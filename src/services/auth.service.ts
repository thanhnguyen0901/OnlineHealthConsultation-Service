import prisma from '../config/db';
import { hashPassword, comparePassword } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../middlewares/error.middleware';
import { newId } from '../utils/id';
import crypto from 'crypto';
import { cleanupUserSessions } from '../utils/sessionCleanup';
import { ERROR_CODES } from '../constants/errorCodes';
import env from '../config/env';

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'PATIENT' | 'DOCTOR';
  // Optional profile data
  specialty?: string;
  bio?: string;
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  address?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Parse a TTL string (e.g. "7d", "24h", "30m", "60s") to milliseconds.
   * Falls back to 7 days for unrecognised formats.
   */
  private parseTtlMs(ttl: string): number {
    const match = /^(\d+)([smhd])$/.exec(ttl);
    if (!match) return 7 * 24 * 60 * 60 * 1000;
    const value = parseInt(match[1], 10);
    switch (match[2]) {
      case 's': return value * 1_000;
      case 'm': return value * 60 * 1_000;
      case 'h': return value * 60 * 60 * 1_000;
      case 'd': return value * 24 * 60 * 60 * 1_000;
      default:  return 7 * 24 * 60 * 60 * 1_000;
    }
  }

  /**
   * Compute session expiry date driven by JWT_REFRESH_EXPIRE env variable.
   * This keeps the DB session TTL in sync with the JWT TTL.
   */
  private computeExpiresAt(): Date {
    return new Date(Date.now() + this.parseTtlMs(env.JWT_REFRESH_EXPIRE));
  }

  /**
   * Hash refresh token using SHA-256
   */
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * DEV-ONLY: emit a short, non-sensitive log line for the auth token
   * trace.  Never enabled in production.
   */
  private debugTokenTrace(
    label: string,
    token: string,
    extra?: Record<string, unknown>
  ): void {
    if (env.NODE_ENV === 'production') return;
    const hash = this.hashToken(token);
    console.debug(
      `[auth:token-trace] ${label}` +
      ` | token_prefix=${token.slice(0, 12)}` +
      ` | hash_prefix=${hash.slice(0, 16)}` +
      (extra ? ` | ${JSON.stringify(extra)}` : '')
    );
  }

  /**
   * Revoke all active sessions that match the given device signature
   * (userId + userAgent + ipAddress) before issuing a new one.
   *
   * Policy: at most ONE active session per user per device.
   *
   * Matching strategy (in priority order):
   *   1. userId + userAgent + ipAddress  — full device match
   *   2. userId + userAgent only         — IP changed (mobile / VPN)
   *   3. userId only                     — fallback when userAgent is absent
   *
   * "Active" is defined as: revokedAt IS NULL AND expiresAt > now()
   *
   * This is intentionally a best-effort revocation; if the UPDATE fails we
   * log the error and continue so that login itself is not blocked.
   */
  private async revokeActiveSessionsForDevice(
    userId: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<void> {
    const now = new Date();

    // Build the device-match filter.  We always scope by userId; additional
    // fields narrow the match when they are present.
    const deviceFilter: Record<string, unknown> = {};
    if (userAgent) {
      deviceFilter.userAgent = userAgent;
      if (ipAddress) {
        deviceFilter.ipAddress = ipAddress; // full match
      }
      // If ipAddress is absent we still match by userAgent alone — covers
      // the case where the client IP changed (DHCP renewal, mobile network).
    }
    // If neither userAgent nor ipAddress is available we fall back to revoking
    // ALL active sessions for this user.  This is the most conservative option
    // and is clearly logged so developers are aware.

    const fallback = !userAgent && !ipAddress;
    if (env.NODE_ENV !== 'production') {
      if (fallback) {
        console.debug(
          `[auth:session] revokeActiveSessionsForDevice:fallback` +
          ` | userId=${userId}` +
          ` — no device fields available, revoking ALL active sessions`
        );
      } else {
        console.debug(
          `[auth:session] revokeActiveSessionsForDevice:device-match` +
          ` | userId=${userId}` +
          ` | userAgent=${userAgent ?? 'none'}` +
          ` | ipAddress=${ipAddress ?? 'absent (userAgent-only match)'}`
        );
      }
    }

    try {
      const result = await prisma.userSession.updateMany({
        where: {
          userId,
          revokedAt: null,
          expiresAt: { gt: now },
          ...deviceFilter, // empty object = no extra filter = all active sessions
        },
        data: { revokedAt: now },
      });

      if (env.NODE_ENV !== 'production') {
        console.debug(
          `[auth:session] revokeActiveSessionsForDevice:done` +
          ` | userId=${userId}` +
          ` | revokedCount=${result.count}`
        );
      }
    } catch (err) {
      // Non-fatal: log and continue so login is not blocked by a cleanup failure.
      console.error('[auth:session] revokeActiveSessionsForDevice failed', err);
    }
  }

  /**
   * Create user session with hashed refresh token.
   * Returns { id, expiresAt } of the created row so callers can log
   * the sessionId without a second DB round-trip.
   */
  private async createSession(
    userId: string,
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<{ id: string; expiresAt: Date }> {
    const refreshTokenHash = this.hashToken(refreshToken);
    // Derive expiry from JWT_REFRESH_EXPIRE so JWT TTL and DB TTL stay aligned
    const expiresAt = this.computeExpiresAt();
    const sessionId = newId();

    // DEV trace: log the hash prefix being written so it can be compared with
    // the cookie-side trace logged in login() / refresh() to detect any mismatch.
    if (env.NODE_ENV !== 'production') {
      console.debug(
        `[auth:token-trace] createSession` +
        ` | userId=${userId}` +
        ` | token_prefix=${refreshToken.slice(0, 12)}` +
        ` | hash_prefix=${refreshTokenHash.slice(0, 16)}`
      );
    }

    await prisma.userSession.create({
      data: {
        id: sessionId,
        userId,
        refreshTokenHash,
        expiresAt,
        userAgent,
        ipAddress,
      },
    });

    if (env.NODE_ENV !== 'production') {
      console.debug(
        `[auth:session] session-created` +
        ` | sessionId=${sessionId}` +
        ` | userId=${userId}` +
        ` | expiresAt=${expiresAt.toISOString()}`
      );
    }

    return { id: sessionId, expiresAt };
  }

  /**
   * Register a new user
   */
  async register(input: RegisterInput, userAgent?: string, ipAddress?: string) {
    const { email, password, firstName, lastName, role, ...profileData } = input;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409, 'USER_EXISTS');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        id: newId(),
        email,
        passwordHash,
        firstName,
        lastName,
        role,
        ...(role === 'PATIENT' && {
          patientProfile: {
            create: {
              id: newId(),
              dateOfBirth: profileData.dateOfBirth,
              gender: profileData.gender,
              phone: profileData.phone,
              address: profileData.address,
            },
          },
        }),
        ...(role === 'DOCTOR' && {
          doctorProfile: {
            create: {
              id: newId(),
              specialtyId: profileData.specialty || '',
              bio: profileData.bio,
            },
          },
        }),
      },
      include: {
        patientProfile: true,
        doctorProfile: {
          include: {
            specialty: true,
          },
        },
      },
    });

    // Generate tokens — payload contains only id and role, never PII like email
    const accessToken = signAccessToken({
      id: user.id,
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      id: user.id,
      role: user.role,
    });

    // Revoke any existing active session for this device before creating a new
    // one — enforces the single-active-session-per-device policy on register.
    await this.revokeActiveSessionsForDevice(user.id, userAgent, ipAddress);

    // Store refresh token hash in database
    await this.createSession(user.id, refreshToken, userAgent, ipAddress);

    return {
      accessToken,
      refreshToken, // Will be set as HttpOnly cookie by controller
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        patientProfile: user.patientProfile,
        doctorProfile: user.doctorProfile,
      },
    };
  }

  /**
   * Login user
   */
  async login(input: LoginInput, userAgent?: string, ipAddress?: string) {
    const { email, password } = input;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        patientProfile: true,
        doctorProfile: {
          include: {
            specialty: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is deactivated', 403, ERROR_CODES.ACCOUNT_DEACTIVATED);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Generate tokens — payload contains only id and role, never PII like email
    const accessToken = signAccessToken({
      id: user.id,
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      id: user.id,
      role: user.role,
    });

    // DEV trace: log token/hash prefix BEFORE writing to DB so we can confirm
    // the value stored in the session matches what the controller will put in the
    // cookie.  The trace in createSession() will echo the same hash_prefix.
    this.debugTokenTrace('login:before-createSession', refreshToken, { userId: user.id });

    // Revoke any existing active session for this device before creating a new
    // one — enforces the single-active-session-per-device policy.
    await this.revokeActiveSessionsForDevice(user.id, userAgent, ipAddress);

    // Store refresh token hash; capture sessionId so we can include it in logs.
    const { id: sessionId, expiresAt: sessionExpiresAt } =
      await this.createSession(user.id, refreshToken, userAgent, ipAddress);

    // DEV trace: log token prefix AFTER session is written — this is the exact
    // value that will be returned to the controller for cookie serialisation.
    this.debugTokenTrace('login:after-createSession(returned-token)', refreshToken, { userId: user.id });

    if (env.NODE_ENV !== 'production') {
      console.debug(
        `[auth:session] login:complete` +
        ` | userId=${user.id}` +
        ` | role=${user.role}` +
        ` | sessionId=${sessionId}` +
        ` | sessionExpiresAt=${sessionExpiresAt.toISOString()}`
      );
    }

    // (Strategy B) Fire-and-forget: clean up dead sessions for this user.
    // cleanupUserSessions returns a count; the dev log inside it prints when > 0.
    cleanupUserSessions(user.id).catch(() => { /* non-critical */ });

    return {
      accessToken,
      refreshToken, // Will be set as HttpOnly cookie by controller
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        patientProfile: user.patientProfile,
        doctorProfile: user.doctorProfile,
      },
    };
  }

  /**
   * Refresh access token with token rotation
   */
  async refresh(refreshToken: string, userAgent?: string, ipAddress?: string) {
    // Verify refresh token JWT
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new AppError('Invalid refresh token', 401, ERROR_CODES.INVALID_REFRESH_TOKEN);
    }

    // Hash the token and lookup in database
    const refreshTokenHash = this.hashToken(refreshToken);

    // DEV trace: log the cookie token and the hash we are about to query.
    // Compare token_prefix and hash_prefix here against the login trace:
    //   login:before-createSession  → should be IDENTICAL to what is shown here.
    // If they differ, the cookie was set with a different token than the one
    // stored in the DB — that is the root cause of INVALID_REFRESH_TOKEN.
    this.debugTokenTrace('refresh:cookie-received→hash-computed', refreshToken);
    if (env.NODE_ENV !== 'production') {
      console.debug(
        `[auth:token-trace] refresh:db-lookup` +
        ` | hash_prefix=${refreshTokenHash.slice(0, 16)}`
      );
    }

    const session = await prisma.userSession.findUnique({
      where: { refreshTokenHash },
    });

    if (!session) {
      if (env.NODE_ENV !== 'production') {
        console.debug(
          `[auth:token-trace] refresh:session-NOT-FOUND` +
          ` | hash_prefix=${refreshTokenHash.slice(0, 16)}` +
          ` — token mismatch: cookie token hash has no matching user_sessions row`
        );
      }
      throw new AppError('Refresh token not found', 401, ERROR_CODES.INVALID_REFRESH_TOKEN);
    }

    if (env.NODE_ENV !== 'production') {
      console.debug(
        `[auth:session] refresh:session-found` +
        ` | sessionId=${session.id}` +
        ` | userId=${session.userId}` +
        ` | revokedAt=${session.revokedAt?.toISOString() ?? 'null'}` +
        ` | rotatedAt=${session.rotatedAt?.toISOString() ?? 'null'}` +
        ` | expiresAt=${session.expiresAt.toISOString()}`
      );
    }

    // Check if token is expired
    if (session.expiresAt < new Date()) {
      throw new AppError('Refresh token expired', 401, ERROR_CODES.REFRESH_TOKEN_EXPIRED);
    }

    // Security: Check for token reuse (already revoked but not expired).
    if (session.revokedAt) {
      // Distinguish between a legitimate rotation race and a real replay attack
      // by inspecting the rotatedAt timestamp set during normal token rotation.
      //
      // Grace window rationale:
      //   Multi-tab reload or a network retry can deliver the old cookie to the
      //   server AFTER it was already rotated by a concurrent request.  In that
      //   narrow window the reuse is not an attack; revoking all sessions would
      //   force an unnecessary logout.
      //
      //   rotatedAt is only populated by the rotation path (not logout/admin
      //   wipe), so a null value already indicates a non-rotation revocation and
      //   falls through to the security branch.
      const rotationAgeMs = session.rotatedAt
        ? Date.now() - session.rotatedAt.getTime()
        : Infinity;

      if (rotationAgeMs <= env.REFRESH_GRACE_WINDOW_MS) {
        // Recent rotation race — do NOT revoke all sessions; let the client
        // retry with the new cookie that was already set by the winning request.
        throw new AppError(
          'Refresh token was recently rotated; please retry with the new session cookie',
          409,
          ERROR_CODES.TOKEN_ROTATED
        );
      }

      // Token is stale and reused outside the grace window — treat it as a
      // potential replay attack.  Revoke ONLY this specific session so the
      // legitimate owner's other devices/tabs remain unaffected.  The
      // controller will clear the httpOnly cookie for this session as part
      // of error handling, preventing the browser from re-sending the
      // dead token on future requests.
      await prisma.userSession.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      });
      throw new AppError(
        'Refresh token reuse detected — this session has been revoked',
        401,
        ERROR_CODES.TOKEN_REUSE_DETECTED
      );
    }

    // Generate new tokens — payload contains only id and role, never PII like email
    const newAccessToken = signAccessToken({
      id: payload.id,
      role: payload.role,
    });

    const newRefreshToken = signRefreshToken({
      id: payload.id,
      role: payload.role,
    });

    // Rotate refresh token: revoke old, create new
    const newRefreshTokenHash = this.hashToken(newRefreshToken);
    const now = new Date();
    // Derive expiry from JWT_REFRESH_EXPIRE so JWT TTL and DB TTL stay aligned
    const newExpiresAt = this.computeExpiresAt();

    // Fetch user data now — before the transaction — so we can return it
    // alongside the new tokens. This eliminates the need for a second
    // GET /auth/me call from the client, closing the double-refresh race window.
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        patientProfile: true,
        doctorProfile: {
          include: { specialty: true },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new AppError('User not found or deactivated', 403, ERROR_CODES.ACCOUNT_DEACTIVATED);
    }

    const newSessionId = newId();

    if (env.NODE_ENV !== 'production') {
      console.debug(
        `[auth:session] refresh:rotation-start` +
        ` | userId=${session.userId}` +
        ` | old_sessionId=${session.id}` +
        ` | old_hash_prefix=${refreshTokenHash.slice(0, 16)}` +
        ` | new_sessionId=${newSessionId}` +
        ` | new_hash_prefix=${newRefreshTokenHash.slice(0, 16)}` +
        ` | new_expiresAt=${newExpiresAt.toISOString()}`
      );
    }

    await prisma.$transaction([
      // Revoke old session and record the rotation timestamp so the grace-window
      // check can distinguish rotation races from genuine replay attacks.
      prisma.userSession.update({
        where: { id: session.id },
        data: { revokedAt: now, rotatedAt: now },
      }),
      // Create new session — set lastUsedAt to now to track the rotation event
      prisma.userSession.create({
        data: {
          id: newSessionId,
          userId: session.userId,
          refreshTokenHash: newRefreshTokenHash,
          expiresAt: newExpiresAt,
          lastUsedAt: now,
          userAgent,
          ipAddress,
        },
      }),
    ]);

    if (env.NODE_ENV !== 'production') {
      console.debug(
        `[auth:session] refresh:rotation-done` +
        ` | userId=${session.userId}` +
        ` | old_sessionId=${session.id} (revoked+rotated)` +
        ` | new_sessionId=${newSessionId} (active)`
      );
    }

    // (Strategy B) Fire-and-forget: clean up dead sessions for this user.
    // cleanupUserSessions returns a count; the dev log inside it prints when > 0.
    cleanupUserSessions(session.userId).catch(() => { /* non-critical */ });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken, // Will be set as HttpOnly cookie by controller
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        patientProfile: user.patientProfile,
        doctorProfile: user.doctorProfile,
      },
    };
  }

  /**
   * Logout user (revoke refresh token session)
   */
  async logout(refreshToken: string) {
    const refreshTokenHash = this.hashToken(refreshToken);

    await prisma.userSession.updateMany({
      where: {
        refreshTokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return { message: 'Logged out successfully' };
  }

  /**
   * Get current user profile
   */
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        patientProfile: true,
        doctorProfile: {
          include: {
            specialty: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      patientProfile: user.patientProfile,
      doctorProfile: user.doctorProfile,
    };
  }
}

export default new AuthService();
