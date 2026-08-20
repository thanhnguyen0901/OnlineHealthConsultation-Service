import { NotificationStatus, NotificationType, OutboxStatus } from '@prisma/client';

import { NotificationService } from './notification.service';

const createService = () => {
  const prisma = {
    appointment: {
      findMany: jest.fn(),
    },
    doctorProfile: {
      findUnique: jest.fn(),
    },
    notificationLog: {
      findMany: jest.fn(),
      upsert: jest.fn(async (args: any) => ({
        id: args.create.id,
        status: args.create.status,
        externalRef: args.create.externalRef,
      })),
      update: jest.fn(async (args: any) => ({
        id: args.where.id,
        ...args.data,
      })),
    },
    outboxEvent: {
      findMany: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    patientProfile: {
      findUnique: jest.fn(),
    },
    question: {
      findUnique: jest.fn(),
    },
  };
  const developmentProvider: any = {
    name: 'DEV_NOTIFICATION',
    send: jest.fn(async () => ({ success: true, provider: 'DEV_NOTIFICATION' })),
  };
  const emailProvider: any = {
    name: 'EMAIL_PROVIDER',
    send: jest.fn(async () => ({ success: true, provider: 'EMAIL_PROVIDER' })),
  };
  const smsProvider: any = {
    name: 'SMS_PROVIDER',
    send: jest.fn(async () => ({ success: false, provider: 'SMS_PROVIDER' })),
  };

  return {
    service: new NotificationService(
      prisma as any,
      developmentProvider as any,
      emailProvider as any,
      smsProvider as any,
    ),
    prisma,
    developmentProvider,
    emailProvider,
    smsProvider,
  };
};

describe('NotificationService provider delivery', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      NODE_ENV: 'development',
      NOTIFICATION_PROVIDER: 'development',
    };
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('stores a development reset link notification when real email is not configured', async () => {
    const { service, prisma, developmentProvider } = createService();

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
        status: NotificationStatus.PENDING,
        provider: 'DEV_NOTIFICATION',
        content: expect.stringContaining('token=plain-token'),
      }),
      update: {},
    });
    expect(developmentProvider.send).toHaveBeenCalledWith(
      expect.objectContaining({
        type: NotificationType.EMAIL,
        externalRef: 'PASSWORD_RESET:token-1',
        content: expect.stringContaining('token=plain-token'),
      }),
    );
    expect(prisma.notificationLog.update).toHaveBeenCalledWith({
      where: { id: expect.any(String) },
      data: expect.objectContaining({
        status: NotificationStatus.SENT,
        provider: 'DEV_NOTIFICATION',
      }),
    });
  });

  it('does not store plain reset tokens in production without a working email provider', async () => {
    process.env.NODE_ENV = 'production';
    process.env.NOTIFICATION_PROVIDER = 'email';
    const { service, prisma, emailProvider } = createService();
    emailProvider.send.mockResolvedValueOnce({
      success: false,
      provider: 'EMAIL_PROVIDER',
      errorCode: 'EMAIL_PROVIDER_NOT_CONFIGURED',
      errorMsg: 'Configure provider secrets.',
    });

    await service.createPasswordResetNotification({
      userId: 'user-1',
      email: 'patient@example.com',
      resetUrl: 'https://app.example.com/reset-password?token=plain-token',
      tokenId: 'token-1',
      expiresAt: new Date('2026-09-01T00:00:00.000Z'),
    });

    const createPayload = prisma.notificationLog.upsert.mock.calls[0][0].create;
    expect(createPayload.content).not.toContain('plain-token');
    expect(createPayload.content).not.toContain('token=');
    expect(emailProvider.send).toHaveBeenCalled();
    expect(prisma.notificationLog.update).toHaveBeenCalledWith({
      where: { id: expect.any(String) },
      data: expect.objectContaining({
        status: NotificationStatus.FAILED,
        provider: 'EMAIL_PROVIDER',
        errorCode: 'EMAIL_PROVIDER_NOT_CONFIGURED',
      }),
    });
  });

  it('processes appointment-created outbox events into patient and doctor notifications', async () => {
    const { service, prisma, developmentProvider } = createService();
    prisma.outboxEvent.findMany.mockResolvedValue([
      {
        id: 'outbox-1',
        aggregateType: 'APPOINTMENT',
        eventType: 'APPOINTMENT_CREATED',
        payload: {
          appointmentId: 'appointment-1',
          patientId: 'patient-profile-1',
          doctorId: 'doctor-profile-1',
        },
      },
    ]);
    prisma.outboxEvent.updateMany.mockResolvedValue({ count: 1 });
    prisma.patientProfile.findUnique.mockResolvedValue({ userId: 'patient-user-1' });
    prisma.doctorProfile.findUnique.mockResolvedValue({ userId: 'doctor-user-1' });

    await expect(service.processOutboxBatch()).resolves.toEqual({ scanned: 1, processed: 1 });

    expect(developmentProvider.send).toHaveBeenCalledTimes(2);
    expect(prisma.notificationLog.upsert).toHaveBeenCalledWith({
      where: { externalRef: 'outbox-1:PATIENT_CREATED' },
      create: expect.objectContaining({
        userId: 'patient-user-1',
        status: NotificationStatus.PENDING,
      }),
      update: {},
    });
    expect(prisma.notificationLog.upsert).toHaveBeenCalledWith({
      where: { externalRef: 'outbox-1:DOCTOR_CREATED' },
      create: expect.objectContaining({
        userId: 'doctor-user-1',
        status: NotificationStatus.PENDING,
      }),
      update: {},
    });
    expect(prisma.outboxEvent.update).toHaveBeenCalledWith({
      where: { id: 'outbox-1' },
      data: {
        status: OutboxStatus.SENT,
        nextRetryAt: null,
      },
    });
  });

  it('marks outbox failed and retryable when provider delivery fails', async () => {
    process.env.NOTIFICATION_PROVIDER = 'email';
    const { service, prisma, emailProvider } = createService();
    emailProvider.send.mockResolvedValueOnce({
      success: false,
      provider: 'EMAIL_PROVIDER',
      errorCode: 'EMAIL_FAILED',
      errorMsg: 'Email failed',
    });
    prisma.outboxEvent.findMany.mockResolvedValue([
      {
        id: 'outbox-1',
        aggregateType: 'APPOINTMENT',
        eventType: 'APPOINTMENT_CONFIRMED',
        payload: {
          appointmentId: 'appointment-1',
          patientId: 'patient-profile-1',
        },
      },
    ]);
    prisma.outboxEvent.updateMany.mockResolvedValue({ count: 1 });
    prisma.patientProfile.findUnique.mockResolvedValue({ userId: 'patient-user-1' });

    await expect(service.processOutboxBatch()).resolves.toEqual({ scanned: 1, processed: 0 });

    expect(prisma.notificationLog.update).toHaveBeenCalledWith({
      where: { id: expect.any(String) },
      data: expect.objectContaining({
        status: NotificationStatus.FAILED,
        errorCode: 'EMAIL_FAILED',
      }),
    });
    expect(prisma.outboxEvent.update).toHaveBeenCalledWith({
      where: { id: 'outbox-1' },
      data: {
        status: OutboxStatus.FAILED,
        retryCount: { increment: 1 },
        nextRetryAt: expect.any(Date),
      },
    });
  });

  it('sends appointment reminders through the provider and records notification status', async () => {
    const { service, prisma, developmentProvider } = createService();
    prisma.appointment.findMany.mockResolvedValue([
      {
        id: 'appointment-1',
        scheduledAt: new Date('2026-09-01T01:00:00.000Z'),
        patient: { userId: 'patient-user-1' },
        doctor: { userId: 'doctor-user-1' },
      },
    ]);

    await expect(service.sendAppointmentReminders(60)).resolves.toEqual({
      remindersSent: 2,
      appointmentsScanned: 1,
      withinMinutes: 60,
    });

    expect(developmentProvider.send).toHaveBeenCalledTimes(2);
    expect(prisma.notificationLog.upsert).toHaveBeenCalledWith({
      where: { externalRef: 'APPOINTMENT_REMINDER:appointment-1:PATIENT' },
      create: expect.objectContaining({
        userId: 'patient-user-1',
        status: NotificationStatus.PENDING,
      }),
      update: {},
    });
  });

  it('processes question-answered outbox events into patient notifications', async () => {
    const { service, prisma, developmentProvider } = createService();
    prisma.outboxEvent.findMany.mockResolvedValue([
      {
        id: 'outbox-question-1',
        aggregateType: 'QUESTION',
        eventType: 'QUESTION_ANSWERED',
        payload: { questionId: 'question-1' },
      },
    ]);
    prisma.outboxEvent.updateMany.mockResolvedValue({ count: 1 });
    prisma.question.findUnique.mockResolvedValue({
      title: 'Headache',
      patient: { userId: 'patient-user-1' },
    });

    await expect(service.processOutboxBatch()).resolves.toEqual({ scanned: 1, processed: 1 });

    expect(developmentProvider.send).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientUserId: 'patient-user-1',
        externalRef: 'outbox-question-1:PATIENT_QUESTION_ANSWERED',
        content: 'Your question "Headache" has been answered.',
      }),
    );
  });
});
