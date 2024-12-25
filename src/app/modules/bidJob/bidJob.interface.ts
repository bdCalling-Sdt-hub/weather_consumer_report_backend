import { Types } from 'mongoose';

export interface IBidJob {
  _id: Types.ObjectId;
  jobId: string;
  technicianId: string;
  bidPrice: number;
}
