import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../../shared/sendResponse';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { myProductModel } from '../../products/model/products.model';

export const getProductDataController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin(req, jwtSecretKey);
    const { from, to } = req.query as any;
    const startIndex = parseInt(from, 10) || 0;
    const endIndex = parseInt(to, 10) || 0;
    const limit = endIndex - startIndex;
    if (limit < 0) {
      throw new Error(
        'Invalid range: "to" should be greater than or equal to "from".'
      );
    }
    const usersData = await myProductModel.find().skip(startIndex).limit(limit);

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Review Given Successfully',
      data: usersData,
    });
  }
);
