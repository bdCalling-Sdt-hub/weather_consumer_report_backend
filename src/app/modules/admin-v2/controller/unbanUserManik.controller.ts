import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';

export const unBanUserManikController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin(req, jwtSecretKey);
    const { manik } = req.params;
    const userData = await userDataModelOfWeatherConsumerReport.findOne({
      id: manik,
    });
    if (!userData) {
      throw new Error('User does not exists with this id');
    }
    userData.isBanned = false;
    await userData.save();
    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'User Banned Successfully',
      data: userData,
    });
  }
);
