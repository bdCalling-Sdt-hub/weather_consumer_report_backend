import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { dataOfResetPasswordRequests } from '../../../../data/temporaryData';
import { hashMyPassword } from '../../../../helpers/passwordHashing';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';

export const verifyForgotPasswordOtpController = myControllerHandler(
  async (req, res) => {
    const { otp, newPassword } = req.body;
    const userData = dataOfResetPasswordRequests.filter(
      (data: any) => otp === data.otp
    )[0];
    if (!userData) {
      throw new Error('Otp Not Valid');
    }
    const { email } = userData;
    const passwordHash = await hashMyPassword(newPassword);
    await userDataModelOfWeatherConsumerReport.findOneAndUpdate(
      { email },
      { passwordHash: passwordHash }
    );

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Password Changed Successfully',
      data: {},
    });
  }
);
