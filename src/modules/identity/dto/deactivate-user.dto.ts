import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DeactivateUserDto {
  @ApiPropertyOptional({ example: 'Policy violation' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;
}
