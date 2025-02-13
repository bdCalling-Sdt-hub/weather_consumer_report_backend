import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { assetCategoryModel } from '../model/category.model';

export const getCategoryController = myControllerHandler(async (req, res) => {
  const categoryData = await assetCategoryModel.find({});
  const myResponse = {
    message: 'Category Fetched Successfully',
    success: true,
    data: categoryData,
  };
  res.status(StatusCodes.OK).json(myResponse);
});
