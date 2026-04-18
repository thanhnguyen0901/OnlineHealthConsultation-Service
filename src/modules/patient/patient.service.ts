import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class PatientService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(userId: string) {
    const profile = await this.prisma.patientProfile.findUnique({
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
      },
    });

    if (!profile) {
      throw new NotFoundException('Patient profile not found');
    }

    return profile;
  }

  async updateMyProfile(userId: string, dto: UpdatePatientProfileDto) {
    const existing = await this.prisma.patientProfile.findUnique({ where: { userId } });

    if (!existing) {
      await this.prisma.patientProfile.create({
        data: {
          id: uuidv7(),
          userId,
        },
      });
    }

    return this.prisma.patientProfile.update({
      where: { userId },
      data: {
        ...(dto.dateOfBirth ? { dateOfBirth: new Date(dto.dateOfBirth) } : {}),
        ...(dto.gender ? { gender: dto.gender } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
        ...(dto.address !== undefined ? { address: dto.address } : {}),
        ...(dto.medicalHistory !== undefined ? { medicalHistory: dto.medicalHistory } : {}),
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
      },
    });
  }
}
