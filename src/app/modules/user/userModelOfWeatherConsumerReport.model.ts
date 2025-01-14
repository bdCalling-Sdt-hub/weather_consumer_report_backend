import mongoose from 'mongoose';

const userSchemaOfWeatherConsumerReport = new mongoose.Schema({
  username: { type: 'String', required: true },
  email: { type: 'String', required: true, unique: true },
  passwordHash: { type: 'String', required: true },
  role: {
    type: 'String',
    enum: ['admin', 'user'],
    default: 'user',
    required: true,
  },
  isBanned: { type: 'Boolean', default: false },
  profileImageUrl: { type: 'String', default: '' },
  createdAt: { type: 'Date', default: Date.now },
  updatedAt: { type: 'Date', default: Date.now },
});

export const userDataModelOfWeatherConsumerReport = mongoose.model(
  'usersData',
  userSchemaOfWeatherConsumerReport
);
