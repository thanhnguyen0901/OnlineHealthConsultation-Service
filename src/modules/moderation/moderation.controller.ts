import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  ListModerationItemsQueryDto,
  ModerationContentType,
} from './dto/list-moderation-items-query.dto';
import { ModerateContentDto } from './dto/moderate-content.dto';
import { ModerationService } from './moderation.service';

@ApiTags('Admin Moderation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Get('items')
  @ApiOperation({ summary: 'Admin lists reviewable questions, answers, and ratings' })
  listItems(@Query() query: ListModerationItemsQueryDto) {
    return this.moderationService.listItems(query);
  }

  @Patch('items/:type/:id')
  @ApiOperation({ summary: 'Admin moderates a question, answer, or rating' })
  moderateItem(
    @CurrentUser() user: { sub: string },
    @Param('type') type: ModerationContentType,
    @Param('id') id: string,
    @Body() dto: ModerateContentDto,
  ) {
    return this.moderationService.moderateItem(user.sub, type, id, dto);
  }
}
