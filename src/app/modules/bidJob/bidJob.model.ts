import mongoose, { Schema } from 'mongoose';
import { IBidJob } from './bidJob.interface';

const bidJobSchema = new Schema<IBidJob>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
    },
    technicianId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Technician ID is required'],
    },
    bidPrice: {
      type: Number,
      required: [true, 'Bid price is required'],
    },
  },
  { timestamps: true }
);

export const BidJob = mongoose.model<IBidJob>('BidJob', bidJobSchema);
