import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum ModerationContentType {
  QUESTION = 'QUESTION',
  ANSWER = 'ANSWER',
  RATING = 'RATING',
}

export class ListModerationItemsQueryDto {
  @ApiPropertyOptional({ enum: ModerationContentType })
  @IsOptional()
  @IsEnum(ModerationContentType)
  type?: ModerationContentType;

  @ApiPropertyOptional({ example: 50, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
