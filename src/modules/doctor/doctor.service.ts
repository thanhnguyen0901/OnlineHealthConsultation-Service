import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ApprovalStatus, Prisma } from '@prisma/client';
import { uuidv7 } from 'uuidv7';

import { PrismaService } from '../../prisma/prisma.service';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { UpdateDoctorScheduleDto } from './dto/update-doctor-schedule.dto';
import { UpdateDoctorSpecialtiesDto } from './dto/update-doctor-specialties.dto';
import { UpdateDoctorApprovalDto } from './dto/update-doctor-approval.dto';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(userId: string) {
    const profile = await this.prisma.doctorProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    return profile;
  }

  async updateMyProfile(userId: string, dto: UpdateDoctorProfileDto) {
    const existing = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!existing) {
      throw new NotFoundException('Doctor profile not found');
    }

    return this.prisma.doctorProfile.update({
      where: { userId },
      data: {
        ...(dto.bio !== undefined ? { bio: dto.bio } : {}),
        ...(dto.yearsOfExperience !== undefined
          ? { yearsOfExperience: dto.yearsOfExperience }
          : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });
  }

  async updateMySchedule(userId: string, dto: UpdateDoctorScheduleDto) {
    const existing = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!existing) {
      throw new NotFoundException('Doctor profile not found');
    }

    return this.prisma.doctorProfile.update({
      where: { userId },
      data: {
        ...(dto.schedule !== undefined
          ? { schedule: dto.schedule as Prisma.InputJsonValue, scheduleUpdatedAt: new Date() }
          : {}),
      },
      include: {
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });
  }

  async updateMySpecialties(userId: string, dto: UpdateDoctorSpecialtiesDto) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const specialties = await this.prisma.specialty.findMany({
      where: { id: { in: dto.specialtyIds }, isActive: true },
      select: { id: true },
    });

    if (specialties.length !== dto.specialtyIds.length) {
      throw new BadRequestException('One or more specialties are invalid or inactive');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.doctorSpecialty.deleteMany({ where: { doctorId: doctor.id } });

      await tx.doctorSpecialty.createMany({
        data: dto.specialtyIds.map((specialtyId) => ({
          id: uuidv7(),
          doctorId: doctor.id,
          specialtyId,
        })),
      });
    });

    return this.getMyProfile(userId);
  }

  async updateDoctorApproval(doctorId: string, dto: UpdateDoctorApprovalDto, adminId: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const updated = await this.prisma.doctorProfile.update({
      where: { id: doctorId },
      data: {
        approvalStatus: dto.approvalStatus,
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        id: uuidv7(),
        actorUserId: adminId,
        action: 'DOCTOR_APPROVAL_UPDATED',
        resource: 'DOCTOR_PROFILE',
        resourceId: doctorId,
        metadata: {
          approvalStatus: dto.approvalStatus,
          isActive: dto.isActive ?? null,
        },
      },
    });

    return updated;
  }

  getPublicFilter() {
    return {
      isActive: true,
      approvalStatus: ApprovalStatus.APPROVED,
      user: {
        isActive: true,
        deletedAt: null,
      },
    } as const;
  }
}
