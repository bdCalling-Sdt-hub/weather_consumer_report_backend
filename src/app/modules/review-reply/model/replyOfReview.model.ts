import mongoose from 'mongoose';
import { ar7id } from '../../../../utils/unique_id/ar7id';

const reviewReplySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'reply_of_review_' + ar7id(),
    },
    reviewId: { type: String, required: true },
    userId: { type: String, required: true },
    reply: { type: String, required: true },
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Enforce a unique reply per review per user
// reviewReplySchema.index({ reviewId: 1, userId: 1 }, { unique: true });

export const reviewReplyModel = mongoose.model(
  'review_reply',
  reviewReplySchema
);
