import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { reviewDataModelOfWeatherConsumerReport } from '../model/review.model';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';

export const searchReviewOfAProductController = myControllerHandler(
  async (req, res) => {
    const { searchText, productId } = req.body;

    const reviewDataOfProduct: any =
      await reviewDataModelOfWeatherConsumerReport
        .find({ productId: productId })
        .limit(20);

    if (!reviewDataOfProduct.length) {
      throw new Error('Review do not exists');
    }

    const arrayOfUserIdOfReviewGiver = [];
    for (let i = 0; i < reviewDataOfProduct.length; i++) {
      arrayOfUserIdOfReviewGiver.push(reviewDataOfProduct[i].userId);
    }

    const arrayOfDetailsOfReviewGiver: any =
      await userDataModelOfWeatherConsumerReport.find({
        id: { $in: arrayOfUserIdOfReviewGiver },
      });

    const arrayOfRefinedReviewData = [];
    for (let i = 0; i < reviewDataOfProduct.length; i++) {
      const singleReviewData = reviewDataOfProduct[i].toObject();
      for (let j = 0; j < arrayOfDetailsOfReviewGiver.length; j++) {
        const singleUserData = arrayOfDetailsOfReviewGiver[j];
        if (singleUserData.id === singleReviewData.userId) {
          singleReviewData.userImageUrl = singleUserData.profileImageUrl;
          singleReviewData.username = singleUserData.username;
          arrayOfRefinedReviewData.push(singleReviewData);
          break;
        }
      }
    }

    const arrayOfRefinedReviewData2: any = [];

    for (let i = 0; i < arrayOfRefinedReviewData.length; i++) {
      const singleReviewData = arrayOfRefinedReviewData[i];
      const username: string = singleReviewData.username.toLowerCase();
      const reviewText: string = singleReviewData.reviewText.toLowerCase();
      const searchText2: string = searchText.toLowerCase();

      if (username.includes(searchText2) || reviewText.includes(searchText2)) {
        arrayOfRefinedReviewData2.push(singleReviewData);
      }
    }

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: arrayOfRefinedReviewData2,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
