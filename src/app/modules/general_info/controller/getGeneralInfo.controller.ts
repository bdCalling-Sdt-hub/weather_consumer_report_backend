import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { generalInfoModel } from '../model/generalInfo.model';

export const getGeneralInfoController = myControllerHandler(
  async (req, res) => {
    const { name } = req.params;
    console.log(name);
    const generalInfo = await generalInfoModel.findOne();
    if (!generalInfo) {
      throw new Error('General Info not created');
    }
    const { privacyPolicy, termsAndConditions, faqs, aboutUs } = generalInfo;
    let dataForClient: any = {};
    if (!name) {
      dataForClient.privacyPolicy = privacyPolicy;
      dataForClient.termsAndConditions = termsAndConditions;
      dataForClient.faqs = faqs;
      dataForClient.aboutUs = aboutUs;
    } else if (name === 'privacy-policy') {
      dataForClient.privacyPolicy = generalInfo.privacyPolicy;
    } else if (name === 'terms-and-conditions') {
      dataForClient.termsAndConditions = generalInfo.termsAndConditions;
    } else if (name === 'about-us') {
      dataForClient.aboutUs = generalInfo.aboutUs;
    } else if (name === 'faqs' || name === 'faq') {
      dataForClient.faqs = generalInfo.faqs;
    }

    const myResponse = {
      message: 'Data Fetched Successfully',
      success: true,
      ...dataForClient,
    };

    res.status(StatusCodes.OK).json(myResponse);
  }
);
