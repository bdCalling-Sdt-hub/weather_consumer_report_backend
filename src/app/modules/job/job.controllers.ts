import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { JobService } from './job.services';
import pick from '../../../shared/pick';
import ApiError from '../../../errors/ApiError';

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
    'isAssigned',
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

//decline job by technician
const declineJobByTechnician = catchAsync(async (req, res, next) => {
  const { jobId, reason } = req.body;
  const userId = req.user.id;
  const result = await JobService.declineJobByTechnician(jobId, userId, reason);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Job declined by technician successfully',
    data: result,
  });
});

//get creator added all jobs
const getCreatorAddedAllJobs = catchAsync(async (req, res, next) => {
  const creatorId = req.user.id;
  const filters = pick(req.query, ['searchTerm', 'jobStatus']);
  const options = pick(req.query, ['sortBy', 'page', 'limit', 'populate']);
  const result = await JobService.getCreatorAddedAllJobs(
    filters,
    options,
    creatorId
  );
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Creator added jobs retrieved successfully',
    data: result,
  });
});
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

const technicianAssignedJob = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const filters = pick(req.query, ['searchTerm', 'userId', 'jobStatus']);
  const options = pick(req.query, ['sortBy', 'page', 'limit', 'populate']);
  const result = await JobService.technicianAssignedJob(
    filters,
    options,
    userId
  );
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Technician assigned job retrieved successfully',
    data: result,
  });
});

const approveJobByCompany = catchAsync(async (req, res, next) => {
  const { jobId } = req.body;
  const result = await JobService.approveJobByCompany(jobId);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Job approved by company and invoice created.',
    data: result,
  });
});

const archivedJobByCompany = catchAsync(async (req, res, next) => {
  const { jobId } = req.body;
  const result = await JobService.archivedJobByCompany(jobId);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Job archived successfully',
    data: result,
  });
});

const rejectJobByCompany = catchAsync(async (req, res, next) => {
  const { jobId } = req.body;
  const result = await JobService.rejectJobByCompany(jobId);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Job rejected successfully',
    data: result,
  });
});

const deliveredJobByTechnician = catchAsync(async (req, res, next) => {
  const { jobId } = req.body;
  const file = req.file;
  if (!file) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Please upload a video file');
  }
  if (!file?.mimetype.startsWith('video')) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Please upload a video file');
  }
  if (file) {
    req.body.completedWorkVideo = '/uploads/jobs/' + file.filename;
  }
  const result = await JobService.deliveredJobByTechnician(jobId, req.body);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Job delivered successfully',
    data: result,
  });
});

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
  archivedJobByCompany,
  rejectJobByCompany,
  deliveredJobByTechnician,
  completeJob,
  declineJobByTechnician,
  technicianAssignedJob,
  getCreatorAddedAllJobs,
};
