import express from 'express';
import { getAdminDashboardDataController } from '../controller/getDashboardData.controller';
import { getUserDataController } from '../controller/getUsersData.controller';
import { banUserController } from '../controller/banUser.controller';
import { getReviewsDataForAdminController } from '../controller/getReviewsData.controller';
import { adminSignInController } from '../controller/signIn.controller';
import { adminForgotPasswordController } from '../controller/forgotPassword.controller';
import { verifyForgotPasswordOtpController } from '../controller/verifyForgotPasswordOtp.controller';
import { changeAdminPasswordController } from '../controller/changePasswordOfAdmin.controller';
import { removeProductController } from '../controller/removeProduct.controller';
import { changePasswordController2 } from '../controller/changePassword2.controller';

const adminRouterV2 = express.Router();

adminRouterV2.post('/sign-in', adminSignInController);
adminRouterV2.get('/get-dashboard-data', getAdminDashboardDataController);
adminRouterV2.get('/get-user-data', getUserDataController);
adminRouterV2.post('/ban-user', banUserController);
adminRouterV2.get('/get-reviews-data', getReviewsDataForAdminController);
adminRouterV2.post('/remove-reviews-data', getReviewsDataForAdminController);
adminRouterV2.post('/forgot-password', adminForgotPasswordController);
adminRouterV2.post(
  '/verify-forgot-password-otp',
  verifyForgotPasswordOtpController
);
adminRouterV2.post('/change-admin-password', changeAdminPasswordController);
adminRouterV2.post('/change-admin-password-2', changePasswordController2);
adminRouterV2.post('/remove-product', removeProductController);

export { adminRouterV2 };
