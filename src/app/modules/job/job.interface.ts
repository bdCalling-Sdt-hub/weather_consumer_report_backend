import { Model, Types } from 'mongoose';
import { PaginateOptions, PaginateResult } from '../../../types/paginate';

export interface IJobDeclineReason {
  _id?: Types.ObjectId;
  userId: Types.ObjectId | string;
  jobId: Types.ObjectId | string;
  reason: string;
}

export interface IJob {
  _id: Types.ObjectId;
  creatorId: Types.ObjectId | string;
  jobLocation: string;
  jobRegistration: string;
  vinGenerated: string;
  lotNo: string;
  make: string;
  model: string;
  jobType: string;
  keyType: string;
  jobDescription: string;
  jobDeclineReason: IJobDeclineReason[];
  jobDeadline: Date;
  bidTechnician: Types.ObjectId[];
  assignedTechnician: string | null;
  jobBidPrice: number;
  completedWorkVideo: string;
  jobStatus:
    | 'Pending'
    | 'InProgress'
    | 'Delivered'
    | 'Review'
    | 'Completed'
    | 'Cancelled';
  assignedTechnicianStatus: 'Pending' | 'Accepted' | 'Archived' | 'Rejected';
  isAssigned: boolean | string;
  isDeleted: boolean;
  stripeInvoiceId?: string | null;
  stripePaymentUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobModal extends Model<IJob> {
  paginate(
    filter: Record<string, any>,
    options: PaginateOptions
  ): Promise<PaginateResult<IJob>>;
}
