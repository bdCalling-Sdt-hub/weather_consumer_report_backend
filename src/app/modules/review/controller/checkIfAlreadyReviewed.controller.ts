import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { reviewDataModelOfWeatherConsumerReport } from '../model/review.model';

export const checkIfAlreadyReviewedController = myControllerHandler(
  async (req, res) => {
    const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
    const { email } = authData;
    const userData = await userDataModelOfWeatherConsumerReport.findOne({
      email,
    });
    if (!userData) {
      throw new Error('User Does not Exists');
    }
    const { productId } = req.body;

    const myReview = await reviewDataModelOfWeatherConsumerReport.findOne({
      productId: productId,
      userId: userData.id,
    });
    let isGivenReview = false;
    if (myReview) {
      isGivenReview = true;
    }

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      isGivenReview,
      reviewData: myReview,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
