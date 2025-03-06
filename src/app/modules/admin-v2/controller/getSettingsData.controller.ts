import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';

export const getSettingsDataController = myControllerHandler(
  async (req, res) => {
    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
