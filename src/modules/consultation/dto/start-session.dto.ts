import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

const CONSULTATION_CHANNELS = ['CHAT', 'VIDEO'] as const;

export type ConsultationChannel = (typeof CONSULTATION_CHANNELS)[number];

export class StartSessionDto {
  @ApiPropertyOptional({
    enum: CONSULTATION_CHANNELS,
    example: 'VIDEO',
    description: 'If VIDEO is unavailable, system falls back to CHAT.',
  })
  @IsOptional()
  @IsIn(CONSULTATION_CHANNELS)
  channel?: ConsultationChannel;
}
