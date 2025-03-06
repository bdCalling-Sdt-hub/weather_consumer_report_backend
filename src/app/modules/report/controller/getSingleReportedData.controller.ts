import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { ReportModel } from '../model/report.model';
import { checkIfUserRequestingAdmin2 } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { myProductModel } from '../../products/model/products.model';
import { reviewDataModelOfWeatherConsumerReport } from '../../review/model/review.model';

export const getSingleReportDataController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin2(
      req,
      jwtSecretKey,
      userDataModelOfWeatherConsumerReport
    );

    const { id } = req.params;

    const reportData = await ReportModel.findOne({ id });
    if (!reportData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Report not found',
        success: false,
      });
    }

    const singleReportData = reportData.toObject();

    let userWhoReported = null;
    let reportedEntity = null;

    const userData = await userDataModelOfWeatherConsumerReport.findOne({
      id: singleReportData.idOfReporter,
    });
    if (userData) {
      userWhoReported = userData.username;
    }

    if (singleReportData.type === 'product') {
      const productData = await myProductModel.findOne({
        id: singleReportData.idOfReportedParty,
      });
      if (productData) {
        reportedEntity = {
          productName: productData.name,
          productDescription: productData.description,
          mediaUrls: [
            productData.productImageUrl,
            ...productData.moreImagesUrl,
          ],
          doesExists: true,
        };
      }
    } else if (singleReportData.type === 'review') {
      const reviewData = await reviewDataModelOfWeatherConsumerReport.findOne({
        id: singleReportData.idOfReportedParty,
      });
      if (reviewData) {
        reportedEntity = {
          reviewText: reviewData.reviewText,
          rating: reviewData.rating,
          mediaUrls: reviewData.media,
          doesExists: true,
        };
      }
    }

    if (!reportedEntity) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Reported entity not found',
        success: false,
      });
    }

    const responseData = {
      id: singleReportData.id,
      type: singleReportData.type,
      idOfReporter: singleReportData.idOfReporter,
      nameOfUserWhoReported: userWhoReported,
      reportedEntity,
    };

    res.status(StatusCodes.OK).json({
      message: 'Report Data Sent Successfully',
      success: true,
      data: responseData,
    });
  }
);
