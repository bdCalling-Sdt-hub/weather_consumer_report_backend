import express from 'express';

import { addAdvertisementController } from '../controller/addAdvertisement.controller';
import { getAdvertisementController } from '../controller/getAdvertisement.controller';

import { deleteAdvertisementController } from '../controller/deleteAdvertisement.controller';
import { updateAdvertisementController } from '../controller/updateAdvertisement.controller';
import { getSingleAdvertisementController } from '../controller/getSingleAdvertisementData.controller';
import { getApprovedAdvertisementController } from '../controller/getApprovedAdvertisement.controller';
import { approveOrRejectAdvertisementController } from '../controller/approveOrRejectAdvertisement.controller';

const advertisementRouter = express.Router();

advertisementRouter.get('/', getAdvertisementController);
advertisementRouter.get(
  '/get-approved-advertisement',
  getApprovedAdvertisementController
);
advertisementRouter.post('/add', addAdvertisementController);
advertisementRouter.post(
  '/approve-or-reject-advertisement/',
  approveOrRejectAdvertisementController
);

advertisementRouter.get('/:id', getSingleAdvertisementController);
advertisementRouter.delete('/:id', deleteAdvertisementController);
advertisementRouter.patch('/:id', updateAdvertisementController);

export { advertisementRouter };
