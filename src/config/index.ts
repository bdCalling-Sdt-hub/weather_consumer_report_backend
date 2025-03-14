import { z } from 'zod';
import path from 'path';
import { databaseUrlOfWeatherConsumerReport } from '../data/environmentVariables';

// Define hardcoded values for environment variables
const config = {
  NODE_ENV: 'development',
  PORT: '8080',
  SOCKET: '8082',
  MONGODB_URL: 'mongodb://localhost:27017/mydb', // Replace with your actual MongoDB URL
  JWT_SECRET: 'my-secret-key', // Replace with your actual JWT secret
  JWT_EXPIRATION_TIME: '1d',
  JWT_REFRESH_EXPIRATION_TIME: '180d',
  BCRYPT_SALT_ROUNDS: '12',
  SMTP_HOST: 'smtp.example.com', // Replace with your SMTP host
  SMTP_PORT: '587', // Replace with your SMTP port
  SMTP_USERNAME: 'smtp-user', // Replace with your SMTP username
  SMTP_PASSWORD: 'smtp-password', // Replace with your SMTP password
  EMAIL_FROM: 'no-reply@example.com', // Replace with your email sender
  BACKEND_IP: '192.168.1.100', // Replace with your backend IP
  STRIPE_SECRET_KEY: 'stripe-secret-key', // Replace with your Stripe secret key
  STRIPE_WEBHOOK_SECRET: 'stripe-webhook-secret', // Replace with your Stripe webhook secret
};

// Validate the hardcoded values (optional if you want to keep the validation logic)
const envVars = {
  success: true,
  data: config,
};

// Validate the environment variables (if you want to keep it for structure)
const envVarsSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.string().default('8080'),
  SOCKET: z.string().default('8082'),
  MONGODB_URL: z.string().optional(),
  JWT_SECRET: z.string(),
  JWT_EXPIRATION_TIME: z.string().default('1d'),
  JWT_REFRESH_EXPIRATION_TIME: z.string().default('180d'),
  BCRYPT_SALT_ROUNDS: z.string().default('12'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USERNAME: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  BACKEND_IP: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
});

// Check if the config is valid
const validationResult = envVarsSchema.safeParse(envVars.data);
if (!validationResult.success) {
  console.log(validationResult.error);
  throw new Error(
    `Config validation error: ${validationResult.error.format()}`
  );
}

export default {
  env: envVars.data.NODE_ENV,
  port: envVars.data.PORT,
  socket_port: envVars.data.SOCKET,
  mongoose: {
    url: databaseUrlOfWeatherConsumerReport,
    options: {
      // Optional Mongoose configurations can go here
    },
  },
  jwt: {
    accessSecret: envVars.data.JWT_SECRET,
    accessExpirationTime: envVars.data.JWT_EXPIRATION_TIME,
    refreshExpirationTime: envVars.data.JWT_REFRESH_EXPIRATION_TIME,
  },
  bcrypt: {
    saltRounds: envVars.data.BCRYPT_SALT_ROUNDS,
  },
  email: {
    smtp: {
      host: envVars.data.SMTP_HOST,
      port: envVars.data.SMTP_PORT,
      auth: {
        user: envVars.data.SMTP_USERNAME,
        pass: envVars.data.SMTP_PASSWORD,
      },
    },
    from: envVars.data.EMAIL_FROM,
  },
  backendIp: envVars.data.BACKEND_IP,
  stripe: {
    secretKey: envVars.data.STRIPE_SECRET_KEY,
    webhookSecret: envVars.data.STRIPE_WEBHOOK_SECRET,
  },
};
