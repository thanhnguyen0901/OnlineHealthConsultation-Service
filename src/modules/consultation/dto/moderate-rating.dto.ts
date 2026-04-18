import { ApiProperty } from '@nestjs/swagger';
import { RatingStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ModerateRatingDto {
  @ApiProperty({ enum: RatingStatus, example: RatingStatus.VISIBLE })
  @IsEnum(RatingStatus)
  status!: RatingStatus;
}
