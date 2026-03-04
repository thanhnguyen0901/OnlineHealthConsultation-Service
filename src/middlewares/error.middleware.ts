import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/apiResponse';
import { ERROR_CODES } from '../constants/errorCodes';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode =
    err instanceof AppError
      ? err.statusCode
      : err instanceof ZodError
      ? 400
      : 500;
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${statusCode}] Error:`, err);
  } else {
    // 5xx logged as error; 4xx logged as warn to reduce noise.
    const logger = statusCode >= 500 ? console.error : console.warn;
    logger(`[${statusCode}] ${err.name}: ${err.message}`, {
      ...(err instanceof AppError && { code: err.code, details: err.details }),
    });
  }

  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    sendError(res, 'Validation failed', 400, ERROR_CODES.VALIDATION_ERROR, details);
    return;
  }

  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.code, err.details);
    return;
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    if (prismaError.code === 'P2002') {
      sendError(res, 'A record with this unique field already exists', 409, ERROR_CODES.DUPLICATE_ENTRY);
      return;
    }
    if (prismaError.code === 'P2025') {
      sendError(res, 'Record not found', 404, ERROR_CODES.NOT_FOUND);
      return;
    }
  }

  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid token', 401, ERROR_CODES.INVALID_TOKEN);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Token expired', 401, ERROR_CODES.TOKEN_EXPIRED);
    return;
  }

  sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    500,
    ERROR_CODES.INTERNAL_SERVER_ERROR
  );
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
