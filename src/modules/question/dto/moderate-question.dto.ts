import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ModerateQuestionDto {
  @ApiProperty({ example: 'MODERATE', description: 'Moderation action, e.g. MODERATE/CLOSE/REOPEN' })
  @IsString()
  @IsNotEmpty()
  action!: string;

  @ApiPropertyOptional({ example: 'Inappropriate medical claim without enough context' })
  @IsOptional()
  @IsString()
  reason?: string;
}
