import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { ERROR_CODES } from '../constants/errorCodes';

/**
 * Rate limiter for authentication endpoints
 * Prevents brute force attacks on login/register
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    error: {
      message: 'Too many requests from this IP, please try again later',
      code: ERROR_CODES.TOO_MANY_REQUESTS,
    },
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (_req) => {
    // Skip rate limiting in development if needed
    return env.NODE_ENV === 'development' && process.env.DISABLE_RATE_LIMIT === 'true';
  },
});

/**
 * Stricter rate limiter for refresh token endpoint
 */
export const refreshRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 refresh requests per windowMs
  message: {
    error: {
      message: 'Too many refresh token requests, please try again later',
      code: ERROR_CODES.TOO_MANY_REQUESTS,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (_req) => {
    return env.NODE_ENV === 'development' && process.env.DISABLE_RATE_LIMIT === 'true';
  },
});

/**
 * General API rate limiter
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: {
      message: 'Too many API requests, please try again later',
      code: ERROR_CODES.TOO_MANY_REQUESTS,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (_req) => {
    return env.NODE_ENV === 'development' && process.env.DISABLE_RATE_LIMIT === 'true';
  },
});
