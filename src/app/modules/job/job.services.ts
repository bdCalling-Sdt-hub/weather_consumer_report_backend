import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { PaginateOptions, PaginateResult } from '../../../types/paginate';
import { IJob } from './job.interface';
import { Job } from './job.model';
import { stripe } from '../../../utils/stripe';
import { WalletService } from '../wallet/wallet.services';
import { User } from '../user/user.model';

interface ISanitizedFilters {
  [key: string]: string | number | boolean;
}
const createJob = async (payload: Partial<IJob>): Promise<IJob> => {
  const result = await Job.create(payload);
  return result;
};

const getAllJobs = async (
  filters: Partial<IJob>,
  options: PaginateOptions
): Promise<PaginateResult<IJob>> => {
  const sanitizedFilters: ISanitizedFilters = {
    isDeleted: false,
    isAssigned: false,
  };
  if (filters.jobStatus) {
    sanitizedFilters.jobStatus = filters.jobStatus;
  }
  options.populate = [
    {
      path: 'creatorId',
    },
    {
      path: 'assignedTechnician',
    },
    {
      path: 'bidTechnician',
      populate: {
        path: 'technicianId',
      },
    },
  ];
  const jobs = await Job.paginate(sanitizedFilters, options);
  return jobs;
};

const getSingleJob = async (jobId: string): Promise<IJob | null> => {
  const job = await Job.findOne({
    _id: jobId,
    isDeleted: false,
  });
  if (!job) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found.');
  }
  return job;
};

const updateJob = async (
  jobId: string,
  payload: Partial<IJob>
): Promise<IJob> => {
  const job = await Job.findOneAndUpdate(
    { _id: jobId, isDeleted: false },
    payload,
    { new: true }
  );
  if (!job) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found.');
  }
  return job;
};

const deleteJob = async (jobId: string): Promise<IJob> => {
  const job = await Job.findOneAndUpdate(
    { _id: jobId, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
  if (!job) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found.');
  }
  return job;
};

const assignTechnicianToJob = async (
  jobId: string,
  technicianId: string,
  bidPrice: number
): Promise<IJob> => {
  const job = await Job.findOne({
    _id: jobId,
    isDeleted: false,
  });
  if (!job) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found.');
  }
  if (job?.isAssigned) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'This Job already assigned to technician.'
    );
  }
  job.assignedTechnician = technicianId;
  job.jobBidPrice = bidPrice;
  job.isAssigned = true;
  job.assignedTechnicianStatus = 'Pending';
  await job.save();
  // Notify company about assignment (mock notification logic here)
  console.log(
    `Notification sent to company: Job ${jobId} assigned to technician ${technicianId}`
  );

  return job;
};

const approveJobByCompany = async (jobId: string): Promise<IJob> => {
  const job = await Job.findOne({
    _id: jobId,
    isDeleted: false,
    isAssigned: true,
  });
  if (!job) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found or not assigned.');
  }

  if (job.jobStatus !== 'Pending') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Job is not awaiting approval.'
    );
  }

  // Retrieve company (creator) details
  const company = await User.findById(job.creatorId);
  if (!company) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Company not found.');
  }

  // Check if the company has a Stripe customer ID
  let stripeCustomerId = company.stripeCustomerId;
  if (!stripeCustomerId) {
    // Create a new Stripe customer
    const customer = await stripe.customers.create({
      name: company.fullName,
      email: company.email,
    });

    // Save Stripe customer ID in the company record
    stripeCustomerId = customer.id;
    company.stripeCustomerId = stripeCustomerId;
    await company.save();
  }

  // Create and finalize the invoice
  const invoice = await stripe.invoices.create({
    customer: stripeCustomerId,
    auto_advance: false, // Do not finalize automatically
    collection_method: 'send_invoice',
    days_until_due: 7,
  });

  await stripe.invoiceItems.create({
    customer: stripeCustomerId,
    invoice: invoice.id,
    amount: job.jobBidPrice * 100, // Amount in cents
    currency: 'usd',
    description: `Invoice for job ID: ${job._id}`,
  });
  // Finalize the invoice to generate the hosted_invoice_url
  const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

  // Update job with invoice details
  job.stripeInvoiceId = finalizedInvoice.id;
  job.stripePaymentUrl = finalizedInvoice.hosted_invoice_url;
  job.jobStatus = 'InProgress';
  job.assignedTechnicianStatus = 'Accepted';
  await job.save();
  return job;
};

const archivedJobByCompany = async (jobId: string): Promise<IJob> => {
  const job = await Job.findOne({
    _id: jobId,
    isDeleted: false,
    isAssigned: true,
  });
  if (!job) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found or not assigned.');
  }
  if (
    job.assignedTechnicianStatus !== 'Pending' &&
    job.assignedTechnicianStatus !== 'Accepted'
  ) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Job is not awaiting approval.'
    );
  }

  job.assignedTechnicianStatus = 'Archived';
  await job.save();
  return job;
};
const rejectJobByCompany = async (jobId: string): Promise<IJob> => {
  const job = await Job.findOne({
    _id: jobId,
    isDeleted: false,
    isAssigned: true,
  });
  if (!job) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found or not assigned.');
  }
  if (
    job.assignedTechnicianStatus !== 'Pending' &&
    job.assignedTechnicianStatus !== 'Accepted'
  ) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Job is not awaiting approval.'
    );
  }

  job.assignedTechnicianStatus = 'Rejected';
  job.assignedTechnician = null;
  job.isAssigned = false;
  await job.save();
  return job;
};

const deliveredJobByTechnician = async (
  jobId: string,
  payload: Partial<IJob>
): Promise<IJob> => {
  const job = await Job.findOne({
    _id: jobId,
    isDeleted: false,
    isAssigned: true,
  });

  if (!job) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found or not assigned.');
  }
  if (job.assignedTechnicianStatus !== 'Accepted') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Job is not accepted yet.');
  }
  job.jobStatus = 'Delivered';
  job.completedWorkVideo = payload.completedWorkVideo as string;
  await job.save();
  return job;
};

const completeJob = async (jobId: string): Promise<IJob> => {
  const job = await Job.findOne({
    _id: jobId,
    isDeleted: false,
  });
  if (!job) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found.');
  }
  if (job.jobStatus !== 'InProgress' && job.jobStatus !== 'Delivered') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Job is not in progress.');
  }

  // Check payment status from Stripe
  const invoice = await stripe.invoices.retrieve(job.stripeInvoiceId!);

  if (invoice.status !== 'paid') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Payment is not completed yet.'
    );
  }
  // Mark the job as completed
  job.jobStatus = 'Completed';
  await job.save();

  const deduction = (job.jobBidPrice * 10) / 100;
  // Calculate the remaining amount
  const remainingAmount = job.jobBidPrice - deduction;

  // Add payment to technician's wallet
  await WalletService.addMoney(
    job.assignedTechnician as string,
    remainingAmount
  );
  return job;
};

export const JobService = {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
  assignTechnicianToJob,
  archivedJobByCompany,
  rejectJobByCompany,
  deliveredJobByTechnician,
  approveJobByCompany,
  completeJob,
};
