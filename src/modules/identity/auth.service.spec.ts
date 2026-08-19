import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { createHash } from 'crypto';

import { AuthService } from './auth.service';

const refreshSecret = 'test-refresh-secret-123';
const accessSecret = 'test-access-secret-123';

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

const createService = () => {
  const usersService = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
  };
  const prisma = {
    userSession: {
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
  };
  const jwtService = new JwtService({
    secret: accessSecret,
    signOptions: { expiresIn: '15m' },
  });

  return {
    service: new AuthService(usersService as any, jwtService, prisma as any),
    usersService,
    prisma,
    jwtService,
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
});
