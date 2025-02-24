import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { categoriesData } from '../../../../data/category/category';
import { assetCategoryModel } from '../model/category.model';

export const addBulkCategoryController = myControllerHandler(
  async (req, res) => {
    const resultData: any = [];

    for (let i = 0; i < categoriesData.length; i++) {
      const singleCategoryData = categoriesData[i];
      const singleCategoryName = singleCategoryData.name;
      const arrayOfSubcategories = singleCategoryData.subCategories;
      for (let i = 0; i < arrayOfSubcategories.length; i++) {
        const singleSubcategoryName = arrayOfSubcategories[i];
        const finalCategoryName = `${singleCategoryName}, ${singleSubcategoryName}`;
        resultData.push(finalCategoryName);
      }
    }

    for (let i = 0; i < resultData.length; i++) {
      const singleCategoryName = resultData[i];
      await assetCategoryModel.create({ categoryName: singleCategoryName });
    }

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
