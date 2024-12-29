import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { PaginateOptions, PaginateResult } from '../../../types/paginate';
import { IJob } from './job.interface';
import { Job } from './job.model';
import { stripe } from '../../../utils/stripe';
import { WalletService } from '../wallet/wallet.services';
import { User } from '../user/user.model';
import { NotificationService } from '../notification/notification.services';
import { INotification } from '../notification/notification.interface';
import { PaymentService } from '../payment/payment.service';
import { Payment } from '../payment/payment.model';

interface ISanitizedFilters {
  [key: string]: string | number | boolean;
}
const createJob = async (payload: Partial<IJob>): Promise<IJob> => {
  const result = await Job.create(payload);
  const eventName = 'admin-notification';
  const notification: INotification = {
    title: 'New Job Created',
    message:
      'A new job has been successfully created. Please review the job details and take any necessary actions.',
    role: 'admin',
    linkId: result._id,
  };
  await NotificationService.addCustomNotification(eventName, notification);
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
  if (filters.isAssigned === 'true') {
    sanitizedFilters.isAssigned = true;
  } else {
    sanitizedFilters.isAssigned = false;
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

  console.log(sanitizedFilters);
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

//get creator added job
const getCreatorAddedAllJobs = async (
  filters: Partial<IJob>,
  options: PaginateOptions,
  creatorId: string
): Promise<PaginateResult<IJob>> => {
  const sanitizedFilters: ISanitizedFilters = {
    isDeleted: false,
    creatorId,
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

  // Retrieve technician details
  const technician = await User.findById(job.assignedTechnician);
  if (!technician) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Technician not found.');
  }

  // Notify technician about the job assignment
  const technicianEventName = 'technician-notification';
  const technicianNotification: INotification = {
    title: 'Job Assigned to You',
    message:
      'The admin has assigned you to the job you recently bid for. Please review the details and proceed.',
    role: 'technician',
    linkId: job._id,
  };

  await NotificationService.addCustomNotification(
    technicianEventName,
    technicianNotification,
    job.assignedTechnician as string
  );

  // Notify company about technician
  const creatorEventName = 'company-notification';
  const creatorNotification: INotification = {
    title: 'Technician Assigned to Your Job',
    message: `The technician ${technician.fullName} has been assigned to your job. You can review the job details.`,
    role: 'company',
    linkId: job._id,
  };

  await NotificationService.addCustomNotification(
    creatorEventName,
    creatorNotification,
    job.creatorId as string
  );
  return job;
};

//technician work
const technicianAssignedJob = async (
  filters: Partial<IJob>,
  options: PaginateOptions,
  technicianId: string
): Promise<PaginateResult<IJob>> => {
  const sanitizedFilters: ISanitizedFilters = {
    isDeleted: false,
    assignedTechnician: technicianId,
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

// approveJobByCompany
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

  // Notify technician about job approval
  const technicianEventName = 'technician-notification';
  const technicianNotification: INotification = {
    title: 'Congratulations! You Are Approved!',
    message: `Congratulations! The company has approved you for the job. Please start working on the assigned job and complete it as soon as possible.`,
    role: 'technician',
    linkId: job._id,
  };

  await NotificationService.addCustomNotification(
    technicianEventName,
    technicianNotification,
    job.assignedTechnician as string
  );

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

  // Update job status to rejected
  job.assignedTechnicianStatus = 'Rejected';
  const technicianId = job.assignedTechnician;
  job.assignedTechnician = null;
  job.isAssigned = false;
  await job.save();

  // Notify technician about job rejection
  const technicianEventName = 'technician-notification';
  const technicianNotification: INotification = {
    title: 'Job Assignment Rejected',
    message: `Unfortunately, the company has decided not to approve your assignment for the job. Please check for other opportunities or contact the company for further details.`,
    role: 'technician',
    linkId: job._id,
  };

  if (technicianId) {
    await NotificationService.addCustomNotification(
      technicianEventName,
      technicianNotification,
      technicianId as string
    );
  }

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
  if (job.jobStatus !== 'InProgress') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Job is not in progress.');
  }

  // Update job status to delivered
  job.jobStatus = 'Delivered';
  job.completedWorkVideo = payload.completedWorkVideo as string;
  await job.save();

  // Notify company to review and accept the job
  const companyEventName = 'company-notification';
  const companyNotification: INotification = {
    title: 'Technician Delivered the Work',
    message: `The technician has delivered the work for the job. Please review the completed work and accept it if everything is satisfactory.`,
    role: 'company',
    linkId: job._id,
  };

  await NotificationService.addCustomNotification(
    companyEventName,
    companyNotification,
    job.creatorId as string // Assuming `job.creator` holds the company user ID
  );

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

  // Add the remaining amount to technician's wallet
  await WalletService.addMoney(
    job.assignedTechnician as string,
    remainingAmount
  );

  //push payment model
  await Payment.create({
    userId: job.creatorId,
    totalAmount: job.jobBidPrice,
    paymentHistory: invoice,
  });
  // Notify technician about payment
  const technicianEventName = 'technician-notification';
  const technicianNotification: INotification = {
    title: 'Job Completed and Payment Received',
    message: `Congratulations! You have received the payment for the job. The amount has been added to your wallet.`,
    role: 'technician',
    linkId: job._id,
  };

  await NotificationService.addCustomNotification(
    technicianEventName,
    technicianNotification,
    job.assignedTechnician as string
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
  technicianAssignedJob,
  getCreatorAddedAllJobs,
  completeJob,
};
