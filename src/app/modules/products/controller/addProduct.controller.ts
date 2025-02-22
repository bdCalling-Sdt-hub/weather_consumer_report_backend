import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { saveAndGiveRefinedUrl } from '../../../../helpers/saveAndGiveRefinedLink';
import { myProductModel } from '../model/products.model';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';

export const addProductController = myControllerHandler(async (req, res) => {
  const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
  const myData = await getDataFromFormOfRequest(req);
  const { email } = authData;

  const userData = await userDataModelOfWeatherConsumerReport.findOne({
    email,
  });
  if (!userData) {
    throw new Error('User Does Not Exists');
  }
  const dataToSave: any = {};
  dataToSave.ownerId = userData.id;
  dataToSave.name = myData.fields.product_name[0];
  dataToSave.category = myData.fields.product_category[0];
  dataToSave.description = myData.fields.product_description[0];
  dataToSave.price = myData.fields.product_price[0];
  dataToSave.currencyOfPrice = myData.fields.product_price_currency[0];
  dataToSave.stockStatus = myData.fields.stock_status[0];
  const productLink = myData.fields.product_link;
  if (productLink) {
    dataToSave.productLink = productLink[0];
  }
  const productLocation = myData.fields.product_location;
  if (productLocation) {
    dataToSave.productLocation = productLocation[0];
  }

  const productImage = myData.files.product_image[0];
  dataToSave.productImageUrl = await saveAndGiveRefinedUrl(
    productImage,
    './public/images/product'
  );

  const namesOfMoreImages = JSON.parse(myData.fields.moreImagesName[0]);
  dataToSave.moreImagesUrl = [];
  for (let i = 0; i < namesOfMoreImages.length; i++) {
    const singleImageName = namesOfMoreImages[i];
    const singleImageFile = myData.files[singleImageName][0];
    if (singleImageFile.size > 0) {
      const imageUrl = await saveAndGiveRefinedUrl(
        singleImageFile,
        './public/images/product'
      );
      dataToSave.moreImagesUrl.push(imageUrl);
    }
  }

  const productData = await myProductModel.create(dataToSave);
  const myResponse = {
    message: 'Review Given Successfully',
    success: true,
    data: productData,
  };
  res.status(StatusCodes.OK).json(myResponse);
});
