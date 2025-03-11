import mongoose from 'mongoose';
import { ar7id } from '../../../utils/unique_id/ar7id';

const userSchemaOfWeatherConsumerReport = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'user_' + ar7id(),
    },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false, default: '' },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
      required: true,
    },
    isBanned: { type: Boolean, default: false },
    profileImageUrl: { type: String, default: '' },
  },
  { timestamps: true } // This will add the createdAt and updatedAt fields automatically
);

export const userDataModelOfWeatherConsumerReport = mongoose.model(
  'usersData',
  userSchemaOfWeatherConsumerReport
);
