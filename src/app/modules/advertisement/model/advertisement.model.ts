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
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const advertisementModel = mongoose.model(
  'advertisement',
  advertisementSchema
);
