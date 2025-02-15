import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { myProductModel } from '../model/products.model';

export const removeProductController = myControllerHandler(async (req, res) => {
  const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
  const { email } = authData;
  const { id } = req.params;
  const userData = await userDataModelOfWeatherConsumerReport.findOne({
    email,
  });
  const productData = await myProductModel.findOne({ id });
  if (!userData) {
    throw new Error('User does not exists');
  }
  if (!productData) {
    throw new Error('No product exists with this id');
  }

  let isRequestingPersonAdmin = false;
  let isRequestingPersonOwnerOfProduct = false;

  if (userData.role === 'admin') {
    isRequestingPersonAdmin = true;
  }
  if (userData.id === productData.ownerId) {
    isRequestingPersonOwnerOfProduct = true;
  }

  const shouldRemoveProduct =
    isRequestingPersonAdmin || isRequestingPersonOwnerOfProduct;

  if (!shouldRemoveProduct) {
    throw new Error('User not allowed to delete this product');
  }

  await myProductModel.findOneAndDelete({ id });
  const myResponse = {
    message: 'Product Deleted Successfully',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});
