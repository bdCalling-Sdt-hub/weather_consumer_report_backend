import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { PaginateOptions, PaginateResult } from '../../../types/paginate';
import { IJob } from './job.interface';
import { Job } from './job.model';

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

//assign technician to job
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
  if (job?.assignedTechnician) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'This Job already assigned to technician.'
    );
  }
  job.assignedTechnician = technicianId;
  job.jobBidPrice = bidPrice;
  job.isAssigned = true;
  await job.save();
  return job;
};

export const JobService = {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
  assignTechnicianToJob,
};
