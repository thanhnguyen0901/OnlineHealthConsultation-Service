import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateDoctorProfileDto {
  @ApiPropertyOptional({ example: 'Cardiologist with 10 years experience' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @ApiPropertyOptional({ example: 'MD, Cardiology residency, board-certified cardiologist' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  qualificationSummary?: string;

  @ApiPropertyOptional({ example: 'Online consultation for chest pain, hypertension, and preventive heart care' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  consultationDescription?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(0)
  yearsOfExperience?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
