import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { PaginateOptions, PaginateResult } from '../../../types/paginate';
import { IJob } from './job.interface';
import { Job } from './job.model';
import { stripe } from '../../../utils/stripe';
import { WalletService } from '../wallet/wallet.services';

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
  // Create Stripe invoice
  const invoiceItem = await stripe.invoiceItems.create({
    customer: job.creatorId.toString(),
    amount: job.jobBidPrice * 100,
    currency: 'usd',
    description: `Invoice for job ID: ${job._id}`,
  });

  const invoice = await stripe.invoices.create({
    customer: job.creatorId.toString(),
    auto_advance: true,
    collection_method: 'send_invoice',
    days_until_due: 7,
  });

  // Update job with invoice details
  job.stripeInvoiceId = invoice?.id;
  job.stripePaymentUrl = invoice?.hosted_invoice_url as string;
  job.jobStatus = 'InProgress';
  job.assignedTechnicianStatus = 'Accepted';
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
  if (job.jobStatus !== 'InProgress') {
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

  // Add payment to technician's wallet
  await WalletService.addMoney(job.assignedTechnician, job.jobBidPrice);
  return job;
};

export const JobService = {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
  assignTechnicianToJob,
  approveJobByCompany,
  completeJob,
};
