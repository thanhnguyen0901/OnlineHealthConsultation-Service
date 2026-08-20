import { NotFoundException } from '@nestjs/common';

import { DoctorService } from './doctor.service';

const createPrismaMock = () => {
  const tx: any = {
    doctorSpecialty: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
  };

  const prisma: any = {
    doctorProfile: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
    $transaction: jest.fn(async (arg: unknown) => {
      if (typeof arg === 'function') {
        return (arg as (transaction: typeof tx) => unknown)(tx);
      }
      return arg;
    }),
    question: {
      count: jest.fn(),
    },
    appointment: {
      count: jest.fn(),
    },
    rating: {
      aggregate: jest.fn(),
    },
    specialty: {
      findMany: jest.fn(),
    },
    doctorSpecialty: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
    patientProfile: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  return { prisma, tx };
};

describe('DoctorService professional profile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updates doctor-owned SRS professional profile fields', async () => {
    const { prisma } = createPrismaMock();
    prisma.doctorProfile.findUnique.mockResolvedValue({ id: 'doctor-1', userId: 'doctor-user-1' });
    prisma.doctorProfile.update.mockResolvedValue({
      id: 'doctor-1',
      bio: 'Legacy biography',
      qualificationSummary: 'MD, Cardiology residency',
      consultationDescription: 'Consults on hypertension and preventive care',
      yearsOfExperience: 12,
    });
    const service = new DoctorService(prisma);

    await service.updateMyProfile('doctor-user-1', {
      bio: 'Legacy biography',
      qualificationSummary: 'MD, Cardiology residency',
      consultationDescription: 'Consults on hypertension and preventive care',
      yearsOfExperience: 12,
    });

    expect(prisma.doctorProfile.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'doctor-user-1' },
        data: {
          bio: 'Legacy biography',
          qualificationSummary: 'MD, Cardiology residency',
          consultationDescription: 'Consults on hypertension and preventive care',
          yearsOfExperience: 12,
        },
      }),
    );
  });

  it('allows admin to update doctor professional profile and records audit log', async () => {
    const { prisma } = createPrismaMock();
    prisma.doctorProfile.findUnique.mockResolvedValue({ id: 'doctor-1' });
    prisma.doctorProfile.update.mockResolvedValue({ id: 'doctor-1' });
    const service = new DoctorService(prisma);

    await service.updateDoctorProfileForAdmin(
      'doctor-1',
      {
        qualificationSummary: 'Board-certified dermatologist',
        consultationDescription: 'Consultation for acne and rashes',
      },
      'admin-user-1',
    );

    expect(prisma.doctorProfile.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'doctor-1' },
        data: {
          qualificationSummary: 'Board-certified dermatologist',
          consultationDescription: 'Consultation for acne and rashes',
        },
      }),
    );
    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        actorUserId: 'admin-user-1',
        action: 'DOCTOR_PROFILE_UPDATED_BY_ADMIN',
        resource: 'DOCTOR_PROFILE',
        resourceId: 'doctor-1',
      }),
    });
  });

  it('rejects professional profile update for an invalid doctor', async () => {
    const { prisma } = createPrismaMock();
    prisma.doctorProfile.findUnique.mockResolvedValue(null);
    const service = new DoctorService(prisma);

    await expect(
      service.updateDoctorProfileForAdmin('missing-doctor', { yearsOfExperience: 4 }, 'admin-user-1'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('allows admin to replace doctor specialties and records audit log', async () => {
    const { prisma, tx } = createPrismaMock();
    prisma.doctorProfile.findUnique
      .mockResolvedValueOnce({ id: 'doctor-1' })
      .mockResolvedValueOnce({ id: 'doctor-1', specialties: [] });
    prisma.specialty.findMany.mockResolvedValue([{ id: 'specialty-1' }]);
    const service = new DoctorService(prisma);

    await service.updateDoctorSpecialtiesForAdmin(
      'doctor-1',
      { specialtyIds: ['specialty-1'] },
      'admin-user-1',
    );

    expect(tx.doctorSpecialty.deleteMany).toHaveBeenCalledWith({ where: { doctorId: 'doctor-1' } });
    expect(tx.doctorSpecialty.createMany).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({
          doctorId: 'doctor-1',
          specialtyId: 'specialty-1',
        }),
      ],
    });
    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        actorUserId: 'admin-user-1',
        action: 'DOCTOR_SPECIALTIES_UPDATED_BY_ADMIN',
        resource: 'DOCTOR_PROFILE',
        resourceId: 'doctor-1',
      }),
    });
  });
});
