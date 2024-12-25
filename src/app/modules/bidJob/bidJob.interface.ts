import { Types } from 'mongoose';

export interface IBidJob {
  _id: Types.ObjectId;
  jobId: Types.ObjectId;
  technicianId: Types.ObjectId;
  bidPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
