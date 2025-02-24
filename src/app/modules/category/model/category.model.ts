import { ar7id } from '../../../../utils/unique_id/ar7id';

import mongoose from 'mongoose';

const assetCategorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'category_' + ar7id(),
    },
    categoryName: {
      type: String,
      required: true,
      unique: true,
    },
    categoryImageUrl: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export const assetCategoryModel = mongoose.model(
  'AssetCategory',
  assetCategorySchema
);
