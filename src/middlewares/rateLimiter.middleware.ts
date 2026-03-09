import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { ERROR_CODES } from '../constants/errorCodes';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.NODE_ENV === 'development' ? 100 : 10,
  message: {
    error: {
      message: 'Too many requests from this IP, please try again later',
      code: ERROR_CODES.TOO_MANY_REQUESTS,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (_req) => {
    return env.NODE_ENV === 'development' && process.env.DISABLE_RATE_LIMIT === 'true';
  },
});

export const refreshRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  // React StrictMode fires effects twice in development, doubling refresh calls.
  max: env.NODE_ENV === 'development' ? 100 : 5,
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

// Limits logout rate to prevent DoS via repeated session-destruction requests.
export const logoutRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.NODE_ENV === 'development' ? 100 : 10,
  message: {
    error: {
      message: 'Too many logout requests, please try again later',
      code: ERROR_CODES.TOO_MANY_REQUESTS,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (_req) => {
    return env.NODE_ENV === 'development' && process.env.DISABLE_RATE_LIMIT === 'true';
  },
});

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.NODE_ENV === 'development' ? 1000 : 100,
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
