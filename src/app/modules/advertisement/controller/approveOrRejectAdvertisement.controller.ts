import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { advertisementModel } from '../model/advertisement.model';

export const approveOrRejectAdvertisementController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin(req, jwtSecretKey);
    const { id, action } = req.body;
    const adData = await advertisementModel.findOne({ id });
    if (!adData) {
      throw new Error('Ad does not exists');
    }

    if (action === 'approve') {
      adData.status = 'approved';
      await adData.save();
    } else if (action === 'reject') {
      adData.status = 'rejected';
      await adData.save();
    }

    const myResponse = {
      message: 'Updated Successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
