import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class AdminCreateUserDto {
  @ApiProperty({ example: 'new.user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'New' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: 'User' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ enum: [Role.PATIENT, Role.DOCTOR], example: Role.PATIENT })
  @IsEnum(Role)
  role!: Role;

  @ApiPropertyOptional({ description: 'Required if role is DOCTOR' })
  @ValidateIf((o: AdminCreateUserDto) => o.role === Role.DOCTOR)
  @IsUUID()
  @IsNotEmpty()
  specialtyId?: string;
}
