import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ReportQueryDto } from './dto/report-query.dto';
import { ReportingService } from './reporting.service';

@ApiTags('Reporting')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('reports')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Admin dashboard metrics' })
  getDashboard(@Query() query: ReportQueryDto) {
    return this.reportingService.getDashboard(query);
  }

  @Get('consultations/trend')
  @ApiOperation({ summary: 'Admin consultation trends by period' })
  getConsultationTrend(@Query() query: ReportQueryDto) {
    return this.reportingService.getConsultationTrend(query);
  }
}
