import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
import { User } from './user.model';
import ApiError from '../../../errors/ApiError';
import pick from '../../../shared/pick';
import { checkIfUserWithSameEmailExists } from '../../../helpers/checkIfUserWithSameEmailExists';
import { userDataModelOfWeatherConsumerReport } from './userModelOfWeatherConsumerReport.model';
import { GenerateRandom5DigitNumber } from '../../../helpers/GenerateRandom5DigitNumber';
import { sendOtpViaEmail } from '../../../helpers/sendOtp';
import { saveUnverifiedUsersDataInTemporaryStorage } from '../../../helpers/saveUnverifiedUsersDataInTemporaryStorage';
import {
  dataOfChangingEmailRequest,
  unverifiedUsers,
} from '../../../data/temporaryData';
import { getUnverifiedUserDataAccordingToOtp } from '../../../helpers/getUnverifiedUserDataWithOtp';
import {
  checkMyPassword,
  hashMyPassword,
} from '../../../helpers/passwordHashing';
import { getDataFromFormOfRequest } from '../../../helpers/getDataFromFormAR7';
import { saveFileToFolder } from '../../../helpers/uploadFilesToFolder';
import refineUrlAr7 from '../../../helpers/refineUrlAr7';
import { parseBearerJwtToken } from '../../../helpers/jwtAR7';
import { jwtSecretKey } from '../../../data/environmentVariables';
import { sendOtpToVerifyNewEmail } from '../../../helpers/sendOtpToVerifyNewEmail';
import { getAndParseJwtTokenFromHeader } from '../../../helpers/getAndParseBearerTokenFromHeader';
import { token } from 'morgan';

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;
    const { nameOfUser, emailOfUser, passwordOfUser } = userData;
    // check if user exists
    await checkIfUserWithSameEmailExists(
      emailOfUser,
      userDataModelOfWeatherConsumerReport
    );
    //  generate and send otp
    const otp = GenerateRandom5DigitNumber().toString();
    await sendOtpViaEmail(nameOfUser, emailOfUser, otp);
    // save unverified user data in temporary storage
    const unverifiedUsersData = {
      nameOfUser,
      emailOfUser,
      passwordOfUser,
      otp,
    };
    saveUnverifiedUsersDataInTemporaryStorage(unverifiedUsersData);

    // if (req.file) {
    //   userData.image = '/uploads/users/' + req.file.filename;
    // }
    // const isUserExist = await User.findOne({ email: userData?.email });
    // if (isUserExist) {
    //   if (!isUserExist.isEmailVerified) {
    //     const result = await UserService.isUpdateUser(isUserExist.email);

    //     return sendResponse(res, {
    //       code: StatusCodes.OK,
    //       message:
    //         'OTP sent to your email, please verify your email within the next 3 minutes.',
    //       data: result,
    //     });
    //   } else {
    //     throw new ApiError(StatusCodes.BAD_REQUEST, 'User already exists');
    //   }
    // }
    // const result = await UserService.createUserToDB(userData);
    // if (result.isEmailVerified) {
    //   return sendResponse(res, {
    //     code: StatusCodes.OK,
    //     message: "User's account created successfully.",
    //     data: result,
    //   });
    // }

    return sendResponse(res, {
      code: StatusCodes.OK,
      message:
        'OTP sent to your email, please verify your email within the next 3 minutes.',
      // data: result,
    });
  }
);
const verifyUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;
    const { otp } = userData;
    const savedUserData: any = await getUnverifiedUserDataAccordingToOtp(
      otp,
      unverifiedUsers
    );
    const { nameOfUser, emailOfUser, passwordOfUser } = savedUserData;
    const hashedPassword = await hashMyPassword(passwordOfUser);
    await userDataModelOfWeatherConsumerReport.create({
      username: nameOfUser,
      email: emailOfUser,
      passwordHash: hashedPassword,
      role: 'user',
      isBanned: false,
      profileImageUrl: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return sendResponse(res, {
      code: StatusCodes.OK,
      message:
        'OTP sent to your email, please verify your email within the next 3 minutes.',
      // data: result,
    });
  }
);
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const formData = (await getDataFromFormOfRequest(req)) as any;
    const { files, fields } = formData;
    const userImage = files.userImage[0];
    const authToken = fields.authToken[0];
    const tokenData = (await parseBearerJwtToken(
      authToken,
      jwtSecretKey
    )) as any;
    const { email } = tokenData;
    const emailProvidedByUser = fields.emailOfUser[0];
    const currentPassword = fields.currentPassword[0];
    const nameOfUser = fields.nameOfUser[0];
    const newPassword = fields.newPassword[0];
    // get user data from database
    const savedUserDataInDatabase =
      await userDataModelOfWeatherConsumerReport.findOne({ email });
    if (!savedUserDataInDatabase) {
      throw new Error('User Does not Exists');
    }
    // check password
    const hashedPassword = savedUserDataInDatabase.passwordHash;
    await checkMyPassword(currentPassword, hashedPassword);

    // save the data directly if email is the old email
    if (emailProvidedByUser === email) {
      console.log(nameOfUser);
      await userDataModelOfWeatherConsumerReport.findOneAndUpdate(
        { email },
        { username: nameOfUser }
      );
      if (newPassword) {
        const passwordHashOfNewPassword = await hashMyPassword(newPassword);
        await userDataModelOfWeatherConsumerReport.findOneAndUpdate(
          { email },
          { passwordHash: passwordHashOfNewPassword }
        );
      }
      // update userImage if new userImage selected
      if (userImage.size !== 0) {
        const imageUrl = (await saveFileToFolder(
          userImage,
          './public/images/user_images/'
        )) as string;
        const refinedImageUrl = refineUrlAr7(imageUrl);
        await userDataModelOfWeatherConsumerReport.findOneAndUpdate(
          { email },
          { profileImageUrl: refinedImageUrl }
        );
      }
    } else {
      const token = GenerateRandom5DigitNumber().toString();
      let imageUrl2 = null as any;
      if (userImage.size !== 0) {
        const imageUrl = (await saveFileToFolder(
          userImage,
          './public/images/user_images/'
        )) as string;
        const refinedImageUrl = refineUrlAr7(imageUrl);
        imageUrl2 = refinedImageUrl;
      }
      const dataOfUserRequestedToEditProfile = {
        nameOfUser,
        imageUrl2,
        newPassword,
        oldEmail: email,
        newEmail: emailProvidedByUser,
        token,
      };

      dataOfChangingEmailRequest.push(dataOfUserRequestedToEditProfile);
      await sendOtpToVerifyNewEmail(nameOfUser, emailProvidedByUser, token);
    }

    return sendResponse(res, {
      code: StatusCodes.OK,
      message:
        'OTP sent to your email, please verify your email within the next 3 minutes.',
      // data: result,
    });
  }
);
const verifyNewEmailOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedTokenData = (await getAndParseJwtTokenFromHeader(
      req,
      jwtSecretKey
    )) as any;

    const { email } = parsedTokenData;
    const { otp } = req.body;

    const userDataSaved = dataOfChangingEmailRequest.filter(
      (data: any) => otp === data.token
    )[0];
    if (!userDataSaved) {
      throw new Error('Invalid Otp');
    }
    const { nameOfUser, imageUrl2, newPassword, oldEmail, newEmail, token } =
      userDataSaved;
    console.log(userDataSaved);
    if (email !== oldEmail) {
      throw new Error('User who is requesting is not Permitted to do this.');
    }

    await userDataModelOfWeatherConsumerReport.findOneAndUpdate(
      {
        email,
      },
      { username: nameOfUser, email: newEmail }
    );
    //  email is changed to new email so we need to search by new email from here
    if (imageUrl2) {
      await userDataModelOfWeatherConsumerReport.findOneAndUpdate(
        {
          email: newEmail,
        },
        { profileImageUrl: imageUrl2 }
      );
    }
    if (newPassword) {
      const newPasswordHash = await hashMyPassword(newPassword);
      await userDataModelOfWeatherConsumerReport.findOneAndUpdate(
        {
          email: newEmail,
        },
        { passwordHash: newPasswordHash }
      );
    }

    return sendResponse(res, {
      code: StatusCodes.OK,
      message:
        'OTP sent to your email, please verify your email within the next 3 minutes.',
      // data: result,
    });
  }
);

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', 'email', 'role', 'fullName']);
  const options = pick(req.query, ['sortBy', 'page', 'limit', 'populate']);
  const users = await UserService.getAllUsersFromDB(filters, options);

  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Users retrieved successfully.',
    data: users,
  });
});

const getSingleUserFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserService.getSingleUserFromDB(id);
  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'User retrieved successfully.',
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getMyProfile(req.user.id);
  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Profile data retrieved successfully.',
    data: result,
  });
});

const fillUpUserDetails = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  if (
    files &&
    'drivingLicenseFront' in files &&
    'drivingLicenseBack' in files
  ) {
    req.body.drivingLicenseFront =
      '/uploads/users/driving_licenses' + files.drivingLicenseFront[0].filename;
    req.body.drivingLicenseBack =
      '/uploads/users/driving_licenses' + files.drivingLicenseBack[0].filename;
  }
  // Call your service with the userId and userData
  const result = await UserService.fillUpUserDetails(userId, req.body);
  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'User details updated successfully.',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  if (req.file) {
    req.body.image = '/uploads/users/' + req.file.filename;
  }
  const result = await UserService.updateMyProfile(userId, req.body);
  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'User updated successfully.',
    data: result,
  });
});
const updateUserImage = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  if (req.file) {
    req.body.image = '/uploads/users/' + req.file.filename;
  }
  const result = await UserService.updateMyProfile(userId, req.body);
  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'User Image updated successfully.',
    data: result,
  });
});

const changeUserStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { action } = req.body;
  await UserService.changeUserStatus(userId, action);
  return sendResponse(res, {
    code: StatusCodes.OK,
    message: `User ${action}ed successfully.`,
    data: {},
  });
});
const deleteMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  await UserService.deleteMyProfile(userId);
  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'User deleted successfully.',
    data: {},
  });
});
const getHomePageDataForLoggedUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;
    return sendResponse(res, {
      code: StatusCodes.OK,
      message:
        'OTP sent to your email, please verify your email within the next 3 minutes.',
      // data: result,
    });
  }
);

export const UserController = {
  createUser,
  verifyUser,
  updateUser,
  getAllUsers,
  updateUserImage,
  getSingleUserFromDB,
  getMyProfile,
  updateMyProfile,
  fillUpUserDetails,
  deleteMyProfile,
  changeUserStatus,
  getHomePageDataForLoggedUsers,
  verifyNewEmailOtp,
};
