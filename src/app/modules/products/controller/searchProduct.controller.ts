import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../../shared/sendResponse';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { myProductModel } from '../model/products.model';

export const searchProductController = myControllerHandler(async (req, res) => {
  const myData = req.params;
  const { search_text } = myData;
  const productsData = await myProductModel.find({
    $or: [
      { name: { $regex: search_text, $options: 'i' } },
      { id: { $regex: search_text, $options: 'i' } },
      { category: { $regex: search_text, $options: 'i' } },
    ],
  });
  const myResponse = {
    message: 'Review Given Successfully',
    success: true,
    data: productsData,
  };
  res.status(StatusCodes.OK).json(myResponse);
});
