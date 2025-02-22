import mongoose from 'mongoose';
import { ar7id } from '../../../../utils/unique_id/ar7id';

const reviewSchemaOfWeatherConsumerReport = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'review_' + ar7id(),
    },
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    reviewText: { type: String, required: true },
    media: { type: [String], default: [] },
    rating: { type: Number, min: 1, max: 5, required: true },
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Enforce unique reviews per user per product
reviewSchemaOfWeatherConsumerReport.index(
  { userId: 1, productId: 1 },
  { unique: true }
);

export const reviewDataModelOfWeatherConsumerReport = mongoose.model(
  'review_data',
  reviewSchemaOfWeatherConsumerReport
);
