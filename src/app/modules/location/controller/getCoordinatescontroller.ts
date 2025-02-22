import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import axios from 'axios';
import { googleMapApiKey } from '../../../../data/environmentVariables';

export const getCoordinatesController = myControllerHandler(
  async (req, res) => {
    const { address } = req.body;

    if (!address) {
      throw new Error('Address is required');
    }

    const googleResponse = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address,
          key: googleMapApiKey,
        },
      }
    );

    const results = googleResponse.data.results;

    if (!results || results.length === 0) {
      throw new Error('No coordinates found for the given address');
    }
    const location = results[0].geometry.location;
    const myResponse = {
      message: 'location fetched successfull',
      success: true,
      data: location,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
