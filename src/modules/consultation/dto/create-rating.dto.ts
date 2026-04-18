import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({ example: '01950000-0000-7000-8006-000000000001' })
  @IsUUID()
  appointmentId!: string;

  @ApiProperty({ minimum: 1, maximum: 5, example: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  score!: number;

  @ApiPropertyOptional({ example: 'Doctor explained very clearly.' })
  @IsOptional()
  @IsString()
  comment?: string;
}
