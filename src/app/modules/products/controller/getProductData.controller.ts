import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { myProductModel } from '../model/products.model';

export const getSingleProductDataController = myControllerHandler(
  async (req, res) => {
    const { id } = req.params;
    const productData = await myProductModel.findOne({ id });
    if (!productData) {
      throw new Error('Product Does not Exists with this id');
    }
    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      productData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
