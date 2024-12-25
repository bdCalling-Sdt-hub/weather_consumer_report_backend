import { z } from 'zod';
import { Role, roles } from '../../middlewares/roles';

const createUserValidationSchema = z.object({
  body: z.object({
    firstName: z
      .string({
        required_error: 'First name is required.',
        invalid_type_error: 'First name must be string',
      })
      .min(1, 'First name cannot be empty.'),
    lastName: z.string({
      required_error: 'Last name is required.',
      invalid_type_error: 'Last name must be string',
    }),
    email: z
      .string({
        required_error: 'Email is required.',
      })
      .email('Invalid email address.'),
    phoneNumber: z.string({
      required_error: 'Phone number is required.',
      invalid_type_error: 'Phone number must be string',
    }),
    password: z
      .string({
        required_error: 'Password is required.',
      })
      .min(8, 'Password must be at least 8 characters long.'),
    agencyName: z
      .string({
        required_error: 'Agency name is required.',
        invalid_type_error: 'Agency name must be string',
      })
      .optional(),
    companyName: z
      .string({
        required_error: 'Company name is required.',
        invalid_type_error: 'Company name must be string',
      })
      .optional(),
    role: z
      .string({
        required_error: 'Role is required.',
      })
      .optional()
      .default('user')
      .refine(role => roles.includes(role as Role), {
        message: `Role must be one of the following: ${roles.join(', ')}`,
      }),
  }),
});
const updateUserValidationSchema = z.object({
  body: z.object({
    firstName: z
      .string({
        required_error: 'First name is required.',
        invalid_type_error: 'First name must be string',
      })
      .min(1, 'First name cannot be empty.')
      .optional(),
    lastName: z
      .string({
        required_error: 'Last name is required.',
        invalid_type_error: 'Last name must be string',
      })
      .optional(),
    email: z
      .string({
        required_error: 'Email is required.',
      })
      .email('Invalid email address.')
      .optional(),
    phoneNumber: z
      .string({
        required_error: 'Phone number is required.',
        invalid_type_error: 'Phone number must be string',
      })
      .optional(),
    address: z
      .string({
        required_error: 'Address is required.',
        invalid_type_error: 'Address must be string',
      })
      .optional(),
    dateOfBirth: z
      .string({
        required_error: 'Date of birth is required.',
        invalid_type_error: 'Date of birth must be string',
      })
      .optional(),
    agencyName: z
      .string({
        required_error: 'Agency name is required.',
        invalid_type_error: 'Agency name must be string',
      })
      .optional(),
    companyName: z
      .string({
        required_error: 'Company name is required.',
        invalid_type_error: 'Company name must be string',
      })
      .optional(),
    location: z
      .string({
        required_error: 'Location is required.',
        invalid_type_error: 'Location must be string',
      })
      .optional(),
  }),
});

const changeUserStatusValidationSchema = z.object({
  body: z.object({
    action: z.enum(['block', 'unblock', 'delete', 'active']),
  }),
});
export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
  changeUserStatusValidationSchema,
};
