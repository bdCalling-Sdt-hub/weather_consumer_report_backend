import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { assetCategoryModel } from '../model/category.model';

export const getSingleCategoryController = myControllerHandler(
  async (req, res) => {
    const { id } = req.params;
    const categoryData = await assetCategoryModel.findOne({ id });
    if (!categoryData) {
      throw new Error('Category Does Not Exists with this id');
    }
    const myResponse = {
      message: 'Category Fetched Successfully',
      success: true,
      data: categoryData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
