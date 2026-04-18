import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: '01950000-0000-7000-8002-000000000001' })
  @IsUUID()
  doctorId!: string;

  @ApiProperty({ example: '2026-05-20T09:00:00.000Z' })
  @IsDateString()
  scheduledAt!: string;

  @ApiPropertyOptional({ example: 60, default: 60 })
  @IsOptional()
  @IsInt()
  @Min(15)
  durationMinutes?: number;

  @ApiProperty({ example: 'Follow-up consultation for chest pain' })
  @IsString()
  @IsNotEmpty()
  reason!: string;

  @ApiPropertyOptional({ example: 'Bring previous ECG report' })
  @IsOptional()
  @IsString()
  notes?: string;
}
