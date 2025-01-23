import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import {
  checkMyPassword,
  hashMyPassword,
} from '../../../../helpers/passwordHashing';

export const changePasswordController2 = myControllerHandler(
  async (req, res) => {
    const { email, newPassword, oldPassword } = req.body;
    const userData = await userDataModelOfWeatherConsumerReport.findOne({
      email,
    });
    if (!userData) {
      throw new Error('user does not exists');
    }
    const { passwordHash } = userData;
    // check if password correct
    await checkMyPassword(oldPassword, passwordHash);
    //change password
    const newPasswordHash = await hashMyPassword(newPassword);
    await userDataModelOfWeatherConsumerReport.findOneAndUpdate(
      { email },
      {
        passwordHash: newPasswordHash,
      }
    );

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Password Changed Successfully',
      data: {},
    });
  }
);
