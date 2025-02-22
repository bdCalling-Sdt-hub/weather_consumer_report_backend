import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { reviewDataModelOfWeatherConsumerReport } from '../../review/model/review.model';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { myProductModel } from '../../products/model/products.model';

export const getAdminDashboardDataController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin(req, jwtSecretKey);

    // Fetch total counts
    const totalUser =
      await userDataModelOfWeatherConsumerReport.countDocuments();
    const totalReviews =
      await reviewDataModelOfWeatherConsumerReport.countDocuments();
    const totalProducts = await myProductModel.countDocuments();
    // Fetch all data
    const users: any = await userDataModelOfWeatherConsumerReport.find();
    const reviews: any = await reviewDataModelOfWeatherConsumerReport.find();
    const products: any = await myProductModel.find();

    // Define all 12 months for consistent formatting
    const allMonths = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    // Initialize data structures with all months
    const numberOfReviewsInDifferentMonths = allMonths.map(month => ({
      month,
      reviews: 0,
    }));

    const userActivityDetailsInDifferentMonths = allMonths.map(month => ({
      month,
      active_users: 0,
      inactive_users: 0,
    }));

    const reviewRatioData = allMonths.map(month => ({
      month,
      totalReviews: 0,
      monthlyReviews: 0,
    }));

    // Process user activity details
    for (let i = 0; i < users.length; i++) {
      const month = new Date(users[i].createdAt).toLocaleString('en-US', {
        month: 'long',
      });

      for (let j = 0; j < userActivityDetailsInDifferentMonths.length; j++) {
        if (userActivityDetailsInDifferentMonths[j].month === month) {
          userActivityDetailsInDifferentMonths[j].active_users++;
          break;
        }
      }
    }

    // Process number of reviews in different months
    for (let i = 0; i < reviews.length; i++) {
      const month = new Date(reviews[i].createdAt).toLocaleString('en-US', {
        month: 'long',
      });

      for (let j = 0; j < numberOfReviewsInDifferentMonths.length; j++) {
        if (numberOfReviewsInDifferentMonths[j].month === month) {
          numberOfReviewsInDifferentMonths[j].reviews++;
          break;
        }
      }
    }

    // Process review ratio data
    for (let i = 0; i < reviews.length; i++) {
      const month = new Date(reviews[i].createdAt).toLocaleString('en-US', {
        month: 'long',
      });

      for (let j = 0; j < reviewRatioData.length; j++) {
        if (reviewRatioData[j].month === month) {
          reviewRatioData[j].monthlyReviews++;
          reviewRatioData[j].totalReviews++;
          break;
        }
      }
    }

    // Process product ratings and reviews
    const productRatings: any = [];
    for (let i = 0; i < products.length; i++) {
      let totalRating = 0;
      let reviewCount = 0;

      for (let j = 0; j < reviews.length; j++) {
        if (reviews[j].productId === products[i].id) {
          totalRating += reviews[j].rating;
          reviewCount++;
        }
      }

      const averageRating = reviewCount ? totalRating / reviewCount : 0;

      productRatings.push({
        product_name: products[i].name,
        productImageUrl: products[i].productImageUrl, // ✅ Added productImageUrl
        average_rating: parseFloat(averageRating.toFixed(1)),
        total_reviews: reviewCount,
      });
    }

    // Sort and rank top-rated products
    for (let i = 0; i < productRatings.length - 1; i++) {
      for (let j = i + 1; j < productRatings.length; j++) {
        if (
          productRatings[i].average_rating < productRatings[j].average_rating ||
          (productRatings[i].average_rating ===
            productRatings[j].average_rating &&
            productRatings[i].total_reviews < productRatings[j].total_reviews)
        ) {
          let temp: any = productRatings[i];
          productRatings[i] = productRatings[j];
          productRatings[j] = temp;
        }
      }
    }

    const topRatedProductsData = [];
    for (let i = 0; i < Math.min(10, productRatings.length); i++) {
      topRatedProductsData.push({
        rank: i + 1,
        ...productRatings[i],
      });
    }

    const dataForClient = {
      totalUser,
      totalReviews,
      totalProducts,
      numberOfReviewsInDifferentMonths,
      topRatedProductsData,
      userActivityDetailsInDifferentMonths,
      reviewRatioData,
    };

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Dashboard Data Retrieved Successfully',
      data: dataForClient,
    });
  }
);
