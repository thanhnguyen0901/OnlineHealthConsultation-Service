import { Injectable, NotFoundException } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';

@Injectable()
export class SpecialtyService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateSpecialtyDto) {
    return this.prisma.specialty.create({
      data: {
        id: uuidv7(),
        nameEn: dto.nameEn,
        nameVi: dto.nameVi,
        description: dto.description,
        isActive: true,
      },
    });
  }

  listAll() {
    return this.prisma.specialty.findMany({
      orderBy: { nameEn: 'asc' },
    });
  }

  async update(id: string, dto: UpdateSpecialtyDto) {
    const existing = await this.prisma.specialty.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Specialty not found');
    }

    return this.prisma.specialty.update({
      where: { id },
      data: {
        ...(dto.nameEn !== undefined ? { nameEn: dto.nameEn } : {}),
        ...(dto.nameVi !== undefined ? { nameVi: dto.nameVi } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
    });
  }

  async deactivate(id: string) {
    const existing = await this.prisma.specialty.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Specialty not found');
    }

    return this.prisma.specialty.update({
      where: { id },
      data: { isActive: false },
    });
  }

  listPublic() {
    return this.prisma.specialty.findMany({
      where: { isActive: true },
      orderBy: { nameEn: 'asc' },
    });
  }
}
