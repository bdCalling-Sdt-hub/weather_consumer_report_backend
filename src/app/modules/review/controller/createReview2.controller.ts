import express, { NextFunction } from 'express';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { reviewDataModelOfWeatherConsumerReport } from '../model/review.model';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';
import { saveAndGiveRefinedUrl } from '../../../../helpers/saveAndGiveRefinedLink';

export const createReview2Controller = myControllerHandler(async (req, res) => {
  const tokenData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
  const myData = await getDataFromFormOfRequest(req);

  const { email } = tokenData;
  const userData = await userDataModelOfWeatherConsumerReport.findOne({
    email,
  });
  if (!userData) {
    throw new Error('User Does Not Exists');
  }

  const dataToSave: any = {};
  dataToSave.userId = userData.id;
  dataToSave.productId = myData.fields.productId[0];
  dataToSave.reviewText = myData.fields.comment[0];
  dataToSave.rating = myData.fields.rating[0];

  const arrayOfMediaNames = JSON.parse(myData.fields.arrayOfMediaNames[0]);

  dataToSave.media = [];

  for (let i = 0; i < arrayOfMediaNames.length; i++) {
    const singleMediaName = arrayOfMediaNames[i];
    const singleMediaFile = myData.files[singleMediaName][0];
    if (singleMediaFile.size > 0) {
      const link = await saveAndGiveRefinedUrl(
        singleMediaFile,
        './public/images/review'
      );
      dataToSave.media.push(link);
    }
  }

  await reviewDataModelOfWeatherConsumerReport.create(dataToSave);

  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Review Given Successfully',
    data: {},
  });
});
