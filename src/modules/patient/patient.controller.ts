import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { PatientService } from './patient.service';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Patient')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PATIENT)
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get('me/profile')
  @ApiOperation({ summary: 'Get my patient profile' })
  async getMyProfile(@CurrentUser() user: { sub: string }) {
    return this.patientService.getMyProfile(user.sub);
  }

  @Patch('me/profile')
  @ApiOperation({ summary: 'Update my patient profile' })
  async updateMyProfile(
    @CurrentUser() user: { sub: string },
    @Body() dto: UpdatePatientProfileDto,
  ) {
    return this.patientService.updateMyProfile(user.sub, dto);
  }
}
