import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class PublicDoctorQueryDto {
  @ApiPropertyOptional({ example: 'hung' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ example: '8f772736-0ed8-495e-b6de-f9b7c2e4d001' })
  @IsOptional()
  @IsUUID()
  specialtyId?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @Transform(({ value }) => parseInt(value ?? '1', 10))
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @Transform(({ value }) => parseInt(value ?? '10', 10))
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;
}
