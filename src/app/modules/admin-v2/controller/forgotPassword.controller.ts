import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import {
  GenerateRandom5DigitNumber,
  GenerateRandom6DigitNumber,
} from '../../../../helpers/GenerateRandom5DigitNumber';
import { dataOfResetPasswordRequests } from '../../../../data/temporaryData';
import { sendPasswordResetOtpViaEmail } from '../../../../helpers/sendPasswordResetOtpViaEmail';

export const adminForgotPasswordController = myControllerHandler(
  async (req, res) => {
    const { email } = req.body;
    const userData = await userDataModelOfWeatherConsumerReport.findOne({
      email,
    });
    if (!userData) {
      throw new Error('user does not exists with this email');
    }

    const { username } = userData;
    const otp = GenerateRandom6DigitNumber().toString();
    const temporaryUserData = { email, otp, createdAt: Date.now() };
    dataOfResetPasswordRequests.push(temporaryUserData);

    await sendPasswordResetOtpViaEmail(username, email, otp);

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Email sent successfully',
      data: {},
    });
  }
);
