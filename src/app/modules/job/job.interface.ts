import { Model, Types } from 'mongoose';
import { PaginateOptions, PaginateResult } from '../../../types/paginate';

export interface IJob {
  _id: Types.ObjectId;
  creatorId: Types.ObjectId;
  jobLocation: string;
  jobRegistration: string;
  vinGenerated: string;
  lotNo: string;
  make: string;
  model: string;
  jobType: string;
  keyType: string;
  jobDescription: string;
  jobDeadline: Date;
  bidTechnician: Types.ObjectId[];
  assignedTechnician: Types.ObjectId;
  jobBidPrice: number;
  completedWorkVideo: string;
  jobStatus: 'Pending' | 'Approved' | 'Archived' | 'Rejected';
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobModal extends Model<IJob> {
  paginate(
    filter: Record<string, any>,
    options: PaginateOptions
  ): Promise<PaginateResult<IJob>>;
}
