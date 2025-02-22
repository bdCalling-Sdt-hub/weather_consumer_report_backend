import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { myProductModel } from '../model/products.model';
import { reviewDataModelOfWeatherConsumerReport } from '../../review/model/review.model';
import { refineStars1 } from '../../../../helpers/refineStars1';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';

export const getSingleProductDataController = myControllerHandler(
  async (req, res) => {
    const { id } = req.params;
    const productData = await myProductModel.findOne({ id });
    if (!productData) {
      throw new Error('Product Does not Exist with this id');
    }

    const averageRatingData =
      await reviewDataModelOfWeatherConsumerReport.aggregate([
        { $match: { productId: productData.id } }, // Filter reviews by productId
        {
          $group: {
            _id: '$productId',
            averageRating: { $avg: '$rating' }, // Calculate average rating
          },
        },
      ]);

    let averageRating = 0; // Default to 0 if no average rating is found
    if (averageRatingData.length > 0) {
      averageRating = averageRatingData[0].averageRating;
    }

    const totalNumberOfReviews =
      await reviewDataModelOfWeatherConsumerReport.countDocuments({
        productId: productData.id,
      });

    const ratingDistribution =
      await reviewDataModelOfWeatherConsumerReport.aggregate([
        { $match: { productId: productData.id } }, // Filter by productId
        {
          $group: {
            _id: '$rating', // Group by rating value
            count: { $sum: 1 }, // Count occurrences
          },
        },
      ]);

    const ratingStats = refineStars1(ratingDistribution);
    const reviewDataOfProduct = await reviewDataModelOfWeatherConsumerReport
      .find({
        productId: productData.id,
      })
      .limit(20);

    const arrayOfUserIdOfReviewGiver = [];
    for (let i = 0; i < reviewDataOfProduct.length; i++) {
      arrayOfUserIdOfReviewGiver.push(reviewDataOfProduct[i].userId);
    }

    const arrayOfDetailsOfReviewGiver =
      await userDataModelOfWeatherConsumerReport.find({
        id: { $in: arrayOfUserIdOfReviewGiver },
      });

    const arrayOfRefinedReviewData: any = [];
    for (let i = 0; i < reviewDataOfProduct.length; i++) {
      const singleReviewData: any = reviewDataOfProduct[i].toObject();
      for (let i = 0; i < arrayOfDetailsOfReviewGiver.length; i++) {
        const singleUserData = arrayOfDetailsOfReviewGiver[i];
        if (singleUserData.id === singleReviewData.userId) {
          singleReviewData.userImageUrl = singleUserData.profileImageUrl;
          singleReviewData.username = singleUserData.username;
          arrayOfRefinedReviewData.push(singleReviewData);
        }
      }
    }

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      productData,
      averageRating,
      totalNumberOfReviews,
      ratingStats,
      reviewData: arrayOfRefinedReviewData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
