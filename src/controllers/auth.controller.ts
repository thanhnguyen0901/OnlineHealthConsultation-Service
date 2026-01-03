import { Request, Response } from 'express';
import { z } from 'zod';
import authService from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler, AppError } from '../middlewares/error.middleware';
import { normalizeRegisterPayload, sanitizeTextFields } from '../utils/normalizers';
import { env } from '../config/env';
import { ERROR_CODES } from '../constants/errorCodes';

// Validation schemas
export const registerSchema = z.object({  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    // Accept either 'fullName' or 'name' from frontend (normalize to fullName)
    fullName: z.string().min(1, 'Full name is required').optional(),
    name: z.string().min(1, 'Name is required').optional(),
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
  }).refine(data => data.fullName || data.name, {
    message: 'Either fullName or name is required',
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional(), // Optional: can come from cookie
  }),
});

export class AuthController {
  /**
   * Register a new user
   * POST /auth/register
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    // Normalize and sanitize payload
    const normalizedPayload = normalizeRegisterPayload(req.body);
    const sanitizedPayload = sanitizeTextFields(normalizedPayload, ['fullName', 'bio', 'address'], {
      fullName: 255,
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
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
   */
  refresh = asyncHandler(async (req: Request, res: Response) => {
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
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
