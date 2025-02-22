import mongoose from 'mongoose';
import { ar7id } from '../../../../utils/unique_id/ar7id';
import { number } from 'zod';

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'product_' + ar7id(),
    },
    ownerId: {
      type: String,
      required: true,
    },
    category: { type: String, required: false },
    name: { type: String, required: true },
    description: { type: String, required: true },
    productLink: { type: String, required: false },
    productLocation: { type: String, required: true },
    productImageUrl: { type: String, required: true },
    moreImagesUrl: { type: [String], default: [] },
    price: { type: Number, required: true },
    currencyOfPrice: { type: String, default: 'usd', enum: ['usd'] },
    stockStatus: { type: String, required: true },
  },
  { timestamps: true }
);

export const myProductModel = mongoose.model('my_products', productSchema);
