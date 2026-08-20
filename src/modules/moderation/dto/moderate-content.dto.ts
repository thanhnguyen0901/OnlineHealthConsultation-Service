import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export enum ModerationAction {
  APPROVE = 'APPROVE',
  HIDE = 'HIDE',
  RESTORE = 'RESTORE',
  CLOSE = 'CLOSE',
}

export class ModerateContentDto {
  @ApiProperty({ enum: ModerationAction, example: ModerationAction.HIDE })
  @IsEnum(ModerationAction)
  action!: ModerationAction;

  @ApiPropertyOptional({ example: 'Inappropriate or unsafe medical content' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
