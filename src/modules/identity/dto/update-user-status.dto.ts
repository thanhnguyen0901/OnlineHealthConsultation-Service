import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserStatusDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  isActive!: boolean;

  @ApiPropertyOptional({ example: 'Policy violation' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
