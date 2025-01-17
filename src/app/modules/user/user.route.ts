import express from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import convertHeicToPngMiddleware from '../../middlewares/convertHeicToPngMiddleware';

const UPLOADS_FOLDER = 'uploads/users';
const upload = fileUploadHandler(UPLOADS_FOLDER);
const UPLOADS_DRIVING_LICENSE_FOLDER = 'uploads/users/driving_licenses';
const uploadDrivingLicense = fileUploadHandler(UPLOADS_DRIVING_LICENSE_FOLDER);

const router = express.Router();

//create user
router.route('/create-user').post(
  // auth('admin'),  someone used auth here but what will we authorize when user is creating account. Does not makes sense
  // upload.single('profileImage'),
  // convertHeicToPngMiddleware(UPLOADS_FOLDER),
  UserController.createUser
);
router.route('/verify-user').post(
  // auth('admin'),  someone used auth here but what will we authorize when user is creating account. Does not makes sense
  // upload.single('profileImage'),
  // convertHeicToPngMiddleware(UPLOADS_FOLDER),
  UserController.verifyUser
);
router.route('/update-user').put(UserController.updateUser);
router.route('/verify-new-email-otp').post(UserController.verifyNewEmailOtp);
router.post(
  '/profile-image',
  auth('common'),
  upload.single('profileImage'),
  convertHeicToPngMiddleware(UPLOADS_FOLDER),
  UserController.updateUserImage
);
router.post(
  '/fill-up-user-data',
  auth('common'),
  uploadDrivingLicense.fields([
    { name: 'drivingLicenseFront', maxCount: 1 },
    { name: 'drivingLicenseBack', maxCount: 1 },
  ]),
  convertHeicToPngMiddleware(UPLOADS_DRIVING_LICENSE_FOLDER),
  UserController.fillUpUserDetails
);
// sub routes must be added after the main routes
router.get('/profile', auth('common'), UserController.getMyProfile);

router.patch(
  '/profile',
  auth('common'),
  validateRequest(UserValidation.updateUserValidationSchema),
  upload.single('profileImage'),
  convertHeicToPngMiddleware(UPLOADS_FOLDER),
  UserController.updateMyProfile
);

//main routes
router
  .route('/')
  .get(auth('admin'), UserController.getAllUsers)
  .delete(auth('common'), UserController.deleteMyProfile);

router
  .route('/:id')
  .get(auth('common'), UserController.getSingleUserFromDB)
  .patch(
    auth('admin'),
    validateRequest(UserValidation.changeUserStatusValidationSchema),
    UserController.changeUserStatus
  );

export const UserRoutes = router;
