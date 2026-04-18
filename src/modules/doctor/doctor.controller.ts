import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { DoctorService } from './doctor.service';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { UpdateDoctorScheduleDto } from './dto/update-doctor-schedule.dto';
import { UpdateDoctorSpecialtiesDto } from './dto/update-doctor-specialties.dto';
import { UpdateDoctorApprovalDto } from './dto/update-doctor-approval.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Doctor')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Roles(Role.DOCTOR)
  @Get('doctors/me/profile')
  @ApiOperation({ summary: 'Get my doctor profile' })
  async getMyProfile(@CurrentUser() user: { sub: string }) {
    return this.doctorService.getMyProfile(user.sub);
  }

  @Roles(Role.DOCTOR)
  @Patch('doctors/me/profile')
  @ApiOperation({ summary: 'Update my doctor profile' })
  async updateMyProfile(
    @CurrentUser() user: { sub: string },
    @Body() dto: UpdateDoctorProfileDto,
  ) {
    return this.doctorService.updateMyProfile(user.sub, dto);
  }

  @Roles(Role.DOCTOR)
  @Patch('doctors/me/schedule')
  @ApiOperation({ summary: 'Update my doctor schedule' })
  async updateMySchedule(
    @CurrentUser() user: { sub: string },
    @Body() dto: UpdateDoctorScheduleDto,
  ) {
    return this.doctorService.updateMySchedule(user.sub, dto);
  }

  @Roles(Role.DOCTOR)
  @Patch('doctors/me/specialties')
  @ApiOperation({ summary: 'Update my doctor specialties' })
  async updateMySpecialties(
    @CurrentUser() user: { sub: string },
    @Body() dto: UpdateDoctorSpecialtiesDto,
  ) {
    return this.doctorService.updateMySpecialties(user.sub, dto);
  }

  @Roles(Role.ADMIN)
  @Patch('admin/doctors/:doctorId/approval')
  @ApiOperation({ summary: 'Admin updates doctor approval status' })
  async updateDoctorApproval(
    @Param('doctorId') doctorId: string,
    @Body() dto: UpdateDoctorApprovalDto,
    @CurrentUser() user: { sub: string },
  ) {
    return this.doctorService.updateDoctorApproval(doctorId, dto, user.sub);
  }
}
