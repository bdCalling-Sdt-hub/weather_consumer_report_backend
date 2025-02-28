import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { ReportModel } from '../model/report.model';

export const makeReportController = myControllerHandler(async (req, res) => {
  const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
  const { email } = authData;
  const userData = await userDataModelOfWeatherConsumerReport.findOne({
    email,
  });
  if (!userData) {
    throw new Error('User does not exists');
  }
  const { type, idOfReportedParty, reasonOfReport } = req.body;
  ReportModel.create({
    type: type,
    idOfReportedParty: idOfReportedParty,
    idOfReporter: userData.id,
    reasonOfReport: reasonOfReport,
  });
  const myResponse = {
    message: 'Review Given Successfully',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});
