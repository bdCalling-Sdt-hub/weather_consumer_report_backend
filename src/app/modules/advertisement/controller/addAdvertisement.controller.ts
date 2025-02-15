import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { saveFileToFolder } from '../../../../helpers/uploadFilesToFolder';
import { saveAndGiveRefinedUrl } from '../../../../helpers/saveAndGiveRefinedLink';
import { advertisementModel } from '../model/advertisement.model';

export const addAdvertisementController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin(req, jwtSecretKey);
    const myData = await getDataFromFormOfRequest(req);

    const name = myData.fields.name[0];
    const link = myData.fields.link[0];

    await advertisementModel.create({ name, link });

    const myResponse = {
      message: 'Advertisement Created Successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
