import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { TUser, UserModal } from './user.interface';
import paginate from '../plugins/paginate';
import { roles } from '../../middlewares/roles';

const userSchema = new Schema<TUser, UserModal>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'], // Custom error message
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'], // Custom error message
    },
    email: {
      type: String,
      required: [true, 'Email is required'], // Custom error message
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: [false, 'Phone number is optional'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'], // Custom error message
      select: false,
      minlength: [8, 'Password must be at least 8 characters long'], // Custom error message for minlength
    },
    dateOfBirth: {
      type: String,
      required: [false, 'Date of birth is optional'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    businessName: {
      type: String,
      required: [false, 'Business name is optional'],
    },
    homeAddress: {
      type: String,
      required: [false, 'Address is optional'],
    },
    drivingLicenseFront: {
      type: String,
      required: [false, 'Driving license front is optional'],
    },
    drivingLicenseBack: {
      type: String,
      required: [false, 'Driving license back is optional'],
    },
    workVehicle: {
      type: String,
      required: [false, 'Work vehicle is optional'],
    },
    workExperience: {
      type: String,
      required: [false, 'Work experience is optional'],
    },
    image: {
      type: String,
      default: '/uploads/users/user.png',
      required: [true, 'User image is required'], // Custom error message
    },
    stripeCustomerId: {
      type: String,
      default: null,
      required: [false, 'Stripe customer id is optional'],
    },
    role: {
      type: String,
      enum: {
        values: roles,
        message: '{VALUE} is not a valid role', // Custom error message for enum validation
      },
      required: [true, 'Role is required'], // Custom error message
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: [true, 'Deleted status is required'], // Custom error message
    },
    isBlocked: {
      type: Boolean,
      default: false,
      required: [true, 'Blocked status is required'], // Custom error message
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      required: [true, 'Email verification status is required'], // Custom error message
    },
    isResetPassword: {
      type: Boolean,
      default: false,
      required: [true, 'Reset password status is required'], // Custom error message
    },
    oneTimeCode: {
      type: String,
      default: null,
      required: [false, 'One-time code is optional'],
    },
    oneTimeCodeExpire: {
      type: Date,
      default: null,
      required: [false, 'One-time code expiry is optional'],
    },
    otpCountDown: {
      type: Number,
      default: null,
      required: [false, 'OTP count down is optional'],
    },
    status: {
      type: String,
      enum: ['Active', 'Blocked', 'Delete'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Apply the paginate plugin
userSchema.plugin(paginate);

// Static methods
userSchema.statics.isExistUserById = async function (id: string) {
  return await this.findById(id);
};

userSchema.statics.isExistUserByEmail = async function (email: string) {
  return await this.findOne({ email });
};

userSchema.statics.isMatchPassword = async function (
  password: string,
  hashPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashPassword);
};

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt.saltRounds)
    );
  }
  next();
});

// Create and export the User model
export const User = model<TUser, UserModal>('User', userSchema);
