import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { assetCategoryModel } from '../model/category.model';

export const getCategorySuggestionController = myControllerHandler(
  async (req, res) => {
    const { search_text } = req.params;

    const myData = await assetCategoryModel.find({
      categoryName: { $regex: search_text, $options: 'i' },
    });

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: myData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
