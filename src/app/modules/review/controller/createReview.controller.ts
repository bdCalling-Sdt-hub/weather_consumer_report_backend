import express, { NextFunction } from 'express';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { reviewDataModelOfWeatherConsumerReport } from '../model/review.model';

export const createReviewController = myControllerHandler(async (req, res) => {
  const tokenData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
  const { email } = tokenData;
  const { rating, comment, productId } = req.body;
  const userData = await userDataModelOfWeatherConsumerReport.findOne({
    email,
  });
  if (!userData) {
    throw new Error('User Does Not Exists');
  }
  const { _id } = userData;

  await reviewDataModelOfWeatherConsumerReport.create({
    userId: _id,
    productId: productId,
    rating: rating,
    reviewText: comment,
  });

  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Review Given Successfully',
    data: {},
  });
});
