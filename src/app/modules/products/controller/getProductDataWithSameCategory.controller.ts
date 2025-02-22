import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { myProductModel } from '../model/products.model';

export const getProductsByCategoryController = myControllerHandler(
  async (req, res) => {
    const { categoryName } = req.params;

    const products = await myProductModel
      .find({ category: categoryName })
      .limit(25);

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: products,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
