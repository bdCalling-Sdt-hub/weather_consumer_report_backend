import express from 'express';
import { createReviewController } from '../controller/createReview.controller';
import { createReview2Controller } from '../controller/createReview2.controller';
import { deleteReviewController } from '../controller/deleteReview.controller';
import { searchReviewOfAProductController } from '../controller/searchReviewOfaProduct.controller';
import { checkIfAlreadyReviewedController } from '../controller/checkIfAlreadyReviewed.controller';

const reviewRouter = express.Router();

reviewRouter.post('/create', createReviewController);
reviewRouter.post('/create-2', createReview2Controller);
reviewRouter.post('/delete-review', deleteReviewController);
reviewRouter.post(
  '/search-review-of-a-product',
  searchReviewOfAProductController
);
reviewRouter.post(
  '/check-if-already-reviewed',
  checkIfAlreadyReviewedController
);

export { reviewRouter };
