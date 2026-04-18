import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({ example: 'Chest pain during exercise' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ example: 'I feel chest pain when exercising hard. Is it dangerous?' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiPropertyOptional({ description: 'Optional assigned doctor profile id', example: '01950000-0000-7000-8002-000000000001' })
  @IsOptional()
  @IsUUID()
  doctorId?: string;
}
