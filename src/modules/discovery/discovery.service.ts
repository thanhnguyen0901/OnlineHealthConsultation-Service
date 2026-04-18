import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

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

    return {
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  getPublicDoctorById(doctorId: string) {
    return this.prisma.doctorProfile.findFirst({
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
  }
}
