import { Router } from 'express';
import auth from '../../middlewares/auth';
import { JobController } from './job.controllers';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import convertHeicToPngMiddleware from '../../middlewares/convertHeicToPngMiddleware';
const UPLOADS_FOLDER = 'uploads/jobs';
const upload = fileUploadHandler(UPLOADS_FOLDER);
const router = Router();

router
  .route('/assign-technician')
  .post(auth('admin'), JobController.assignTechnicianToJob);

router
  .route('/approve-job')
  .post(auth('company'), JobController.approveJobByCompany);

router
  .route('/complete-job')
  .post(
    auth('technician'),
    upload.single('workVideo'),
    convertHeicToPngMiddleware(UPLOADS_FOLDER),
    JobController.completeJob
  );

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
