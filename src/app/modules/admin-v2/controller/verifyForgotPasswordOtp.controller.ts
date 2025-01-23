import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse, { sendResponse2 } from '../../../../shared/sendResponse';
import { dataOfResetPasswordRequests } from '../../../../data/temporaryData';
import { hashMyPassword } from '../../../../helpers/passwordHashing';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { giveAuthenticationToken } from '../../../../helpers/jwtAR7';
import { adminChangingPasswordJwtSecretKey } from '../../../../data/environmentVariables';

export const verifyForgotPasswordOtpController = myControllerHandler(
  async (req, res) => {
    const { otp } = req.body;
    const userData = dataOfResetPasswordRequests.filter(
      (data: any) => otp === data.otp
    )[0];
    if (!userData) {
      throw new Error('Otp Not Valid');
    }
    const { email } = userData;
    const token = (await giveAuthenticationToken(
      email,
      adminChangingPasswordJwtSecretKey
    )) as any;

    sendResponse2(res, {
      code: StatusCodes.OK,
      message: 'Otp Verified Successful',
      data: [userData],
      token: token,
    });
  }
);
