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

// ---------------------------------------------------------------------------
// Canonical refresh-token cookie helpers
// ---------------------------------------------------------------------------
//
// IMPORTANT — PATH MUST STAY '/api/auth'
//
// A previous code version accidentally set the refresh cookie with path
// '/api/auth/refresh' (e.g. via req.originalUrl).  Browsers retain cookies
// indefinitely, so any browser that visited the site during that period still
// carries a stale cookie at the more-specific path.  RFC 6265 path-matching
// rules mean that a request to /api/auth/refresh matches BOTH paths but the
// browser sends only the most-specific one, causing the backend to receive the
// stale token and fail the DB hash lookup with INVALID_REFRESH_TOKEN.
//
// The canonical path is '/api/auth'.  All set/clear helpers below are the
// ONLY place this string may appear in this file — centralised so a future
// typo cannot silently create a second divergent path again.

/** The one canonical path for the refresh-token cookie. */
const REFRESH_COOKIE_PATH = '/api/auth' as const;

/**
 * Legacy paths that a stale browser might still hold.
 * We actively evict them on every set/clear operation.
 */
const LEGACY_REFRESH_COOKIE_PATHS = ['/api/auth/refresh'] as const;

// DEV assertion — catches any accidental future drift at startup.
// Will throw immediately if someone changes REFRESH_COOKIE_PATH to something
// that matches a legacy path, which would cause the same double-cookie bug.
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

/** Shared base options (no maxAge — used for both set and clear). */
const refreshCookieBase = () => ({
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: env.COOKIE_SAMESITE,
  ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
});

/**
 * Set the refreshToken cookie at the canonical path.
 * Also evicts any stale cookies at legacy paths so the browser is left with
 * exactly one refreshToken cookie after any login / refresh rotation.
 */
function setRefreshCookie(res: Response, token: string): void {
  // Evict legacy paths first so the browser discards stale cookies
  // before the new canonical one arrives.
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

/**
 * Clear the refreshToken cookie at ALL known paths (canonical + legacy).
 * Must be called on logout and on terminal refresh errors so the browser
 * cannot re-send a dead token on any subsequent request.
 */
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
      setRefreshCookie(res, result.refreshToken);
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
    
    // Set refresh token in httpOnly cookie (also evicts legacy /api/auth/refresh cookie)
    if (result.refreshToken) {
      // DEV trace: log the token prefix the controller is about to write into
      // the httpOnly cookie.  Must match 'login:after-createSession(returned-token)'
      // trace in auth.service.ts.  If they differ, the cookie and DB hash diverge.
      if (env.NODE_ENV !== 'production') {
        const crypto = await import('crypto');
        const h = crypto.createHash('sha256').update(result.refreshToken).digest('hex');
        console.debug(
          `[auth:token-trace] login-controller:setting-cookie` +
          ` | token_prefix=${result.refreshToken.slice(0, 12)}` +
          ` | hash_prefix=${h.slice(0, 16)}`
        );
      }
      setRefreshCookie(res, result.refreshToken);
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

    // DEV trace: confirm the cookie is being read by the controller before
    // it is forwarded to the service.  Presence = cookie arrived at the server.
    if (env.NODE_ENV !== 'production') {
      console.debug(
        `[auth:token-trace] refresh-controller:cookie-read` +
        ` | cookie_present=true` +
        ` | token_prefix=${refreshToken.slice(0, 12)}`
      );
    }
    
    // Extract metadata
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.socket.remoteAddress;
    
    // Wrap the service call so we can clear the stale cookie before propagating
    // certain terminal errors.  This prevents the browser from re-sending a dead
    // token on every subsequent request after the session is permanently gone.
    //
    // Errors that warrant cookie removal:
    //   TOKEN_REUSE_DETECTED  — token was replayed; session already revoked.
    //   INVALID_REFRESH_TOKEN — session not found in DB (e.g. after DB reset) or
    //                           the JWT itself failed signature verification.
    //   REFRESH_TOKEN_EXPIRED — session exists but expiresAt < now; useless cookie.
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
        // Clears canonical path AND all legacy paths (e.g. /api/auth/refresh)
        // so the browser cannot re-send a dead token on future requests.
        clearRefreshCookie(res);
      }
      throw err;
    }

    // Set NEW refresh token cookie (rotation).
    // setRefreshCookie() also evicts the legacy /api/auth/refresh cookie so
    // the browser is left with exactly ONE refreshToken cookie after rotation.
    if (result.refreshToken) {
      setRefreshCookie(res, result.refreshToken);
    }
    
    // Remove refreshToken from response body (security: only in httpOnly cookie)
    // user + accessToken are included so clients do NOT need a second GET /auth/me
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
    
    // Clear refreshToken at canonical path AND all legacy paths so the browser
    // cannot re-send a dead token regardless of which cookie it currently holds.
    clearRefreshCookie(res);
    
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
