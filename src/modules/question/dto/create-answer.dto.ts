import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswerDto {
  @ApiProperty({ example: 'Please reduce intensity and schedule ECG for proper evaluation.' })
  @IsString()
  @IsNotEmpty()
  content!: string;
}
