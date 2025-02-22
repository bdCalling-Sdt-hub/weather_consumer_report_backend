import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { reviewDataModelOfWeatherConsumerReport } from '../model/review.model';

export const deleteReviewController = myControllerHandler(async (req, res) => {
  const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
  const { email } = authData;
  const userData = await userDataModelOfWeatherConsumerReport.findOne({
    email,
  });
  if (!userData) {
    throw new Error('User Does Not Exists');
  }
  const { reviewId } = req.body;
  const reviewData = await reviewDataModelOfWeatherConsumerReport.findOne({
    id: reviewId,
  });
  if (!reviewData) {
    throw new Error('Review does not exists');
  }

  if (!(reviewData.userId === userData.id || userData.role === 'admin')) {
    throw new Error('User does not have permission to delete the review');
  }

  await reviewData.deleteOne();

  const myResponse = {
    message: 'Review Given Successfully',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});
