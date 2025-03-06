import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { ReportModel } from '../model/report.model';
import { reviewDataModelOfWeatherConsumerReport } from '../../review/model/review.model';
import e from 'cors';
import { myProductModel } from '../../products/model/products.model';

export const acceptOrRejectReportController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin(req, jwtSecretKey);
    const myData = await getDataFromFormOfRequest(req);
    const reportId = myData.fields.report_id[0];
    const action = myData.fields.action[0];
    const reportData = await ReportModel.findOne({ id: reportId });
    if (!reportData) {
      throw new Error('Report does not exists');
    }

    if (action === 'accept') {
      if (reportData.type === 'review') {
        const reviewId = reportData.idOfReportedParty;
        const reviewData = await reviewDataModelOfWeatherConsumerReport.findOne(
          { id: reviewId }
        );
        if (!reviewData) {
          throw new Error('Already Deleted');
        }
        await reviewData.deleteOne();
        await reportData.deleteOne();
      } else if (reportData.type === 'product') {
        const productId = reportData.idOfReportedParty;
        const productData = await myProductModel.findOne({ id: productId });
        if (!productData) {
          throw new Error('Already Deleted');
        }
        await productData.deleteOne();
        await reportData.deleteOne();
      }
    } else if (action === 'reject') {
      await reportData.deleteOne();
    }

    const myResponse = {
      message: 'Report Action Taken Successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
