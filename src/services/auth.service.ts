import prisma from '../config/db';
import { hashPassword, comparePassword } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../middlewares/error.middleware';

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
   * Register a new user
   */
  async register(input: RegisterInput) {
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

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
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
  async login(input: LoginInput) {
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

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
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
   * Refresh access token
   */
  async refresh(refreshToken: string) {
    // Verify refresh token
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    // Check if refresh token exists in database and is not revoked
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        revoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!storedToken) {
      throw new AppError('Refresh token not found or expired', 401, 'INVALID_REFRESH_TOKEN');
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

    // Revoke old refresh token and store new one
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revoked: true },
      }),
      prisma.refreshToken.create({
        data: {
          userId: payload.id,
          token: newRefreshToken,
          expiresAt,
        },
      }),
    ]);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout user (revoke refresh token)
   */
  async logout(refreshToken: string) {
    await prisma.refreshToken.updateMany({
      where: {
        token: refreshToken,
        revoked: false,
      },
      data: {
        revoked: true,
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
