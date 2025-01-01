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
      select: 'fullName email location image',
    },
    {
      path: 'assignedTechnician',
      select:
        'fullName email workVehicle workExperience drivingLicenseFront drivingLicenseBack location image',
    },
    {
      path: 'bidTechnician',
      populate: {
        path: 'technicianId',
        select:
          'fullName email workVehicle workExperience drivingLicenseFront drivingLicenseBack location image',
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
  }).populate([
    {
      path: 'creatorId',
      select: 'fullName email location image',
    },
    {
      path: 'assignedTechnician',
      select:
        'fullName email workVehicle workExperience drivingLicenseFront drivingLicenseBack location image',
    },
    {
      path: 'bidTechnician.technicianId',
      select:
        'fullName email workVehicle workExperience drivingLicenseFront drivingLicenseBack location image',
    },
  ]);
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

const declineJobByTechnician = async (
  jobId: string,
  userId: string,
  reason: string
): Promise<IJob> => {
  const job = await Job.findOne({
    _id: jobId,
    isDeleted: false,
  });

  // Check if the job exists
  if (!job) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found.');
  }

  //check if this job already  assigned to technician
  if (job?.isAssigned) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'This job already assigned to technician.'
    );
  }
  // Check if the user is already associated with the job decline reasons
  const alreadyDeclined = job.jobDeclineReason.some(
    declineReason => String(declineReason.userId) === userId
  );

  if (alreadyDeclined) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'User has already declined this job.'
    );
  }

  // Push the decline reason to the job's jobDeclineReason array
  job.jobDeclineReason.push({
    userId,
    jobId,
    reason,
  });

  // Save the updated job
  await job.save();

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

  // Retrieve technician details
  const technician = await User.findById(job.assignedTechnician);
  if (!technician) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Technician not found.');
  }

  // Notify technician about the job assignment
  const technicianEventName = 'technician-notification';
  const technicianNotification: INotification = {
    title: 'Job Assigned to You',
    receiverId: technicianId,
    message:
      'The admin has assigned you to the job you recently bid for. Please review the details and proceed.',
    role: 'technician',
    linkId: job._id,
  };

  await NotificationService.addCustomNotification(
    technicianEventName,
    technicianNotification,
    technicianId as string
  );

  // Notify company about technician
  const creatorEventName = 'company-notification';
  const creatorNotification: INotification = {
    title: 'Technician Assigned to Your Job',
    receiverId: job?.creatorId,
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
  });
  if (!job) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found');
  }
  if (!job.isAssigned) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Job is not assigned to any technician.'
    );
  }

  if (job.jobStatus !== 'Pending') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Job cannot be approved because it is in ${job.jobStatus} status.`
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
  job.stripeInvoiceId = finalizedInvoice?.id;
  job.stripePaymentUrl = finalizedInvoice?.hosted_invoice_url;
  job.jobStatus = 'InProgress';
  job.assignedTechnicianStatus = 'Accepted';
  await job.save();

  // Notify technician about job approval
  const technicianEventName = 'technician-notification';
  const technicianNotification: INotification = {
    title: 'Congratulations! You Are Approved!',
    receiverId: job.assignedTechnician as string,
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
  });

  if (!job) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'The job you are trying to archive does not exist.'
    );
  }
  // Check if job exists and is assigned
  if (!job?.isAssigned) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'The job you are trying to archive either does not exist or has not been assigned to a technician.'
    );
  }

  // Check technician status
  if (
    job.assignedTechnicianStatus !== 'Pending' &&
    job.assignedTechnicianStatus !== 'Accepted'
  ) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `The job cannot be archived because it is currently in the "${job.assignedTechnicianStatus}" status. Only jobs awaiting approval can be archived.`
    );
  }

  // Archive the job
  job.assignedTechnicianStatus = 'Archived';
  await job.save();

  return job;
};

const rejectJobByCompany = async (jobId: string): Promise<IJob> => {
  const job = await Job.findOne({
    _id: jobId,
    isDeleted: false,
  });

  if (!job) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'The job you are trying to reject does not exist.'
    );
  }
  // Check if job exists and is assigned
  if (!job.isAssigned) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'The job you are trying to reject does not exist or has not been assigned to a technician.'
    );
  }

  // Check technician status
  if (
    job.assignedTechnicianStatus !== 'Pending' &&
    job.assignedTechnicianStatus !== 'Accepted'
  ) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `The job cannot be rejected because it is currently in the "${job.assignedTechnicianStatus}" status. Only jobs awaiting approval can be rejected.`
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
    receiverId: technicianId as string,
    message: `We regret to inform you that the company has decided not to approve your assignment for the job. You can check for other opportunities or contact the company for further details.`,
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
  });

  if (!job) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found.');
  }
  // Check if job exists and is assigned
  if (!job?.isAssigned) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'The job you are trying to deliver either does not exist or has not been assigned to you.'
    );
  }

  // Check if job is accepted by the technician
  if (job.assignedTechnicianStatus !== 'Accepted') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'The job cannot be delivered as it has not been accepted yet. Please wait for acceptance before delivering your work.'
    );
  }

  // Check if job status is in progress
  if (job.jobStatus !== 'InProgress') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'The job cannot be delivered as it is not currently in progress. Please confirm the job status before delivering.'
    );
  }

  // Update job status to delivered
  job.jobStatus = 'Delivered';
  job.completedWorkVideo = payload.completedWorkVideo as string;
  await job.save();

  // Notify company to review and accept the job
  const companyEventName = 'company-notification';
  const companyNotification: INotification = {
    title: 'Technician Delivered the Work',
    receiverId: job.creatorId,
    message: `The technician has delivered the work for the job. Please review the completed work and accept it if everything meets your expectations.`,
    role: 'company',
    linkId: job._id,
  };

  await NotificationService.addCustomNotification(
    companyEventName,
    companyNotification,
    job.creatorId as string // Assuming `job.creatorId` holds the company user ID
  );

  return job;
};

const completeJob = async (jobId: string): Promise<IJob> => {
  const job = await Job.findOne({
    _id: jobId,
    isDeleted: false,
  });

  // Check if job exists
  if (!job) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'The job you are trying to complete does not exist or has already been removed.'
    );
  }

  // Check if job is assigned
  if (!job.isAssigned) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'The job cannot be marked as completed because it has not been assigned to a technician.'
    );
  }

  // Check if job is in progress or delivered
  if (job.jobStatus !== 'InProgress' && job.jobStatus !== 'Delivered') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `The job cannot be completed because it is currently in the "${job.jobStatus}" status. Only jobs that are "InProgress" or "Delivered" can be marked as completed.`
    );
  }

  // Check payment status from Stripe
  const invoice = await stripe.invoices.retrieve(job.stripeInvoiceId!);
  if (invoice.status !== 'paid') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'The job cannot be completed because the payment has not yet been processed. Please ensure payment is completed before marking the job as complete.'
    );
  }

  // Mark the job as completed
  job.jobStatus = 'Completed';
  await job.save();

  // Deduct platform fee and calculate remaining amount
  const deduction = (job.jobBidPrice * 10) / 100;
  const remainingAmount = job.jobBidPrice - deduction;

  // Add remaining amount to the technician's wallet
  await WalletService.addMoney(
    job.assignedTechnician as string,
    remainingAmount
  );

  // Record payment in the payment history
  await Payment.create({
    userId: job.creatorId,
    totalAmount: job.jobBidPrice,
    paymentHistory: invoice,
  });

  //notify admin about job completion
  const adminEventName = 'admin-notification';

  const adminNotification: INotification = {
    title: 'Payment Received and Job Completed',
    message: `The job has been successfully completed and the payment has been completed. Please review the job details and payment history.`,
    role: 'admin',
    linkId: job._id,
  };

  await NotificationService.addCustomNotification(
    adminEventName,
    adminNotification
  );

  // Notify company about job completion
  const companyEventName = 'company-notification';
  const companyNotification: INotification = {
    title: 'You Have Successfully Paid the Technician',
    receiverId: job.creatorId,
    message: `You have successfully paid the technician for the job. The job has been marked as completed.`,
    role: 'company',
    linkId: job._id,
  };

  await NotificationService.addCustomNotification(
    companyEventName,
    companyNotification,
    job.creatorId as string // Assuming `job.creatorId` holds the company user ID
  );

  // Notify technician about payment
  const technicianEventName = 'technician-notification';
  const technicianNotification: INotification = {
    title: 'Job Completed and Payment Received',
    receiverId: job.assignedTechnician as string,
    message: `Congratulations! The job has been completed successfully, and the payment has been added to your wallet.`,
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
  declineJobByTechnician,
  completeJob,
};
