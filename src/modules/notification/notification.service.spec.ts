import { NotificationStatus, NotificationType } from '@prisma/client';

import { NotificationService } from './notification.service';

const createService = () => {
  const prisma = {
    notificationLog: {
      upsert: jest.fn(),
    },
  };

  return {
    service: new NotificationService(prisma as any),
    prisma,
  };
};

describe('NotificationService password reset delivery', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, NODE_ENV: 'development' };
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('stores a development reset link notification when real email is not configured', async () => {
    const { service, prisma } = createService();

    await service.createPasswordResetNotification({
      userId: 'user-1',
      email: 'patient@example.com',
      resetUrl: 'http://localhost:5173/reset-password?token=plain-token',
      tokenId: 'token-1',
      expiresAt: new Date('2026-09-01T00:00:00.000Z'),
    });

    expect(prisma.notificationLog.upsert).toHaveBeenCalledWith({
      where: { externalRef: 'PASSWORD_RESET:token-1' },
      create: expect.objectContaining({
        userId: 'user-1',
        type: NotificationType.EMAIL,
        externalRef: 'PASSWORD_RESET:token-1',
        status: NotificationStatus.SENT,
        provider: 'DEV_NOTIFICATION',
        content: expect.stringContaining('token=plain-token'),
      }),
      update: {},
    });
  });

  it('does not store plain reset tokens in production without an email provider', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.PASSWORD_RESET_NOTIFICATION_PROVIDER;
    const { service, prisma } = createService();

    await service.createPasswordResetNotification({
      userId: 'user-1',
      email: 'patient@example.com',
      resetUrl: 'https://app.example.com/reset-password?token=plain-token',
      tokenId: 'token-1',
      expiresAt: new Date('2026-09-01T00:00:00.000Z'),
    });

    expect(prisma.notificationLog.upsert).toHaveBeenCalledWith({
      where: { externalRef: 'PASSWORD_RESET:token-1' },
      create: expect.objectContaining({
        status: NotificationStatus.FAILED,
        provider: 'EMAIL_PROVIDER_NOT_CONFIGURED',
        errorCode: 'EMAIL_PROVIDER_NOT_CONFIGURED',
      }),
      update: {},
    });
    const createPayload = prisma.notificationLog.upsert.mock.calls[0][0].create;
    expect(createPayload.content).not.toContain('plain-token');
    expect(createPayload.content).not.toContain('token=');
  });
});
