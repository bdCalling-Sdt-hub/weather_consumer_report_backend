import mongoose, { Schema } from 'mongoose';
import { IJob, IJobDeclineReason, IJobModal } from './job.interface';
import paginate from '../plugins/paginate';

const jobDeadlineReasonSchema = new Schema<IJobDeclineReason>({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required'],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
  },
});

const jobSchema = new Schema<IJob>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator ID is required'],
    },
    jobLocation: {
      type: String,
      required: [true, 'Job location is required'],
    },
    jobRegistration: {
      type: String,
      required: [true, 'Job registration is required'],
    },
    vinGenerated: {
      type: String,
      required: [true, 'VIN generated is required'],
    },
    lotNo: {
      type: String,
      required: [true, 'Lot number is required'],
    },
    make: {
      type: String,
      required: [true, 'Make is required'],
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
    },
    jobType: {
      type: String,
      required: [true, 'Job type is required'],
    },
    keyType: {
      type: String,
      required: [true, 'Key type is required'],
    },
    jobDeclineReason: [jobDeadlineReasonSchema],
    jobDescription: {
      type: String,
      required: [true, 'Job description is required'],
    },
    jobDeadline: {
      type: Date,
      required: [true, 'Job deadline is required'],
    },
    bidTechnician: [
      {
        type: Schema.Types.ObjectId,
        ref: 'BidJob',
      },
    ],
    assignedTechnician: {
      type: String,
      ref: 'User',
      required: [false, 'Assigned technician is required'],
    },
    jobBidPrice: {
      type: Number,
      required: [false, 'Job bid price is required'],
    },
    completedWorkVideo: {
      type: String,
      required: [false, 'Completed work video is required'],
    },
    jobStatus: {
      type: String,
      enum: [
        'Pending',
        'InProgress',
        'Delivered',
        'Review',
        'Completed',
        'Cancelled',
      ],
      default: 'Pending',
    },
    assignedTechnicianStatus: {
      type: String,
      enum: ['Pending', 'Accepted', 'Archived', 'Rejected'],
      default: 'Pending',
    },
    stripeInvoiceId: {
      type: String,
      required: [false, 'Stripe invoice ID is required'],
    },
    stripePaymentUrl: {
      type: String,
      required: [false, 'Stripe payment URL is required'],
    },
    isAssigned: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Attach the Pagination Plugin
jobSchema.plugin(paginate);

// Export the Job Model
export const Job = mongoose.model<IJob, IJobModal>('Job', jobSchema);
