import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { assetCategoryModel } from '../model/category.model';
import { myProductModel } from '../../products/model/products.model'; // Assuming you have a product model

export const getCategory2Controller = myControllerHandler(async (req, res) => {
  const categoryData: any = await assetCategoryModel.find({});

  // Iterate over categories to add the count of products for each category
  for (let i = 0; i < categoryData.length; i++) {
    const category = categoryData[i].toObject(); // Convert the Mongoose document to a plain object
    const categoryName = category.categoryName; // Assuming the category has a categoryName field
    const productCount = await myProductModel.countDocuments({
      category: categoryName,
    });

    // Add the totalProducts key to the plain object
    category.totalProducts = productCount;

    // Update the categoryData with the modified object
    categoryData[i] = category;
  }

  const myResponse = {
    message: 'Category Fetched Successfully',
    success: true,
    data: categoryData,
  };

  res.status(StatusCodes.OK).json(myResponse);
});
