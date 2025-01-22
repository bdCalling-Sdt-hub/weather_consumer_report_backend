import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';
import { userDataModelOfWeatherConsumerReport } from '../user/userModelOfWeatherConsumerReport.model';
import {
  checkMyPassword,
  hashMyPassword,
} from '../../../helpers/passwordHashing';
import {
  giveAuthenticationToken,
  parseJwtToken,
} from '../../../helpers/jwtAR7';
import {
  frontendAddress,
  jwtSecretKey,
} from '../../../data/environmentVariables';
import { sendResetPasswordLinkToEmail } from '../../../helpers/sendResetPasswordLinkToEmail';
import { GenerateRandom5DigitNumber } from '../../../helpers/GenerateRandom5DigitNumber';
import { dataOfResetPasswordRequests } from '../../../data/temporaryData';

//login
const loginIntoDB = catchAsync(async (req, res, next) => {
  const result = await AuthService.loginIntoDB(req.body);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Login Successful',
    data: result,
  });
});
// login-v2
const loginController = catchAsync(async (req, res, next) => {
  const userData = req.body;
  const { emailOfUser, passwordOfUser } = userData;

  // check if user exists
  const savedUserDataInDatabase =
    await userDataModelOfWeatherConsumerReport.findOne({
      email: emailOfUser,
    });
  if (!savedUserDataInDatabase) {
    throw Error('User Does Not Exists');
  }
  // check if password is correct
  const { passwordHash } = savedUserDataInDatabase;
  await checkMyPassword(passwordOfUser, passwordHash);
  // create json token
  const authToken = await giveAuthenticationToken(emailOfUser, jwtSecretKey);

  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Login Successful',
    data: authToken,
  });
});

//forgot password
const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const result = await AuthService.forgotPassword(email);
  sendResponse(res, {
    code: StatusCodes.OK,
    message:
      'OTP sent to your email, please verify your email within the next 3 minutes',
    data: result,
  });
});

//forgot password version 2

const forgotPasswordV2 = catchAsync(async (req, res, next) => {
  const userData = req.body;
  const { email } = userData;
  const token = GenerateRandom5DigitNumber().toString();
  const userRequestData = {
    email,
    token,
  };
  dataOfResetPasswordRequests.push(userRequestData);
  const resetLinkForUser = `${frontendAddress}/reset-password/${token}`;

  await sendResetPasswordLinkToEmail(email, resetLinkForUser);
  sendResponse(res, {
    code: StatusCodes.OK,
    message:
      'OTP sent to your email, please verify your email within the next 3 minutes',
    // data: result,
  });
});

//resend otp
const resendOTP = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const result = await AuthService.resendOTP(email);
  sendResponse(res, {
    code: StatusCodes.OK,
    message:
      'OTP sent to your email, please verify your email within the next 3 minutes',
    data: result,
  });
});
//verify email
const verifyEmail = catchAsync(async (req, res, next) => {
  const verifyData = req.body;
  const result = await AuthService.verifyEmail(verifyData);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Verify Email Successful',
    data: result,
  });
});

//reset password
const resetPassword = catchAsync(async (req, res, next) => {
  const resetPasswordData = req.body;
  await AuthService.resetPassword(resetPasswordData);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Reset Password Successful',
    data: {},
  });
});

//reset password v2
const resetPasswordV2 = catchAsync(async (req, res, next) => {
  const { token, password } = req.body;
  const userData = dataOfResetPasswordRequests.filter(
    (data: any) => data.token === token
  )[0];
  const { email } = userData;
  const newPasswordHash = await hashMyPassword(password);

  await userDataModelOfWeatherConsumerReport.findOneAndUpdate(
    { email },
    { passwordHash: newPasswordHash }
  );

  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Reset Password Successful',
    data: {},
  });
});

//change password
const changePassword = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const changePasswordData = req.body;
  const result = await AuthService.changePassword(userId, changePasswordData);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Change Password Successful',
    data: result,
  });
});

// verify token
const verifyToken = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const authToken = authHeader?.split(' ')[1] as string;
  const userData = (await parseJwtToken(authToken, jwtSecretKey)) as any;
  const { email } = userData;
  const savedDataOfUser = (await userDataModelOfWeatherConsumerReport.findOne({
    email,
  })) as any;
  // wipe pasword hash
  savedDataOfUser.passwordHash = '';
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Login Successful',
    data: savedDataOfUser,
  });
});

//refresh token
const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);
  res.cookie('refreshToken', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Login Successful',
    data: result,
  });
});
export const AuthController = {
  loginIntoDB,
  loginController,
  verifyEmail,
  forgotPassword,
  forgotPasswordV2,
  resetPassword,
  resetPasswordV2,
  changePassword,
  refreshToken,
  resendOTP,
  verifyToken,
};
