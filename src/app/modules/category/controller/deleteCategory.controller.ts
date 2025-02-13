import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { assetCategoryModel } from '../model/category.model';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';

export const deleteCategoryController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin(req, jwtSecretKey);
    const { id } = req.params;
    await assetCategoryModel.findOneAndDelete({ id });
    const myResponse = {
      message: 'Category Deleted Successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
