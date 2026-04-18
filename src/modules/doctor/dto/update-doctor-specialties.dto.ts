import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class UpdateDoctorSpecialtiesDto {
  @ApiProperty({ type: [String], example: ['8f772736-0ed8-495e-b6de-f9b7c2e4d001'] })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  specialtyIds!: string[];
}
