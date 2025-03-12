import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { hashMyPassword } from '../../../../helpers/passwordHashing';

export const addSuperAdminController = myControllerHandler(async (req, res) => {
  console.log(req.body);
  const { name, role, email, password } = req.body;
  const passwordHash = await hashMyPassword(password);

  await userDataModelOfWeatherConsumerReport.create({
    username: name,
    email: email,
    passwordHash,
    role: 'admin',
  });

  const myResponse = {
    message: 'Review Given Successfully',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});
