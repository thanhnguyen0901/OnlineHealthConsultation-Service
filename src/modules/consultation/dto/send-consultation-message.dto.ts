import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SendConsultationMessageDto {
  @ApiProperty({ example: 'Hello doctor, I have updated my symptoms.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content!: string;
}
