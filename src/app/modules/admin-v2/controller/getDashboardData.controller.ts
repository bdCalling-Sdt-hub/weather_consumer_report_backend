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
      { month: 'April', reviews: 65 },
      { month: 'May', reviews: 120 },
      { month: 'June', reviews: 95 },
      { month: 'July', reviews: 110 },
      { month: 'August', reviews: 85 },
      { month: 'September', reviews: 70 },
      { month: 'October', reviews: 100 },
      { month: 'November', reviews: 130 },
      { month: 'December', reviews: 105 },
    ];

    const userActivityDetailsInDifferentMonths = [
      { month: 'January', active_users: 900, inactive_users: 300 },
      { month: 'February', active_users: 850, inactive_users: 200 },
      { month: 'March', active_users: 1000, inactive_users: 250 },
      { month: 'April', active_users: 950, inactive_users: 220 },
      { month: 'May', active_users: 1100, inactive_users: 280 },
      { month: 'June', active_users: 1020, inactive_users: 240 },
      { month: 'July', active_users: 970, inactive_users: 210 },
      { month: 'August', active_users: 890, inactive_users: 270 },
      { month: 'September', active_users: 920, inactive_users: 230 },
      { month: 'October', active_users: 1080, inactive_users: 300 },
      { month: 'November', active_users: 1140, inactive_users: 260 },
      { month: 'December', active_users: 1200, inactive_users: 310 },
    ];

    const topRatedProductsData = [
      {
        rank: 1,
        product_name: 'UltraComfort Sofa',
        average_rating: 4.9,
        total_reviews: 500,
      },
      {
        rank: 2,
        product_name: 'EcoFresh Water Bottle',
        average_rating: 4.8,
        total_reviews: 450,
      },
      {
        rank: 3,
        product_name: 'Gourmet Chef Knife Set',
        average_rating: 4.8,
        total_reviews: 400,
      },
      {
        rank: 4,
        product_name: 'PowerBoost Blender',
        average_rating: 4.7,
        total_reviews: 350,
      },
      {
        rank: 5,
        product_name: 'SmartFit Fitness Tracker',
        average_rating: 4.7,
        total_reviews: 340,
      },
      {
        rank: 6,
        product_name: 'Luxury Memory Foam Pillow',
        average_rating: 4.6,
        total_reviews: 320,
      },
      {
        rank: 7,
        product_name: 'RapidCharge Power Bank',
        average_rating: 4.6,
        total_reviews: 300,
      },
      {
        rank: 8,
        product_name: 'HomeGuard Security Camera',
        average_rating: 4.5,
        total_reviews: 290,
      },
      {
        rank: 9,
        product_name: 'GlidePro Electric Toothbrush',
        average_rating: 4.5,
        total_reviews: 280,
      },
      {
        rank: 10,
        product_name: 'SleekSound Wireless Earbuds',
        average_rating: 4.5,
        total_reviews: 270,
      },
    ];

    const reviewRatioData = [
      { month: 'January', totalReviews: 12457, monthlyReviews: 9457 },
      { month: 'February', totalReviews: 13000, monthlyReviews: 10000 },
      { month: 'March', totalReviews: 14000, monthlyReviews: 11000 },
      { month: 'April', totalReviews: 15000, monthlyReviews: 11500 },
      { month: 'May', totalReviews: 16000, monthlyReviews: 12000 },
      { month: 'June', totalReviews: 17000, monthlyReviews: 12500 },
      { month: 'July', totalReviews: 18000, monthlyReviews: 13000 },
      { month: 'August', totalReviews: 19000, monthlyReviews: 13500 },
      { month: 'September', totalReviews: 20000, monthlyReviews: 14000 },
      { month: 'October', totalReviews: 21000, monthlyReviews: 14500 },
      { month: 'November', totalReviews: 22000, monthlyReviews: 15000 },
      { month: 'December', totalReviews: 23000, monthlyReviews: 15500 },
    ];

    const dataForClient = {
      totalUser,
      totalReviews,
      numberOfReviewsInDifferentMonths,
      topRatedProductsData,
      userActivityDetailsInDifferentMonths,
      reviewRatioData,
    };

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Review Given Successfully',
      data: dataForClient,
    });
  }
);
