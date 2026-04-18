import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSpecialtyDto {
  @ApiProperty({ example: 'Cardiology' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nameEn!: string;

  @ApiProperty({ example: 'Tim mach' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nameVi!: string;

  @ApiPropertyOptional({ example: 'Cardiovascular consultation' })
  @IsOptional()
  @IsString()
  description?: string;
}
