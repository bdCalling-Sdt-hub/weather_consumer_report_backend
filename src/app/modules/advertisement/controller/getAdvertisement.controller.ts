import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { advertisementModel } from '../model/advertisement.model';

export const getAdvertisementController = myControllerHandler(
  async (req, res) => {
    const data = await advertisementModel.find({});
    const myResponse = {
      message: 'Advertisement Fetched Successfully',
      success: true,
      data: data,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
