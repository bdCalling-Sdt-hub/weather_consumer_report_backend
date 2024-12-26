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
  assignedTechnician: string;
  jobBidPrice: number;
  completedWorkVideo: string;
  jobStatus: 'Pending' | 'InProgress' | 'Review' | 'Completed' | 'Cancelled';
  assignedTechnicianStatus: 'Pending' | 'Accepted' | 'Archived' | 'Rejected';
  isAssigned: boolean;
  isDeleted: boolean;
  stripeInvoiceId?: string;
  stripePaymentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobModal extends Model<IJob> {
  paginate(
    filter: Record<string, any>,
    options: PaginateOptions
  ): Promise<PaginateResult<IJob>>;
}
