import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../../shared/sendResponse';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { myProductModel } from '../model/products.model';

export const searchProductBasedOnCriteriaController = myControllerHandler(
  async (req, res) => {
    const myData = req.body;
    const { searchText, category } = myData;

    // Initialize the query object
    let query: any = {};

    // Only add searchText to the query if it's not an empty string
    if (searchText) {
      query.$or = [
        { name: { $regex: searchText, $options: 'i' } },
        { id: { $regex: searchText, $options: 'i' } },
      ];
    }

    // Only add category to the query if it's not an empty string
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    // Fetch the products based on the dynamically built query
    const productsData = await myProductModel.find(query);

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: productsData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
