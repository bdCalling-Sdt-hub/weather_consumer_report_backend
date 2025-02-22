import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { saveFileToFolder } from '../../../../helpers/uploadFilesToFolder';
import { saveAndGiveRefinedUrl } from '../../../../helpers/saveAndGiveRefinedLink';
import { advertisementModel } from '../model/advertisement.model';
import { getMediaTypeAR7 } from '../../../../helpers/getMediaTypeAR7';

export const addAdvertisementController = myControllerHandler(
  async (req, res) => {
    const myData = await getDataFromFormOfRequest(req);
    console.log(myData);
    const dataToSave: any = {};

    dataToSave.username = myData.fields.name_of_user[0];
    dataToSave.email = myData.fields.email_of_user[0];
    dataToSave.phone = myData.fields.phone_of_user[0];
    dataToSave.adName = myData.fields.advertisement_name[0];
    dataToSave.link = myData.fields.ad_link[0];
    dataToSave.duration = myData.fields.ad_duration[0];
    dataToSave.days = myData.fields.number_of_days[0];
    dataToSave.message = myData.fields.extra_message[0];

    const mediaFile = myData.files.ad_image_or_video[0];

    dataToSave.mediaLink = await saveAndGiveRefinedUrl(
      mediaFile,
      './public/images/advertisement'
    );

    dataToSave.mediaType = await getMediaTypeAR7(dataToSave.mediaLink);

    await advertisementModel.create(dataToSave);

    const myResponse = {
      message: 'Advertisement Created Successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
