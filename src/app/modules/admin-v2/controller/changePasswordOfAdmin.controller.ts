import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { parseJwtToken } from '../../../../helpers/jwtAR7';
import { adminChangingPasswordJwtSecretKey } from '../../../../data/environmentVariables';
import { hashMyPassword } from '../../../../helpers/passwordHashing';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';

export const changeAdminPasswordController = myControllerHandler(
  async (req, res) => {
    const { jwtToken, newPassword } = req.body;
    console.log(req.body);
    const { email } = await parseJwtToken(
      jwtToken,
      adminChangingPasswordJwtSecretKey
    );
    const newHashedPassword = await hashMyPassword(newPassword);

    await userDataModelOfWeatherConsumerReport.findOneAndUpdate(
      { email },
      { passwordHash: newHashedPassword }
    );

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'password changed successfully',
      data: {},
    });
  }
);
