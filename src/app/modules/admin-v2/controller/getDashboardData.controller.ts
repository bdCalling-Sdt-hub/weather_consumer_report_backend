import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { reviewDataModelOfWeatherConsumerReport } from '../../review/model/review.model';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';

export const getAdminDashboardDataController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin(req, jwtSecretKey);
    const totalUser =
      await userDataModelOfWeatherConsumerReport.countDocuments();
    const totalReviews =
      await reviewDataModelOfWeatherConsumerReport.countDocuments();
    const numberOfReviewsInDifferentMonths = [
      { month: 'January', reviews: 75 },
      { month: 'February', reviews: 80 },
      { month: 'March', reviews: 90 },
    ];

    const userActivityDetailsInDifferentMonths = [
      { month: 'January', active_users: 900, inactive_users: 300 },
      { month: 'February', active_users: 850, inactive_users: 200 },
    ];
    const topRatedProductsData = [
      {
        rank: 1,
        product_name: 'John',
        average_rating: 4.5,
        total_reviews: 300,
      },
      {
        rank: 2,
        product_name: 'Jane',
        average_rating: 4.5,
        total_reviews: 300,
      },
    ];

    const dataForClient = {
      totalUser,
      totalReviews,
      numberOfReviewsInDifferentMonths,
      topRatedProductsData,
      userActivityDetailsInDifferentMonths,
    };

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Review Given Successfully',
      data: dataForClient,
    });
  }
);
