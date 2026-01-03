import prisma from '../config/db';
import { hashPassword, comparePassword } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../middlewares/error.middleware';
import crypto from 'crypto';

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
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
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.userSession.create({
      data: {
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
    const { email, password, fullName, role, ...profileData } = input;

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
        email,
        passwordHash,
        fullName,
        role,
        ...(role === 'PATIENT' && {
          patientProfile: {
            create: {
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

    // Generate tokens
    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      id: user.id,
      email: user.email,
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
        fullName: user.fullName,
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
      throw new AppError('Account is deactivated', 403, 'ACCOUNT_DEACTIVATED');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Generate tokens
    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token hash
    await this.createSession(user.id, refreshToken, userAgent, ipAddress);

    return {
      accessToken,
      refreshToken, // Will be set as HttpOnly cookie by controller
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
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

    // Generate new tokens
    const newAccessToken = signAccessToken({
      id: payload.id,
      email: payload.email,
      role: payload.role,
    });

    const newRefreshToken = signRefreshToken({
      id: payload.id,
      email: payload.email,
      role: payload.role,
    });

    // Rotate refresh token: revoke old, create new
    const newRefreshTokenHash = this.hashToken(newRefreshToken);
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7);

    await prisma.$transaction([
      // Revoke old session
      prisma.userSession.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      }),
      // Create new session
      prisma.userSession.create({
        data: {
          userId: session.userId,
          refreshTokenHash: newRefreshTokenHash,
          expiresAt: newExpiresAt,
          userAgent,
          ipAddress,
        },
      }),
    ]);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken, // Will be set as HttpOnly cookie by controller
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
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
      patientProfile: user.patientProfile,
      doctorProfile: user.doctorProfile,
    };
  }
}

export default new AuthService();
