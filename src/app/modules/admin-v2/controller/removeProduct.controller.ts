import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';

export const removeProductController = myControllerHandler(async (req, res) => {
  const { productId } = req.body;
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Product Removed Successfully',
    data: {},
  });
});
