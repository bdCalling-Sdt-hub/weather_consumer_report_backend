import { Model, Types } from 'mongoose';
import { Role } from '../../middlewares/roles';
import { TUserStatus } from './user.constant';
import { PaginateOptions, PaginateResult } from '../../../types/paginate';

export type TUser = {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  dateOfBirth: string;
  location: {
    latitude: number;
    longitude: number;
  };
  image: string;
  businessName: string;
  homeAddress: string;
  workVehicle: string;
  workExperience: string;
  amount: number;
  drivingLicenseFront: string;
  drivingLicenseBack: string;
  status: TUserStatus;
  role: Role;
  isDeleted: boolean;
  isBlocked: boolean;
  isEmailVerified: boolean;
  isResetPassword: boolean;
  oneTimeCode?: string | null;
  oneTimeCodeExpire?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export interface UserModal extends Model<TUser> {
  paginate: (
    filter: object,
    options: PaginateOptions
  ) => Promise<PaginateResult<TUser>>;
  isExistUserById(id: string): Promise<Partial<TUser> | null>;
  isExistUserByEmail(email: string): Promise<Partial<TUser> | null>;
  isMatchPassword(password: string, hashPassword: string): Promise<boolean>;
}
