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
   * Create user session with hashed refresh token
   */
  private async createSession(
    userId: string,
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string
  ) {
    const refreshTokenHash = this.hashToken(refreshToken);
    // Derive expiry from JWT_REFRESH_EXPIRE so JWT TTL and DB TTL stay aligned
    const expiresAt = this.computeExpiresAt();

    await prisma.userSession.create({
      data: {
        id: newId(),
        userId,
        refreshTokenHash,
        expiresAt,
        userAgent,
        ipAddress,
      },
    });
  }

  /**
   * Revoke all user sessions (security measure on token reuse detection)
   */
  private async revokeAllUserSessions(userId: string) {
    await prisma.userSession.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
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

    // Store refresh token hash
    await this.createSession(user.id, refreshToken, userAgent, ipAddress);

    // (Strategy B) Fire-and-forget: clean up dead sessions for this user
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
      throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    // Hash the token and lookup in database
    const refreshTokenHash = this.hashToken(refreshToken);
    const session = await prisma.userSession.findUnique({
      where: { refreshTokenHash },
    });

    if (!session) {
      throw new AppError('Refresh token not found', 401, 'INVALID_REFRESH_TOKEN');
    }

    // Check if token is expired
    if (session.expiresAt < new Date()) {
      throw new AppError('Refresh token expired', 401, 'REFRESH_TOKEN_EXPIRED');
    }

    // Security: Check for token reuse (already revoked but not expired)
    if (session.revokedAt) {
      // Token reuse detected! Revoke all user sessions
      await this.revokeAllUserSessions(session.userId);
      throw new AppError(
        'Token reuse detected - all sessions revoked for security',
        401,
        'TOKEN_REUSE_DETECTED'
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

    await prisma.$transaction([
      // Revoke old session
      prisma.userSession.update({
        where: { id: session.id },
        data: { revokedAt: now },
      }),
      // Create new session — set lastUsedAt to now to track the rotation event
      prisma.userSession.create({
        data: {
          id: newId(),
          userId: session.userId,
          refreshTokenHash: newRefreshTokenHash,
          expiresAt: newExpiresAt,
          lastUsedAt: now,
          userAgent,
          ipAddress,
        },
      }),
    ]);

    // (Strategy B) Fire-and-forget: clean up dead sessions for this user
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
