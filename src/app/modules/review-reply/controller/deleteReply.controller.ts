import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { reviewReplyModel } from '../model/replyOfReview.model';

export const deleteReplyController = myControllerHandler(async (req, res) => {
  const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
  const { email } = authData;
  const { replyId } = req.body;
  const userData = await userDataModelOfWeatherConsumerReport.findOne({
    email,
  });
  if (!userData) {
    throw new Error('User does not Exists');
  }

  const replyData = await reviewReplyModel.findOne({
    id: replyId,
  });
  if (!replyData) {
    throw new Error('Reply Does Not Exists');
  }

  if (!(replyData.userId === userData.id || userData.role === 'admin')) {
    throw new Error('User does not have permission to delete the review');
  }
  await replyData.deleteOne();
  const myResponse = {
    message: 'Review Given Successfully',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});
