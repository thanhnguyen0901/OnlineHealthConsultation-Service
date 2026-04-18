import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class UpdateDoctorScheduleDto {
  @ApiPropertyOptional({
    description: 'Schedule JSON array',
    example: [{ date: '2026-04-20', startTime: '08:00', endTime: '12:00', available: true }],
    type: 'array',
  })
  @IsOptional()
  @IsArray()
  schedule?: unknown[];
}
