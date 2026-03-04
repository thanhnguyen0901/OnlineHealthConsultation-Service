import { Request, Response } from 'express';
import { z } from 'zod';
import authService from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler, AppError } from '../middlewares/error.middleware';
import { normalizeRegisterPayload, sanitizeTextFields } from '../utils/normalizers';
import { env } from '../config/env';
import { ERROR_CODES } from '../constants/errorCodes';

// maxAge mirrors JWT_REFRESH_EXPIRE to keep cookie lifetime in sync.
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

// Refresh-token path is fixed at '/api/auth'; all set/clear operations use this constant.
const REFRESH_COOKIE_PATH = '/api/auth' as const;

const LEGACY_REFRESH_COOKIE_PATHS = ['/api/auth/refresh'] as const;

// REFRESH_COOKIE_PATH must never equal a legacy path (would re-introduce double-cookie bug).
if (env.NODE_ENV !== 'production') {
  for (const legacyPath of LEGACY_REFRESH_COOKIE_PATHS) {
    if ((REFRESH_COOKIE_PATH as string) === legacyPath) {
      throw new Error(
        `[auth-controller] REFRESH_COOKIE_PATH ('${REFRESH_COOKIE_PATH}') ` +
        `must not equal a legacy path ('${legacyPath}'). ` +
        `This would re-introduce the double-cookie path bug.`
      );
    }
  }
}

const refreshCookieBase = () => ({
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: env.COOKIE_SAMESITE,
  ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
});

// Evicts legacy path cookies before setting canonical to prevent double-cookie state.
function setRefreshCookie(res: Response, token: string): void {
  for (const legacyPath of LEGACY_REFRESH_COOKIE_PATHS) {
    res.clearCookie('refreshToken', { ...refreshCookieBase(), path: legacyPath });
  }
  if (env.NODE_ENV !== 'production') {
    console.debug(
      `[auth:cookie] setRefreshCookie path=${REFRESH_COOKIE_PATH}` +
      ` token_prefix=${token.slice(0, 12)}`
    );
  }
  res.cookie('refreshToken', token, {
    ...refreshCookieBase(),
    maxAge: REFRESH_COOKIE_MAX_AGE,
    path: REFRESH_COOKIE_PATH,
  });
}

// Clears all known cookie paths so a dead token cannot be re-sent after logout or terminal errors.
function clearRefreshCookie(res: Response): void {
  res.clearCookie('refreshToken', { ...refreshCookieBase(), path: REFRESH_COOKIE_PATH });
  for (const legacyPath of LEGACY_REFRESH_COOKIE_PATHS) {
    res.clearCookie('refreshToken', { ...refreshCookieBase(), path: legacyPath });
  }
  if (env.NODE_ENV !== 'production') {
    console.debug(
      `[auth:cookie] clearRefreshCookie paths=[${REFRESH_COOKIE_PATH}, ` +
      `${LEGACY_REFRESH_COOKIE_PATHS.join(', ')}]`
    );
  }
}

export const registerSchema = z.object({  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    fullName: z.string().optional(),  // legacy: split into firstName+lastName by normalizeRegisterPayload
    name: z.string().optional(),      // legacy: split into firstName+lastName by normalizeRegisterPayload
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

// /auth/refresh and /auth/logout are cookie-only; body-supplied refreshToken is rejected with 400.
export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const normalizedPayload = normalizeRegisterPayload(req.body);
    const sanitizedPayload = sanitizeTextFields(normalizedPayload, ['firstName', 'lastName', 'bio', 'address'], {
      firstName: 100,
      lastName: 100,
      bio: 5000,
      address: 500,
    });
    
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.socket.remoteAddress;
    
    const result = await authService.register(sanitizedPayload, userAgent, ipAddress);
    
    if (result.refreshToken) {
      setRefreshCookie(res, result.refreshToken);
    }
    
    // refreshToken must not be exposed in the response body; it travels only via httpOnly cookie.
    const { refreshToken, ...responseData } = result;
    
    sendSuccess(res, responseData, undefined, 201);
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.socket.remoteAddress;
    
    const result = await authService.login(req.body, userAgent, ipAddress);
    
    if (result.refreshToken) {
      setRefreshCookie(res, result.refreshToken);
    }
    
    // refreshToken must not be exposed in the response body; it travels only via httpOnly cookie.
    const { refreshToken, ...responseData } = result;
    
    sendSuccess(res, responseData);
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    if (req.body?.refreshToken !== undefined) {
      throw new AppError(
        'refreshToken must not be sent in the request body. ' +
        'It is transmitted exclusively via the httpOnly cookie set by /auth/login.',
        400,
        ERROR_CODES.BODY_NOT_ALLOWED
      );
    }

    const refreshToken = req.cookies?.refreshToken;
    
    if (!refreshToken) {
      throw new AppError('Refresh token is required', 401, ERROR_CODES.REFRESH_TOKEN_MISSING);
    }

    if (env.NODE_ENV !== 'production') {
      console.debug(
        `[auth:token-trace] refresh-controller:cookie-read` +
        ` | cookie_present=true` +
        ` | token_prefix=${refreshToken.slice(0, 12)}`
      );
    }
    
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.socket.remoteAddress;
    
    // Clear cookie on terminal errors (TOKEN_REUSE_DETECTED, INVALID_REFRESH_TOKEN, REFRESH_TOKEN_EXPIRED) to block stale-token replay.
    const CLEAR_COOKIE_CODES = new Set<string>([
      ERROR_CODES.TOKEN_REUSE_DETECTED,
      ERROR_CODES.INVALID_REFRESH_TOKEN,
      ERROR_CODES.REFRESH_TOKEN_EXPIRED,
    ]);

    let result;
    try {
      result = await authService.refresh(refreshToken, userAgent, ipAddress);
    } catch (err) {
      if (err instanceof AppError && CLEAR_COOKIE_CODES.has(err.code as string)) {
        clearRefreshCookie(res);
      }
      throw err;
    }

    if (result.refreshToken) {
      setRefreshCookie(res, result.refreshToken);
    }

    // refreshToken must not be exposed in the response body; it travels only via httpOnly cookie.
    const { refreshToken: _, ...responseData } = result;
    
    sendSuccess(res, responseData);
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    
    if (!refreshToken) {
      throw new AppError('Refresh token is required', 401, ERROR_CODES.REFRESH_TOKEN_MISSING);
    }
    
    const result = await authService.logout(refreshToken);
    
    clearRefreshCookie(res);
    
    sendSuccess(res, result);
  });

  me = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await authService.getMe(userId);
    sendSuccess(res, result);
  });
}

export default new AuthController();
