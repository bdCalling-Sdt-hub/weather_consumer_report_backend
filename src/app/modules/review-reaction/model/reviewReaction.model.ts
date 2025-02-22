import mongoose from 'mongoose';
import { ar7id } from '../../../../utils/unique_id/ar7id';

const reviewReactionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'reaction_' + ar7id(),
    },
    userId: { type: String, required: true },
    reviewId: { type: String, required: true, ref: 'review_data' },
    reaction: {
      type: String,
      enum: ['like', 'dislike'],
      required: true,
    },
  },
  { timestamps: true }
);

reviewReactionSchema.index({ userId: 1, reviewId: 1 }, { unique: true });

export const reviewReactionModel = mongoose.model(
  'review_reaction',
  reviewReactionSchema
);
