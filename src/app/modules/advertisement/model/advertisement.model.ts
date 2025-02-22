import { ar7id } from '../../../../utils/unique_id/ar7id';

import mongoose from 'mongoose';

const advertisementSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'advertisement_' + ar7id(),
    },
    status: {
      type: String,
      required: true,
      default: 'pending',
      enum: ['pending', 'approved', 'rejected'],
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      default: '',
    },
    adName: {
      type: String,
      required: true,
    },
    link: { type: String, required: true, default: '/' },
    duration: { type: Number, required: true },
    mediaLink: { type: String, required: true },
    mediaType: { type: String, required: true, enum: ['image', 'video'] },
    days: {
      type: Number,
      required: true,
    },

    message: { type: String, required: false },
  },
  { timestamps: true }
);

export const advertisementModel = mongoose.model(
  'advertisement',
  advertisementSchema
);
