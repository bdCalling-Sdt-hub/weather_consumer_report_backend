import express from 'express';
import { createReplyOfReviewController } from '../controller/createReplyOfReview.controller';
import { getReplyOfSingleReviewController } from '../controller/getReplyOfReview.controller';
import { deleteReplyController } from '../controller/deleteReply.controller';
import { searchReviewOfAProductController } from '../../review/controller/searchReviewOfaProduct.controller';

const replyOfReviewRouter = express.Router();

replyOfReviewRouter.post('/reply/', createReplyOfReviewController);
replyOfReviewRouter.get(
  '/get-reply-of-single-review/:id',
  getReplyOfSingleReviewController
);
replyOfReviewRouter.post('/delete-reply', deleteReplyController);

export { replyOfReviewRouter };
