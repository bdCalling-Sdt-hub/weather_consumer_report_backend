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
import { getProductDataController } from '../controller/getProductData.controller';
import { searchUserDataController } from '../controller/searchUserData.controller';
import { updateProfileController } from '../controller/updateProfile.controller';
import { updateGeneralInfoController } from '../controller/updateGeneralInfo.controller';
import { banUserManikController } from '../controller/banUserManik.controller';
import { unBanUserManikController } from '../controller/unbanUserManik.controller';
import { getOwnProfileDataController } from '../controller/getOwnProfileData.controller';
import { getSettingsDataController } from '../controller/getSettingsData.controller';
import { addSuperAdminController } from '../controller/addSuperAdmin.controller';

const adminRouterV2 = express.Router();

adminRouterV2.post('/sign-in', adminSignInController);
adminRouterV2.get('/get-dashboard-data', getAdminDashboardDataController);
adminRouterV2.get('/get-user-data', getUserDataController);
adminRouterV2.get('/user/:search_text', searchUserDataController);
adminRouterV2.post('/ban-user', banUserController);
adminRouterV2.patch('/ban-user/:manik', banUserManikController);
adminRouterV2.patch('/unban-user/:manik', unBanUserManikController);
adminRouterV2.get('/get-reviews-data', getReviewsDataForAdminController);
adminRouterV2.post('/remove-reviews-data', getReviewsDataForAdminController);
adminRouterV2.post('/forgot-password', adminForgotPasswordController);
adminRouterV2.post(
  '/verify-forgot-password-otp',
  verifyForgotPasswordOtpController
);
adminRouterV2.post('/change-admin-password', changeAdminPasswordController);
adminRouterV2.post('/change-admin-password-2', changePasswordController2);
adminRouterV2.get('/product', getProductDataController);
adminRouterV2.post('/remove-product', removeProductController);
adminRouterV2.patch('/update-profile', updateProfileController);
adminRouterV2.post('/general-info/update/:name', updateGeneralInfoController);
adminRouterV2.get('/get-own-profile-data', getOwnProfileDataController);
adminRouterV2.get('/get-settings-data', getSettingsDataController);
adminRouterV2.post('/add-super-admin-poqwe', addSuperAdminController);
export { adminRouterV2 };
