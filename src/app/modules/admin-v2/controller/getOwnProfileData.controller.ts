import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';

export const getOwnProfileDataController = myControllerHandler(
  async (req, res) => {
    const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
    const { email } = authData;

    const userData = await userDataModelOfWeatherConsumerReport.findOne({
      email,
    });
    if (!userData) {
      throw new Error('User does not exists');
    }
    const refinedUserData: any = await userData.toObject();
    delete refinedUserData.passwordHash;
    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: refinedUserData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
