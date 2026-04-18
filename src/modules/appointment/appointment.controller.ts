import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AdminUpdateAppointmentStatusDto } from './dto/admin-update-appointment-status.dto';

@ApiTags('Appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Roles(Role.PATIENT)
  @Post()
  @ApiOperation({ summary: 'Patient books an appointment' })
  createAppointment(@CurrentUser() user: { sub: string }, @Body() dto: CreateAppointmentDto) {
    return this.appointmentService.createAppointment(user.sub, dto);
  }

  @Roles(Role.PATIENT)
  @Get('mine')
  @ApiOperation({ summary: 'Patient lists own appointments' })
  listMyAppointments(@CurrentUser() user: { sub: string }) {
    return this.appointmentService.listMyAppointments(user.sub);
  }

  @Roles(Role.PATIENT)
  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Patient cancels an appointment' })
  cancelAppointment(@CurrentUser() user: { sub: string }, @Param('id') appointmentId: string) {
    return this.appointmentService.cancelAppointment(user.sub, appointmentId);
  }

  @Roles(Role.DOCTOR)
  @Get('doctor/me')
  @ApiOperation({ summary: 'Doctor lists own appointments' })
  listDoctorAppointments(@CurrentUser() user: { sub: string }) {
    return this.appointmentService.listDoctorAppointments(user.sub);
  }

  @Roles(Role.DOCTOR)
  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Doctor confirms an appointment' })
  confirmAppointment(@CurrentUser() user: { sub: string }, @Param('id') appointmentId: string) {
    return this.appointmentService.confirmAppointment(user.sub, appointmentId);
  }

  @Roles(Role.DOCTOR)
  @Patch(':id/complete')
  @ApiOperation({ summary: 'Doctor completes an appointment' })
  completeAppointment(@CurrentUser() user: { sub: string }, @Param('id') appointmentId: string) {
    return this.appointmentService.completeAppointment(user.sub, appointmentId);
  }
}

@ApiTags('Admin Appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/appointments')
export class AdminAppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  @ApiOperation({ summary: 'Admin lists all appointments' })
  listAllAppointments() {
    return this.appointmentService.listAllAppointments();
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Admin updates appointment status' })
  updateAppointmentStatus(
    @CurrentUser() user: { sub: string },
    @Param('id') appointmentId: string,
    @Body() dto: AdminUpdateAppointmentStatusDto,
  ) {
    return this.appointmentService.adminUpdateAppointmentStatus(user.sub, appointmentId, dto.status);
  }
}
