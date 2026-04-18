import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsOptional } from 'class-validator';

const GROUP_BY_VALUES = ['day', 'week', 'month'] as const;

export type TrendGroupBy = (typeof GROUP_BY_VALUES)[number];

export class ReportQueryDto {
  @ApiPropertyOptional({ example: '2026-01-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ example: '2026-12-31T23:59:59.999Z' })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({ enum: GROUP_BY_VALUES, example: 'day' })
  @IsOptional()
  @IsIn(GROUP_BY_VALUES)
  groupBy?: TrendGroupBy;
}
