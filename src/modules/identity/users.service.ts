import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { uuidv7 } from 'uuidv7';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    if (dto.role === Role.ADMIN) {
      throw new BadRequestException('Cannot register admin via this endpoint');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);
    const userId = uuidv7();

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          id: userId,
          email: dto.email,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          role: dto.role,
        },
      });

      if (dto.role === Role.PATIENT) {
        await tx.patientProfile.create({
          data: {
            id: uuidv7(),
            userId: user.id,
          },
        });
      } else if (dto.role === Role.DOCTOR) {
        if (!dto.specialtyId) {
          throw new BadRequestException('Specialty is required for doctors');
        }
        await tx.doctorProfile.create({
          data: {
            id: uuidv7(),
            userId: user.id,
            specialtyId: dto.specialtyId,
          },
        });
      }

      const { passwordHash: _, ...safeUser } = user;
      return safeUser;
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
