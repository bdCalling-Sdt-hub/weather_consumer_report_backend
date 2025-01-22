import express from 'express';
import { createReviewController } from '../controller/createReview.controller';

const reviewRouter = express.Router();

reviewRouter.post('/create', createReviewController);

export { reviewRouter };
