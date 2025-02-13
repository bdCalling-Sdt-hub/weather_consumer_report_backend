import { ErrorRequestHandler } from 'express';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import handleValidationError from '../../errors/handleValidationError';
import handleZodError from '../../errors/handleZodError';
import handleDuplicateError from '../../errors/handleDuplicateError';
import { errorLogger } from '../../shared/logger';
import { IErrorMessage } from '../../types/errors.types';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  // Log error based on environment
  if (config.env === 'development') {
    console.log('🚨 globalErrorHandler ~~ ', error);
  } else {
    errorLogger.error('🚨 globalErrorHandler ~~ ', error);
  }

  let code = 500;
  let message = error.message || 'Something went wrong';
  let errorMessages: IErrorMessage[] = [];

  // Handle Zod Validation Error
  if (error.name === 'ZodError') {
    const simplifiedError = handleZodError(error);
    code = 400;
    message = simplifiedError.errorMessages.map(err => err.message).join(', ');
    errorMessages = simplifiedError.errorMessages;
  }
  // Handle Mongoose ValidationError
  else if (error.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error);
    code = 400;
    message = simplifiedError.errorMessages.map(err => err.message).join(', ');
    errorMessages = simplifiedError.errorMessages;
  }
  // Handle MongoDB Duplicate Key Error
  else if (error.code === 11000 || error.code === 11001) {
    const simplifiedError = handleDuplicateError(error);
    code = 409; // Conflict
    message = simplifiedError.errorMessages.map(err => err.message).join(', ');
    errorMessages = simplifiedError.errorMessages;
  }
  // Handle Custom API Error
  else if (error instanceof ApiError) {
    code = error.code || 500;
    message = error.message || 'Something went wrong';
    errorMessages = error.message ? [{ path: '', message: error.message }] : [];
  }
  // Handle General Errors
  else if (error instanceof Error) {
    message = error.message || 'Internal Server Error';
    errorMessages = error.message ? [{ path: '', message: error.message }] : [];
  }
  // Handle Unknown Errors
  else {
    message = typeof error === 'string' ? error : JSON.stringify(error);
    errorMessages = [{ path: '', message }];
  }

  // Send response
  res.status(code).json({
    code,
    success: false,
    message,
    errors: errorMessages, // Detailed error messages
    stack: config.env === 'development' ? error?.stack : undefined, // Stack trace only in development
  });
};

export default globalErrorHandler;
