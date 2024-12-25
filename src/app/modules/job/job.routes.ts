import { Router } from 'express';
import auth from '../../middlewares/auth';
import { JobController } from './job.controllers';

const router = Router();

//admin assign technician
router
  .route('/assign-technician')
  .post(auth('admin'), JobController.assignTechnicianToJob);

router
  .route('/')
  .post(auth('company'), JobController.createJob)
  .get(JobController.getAllJobs);

router
  .route('/:id')
  .get(JobController.getSingleJob)
  .patch(auth('company'), JobController.updateJob)
  .delete(auth('company'), JobController.deleteJob);

export const JobRoutes = router;
