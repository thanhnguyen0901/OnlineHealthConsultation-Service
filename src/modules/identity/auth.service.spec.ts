import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { createHash } from 'crypto';
import * as bcrypt from 'bcryptjs';

import { AuthService } from './auth.service';

const refreshSecret = 'test-refresh-secret-123';
const accessSecret = 'test-access-secret-123';

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

const createService = () => {
  const usersService = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
  };
  const tx: any = {
    passwordResetToken: {
      update: jest.fn(),
    },
    user: {
      update: jest.fn(),
    },
    userSession: {
      updateMany: jest.fn(),
    },
  };
  const prisma = {
    passwordResetToken: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: tx.passwordResetToken.update,
    },
    user: {
      update: tx.user.update,
    },
    userSession: {
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      updateMany: tx.userSession.updateMany,
    },
    auditLog: {
      create: jest.fn(),
    },
    $transaction: jest.fn(async (callback: (transaction: typeof tx) => unknown) => callback(tx)),
  };
  const notificationService = {
    createPasswordResetNotification: jest.fn(),
  };
  const jwtService = new JwtService({
    secret: accessSecret,
    signOptions: { expiresIn: '15m' },
  });

  return {
    service: new AuthService(
      usersService as any,
      jwtService,
      prisma as any,
      notificationService as any,
    ),
    usersService,
    prisma,
    jwtService,
    notificationService,
  };
};

const user = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'patient@example.com',
  firstName: 'Pat',
  lastName: 'Lee',
  role: Role.PATIENT,
  isActive: true,
  deletedAt: null,
};

const signRefreshToken = (jwtService: JwtService, sessionId = '22222222-2222-2222-2222-222222222222') =>
  jwtService.signAsync(
    {
      sub: user.id,
      sid: sessionId,
      type: 'refresh',
    },
    {
      secret: refreshSecret,
      expiresIn: '7d',
    },
  );

