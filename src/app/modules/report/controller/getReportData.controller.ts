import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { ReportModel } from '../model/report.model';
import { checkIfUserRequestingAdmin2 } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { myProductModel } from '../../products/model/products.model';
import { reviewDataModelOfWeatherConsumerReport } from '../../review/model/review.model';

export const getReportDataController = myControllerHandler(async (req, res) => {
  await checkIfUserRequestingAdmin2(
    req,
    jwtSecretKey,
    userDataModelOfWeatherConsumerReport
  );

  const reportData = await ReportModel.find({}).sort({ createdAt: -1 });

  const refinedReportData = [];

  for (let i = 0; i < reportData.length; i++) {
    const singleReportData = reportData[i].toObject();
    refinedReportData.push(singleReportData);
  }

  const arrayOfIdOfProductReported = [];
  const arrayOfIdOfReviewReported = [];
  const arrayOfIdOfUserWhoReported = [];

  for (let i = 0; i < refinedReportData.length; i++) {
    const singleReportData = refinedReportData[i];
    const idOfUserWhoReported = singleReportData.idOfReporter;
    arrayOfIdOfUserWhoReported.push(idOfUserWhoReported);
    if (singleReportData.type === 'product') {
      arrayOfIdOfProductReported.push(singleReportData.idOfReportedParty);
    } else if (singleReportData.type === 'review') {
      arrayOfIdOfReviewReported.push(singleReportData.idOfReportedParty);
    }
  }

  const dataOfUsersWhoReported =
    await userDataModelOfWeatherConsumerReport.find({
      id: {
        $in: arrayOfIdOfUserWhoReported,
      },
    });
  const dataOfReportedProduct = await myProductModel.find({
    id: { $in: arrayOfIdOfProductReported },
  });
  const dataOfReportedReview =
    await reviewDataModelOfWeatherConsumerReport.find({
      id: { $in: arrayOfIdOfReviewReported },
    });

  for (let i = 0; i < refinedReportData.length; i++) {
    const singleReportedData: any = refinedReportData[i];
    for (let i = 0; i < dataOfUsersWhoReported.length; i++) {
      const singleUserData = dataOfUsersWhoReported[i];
      if (singleUserData.id === singleReportedData.idOfReporter) {
        singleReportedData.nameOfUserWhoReported = singleUserData.username;
      }
    }

    if (singleReportedData.type === 'product') {
      for (let i = 0; i < dataOfReportedProduct.length; i++) {
        const singleProductData = dataOfReportedProduct[i];

        if (singleProductData.id === singleReportedData.idOfReportedParty) {
          singleReportedData.productName = singleProductData.name;
          singleReportedData.productDescription = singleProductData.description;
          singleReportedData.mediaUrls = [];
          singleReportedData.mediaUrls.push(singleProductData.productImageUrl);
          const moreMediaOfProduct = singleProductData.moreImagesUrl;
          singleReportedData.doesExists = true;

          for (let i = 0; i < moreMediaOfProduct.length; i++) {
            const singleProductMedia = moreMediaOfProduct[i];
            singleReportedData.mediaUrls.push(singleProductMedia);
          }
        }
      }
    }

    if (singleReportedData.type === 'review') {
      for (let i = 0; i < dataOfReportedReview.length; i++) {
        const singleReviewData = dataOfReportedReview[i];
        if (singleReviewData.id === singleReportedData.idOfReportedParty) {
          singleReportedData.reviewText = singleReviewData.reviewText;
          singleReportedData.rating = singleReviewData.rating;
          singleReportedData.mediaUrls = singleReviewData.media;
          singleReportedData.doesExists = true;
        }
      }
    }
  }

  // filter out reports that does not exists
  const refinedReportData2 = [];

  for (let i = 0; i < refinedReportData.length; i++) {
    const singleReportData: any = refinedReportData[i];
    const doesExists = singleReportData.doesExists;
    if (doesExists) {
      refinedReportData2.push(singleReportData);
    }
  }

  const dataToSend: any = {
    reportedReviews: [],
    reportedProducts: [],
  };

  for (let i = 0; i < refinedReportData2.length; i++) {
    const singleReportData = refinedReportData2[i];
    if (singleReportData.type === 'product') {
      dataToSend.reportedProducts.push(singleReportData);
    } else if (singleReportData.type === 'review') {
      dataToSend.reportedReviews.push(singleReportData);
    }
  }

  const myResponse = {
    message: 'Report Data Sent Successfully',
    success: true,
    data: dataToSend,
  };
  res.status(StatusCodes.OK).json(myResponse);
});
