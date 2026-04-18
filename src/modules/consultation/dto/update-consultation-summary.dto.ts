import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateConsultationSummaryDto {
  @ApiProperty({ example: 'Patient condition improved, continue medication for 7 days.' })
  @IsString()
  @IsNotEmpty()
  summary!: string;
}
