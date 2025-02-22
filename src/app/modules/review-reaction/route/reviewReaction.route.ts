import express from 'express';
import { makeReviewReactionController } from '../controller/makeReviewReaction.controller';
import { checkCurrentUserReactionController } from '../controller/checkCurrentUserReactionStatus.controller';

const reviewReactionRouter = express.Router();

reviewReactionRouter.post('/react/', makeReviewReactionController);
reviewReactionRouter.post(
  '/check-current-user-reaction',
  checkCurrentUserReactionController
);

export { reviewReactionRouter };
