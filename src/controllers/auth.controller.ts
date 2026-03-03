import { Request, Response } from 'express';
import { z } from 'zod';
import authService from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler, AppError } from '../middlewares/error.middleware';
import { normalizeRegisterPayload, sanitizeTextFields } from '../utils/normalizers';
import { env } from '../config/env';
import { ERROR_CODES } from '../constants/errorCodes';

/** Cookie maxAge derived from JWT_REFRESH_EXPIRE so both stay in sync. */
const parseTtlMs = (ttl: string): number => {
  const match = /^(\d+)([smhd])$/.exec(ttl);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const v = parseInt(match[1], 10);
  switch (match[2]) {
    case 's': return v * 1_000;
    case 'm': return v * 60 * 1_000;
    case 'h': return v * 60 * 60 * 1_000;
    case 'd': return v * 24 * 60 * 60 * 1_000;
    default:  return 7 * 24 * 60 * 60 * 1_000;
  }
};
const REFRESH_COOKIE_MAX_AGE = parseTtlMs(env.JWT_REFRESH_EXPIRE);

// Validation schemas
export const registerSchema = z.object({  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    // Accept firstName/lastName separately, or a combined fullName/name for legacy clients.
    // normalizeRegisterPayload will split fullName/name into firstName+lastName before the service call.
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    fullName: z.string().optional(),  // legacy combined-name field
    name: z.string().optional(),      // legacy combined-name field
    role: z.enum(['PATIENT', 'DOCTOR'], {
      errorMap: () => ({ message: 'Role must be either PATIENT or DOCTOR' }),
    }),
    specialty: z.string().optional(),
    bio: z.string().optional(),
    dateOfBirth: z.string().optional().transform((val) => val ? new Date(val) : undefined),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'male', 'female', 'other'])
      .transform((val) => val.toUpperCase() as 'MALE' | 'FEMALE' | 'OTHER')
      .optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }).refine(data => data.firstName || data.fullName || data.name, {
    message: 'firstName or a combined fullName/name field is required',
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// NOTE: There is intentionally NO body schema for /auth/refresh or
// /auth/logout. Both endpoints are cookie-only: the refresh token travels
// exclusively in an httpOnly cookie, never in the request body.
// Any request that supplies refreshToken in the body is rejected with 400.
// See the `refresh` handler below for the explicit guard.

export class AuthController {
  /**
   * Register a new user
   * POST /auth/register
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    // Normalize and sanitize payload
    const normalizedPayload = normalizeRegisterPayload(req.body);
    const sanitizedPayload = sanitizeTextFields(normalizedPayload, ['firstName', 'lastName', 'bio', 'address'], {
      firstName: 100,
      lastName: 100,
      bio: 5000,
      address: 500,
    });
    
    // Extract metadata
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.socket.remoteAddress;
    
    const result = await authService.register(sanitizedPayload, userAgent, ipAddress);
    
    // Set refresh token in httpOnly cookie
    if (result.refreshToken) {
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: env.COOKIE_SECURE,
        sameSite: env.COOKIE_SAMESITE,
        maxAge: REFRESH_COOKIE_MAX_AGE,
        path: '/api/auth/refresh',
        ...(env.COOKIE_DOMAIN && { domain: env.COOKIE_DOMAIN }),
      });
    }
    
    // Remove refreshToken from response body (security: only in httpOnly cookie)
    const { refreshToken, ...responseData } = result;
    
    sendSuccess(res, responseData, undefined, 201);
  });

  /**
   * Login user
   * POST /auth/login
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    // Extract metadata
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.socket.remoteAddress;
    
    const result = await authService.login(req.body, userAgent, ipAddress);
    
    // Set refresh token in httpOnly cookie
    if (result.refreshToken) {
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: env.COOKIE_SECURE,
        sameSite: env.COOKIE_SAMESITE,
        maxAge: REFRESH_COOKIE_MAX_AGE,
        path: '/api/auth/refresh',
        ...(env.COOKIE_DOMAIN && { domain: env.COOKIE_DOMAIN }),
      });
    }
    
    // Remove refreshToken from response body (security: only in httpOnly cookie)
    const { refreshToken, ...responseData } = result;
    
    sendSuccess(res, responseData);
  });

  /**
   * Refresh access token
   * POST /auth/refresh
   *
   * Contract: COOKIE-ONLY.
   * The refresh token MUST be supplied via the `refreshToken` httpOnly cookie
   * (set automatically by /auth/login and /auth/register).
   * Sending refreshToken in the request body is explicitly rejected with 400
   * to prevent clients from accidentally falling back to body-based transport.
   */
  refresh = asyncHandler(async (req: Request, res: Response) => {
    // AUDIT-04: Explicitly reject body-based token submission to enforce
    // the cookie-only contract and prevent accidental insecure usage.
    if (req.body?.refreshToken !== undefined) {
      throw new AppError(
        'refreshToken must not be sent in the request body. ' +
        'It is transmitted exclusively via the httpOnly cookie set by /auth/login.',
        400,
        ERROR_CODES.BODY_NOT_ALLOWED
      );
    }

    // Get refresh token ONLY from cookie (no body support for security)
    const refreshToken = req.cookies?.refreshToken;
    
    if (!refreshToken) {
      throw new AppError('Refresh token is required', 401, ERROR_CODES.REFRESH_TOKEN_MISSING);
    }
    
    // Extract metadata
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.socket.remoteAddress;
    
    const result = await authService.refresh(refreshToken, userAgent, ipAddress);
    
    // Set NEW refresh token cookie (rotation)
    if (result.refreshToken) {
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: env.COOKIE_SECURE,
        sameSite: env.COOKIE_SAMESITE,
        maxAge: REFRESH_COOKIE_MAX_AGE,
        path: '/api/auth/refresh',
        ...(env.COOKIE_DOMAIN && { domain: env.COOKIE_DOMAIN }),
      });
    }
    
    // Remove refreshToken from response body (security: only in httpOnly cookie)
    const { refreshToken: _, ...responseData } = result;
    
    sendSuccess(res, responseData);
  });

  /**
   * Logout user
   * POST /auth/logout
   *
   * Contract: COOKIE-ONLY.
   * Revokes the session identified by the httpOnly `refreshToken` cookie.
   * No request body is expected or read.
   */
  logout = asyncHandler(async (req: Request, res: Response) => {
    // Get refresh token ONLY from cookie (no body support)
    const refreshToken = req.cookies?.refreshToken;
    
    if (!refreshToken) {
      throw new AppError('Refresh token is required', 401, ERROR_CODES.REFRESH_TOKEN_MISSING);
    }
    
    const result = await authService.logout(refreshToken);
    
    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.COOKIE_SECURE,
      sameSite: env.COOKIE_SAMESITE,
      path: '/api/auth/refresh',
      ...(env.COOKIE_DOMAIN && { domain: env.COOKIE_DOMAIN }),
    });
    
    sendSuccess(res, result);
  });

  /**
   * Get current user profile
   * GET /auth/me
   */
  me = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await authService.getMe(userId);
    sendSuccess(res, result);
  });
}

export default new AuthController();
