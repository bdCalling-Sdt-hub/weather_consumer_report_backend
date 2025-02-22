import express from 'express';
import { getLocationSuggestionController } from '../controller/getLocationSuggestion.controller';
import { getCoordinatesController } from '../controller/getCoordinatescontroller';

const locationRouter = express.Router();
locationRouter.post(
  '/get-location-suggestion',
  getLocationSuggestionController
);
locationRouter.post('/get-coordinates', getCoordinatesController);

export { locationRouter };
