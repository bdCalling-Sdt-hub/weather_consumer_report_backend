import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';

import { jwtSecretKey } from '../../../../data/environmentVariables';

import { checkIfUserRequestingAdmin2 } from '../../../../helpers/checkIfRequestedUserAdmin';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { generalInfoModel } from '../../general_info/model/generalInfo.model';

export const updateGeneralInfoController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin2(
      req,
      jwtSecretKey,
      userDataModelOfWeatherConsumerReport
    );
    const { name } = req.params;

    if (name === 'privacy-policy') {
      const { privacyPolicy } = req.body;
      await generalInfoModel.findOneAndUpdate({}, { privacyPolicy });
    } else if (name === 'terms-and-conditions') {
      const { termsAndConditions } = req.body;
      await generalInfoModel.findOneAndUpdate({}, { termsAndConditions });
    } else if (name === 'about-us') {
      const { aboutUs } = req.body;
      await generalInfoModel.findOneAndUpdate({}, { aboutUs });
    } else if (name === 'faq') {
      const { faqs } = req.body;
      await generalInfoModel.findOneAndUpdate({}, { faqs });
    }

    const myResponse = {
      message: 'Updating Successful',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
