import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { OperationsService } from './operations.service';

@ApiTags('Operations')
@Controller()
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Get('health')
  @ApiOperation({ summary: 'Public healthcheck endpoint' })
  healthCheck() {
    return this.operationsService.healthCheck();
  }
}

@ApiTags('Admin Operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/ops')
export class AdminOperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Admin gets operational metrics counters' })
  getMetrics() {
    return this.operationsService.getMetrics();
  }
}
