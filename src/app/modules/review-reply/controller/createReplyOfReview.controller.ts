import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { reviewReplyModel } from '../model/replyOfReview.model';

export const createReplyOfReviewController = myControllerHandler(
  async (req, res) => {
    const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
    const { email } = authData;
    const userData = await userDataModelOfWeatherConsumerReport.findOne({
      email,
    });
    if (!userData) {
      throw new Error('User does not exists with this token');
    }

    const { replyText, reviewId } = req.body;

    await reviewReplyModel.create({
      userId: userData.id,
      reply: replyText,
      reviewId,
    });

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
