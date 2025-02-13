import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';

export const searchProductController = myControllerHandler(async (req, res) => {
  const { rating, category, brands, searchText } = req.body;

  console.log(rating, category, brands, searchText);

  const myResponse = {
    message: 'Review Given Successfully',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});
