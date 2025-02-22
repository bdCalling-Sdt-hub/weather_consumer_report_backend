import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { reviewReplyModel } from '../model/replyOfReview.model';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';

export const getReplyOfSingleReviewController = myControllerHandler(
  async (req, res) => {
    const { id } = req.params;
    const replyData: any = await reviewReplyModel.find({ reviewId: id });
    const userData: any = await userDataModelOfWeatherConsumerReport.find({});

    // Prepare an array to store formatted replies
    const formattedReplies = [];

    for (let i = 0; i < replyData.length; i++) {
      let reply = replyData[i].toObject();
      let user = null;

      // Find the user whose id matches the reply's userId
      for (let j = 0; j < userData.length; j++) {
        if (userData[j].id === reply.userId) {
          user = {
            username: userData[j].username,
            profileImageUrl: userData[j].profileImageUrl,
          };
          break; // Exit loop once match is found
        }
      }

      // Add the user details to the reply
      reply.user = user;
      formattedReplies.push(reply);
    }

    const myResponse = {
      message: 'Replies fetched successfully',
      success: true,
      data: formattedReplies,
    };

    res.status(StatusCodes.OK).json(myResponse);
  }
);
