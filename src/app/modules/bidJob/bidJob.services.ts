import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Job } from '../job/job.model';
import { IBidJob } from './bidJob.interface';
import { BidJob } from './bidJob.model';

const addBidJob = async (payload: IBidJob): Promise<IBidJob> => {
  const existJob = await Job.findOne({
    _id: payload.jobId,
    isDeleted: false,
  });
  if (!existJob) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found');
  }
  const alreadyBid = await BidJob.findOne({
    jobId: payload.jobId,
    technicianId: payload.technicianId,
  });
  if (alreadyBid) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You have already bid on this job'
    );
  }
  // Create the bid job
  const result = await BidJob.create(payload);

  // Update the job's bidTechnician field
  existJob.bidTechnician.push(result._id);
  await existJob.save();

  return result;
};

export const BidJobService = { addBidJob };
