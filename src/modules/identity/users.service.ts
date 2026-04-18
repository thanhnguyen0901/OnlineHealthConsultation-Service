import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { uuidv7 } from 'uuidv7';
import { Role } from '@prisma/client';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: RegisterDto) {
    return this.createUserCore(dto, { allowAdminRole: false });
  }

  async createUserByAdmin(adminUserId: string, dto: AdminCreateUserDto) {
    if (dto.role !== Role.PATIENT && dto.role !== Role.DOCTOR) {
      throw new BadRequestException('Admin can only create PATIENT or DOCTOR accounts');
    }
    const created = await this.createUserCore(dto, { allowAdminRole: false });
    await this.prisma.auditLog.create({
      data: {
        id: uuidv7(),
        actorUserId: adminUserId,
        action: 'USER_CREATED_BY_ADMIN',
        resource: 'USER',
        resourceId: created.id,
        metadata: {
          role: created.role,
        },
      },
    });
    return created;
  }

  private async createUserCore(
    dto: Pick<RegisterDto, 'email' | 'password' | 'firstName' | 'lastName' | 'role' | 'specialtyId'>,
    options: { allowAdminRole: boolean },
  ) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    if (!options.allowAdminRole && dto.role === Role.ADMIN) {
      throw new BadRequestException('Cannot create admin user via this endpoint');
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
        const doctorProfile = await tx.doctorProfile.create({
          data: {
            id: uuidv7(),
            userId: user.id,
          },
        });
        await tx.doctorSpecialty.create({
          data: {
            id: uuidv7(),
            doctorId: doctorProfile.id,
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

  async getUserDetailForAdmin(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        patientProfile: true,
        doctorProfile: {
          include: {
            specialties: {
              include: {
                specialty: true,
              },
            },
          },
        },
      },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async deactivateUser(adminUserId: string, targetUserId: string, reason?: string) {
    if (adminUserId === targetUserId) {
      throw new BadRequestException('Admin cannot deactivate their own account');
    }

    const updated = await this.prisma.user.update({
      where: { id: targetUserId },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });

    await this.prisma.auditLog.create({
      data: {
        id: uuidv7(),
        actorUserId: adminUserId,
        action: 'USER_DEACTIVATED',
        resource: 'USER',
        resourceId: targetUserId,
        metadata: {
          reason: reason ?? null,
        },
      },
    });

    const { passwordHash, ...safeUser } = updated;
    return safeUser;
  }

  async listUsers(query: ListUsersQueryDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where = {
      ...(query.role ? { role: query.role } : {}),
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          deletedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    };
  }

  async updateUserStatus(adminUserId: string, targetUserId: string, dto: UpdateUserStatusDto) {
    if (adminUserId === targetUserId && dto.isActive === false) {
      throw new BadRequestException('Admin cannot deactivate their own account');
    }

    const existing = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!existing) {
      throw new BadRequestException('User not found');
    }

    const updated = await this.prisma.user.update({
      where: { id: targetUserId },
      data: {
        isActive: dto.isActive,
        deletedAt: dto.isActive ? null : new Date(),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!dto.isActive) {
      await this.prisma.userSession.updateMany({
        where: { userId: targetUserId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    await this.prisma.auditLog.create({
      data: {
        id: uuidv7(),
        actorUserId: adminUserId,
        action: dto.isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
        resource: 'USER',
        resourceId: targetUserId,
        metadata: {
          reason: dto.reason ?? null,
        },
      },
    });

    return updated;
  }

  async updateUserByAdmin(adminUserId: string, targetUserId: string, dto: AdminUpdateUserDto) {
    if (adminUserId === targetUserId && dto.isActive === false) {
      throw new BadRequestException('Admin cannot deactivate their own account');
    }

    const existing = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!existing) {
      throw new BadRequestException('User not found');
    }

    if (dto.email && dto.email !== existing.email) {
      const duplicate = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (duplicate) {
        throw new ConflictException('Email already exists');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: targetUserId },
      data: {
        ...(dto.email !== undefined ? { email: dto.email } : {}),
        ...(dto.firstName !== undefined ? { firstName: dto.firstName } : {}),
        ...(dto.lastName !== undefined ? { lastName: dto.lastName } : {}),
        ...(dto.isActive !== undefined
          ? { isActive: dto.isActive, deletedAt: dto.isActive ? null : new Date() }
          : {}),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (dto.isActive === false) {
      await this.prisma.userSession.updateMany({
        where: { userId: targetUserId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    await this.prisma.auditLog.create({
      data: {
        id: uuidv7(),
        actorUserId: adminUserId,
        action: 'USER_UPDATED_BY_ADMIN',
        resource: 'USER',
        resourceId: targetUserId,
        metadata: {
          changedFields: Object.keys(dto),
        },
      },
    });

    return updated;
  }

  async deleteUserByAdmin(adminUserId: string, targetUserId: string) {
    if (adminUserId === targetUserId) {
      throw new BadRequestException('Admin cannot delete their own account');
    }

    const existing = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!existing) {
      throw new BadRequestException('User not found');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: targetUserId },
        data: {
          isActive: false,
          deletedAt: new Date(),
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          deletedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      await tx.userSession.updateMany({
        where: { userId: targetUserId, revokedAt: null },
        data: { revokedAt: new Date() },
      });

      await tx.auditLog.create({
        data: {
          id: uuidv7(),
          actorUserId: adminUserId,
          action: 'USER_DELETED_BY_ADMIN',
          resource: 'USER',
          resourceId: targetUserId,
        },
      });

      return user;
    });

    return updated;
  }
}
