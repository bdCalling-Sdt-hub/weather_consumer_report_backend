import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from '../user/user.validation';
import { UserController } from '../user/user.controller';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/register',
  validateRequest(UserValidation.createUserValidationSchema),
  UserController.createUser
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginIntoDB
);
router.post('/login/v2', AuthController.loginController);

router.post('/forgot-password', AuthController.forgotPassword);
router.post('/forgot-password/v2', AuthController.forgotPasswordV2);
router.post('/resend-otp', AuthController.resendOTP);
router.post(
  '/verify-email',
  validateRequest(AuthValidation.verifyEmailValidationSchema),
  AuthController.verifyEmail
);

router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthController.resetPassword
);

router.post('/reset-password/v2', AuthController.resetPasswordV2);

//refresh token
router.post('/refresh-token', AuthController.refreshToken);

//verify token
router.post('/verify-token', AuthController.verifyToken);

router.post(
  '/change-password',
  auth('common'),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword
);
export const AuthRoutes = router;
