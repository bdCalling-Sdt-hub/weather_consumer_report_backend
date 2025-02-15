import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';
import { saveAndGiveRefinedUrl } from '../../../../helpers/saveAndGiveRefinedLink';

export const updateProfileController = myControllerHandler(async (req, res) => {
  await checkIfUserRequestingAdmin(req, jwtSecretKey);
  const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
  const { email } = authData;
  const userData = await userDataModelOfWeatherConsumerReport.findOne({
    email,
  });
  if (!userData) {
    throw new Error('User Does Not Exists');
  }
  const sentData = await getDataFromFormOfRequest(req);
  const dataToUpdate: any = {};

  const newName = sentData.fields.name;
  const newEmail = sentData.fields.email;
  const newPhoneNumber = sentData.fields.phone_number;
  const newProfileImage = sentData.files.profile_image;

  if (newName) {
    if (newName[0]) {
      dataToUpdate.username = newName[0];
    }
  }
  if (newEmail) {
    if (newEmail[0]) {
      dataToUpdate.email = newEmail[0];
    }
  }
  if (newPhoneNumber) {
    if (newPhoneNumber[0]) {
      dataToUpdate.phone = newPhoneNumber[0];
    }
  }
  if (newProfileImage) {
    if (!(newProfileImage[0].size > 0)) {
      return;
    }
    const imageUrl = await saveAndGiveRefinedUrl(
      newProfileImage[0],
      './public/images/user'
    );
    dataToUpdate.profileImageUrl = imageUrl;
  }

  await userDataModelOfWeatherConsumerReport.findOneAndUpdate(
    {
      id: userData.id,
    },
    dataToUpdate
  );

  const myResponse = {
    message: 'Profile Data Updated Successfully',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});
