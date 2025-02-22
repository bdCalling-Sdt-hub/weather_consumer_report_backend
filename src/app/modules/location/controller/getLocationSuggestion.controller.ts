import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { sendContactUsEmail } from '../../../../helpers/sendOwnerEmailOfContactUs';
import {
  googleMapApiKey,
  ownerEmail,
} from '../../../../data/environmentVariables';
import axios from 'axios';

export const getLocationSuggestionController = myControllerHandler(
  async (req, res) => {
    const { searchText } = req.body;
    const googleResponse = await axios.get(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      {
        params: {
          input: searchText,
          key: googleMapApiKey,
        },
      }
    );

    const myPredictions = googleResponse.data.predictions;
    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: myPredictions,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
