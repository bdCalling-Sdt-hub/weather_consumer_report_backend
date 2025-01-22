import mongoose from 'mongoose';

const reviewSchemaOfWeatherConsumerReport = new mongoose.Schema({
  userId: { type: 'Mixed', required: true }, // Allow both ObjectId and String
  productId: { type: 'Mixed', required: true }, // Allow both ObjectId and String
  reviewText: { type: 'String', required: true },
  rating: { type: 'Number', min: 1, max: 5, required: true },
  isEdited: { type: 'Boolean', default: false },
  createdAt: { type: 'Date', default: Date.now },
  updatedAt: { type: 'Date', default: Date.now },
});

export const reviewDataModelOfWeatherConsumerReport = mongoose.model(
  'reviewData',
  reviewSchemaOfWeatherConsumerReport
);
