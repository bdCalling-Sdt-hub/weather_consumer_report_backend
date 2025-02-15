import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../../shared/sendResponse';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';

export const searchUserDataController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin(req, jwtSecretKey);
    const myData = req.params;
    const { search_text } = myData;
    const usersData = await userDataModelOfWeatherConsumerReport.find({
      $or: [
        { username: { $regex: search_text, $options: 'i' } },
        { id: { $regex: search_text, $options: 'i' } },
      ],
    });
    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: usersData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
