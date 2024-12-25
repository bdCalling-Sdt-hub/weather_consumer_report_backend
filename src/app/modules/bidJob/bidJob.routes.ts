import { Router } from 'express';
import auth from '../../middlewares/auth';
import { BidJobController } from './bidJob.controllers';

const router = Router();
router.route('/').post(auth('technician'), BidJobController.addBidJob);

export const BidJobRoutes = router;