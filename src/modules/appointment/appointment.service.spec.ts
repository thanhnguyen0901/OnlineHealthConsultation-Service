import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AppointmentStatus, ApprovalStatus } from '@prisma/client';

import { AppointmentService } from './appointment.service';

const futureIso = (localTime: string) => {
  const [hours, minutes] = localTime.split(':').map(Number);
  return new Date(Date.UTC(2026, 8, 1, hours - 7, minutes, 0, 0)).toISOString();
};

const createPrismaMock = () => {
  const tx: any = {
    doctorProfile: {
      findUnique: jest.fn(),
    },
    appointment: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    outboxEvent: {
      create: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
  };

  const prisma: any = {
    patientProfile: {
      findUnique: jest.fn(),
    },
    doctorProfile: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
    appointment: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(async (callback: (transaction: typeof tx) => unknown) => callback(tx)),
  };

  return { prisma, tx };
};

const activeDoctor = {
  id: 'doctor-1',
  isActive: true,
  approvalStatus: ApprovalStatus.APPROVED,
  schedule: [
    { date: '2026-09-01', startTime: '08:00', endTime: '12:00', available: true },
  ],
  user: {
    isActive: true,
    deletedAt: null,
  },
};

describe('AppointmentService availability', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.useRealTimers();
    process.env = {
      ...originalEnv,
      APP_TIMEZONE: 'Asia/Ho_Chi_Minh',
      APPOINTMENT_DURATION_MINUTES: '60',
      APPOINTMENT_SLOT_STEP_MINUTES: '30',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it('returns valid available slots from doctor schedule', async () => {
    const { prisma } = createPrismaMock();
    prisma.doctorProfile.findFirst.mockResolvedValue(activeDoctor);
    prisma.appointment.findMany.mockResolvedValue([]);
    const service = new AppointmentService(prisma);

    const result = await service.getDoctorAvailability('doctor-1', {
      date: '2026-09-01',
      durationMinutes: 60,
    });

    expect(result.slots).toHaveLength(7);
    expect(result.slots[0]).toMatchObject({
      start: futureIso('08:00'),
      end: futureIso('09:00'),
      label: '08:00',
      available: true,
    });
    expect(result.slots[result.slots.length - 1].label).toBe('11:00');
  });

  it('removes slots that overlap active doctor appointments and keeps boundary slots', async () => {
    const { prisma } = createPrismaMock();
    prisma.doctorProfile.findFirst.mockResolvedValue(activeDoctor);
    prisma.appointment.findMany.mockResolvedValue([
      {
        id: 'appointment-1',
        scheduledAt: new Date(futureIso('09:00')),
        durationMinutes: 60,
      },
    ]);
    const service = new AppointmentService(prisma);

    const result = await service.getDoctorAvailability('doctor-1', {
      date: '2026-09-01',
      durationMinutes: 60,
    });

    expect(result.slots.map((slot) => slot.label)).toEqual([
      '08:00',
      '10:00',
      '10:30',
      '11:00',
    ]);
  });

  it('rejects availability lookup for invalid or non-public doctor', async () => {
    const { prisma } = createPrismaMock();
    prisma.doctorProfile.findFirst.mockResolvedValue(null);
    const service = new AppointmentService(prisma);

    await expect(
      service.getDoctorAvailability('doctor-1', { date: '2026-09-01' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects appointment creation outside doctor working hours', async () => {
    const { prisma, tx } = createPrismaMock();
    prisma.patientProfile.findUnique.mockResolvedValue({ id: 'patient-1' });
    prisma.doctorProfile.findUnique.mockResolvedValue(activeDoctor);
    tx.doctorProfile.findUnique.mockResolvedValue(activeDoctor);
    const service = new AppointmentService(prisma);

    await expect(
      service.createAppointment('patient-user-1', {
        doctorId: 'doctor-1',
        scheduledAt: futureIso('13:00'),
        durationMinutes: 60,
        reason: 'Follow-up',
      }),
    ).rejects.toThrow('Doctor is not available at this time');
    expect(tx.appointment.create).not.toHaveBeenCalled();
  });

  it('rejects appointment creation when doctor has an overlapping appointment', async () => {
    const { prisma, tx } = createPrismaMock();
    prisma.patientProfile.findUnique.mockResolvedValue({ id: 'patient-1' });
    prisma.doctorProfile.findUnique.mockResolvedValue(activeDoctor);
    tx.doctorProfile.findUnique.mockResolvedValue(activeDoctor);
    tx.appointment.findMany.mockImplementation((args: any) => {
      if (args.where.doctorId) {
        return Promise.resolve([
          {
            id: 'appointment-1',
            scheduledAt: new Date(futureIso('09:00')),
            durationMinutes: 60,
          },
        ]);
      }
      return Promise.resolve([]);
    });
    const service = new AppointmentService(prisma);

    await expect(
      service.createAppointment('patient-user-1', {
        doctorId: 'doctor-1',
        scheduledAt: futureIso('09:30'),
        durationMinutes: 60,
        reason: 'Follow-up',
      }),
    ).rejects.toThrow('Doctor already has an appointment at this time');
  });

  it('rejects appointment creation when patient has an overlapping appointment', async () => {
    const { prisma, tx } = createPrismaMock();
    prisma.patientProfile.findUnique.mockResolvedValue({ id: 'patient-1' });
    prisma.doctorProfile.findUnique.mockResolvedValue(activeDoctor);
    tx.doctorProfile.findUnique.mockResolvedValue(activeDoctor);
    tx.appointment.findMany.mockImplementation((args: any) => {
      if (args.where.patientId) {
        return Promise.resolve([
          {
            id: 'appointment-1',
            scheduledAt: new Date(futureIso('08:30')),
            durationMinutes: 60,
          },
        ]);
      }
      return Promise.resolve([]);
    });
    const service = new AppointmentService(prisma);

    await expect(
      service.createAppointment('patient-user-1', {
        doctorId: 'doctor-1',
        scheduledAt: futureIso('08:00'),
        durationMinutes: 60,
        reason: 'Follow-up',
      }),
    ).rejects.toThrow('Patient already has an appointment at this time');
  });

  it('allows boundary appointment creation when existing appointment ends at requested start', async () => {
    const { prisma, tx } = createPrismaMock();
    prisma.patientProfile.findUnique.mockResolvedValue({ id: 'patient-1' });
    prisma.doctorProfile.findUnique.mockResolvedValue(activeDoctor);
    tx.doctorProfile.findUnique.mockResolvedValue(activeDoctor);
    tx.appointment.findMany.mockImplementation((args: any) => {
      if (args.where.doctorId) {
        return Promise.resolve([
          {
            id: 'appointment-1',
            scheduledAt: new Date(futureIso('08:00')),
            durationMinutes: 60,
          },
        ]);
      }
      return Promise.resolve([]);
    });
    tx.appointment.create.mockResolvedValue({ id: 'appointment-2' });
    const service = new AppointmentService(prisma);

    await expect(
      service.createAppointment('patient-user-1', {
        doctorId: 'doctor-1',
        scheduledAt: futureIso('09:00'),
        durationMinutes: 60,
        reason: 'Follow-up',
      }),
    ).resolves.toEqual({ id: 'appointment-2' });
  });

  it('rejects appointment creation for inactive or unapproved doctor', async () => {
    const { prisma } = createPrismaMock();
    prisma.patientProfile.findUnique.mockResolvedValue({ id: 'patient-1' });
    prisma.doctorProfile.findUnique.mockResolvedValue({
      ...activeDoctor,
      approvalStatus: ApprovalStatus.PENDING,
    });
    const service = new AppointmentService(prisma);

    await expect(
      service.createAppointment('patient-user-1', {
        doctorId: 'doctor-1',
        scheduledAt: futureIso('08:00'),
        durationMinutes: 60,
        reason: 'Follow-up',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('applies the same conflict rule during reschedule', async () => {
    const { prisma, tx } = createPrismaMock();
    prisma.doctorProfile.findUnique.mockResolvedValue(activeDoctor);
    prisma.appointment.findUnique.mockResolvedValue({
      id: 'appointment-1',
      doctorId: 'doctor-1',
      patientId: 'patient-1',
      scheduledAt: new Date(futureIso('08:00')),
      durationMinutes: 60,
      status: AppointmentStatus.CONFIRMED,
    });
    tx.doctorProfile.findUnique.mockResolvedValue(activeDoctor);
    tx.appointment.findMany.mockImplementation((args: any) => {
      if (args.where.doctorId) {
        return Promise.resolve([
          {
            id: 'appointment-2',
            scheduledAt: new Date(futureIso('09:00')),
            durationMinutes: 60,
          },
        ]);
      }
      return Promise.resolve([]);
    });
    const service = new AppointmentService(prisma);

    await expect(
      service.rescheduleAppointment('doctor-user-1', 'appointment-1', futureIso('09:30')),
    ).rejects.toThrow('Doctor already has an appointment at this time');
    expect(tx.appointment.update).not.toHaveBeenCalled();
  });
});
