import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { reviewReactionModel } from '../model/reviewReaction.model';

export const checkCurrentUserReactionController = myControllerHandler(
  async (req, res) => {
    const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
    const { reviewId } = req.body;
    const { email } = authData;
    const userData = await userDataModelOfWeatherConsumerReport.findOne({
      email,
    });
    if (!userData) {
      throw new Error('User does not exists with this token');
    }

    const dataForClient: any = {};

    const reactionData = await reviewReactionModel.findOne({
      reviewId,
      userId: userData.id,
    });

    if (reactionData) {
      dataForClient.reaction = reactionData.reaction;
    }

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: dataForClient,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
