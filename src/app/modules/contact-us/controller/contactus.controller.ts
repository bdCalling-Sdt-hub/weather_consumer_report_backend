import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { sendContactUsEmail } from '../../../../helpers/sendOwnerEmailOfContactUs';
import { ownerEmail } from '../../../../data/environmentVariables';

export const contactusController = myControllerHandler(async (req, res) => {
  const { nameOfUser, emailOfUser, messageOfUser } = req.body;
  await sendContactUsEmail(nameOfUser, emailOfUser, messageOfUser, ownerEmail);

  const myResponse = {
    message: 'Review Given Successfully',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});
