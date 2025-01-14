const userData = {
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
};

const product = {
  productId: { type: 'String', required: true, unique: true },
  title: { type: 'String', required: true },
  description: { type: 'String', required: false },
  price: { type: 'Number', required: true },
  imageUrl: { type: 'String', required: true },
  category: { type: 'String', required: true },
  rating: { type: 'Number', required: false },
  reviews: [{ type: 'ObjectId', ref: 'Review', required: false }],
  fetchedAt: { type: 'Date', default: Date.now },
};
const review = {
  userId: { type: 'ObjectId', ref: 'User', required: true },
  productId: { type: 'ObjectId', ref: 'Product', required: true },
  reviewText: { type: 'String', required: true },
  rating: { type: 'Number', min: 1, max: 5, required: true },
  isEdited: { type: 'Boolean', default: false },
  createdAt: { type: 'Date', default: Date.now },
  updatedAt: { type: 'Date', default: Date.now },
};
const advertisement = {
  adId: { type: 'String', required: true, unique: true },
  title: { type: 'String', required: true },
  description: { type: 'String', required: false },
  imageUrl: { type: 'String', required: true },
  redirectUrl: { type: 'String', required: true },
  startDate: { type: 'Date', required: true },
  endDate: { type: 'Date', required: true },
  clicks: { type: 'Number', default: 0 },
  impressions: { type: 'Number', default: 0 },
};
