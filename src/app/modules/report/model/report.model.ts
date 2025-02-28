import mongoose from 'mongoose';
import { ar7id } from '../../../../utils/unique_id/ar7id';

const reportSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'report_' + ar7id(),
    },
    type: {
      type: String,
      required: true,
    },
    idOfReportedParty: {
      type: String,
      required: true,
    },
    reasonOfReport: {
      type: String,
      required: true,
    },
    idOfReporter: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      default: () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    },
  },
  { timestamps: true }
);

// Add TTL index to automatically delete the document after 2 days
reportSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export const ReportModel = mongoose.model('reports_of_users', reportSchema);
