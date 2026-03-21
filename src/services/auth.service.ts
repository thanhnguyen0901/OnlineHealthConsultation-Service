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

  private computeExpiresAt(): Date {
    return new Date(Date.now() + this.parseTtlMs(env.JWT_REFRESH_EXPIRE));
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // Development-only diagnostic logger; no-op in production.
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

  // Policy: at most one active session per device; revocation failure is non-fatal and does not block login.
  private async revokeActiveSessionsForDevice(
    userId: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<void> {
    const now = new Date();

    // Without device fields, all active sessions for the user are revoked.
    const deviceFilter: Record<string, unknown> = {};
    if (userAgent) {
      deviceFilter.userAgent = userAgent;
      if (ipAddress) {
        deviceFilter.ipAddress = ipAddress;
      }
    }

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

  async register(input: RegisterInput, userAgent?: string, ipAddress?: string) {
    const { email, password, firstName, lastName, role, ...profileData } = input;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409, 'USER_EXISTS');
    }

    const passwordHash = await hashPassword(password);

    if (role === 'DOCTOR') {
      if (!profileData.specialty) {
        throw new AppError('specialty is required for DOCTOR registration', 400, 'SPECIALTY_REQUIRED');
      }
      const specialty = await prisma.specialty.findUnique({
        where: { id: profileData.specialty },
        select: { id: true, isActive: true },
      });
      if (!specialty || !specialty.isActive) {
        throw new AppError('Specialty not found or inactive', 404, ERROR_CODES.SPECIALTY_NOT_FOUND);
      }
    }

    const user = await prisma.user.create({
      data: {
        id: newId(),
        email,
        passwordHash,
        firstName,
        lastName,
        role,
        ...(role === 'DOCTOR' && { isActive: false }),
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
              isActive: false,
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

    // Enforce single-active-session-per-device before creating a new session.
    await this.revokeActiveSessionsForDevice(user.id, userAgent, ipAddress);

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

  async login(input: LoginInput, userAgent?: string, ipAddress?: string) {
    const { email, password } = input;

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

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 403, ERROR_CODES.ACCOUNT_DEACTIVATED);
    }

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

    this.debugTokenTrace('login:before-createSession', refreshToken, { userId: user.id });

    // Enforce single-active-session-per-device before creating a new session.
    await this.revokeActiveSessionsForDevice(user.id, userAgent, ipAddress);

    const { id: sessionId, expiresAt: sessionExpiresAt } =
      await this.createSession(user.id, refreshToken, userAgent, ipAddress);

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

    // Fire-and-forget per-user session cleanup.
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

  async refresh(refreshToken: string, userAgent?: string, ipAddress?: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new AppError('Invalid refresh token', 401, ERROR_CODES.INVALID_REFRESH_TOKEN);
    }

    const refreshTokenHash = this.hashToken(refreshToken);

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
          ` | hash_prefix=${refreshTokenHash.slice(0, 16)}`
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

    if (session.expiresAt < new Date()) {
      throw new AppError('Refresh token expired', 401, ERROR_CODES.REFRESH_TOKEN_EXPIRED);
    }

    // Token reuse: revoked but not yet expired.
    if (session.revokedAt) {
      // Grace window: concurrent rotation may resend the old cookie; TOKEN_ROTATED tells the client to retry with the new cookie.
      // null rotatedAt indicates a non-rotation revocation and falls through to the replay-attack branch.
      const rotationAgeMs = session.rotatedAt
        ? Date.now() - session.rotatedAt.getTime()
        : Infinity;

      if (rotationAgeMs <= env.REFRESH_GRACE_WINDOW_MS) {
        throw new AppError(
          'Refresh token was recently rotated; please retry with the new session cookie',
          409,
          ERROR_CODES.TOKEN_ROTATED
        );
      }

      // Stale reuse outside grace window: treat as replay attack; revoke this session only.
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
    // JWT_REFRESH_EXPIRE drives DB TTL to keep them in sync.
    const newExpiresAt = this.computeExpiresAt();

    // Fetch user before the transaction to avoid a second GET /auth/me round-trip from the client.
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
      // Record rotatedAt to distinguish rotation races from replay attacks in the grace-window check.
      prisma.userSession.update({
        where: { id: session.id },
        data: { revokedAt: now, rotatedAt: now },
      }),
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

    // Fire-and-forget per-user session cleanup.
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
