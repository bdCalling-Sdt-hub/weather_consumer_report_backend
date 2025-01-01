import { Router } from 'express';
import auth from '../../middlewares/auth';
import { JobController } from './job.controllers';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import convertHeicToPngMiddleware from '../../middlewares/convertHeicToPngMiddleware';
const UPLOADS_FOLDER = 'uploads/jobs';
const upload = fileUploadHandler(UPLOADS_FOLDER);
const router = Router();

//decline job by technician
router
  .route('/decline-job')
  .post(auth('technician'), JobController.declineJobByTechnician);
//assign technician
router
  .route('/assign-technician')
  .post(auth('admin'), JobController.assignTechnicianToJob);

//technician assigned job
router
  .route('/technician-assigned-job')
  .get(auth('technician'), JobController.technicianAssignedJob);
// company added all jobs
router
  .route('/company-added-all-jobs')
  .get(auth('company'), JobController.getCreatorAddedAllJobs);

//approve job by company
router
  .route('/approve-job')
  .post(auth('company'), JobController.approveJobByCompany);

//archive job by company
router
  .route('/archive-job')
  .post(auth('company'), JobController.archivedJobByCompany);

//reject job by company
router
  .route('/reject-job')
  .post(auth('company'), JobController.rejectJobByCompany);

//delivered job by technician
router
  .route('/submit-work')
  .post(
    auth('technician'),
    upload.single('completedWorkVideo'),
    convertHeicToPngMiddleware(UPLOADS_FOLDER),
    JobController.deliveredJobByTechnician
  );

//accept job by company
router.route('/accepted-job').post(auth('company'), JobController.completeJob);

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
