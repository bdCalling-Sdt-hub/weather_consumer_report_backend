import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { myProductModel } from '../../products/model/products.model';

export const getCategory3Controller = myControllerHandler(async (req, res) => {
  // Use aggregation to group by the 'category' field and count documents in each group
  const categoryData = await myProductModel.aggregate([
    {
      $group: {
        _id: '$category', // Group by the category field
        totalProducts: { $sum: 1 }, // Count each document in the group
      },
    },
    {
      $project: {
        _id: 0,
        categoryName: '$_id', // Rename _id to categoryName
        totalProducts: 1, // Include totalProducts in the output
      },
    },
  ]);

  res.status(StatusCodes.OK).json({
    message: 'Category Fetched Successfully',
    success: true,
    data: categoryData,
  });
});
