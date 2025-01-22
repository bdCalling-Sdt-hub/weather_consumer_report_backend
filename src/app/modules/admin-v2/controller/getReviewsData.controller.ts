import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../../shared/sendResponse';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { reviewDataModelOfWeatherConsumerReport } from '../../review/model/review.model';

export const getReviewsDataForAdminController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin(req, jwtSecretKey);
    const { from, to } = req.query as any;
    const startIndex = parseInt(from, 10) || 0;
    const endIndex = parseInt(to, 10) || 0;
    const limit = endIndex - startIndex;
    if (limit < 0) {
      throw new Error(
        'Invalid range: "to" should be greater than or equal to "from".'
      );
    }

    const reviewData = await reviewDataModelOfWeatherConsumerReport
      .find()
      .skip(startIndex)
      .limit(limit);

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Review Data Retrieved Successfully',
      data: reviewData,
    });
  }
);
