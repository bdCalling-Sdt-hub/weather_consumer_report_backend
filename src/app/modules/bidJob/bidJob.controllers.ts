import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BidJobService } from './bidJob.services';

const addBidJob = catchAsync(async (req, res, next) => {
  req.body.technicianId = req.user.id;
  const result = await BidJobService.addBidJob(req.body);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'BidJob added successfully',
    data: result,
  });
});

export const BidJobController = {
  addBidJob,
};
