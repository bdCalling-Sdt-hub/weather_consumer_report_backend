import mongoose from 'mongoose';
import { ar7id } from '../../../../utils/unique_id/ar7id';

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'product_' + ar7id(),
    },
    category: { type: String, required: false },
    name: { type: String, required: true },
    description: { type: String, required: true },
    productLink: { type: String, required: false },
    productLocation: { type: String, required: false },
    productImageUrl: { type: String, required: true },
    moreImagesUrl: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const myProductModel = mongoose.model('my_products', productSchema);