describe('AuthService refresh-cookie session rotation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      JWT_SECRET: accessSecret,
      JWT_REFRESH_SECRET: refreshSecret,
      JWT_ACCESS_EXPIRE: '15m',
      JWT_REFRESH_EXPIRE: '7d',
      PASSWORD_RESET_TOKEN_TTL_MINUTES: '15',
      PASSWORD_RESET_FRONTEND_URL: 'http://localhost:5173/reset-password',
    };
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('refreshes with a valid refresh token and returns a new access token', async () => {
    const { service, usersService, prisma, jwtService } = createService();
    const refreshToken = await signRefreshToken(jwtService);
    usersService.findById.mockResolvedValue(user);
    prisma.userSession.findFirst.mockResolvedValue({
      id: '22222222-2222-2222-2222-222222222222',
      userId: user.id,
    });

    const result = await service.refresh(refreshToken, 'jest-agent', '127.0.0.1');

    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.refreshToken).toEqual(expect.any(String));
    expect(result.refreshToken).not.toBe(refreshToken);
    expect(result.user).toMatchObject({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  });

  it('rejects an invalid refresh token before checking sessions', async () => {
    const { service, prisma } = createService();

    await expect(service.refresh('not-a-jwt')).rejects.toBeInstanceOf(UnauthorizedException);
    expect(prisma.userSession.findFirst).not.toHaveBeenCalled();
  });

  it('rejects a revoked or expired refresh session', async () => {
    const { service, prisma, jwtService } = createService();
    const refreshToken = await signRefreshToken(jwtService);
    prisma.userSession.findFirst.mockResolvedValue(null);

    await expect(service.refresh(refreshToken)).rejects.toThrow(
      'Refresh token has been revoked or expired',
    );
  });

  it('rotates refresh sessions by revoking the old session and creating a new one', async () => {
    const { service, usersService, prisma, jwtService } = createService();
    const oldSessionId = '22222222-2222-2222-2222-222222222222';
    const refreshToken = await signRefreshToken(jwtService, oldSessionId);
    usersService.findById.mockResolvedValue(user);
    prisma.userSession.findFirst.mockResolvedValue({
      id: oldSessionId,
      userId: user.id,
    });

    const result = await service.refresh(refreshToken);

    expect(prisma.userSession.findFirst).toHaveBeenCalledWith({
      where: {
        id: oldSessionId,
        userId: user.id,
        refreshTokenHash: hashToken(refreshToken),
        revokedAt: null,
        expiresAt: { gt: expect.any(Date) },
      },
    });
    expect(prisma.userSession.update).toHaveBeenCalledWith({
      where: { id: oldSessionId },
      data: { revokedAt: expect.any(Date), rotatedAt: expect.any(Date) },
    });
    expect(prisma.userSession.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: user.id,
        refreshTokenHash: hashToken(result.refreshToken),
        expiresAt: expect.any(Date),
      }),
    });
  });

  it('revokes active user sessions on logout', async () => {
    const { service, prisma } = createService();

    await expect(service.logout(user.id)).resolves.toEqual({ message: 'Logout successful' });

    expect(prisma.userSession.updateMany).toHaveBeenCalledWith({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    });
    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        actorUserId: user.id,
        action: 'LOGOUT',
        resource: 'AUTH',
        resourceId: user.id,
      }),
    });
  });

  it('returns the same forgot-password response when the email does not exist', async () => {
    const { service, usersService, prisma, notificationService } = createService();
    usersService.findByEmail.mockResolvedValue(null);

    await expect(service.forgotPassword({ email: 'missing@example.com' })).resolves.toEqual({
      message: 'If the email exists, reset instructions have been generated',
    });

    expect(prisma.passwordResetToken.create).not.toHaveBeenCalled();
    expect(notificationService.createPasswordResetNotification).not.toHaveBeenCalled();
  });

  it('creates a hashed one-time reset token and password reset notification for active users', async () => {
    const { service, usersService, prisma, notificationService } = createService();
    usersService.findByEmail.mockResolvedValue(user);

    await expect(service.forgotPassword({ email: user.email })).resolves.toEqual({
      message: 'If the email exists, reset instructions have been generated',
    });

    expect(prisma.passwordResetToken.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        id: expect.any(String),
        userId: user.id,
        tokenHash: expect.stringMatching(/^[a-f0-9]{64}$/),
        expiresAt: expect.any(Date),
      }),
    });
    const created = prisma.passwordResetToken.create.mock.calls[0][0].data;
    expect(created.tokenHash).not.toContain('.');
    expect(notificationService.createPasswordResetNotification).toHaveBeenCalledWith({
      userId: user.id,
      email: user.email,
      resetUrl: expect.stringMatching(/^http:\/\/localhost:5173\/reset-password\?token=/),
      tokenId: created.id,
      expiresAt: created.expiresAt,
    });
    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        action: 'PASSWORD_RESET_REQUESTED',
        metadata: expect.objectContaining({ email: 'p***t@example.com' }),
      }),
    });
  });

  it('rejects invalid, expired, or already-used reset tokens', async () => {
    const { service, prisma } = createService();
    prisma.passwordResetToken.findFirst.mockResolvedValue(null);

    await expect(
      service.resetPassword({ token: 'bad-token', newPassword: 'NewPassword123!' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('consumes a valid reset token, updates password, and revokes sessions', async () => {
    const { service, prisma } = createService();
    prisma.passwordResetToken.findFirst.mockResolvedValue({
      id: 'reset-token-1',
      userId: user.id,
    });

    await expect(
      service.resetPassword({ token: 'plain-reset-token', newPassword: 'NewPassword123!' }),
    ).resolves.toEqual({ message: 'Password reset successful' });

    expect(prisma.passwordResetToken.findFirst).toHaveBeenCalledWith({
      where: {
        tokenHash: hashToken('plain-reset-token'),
        usedAt: null,
        expiresAt: { gt: expect.any(Date) },
      },
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: { passwordHash: expect.any(String) },
    });
    const passwordHash = prisma.user.update.mock.calls[0][0].data.passwordHash;
    await expect(bcrypt.compare('NewPassword123!', passwordHash)).resolves.toBe(true);
    expect(prisma.passwordResetToken.update).toHaveBeenCalledWith({
      where: { id: 'reset-token-1' },
      data: { usedAt: expect.any(Date) },
    });
    expect(prisma.userSession.updateMany).toHaveBeenCalledWith({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    });
  });
});
