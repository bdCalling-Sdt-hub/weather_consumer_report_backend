import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { saveFileToFolder } from '../../../../helpers/uploadFilesToFolder';
import { saveAndGiveRefinedUrl } from '../../../../helpers/saveAndGiveRefinedLink';
import { assetCategoryModel } from '../model/category.model';

export const addCategoryController = myControllerHandler(async (req, res) => {
  await checkIfUserRequestingAdmin(req, jwtSecretKey);
  const myData = await getDataFromFormOfRequest(req);
  const categoryName = myData.fields.category_name[0];
  const categoryImage = myData.files.category_image[0];
  const categoryImageUrl = await saveAndGiveRefinedUrl(
    categoryImage,
    './public/images/category'
  );

  await assetCategoryModel.create({ categoryName, categoryImageUrl });

  const myResponse = {
    message: 'Category Created Successfully',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});
