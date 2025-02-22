import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { reviewReactionModel } from '../model/reviewReaction.model';

export const makeReviewReactionController = myControllerHandler(
  async (req, res) => {
    const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
    const myData = req.body;
    const { email } = authData;
    const userData = await userDataModelOfWeatherConsumerReport.findOne({
      email,
    });

    if (!userData) {
      throw new Error('User does not exist with this token');
    }

    const { status, reviewId } = myData;

    // Check if the user has already reacted to the review
    const existingReaction = await reviewReactionModel.findOne({
      userId: userData.id,
      reviewId,
    });
    console.log({ delete: 'Deleted', status });
    if (existingReaction) {
      if (existingReaction.reaction === status) {
        // If the user requests the same reaction again (like/like or dislike/dislike), delete it
        await existingReaction.deleteOne();
      } else {
        // If the reaction type is different, update the reaction
        existingReaction.reaction = status;
        await existingReaction.save();
      }
    } else {
      // Create a new reaction if no previous reaction exists
      await reviewReactionModel.create({
        reaction: status,
        reviewId,
        userId: userData.id,
      });
    }

    // Define the response message
    const myResponse = {
      message: 'Review reaction updated successfully',
      success: true,
      data: {},
    };

    res.status(StatusCodes.OK).json(myResponse);
  }
);
