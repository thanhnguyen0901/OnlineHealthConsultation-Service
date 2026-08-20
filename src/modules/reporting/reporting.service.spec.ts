import { BadRequestException } from '@nestjs/common';

import { ReportingService } from './reporting.service';

const createPrismaMock = () => ({
  consultationSession: {
    count: jest.fn(),
    groupBy: jest.fn(),
    findMany: jest.fn(),
  },
  appointment: {
    count: jest.fn(),
    groupBy: jest.fn(),
  },
  user: {
    count: jest.fn(),
  },
  doctorProfile: {
    count: jest.fn(),
  },
  specialty: {
    count: jest.fn(),
  },
  question: {
    count: jest.fn(),
  },
  rating: {
    count: jest.fn(),
  },
});

describe('ReportingService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('reports consultation and active user metrics with supported date range filters', async () => {
    const prisma: any = createPrismaMock();
    prisma.consultationSession.count.mockResolvedValue(3);
    prisma.consultationSession.groupBy.mockResolvedValue([
      { status: 'ONGOING', _count: { _all: 1 } },
      { status: 'COMPLETED', _count: { _all: 2 } },
    ]);
    prisma.appointment.count.mockResolvedValue(5);
    prisma.user.count
      .mockResolvedValueOnce(9)
      .mockResolvedValueOnce(7)
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(3);
    prisma.doctorProfile.count.mockResolvedValue(2);
    prisma.specialty.count.mockResolvedValue(6);
    prisma.question.count
      .mockResolvedValueOnce(8)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(6);
    prisma.rating.count.mockResolvedValue(4);
    prisma.appointment.groupBy.mockResolvedValue([{ status: 'CONFIRMED', _count: { _all: 5 } }]);
    const service = new ReportingService(prisma);

    const result = await service.getDashboard({
      from: '2026-08-01T00:00:00.000Z',
      to: '2026-08-31T23:59:59.999Z',
    });

    expect(prisma.consultationSession.count).toHaveBeenCalledWith({
      where: {
        OR: [
          {
            startedAt: {
              gte: new Date('2026-08-01T00:00:00.000Z'),
              lte: new Date('2026-08-31T23:59:59.999Z'),
            },
          },
          {
            startedAt: null,
            createdAt: {
              gte: new Date('2026-08-01T00:00:00.000Z'),
              lte: new Date('2026-08-31T23:59:59.999Z'),
            },
          },
        ],
      },
    });
    expect(result).toMatchObject({
      totalConsultations: 3,
      totalActiveUsers: 7,
      totalAppointments: 5,
      totalQuestions: 8,
      pendingQuestions: 2,
      answeredQuestions: 6,
      totalRatings: 4,
      consultationsByStatus: [
        { status: 'ONGOING', count: 1 },
        { status: 'COMPLETED', count: 2 },
      ],
    });
  });

  it('builds consultation trend points from consultation sessions', async () => {
    const prisma: any = createPrismaMock();
    prisma.consultationSession.findMany.mockResolvedValue([
      { startedAt: new Date('2026-08-01T01:00:00.000Z'), createdAt: new Date('2026-08-01T01:00:00.000Z') },
      { startedAt: new Date('2026-08-01T02:00:00.000Z'), createdAt: new Date('2026-08-01T02:00:00.000Z') },
      { startedAt: null, createdAt: new Date('2026-08-02T02:00:00.000Z') },
    ]);
    const service = new ReportingService(prisma);

    const result = await service.getConsultationTrend({ groupBy: 'day' });

    expect(result.points).toEqual([
      { bucket: '2026-08-01', count: 2 },
      { bucket: '2026-08-02', count: 1 },
    ]);
  });

  it('rejects invalid report date ranges', async () => {
    const prisma: any = createPrismaMock();
    const service = new ReportingService(prisma);

    await expect(
      service.getDashboard({
        from: '2026-09-01T00:00:00.000Z',
        to: '2026-08-01T00:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
