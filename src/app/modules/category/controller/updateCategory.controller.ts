import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';

import { saveAndGiveRefinedUrl } from '../../../../helpers/saveAndGiveRefinedLink';
import { assetCategoryModel } from '../model/category.model';

export const updateCategoryController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin(req, jwtSecretKey);
    const { id } = req.params;

    const myData = await getDataFromFormOfRequest(req);
    const updatedData = {} as any;
    const categoryName = myData.fields.category_name;
    const categoryImage = myData.files.category_image;
    if (categoryName) {
      if (categoryName[0]) {
        updatedData.categoryName = categoryName[0];
      }
    }
    if (categoryImage) {
      if (!(categoryImage[0].size > 0)) {
        return;
      }
      const categoryImageUrl = await saveAndGiveRefinedUrl(
        categoryImage[0],
        './public/images/category'
      );
      updatedData.categoryImageUrl = categoryImageUrl;
    }

    await assetCategoryModel.findOneAndUpdate({ id }, updatedData);

    const myResponse = {
      message: 'Category Updated Successfully',
      success: true,
      data: {
        success: true,
      },
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
