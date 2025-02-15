import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';

import { saveAndGiveRefinedUrl } from '../../../../helpers/saveAndGiveRefinedLink';
import { advertisementModel } from '../model/advertisement.model';

export const updateAdvertisementController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin(req, jwtSecretKey);
    const { id } = req.params;

    const myData = await getDataFromFormOfRequest(req);
    const updatedData = {} as any;
    const name = myData.fields.name;
    const link = myData.fields.link;
    if (name) {
      if (name[0]) {
        updatedData.name = name[0];
      }
    }
    if (link) {
      if (link[0]) {
        updatedData.link = link[0];
      }
    }

    await advertisementModel.findOneAndUpdate({ id }, updatedData);

    const myResponse = {
      message: 'Advertisement Updated Successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
//
