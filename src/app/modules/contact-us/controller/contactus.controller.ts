import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { sendContactUsEmail } from '../../../../helpers/sendOwnerEmailOfContactUs';
import {
  CONTACT_EMAIL_1,
  CONTACT_EMAIL_2,
  ownerEmail,
} from '../../../../data/environmentVariables';

export const contactusController = myControllerHandler(async (req, res) => {
  const { nameOfUser, emailOfUser, messageOfUser } = req.body;
  await sendContactUsEmail(
    nameOfUser,
    emailOfUser,
    messageOfUser,
    CONTACT_EMAIL_1
  );
  await sendContactUsEmail(
    nameOfUser,
    emailOfUser,
    messageOfUser,
    CONTACT_EMAIL_2
  );

  const myResponse = {
    message: 'Review Given Successfully',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});
