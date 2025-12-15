import { Request, Response } from 'express';
import { z } from 'zod';
import authService from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler, AppError } from '../middlewares/error.middleware';

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
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
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
    // Normalize name/fullName for FE compatibility
    const payload = {
      ...req.body,
      fullName: req.body.fullName || req.body.name,
    };
    const result = await authService.register(payload);
    sendSuccess(res, result, undefined, 201);
  });

  /**
   * Login user
   * POST /auth/login
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    sendSuccess(res, result);
  });

  /**
   * Refresh access token
   * POST /auth/refresh
   */
  refresh = asyncHandler(async (req: Request, res: Response) => {
    // Get refresh token from body or cookie (FE compatibility)
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
    
    if (!refreshToken) {
      throw new AppError('Refresh token is required', 401, 'REFRESH_TOKEN_MISSING');
    }
    
    const result = await authService.refresh(refreshToken);
    sendSuccess(res, result);
  });

  /**
   * Logout user
   * POST /auth/logout
   */
  logout = asyncHandler(async (req: Request, res: Response) => {
    // Get refresh token from body or cookie (FE compatibility)
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
    
    if (!refreshToken) {
      throw new AppError('Refresh token is required', 401, 'REFRESH_TOKEN_MISSING');
    }
    
    const result = await authService.logout(refreshToken);
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
