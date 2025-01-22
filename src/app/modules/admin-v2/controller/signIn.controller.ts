import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { checkMyPassword } from '../../../../helpers/passwordHashing';
import { giveAuthenticationToken } from '../../../../helpers/jwtAR7';
import { jwtSecretKey } from '../../../../data/environmentVariables';

export const adminSignInController = myControllerHandler(async (req, res) => {
  const { email, password } = req.body;
  const userData = await userDataModelOfWeatherConsumerReport.findOne({
    email,
  });
  if (!userData) {
    throw new Error('User does not exists');
  }
  const { passwordHash } = userData;
  //   check password
  await checkMyPassword(password, passwordHash);

  // check if admin
  if (userData.role !== 'admin') {
    throw new Error('The user who requested is not admin');
  }

  const authToken = await giveAuthenticationToken(email, jwtSecretKey);
  const bearerToken = `Bearer ${authToken}`;

  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Review Given Successfully',
    data: bearerToken,
  });
});
