import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { advertisementModel } from '../model/advertisement.model';

export const getSingleAdvertisementController = myControllerHandler(
  async (req, res) => {
    const { id } = req.params;
    const data = await advertisementModel.findOne({ id });
    if (!data) {
      throw new Error('Advertisement Does Not Exists with this id');
    }
    const myResponse = {
      message: 'Advertisement Fetched Successfully',
      success: true,
      data: data,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
