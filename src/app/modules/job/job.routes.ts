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
  .route('/archive-job')
  .post(auth('company'), JobController.archivedJobByCompany);

router
  .route('/reject-job')
  .post(auth('company'), JobController.rejectJobByCompany);

router
  .route('/deliver-job')
  .post(
    auth('technician'),
    upload.single('completedWorkVideo'),
    convertHeicToPngMiddleware(UPLOADS_FOLDER),
    JobController.deliveredJobByTechnician
  );
router
  .route('/accepted-job')
  .post(auth('company'), JobController.completeJob);

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
