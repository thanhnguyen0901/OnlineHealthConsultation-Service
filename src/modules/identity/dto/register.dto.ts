import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, ValidateIf, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ enum: Role, example: Role.PATIENT })
  @IsEnum(Role)
  @IsNotEmpty()
  role!: Role;

  @ApiPropertyOptional({ description: 'Required if role is DOCTOR' })
  @ValidateIf((o: any) => o.role === Role.DOCTOR)
  @IsUUID()
  @IsNotEmpty()
  specialtyId?: string;
}
