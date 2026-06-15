import { Injectable } from '@nestjs/common';
import { Prisma, RatingStatus } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { PublicDoctorQueryDto } from './dto/public-doctor-query.dto';

@Injectable()
export class DiscoveryService {
  constructor(private readonly prisma: PrismaService) {}

  getHome() {
    return {
      service: 'Online Health Consultation Platform API',
      version: 'v1',
      status: 'ready',
    };
  }

  listPublicSpecialties() {
    return this.prisma.specialty.findMany({
      where: { isActive: true },
      orderBy: { nameEn: 'asc' },
    });
  }

  async listPublicDoctors(query: PublicDoctorQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const keyword = query.keyword?.trim();

    const where: Prisma.DoctorProfileWhereInput = {
      isActive: true,
      approvalStatus: 'APPROVED',
      user: {
        isActive: true,
        deletedAt: null,
      },
      ...(query.specialtyId
        ? {
            specialties: {
              some: {
                specialtyId: query.specialtyId,
              },
            },
          }
        : {}),
      ...(keyword
        ? {
            OR: [
              { bio: { contains: keyword, mode: 'insensitive' } },
              {
                user: {
                  OR: [
                    { firstName: { contains: keyword, mode: 'insensitive' } },
                    { lastName: { contains: keyword, mode: 'insensitive' } },
                  ],
                },
              },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.doctorProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          specialties: {
            include: {
              specialty: {
                select: {
                  id: true,
                  nameEn: true,
                  nameVi: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.doctorProfile.count({ where }),
    ]);

    const itemsWithRating = await Promise.all(
      items.map(async (doctor) => {
        const ratingSummary = await this.getDoctorRatingSummary(doctor.id);
        return {
          ...doctor,
          ...ratingSummary,
        };
      }),
    );

    return {
      data: itemsWithRating,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async getDoctorRatingSummary(doctorId: string) {
    const aggregate = await this.prisma.rating.aggregate({
      where: {
        doctorId,
        status: RatingStatus.VISIBLE,
      },
      _avg: {
        score: true,
      },
      _count: {
        _all: true,
      },
    });

    return {
      avgRating: aggregate._avg.score,
      ratingCount: aggregate._count._all,
    };
  }

  async getPublicDoctorById(doctorId: string) {
    const doctor = await this.prisma.doctorProfile.findFirst({
      where: {
        id: doctorId,
        isActive: true,
        approvalStatus: 'APPROVED',
        user: {
          isActive: true,
          deletedAt: null,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        specialties: {
          include: {
            specialty: {
              select: {
                id: true,
                nameEn: true,
                nameVi: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!doctor) {
      return null;
    }

    const ratingSummary = await this.getDoctorRatingSummary(doctor.id);

    return {
      ...doctor,
      ...ratingSummary,
    };
  }
}
