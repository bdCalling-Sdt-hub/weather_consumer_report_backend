import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { JobService } from './job.services';
import pick from '../../../shared/pick';

const createJob = catchAsync(async (req, res, next) => {
  const creatorId = req.user.id;
  req.body.creatorId = creatorId;
  const result = await JobService.createJob(req.body);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Job created successfully',
    data: result,
  });
});

const getAllJobs = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, [
    'searchTerm',
    'creatorId',
    'jobType',
    'jobStatus',
  ]);
  const options = pick(req.query, ['sortBy', 'page', 'limit', 'populate']);

  const result = await JobService.getAllJobs(filters, options);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Jobs retrieved successfully',
    data: result,
  });
});

const getSingleJob = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await JobService.getSingleJob(id);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Job retrieved successfully',
    data: result,
  });
});

const updateJob = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await JobService.updateJob(id, req.body);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Job updated successfully',
    data: result,
  });
});

const deleteJob = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await JobService.deleteJob(id);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Job deleted successfully',
    data: {},
  });
});

//assign technician
const assignTechnicianToJob = catchAsync(async (req, res, next) => {
  const { jobId, technicianId, bidPrice } = req.body;
  const result = await JobService.assignTechnicianToJob(
    jobId,
    technicianId,
    Number(bidPrice)
  );
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Technician assigned to job successfully',
    data: result,
  });
});

//approve job
const approveJobByCompany = catchAsync(async (req, res, next) => {
  const { jobId } = req.body;
  const result = await JobService.approveJobByCompany(jobId);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Job approved by company and invoice created.',
    data: {
      job: result,
      paymentUrl: result.stripePaymentUrl,
    },
  });
});


//complete job
const completeJob = catchAsync(async (req, res, next) => {
  const { jobId } = req.body;
  const result = await JobService.completeJob(jobId);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Job completed successfully',
    data: result,
  });
});

export const JobController = {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
  assignTechnicianToJob,
  approveJobByCompany,
  completeJob,
};
