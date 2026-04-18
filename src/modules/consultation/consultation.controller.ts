import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ConsultationService } from './consultation.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { CreateRatingDto } from './dto/create-rating.dto';
import { ModerateRatingDto } from './dto/moderate-rating.dto';
import { StartSessionDto } from './dto/start-session.dto';
import { UpdateConsultationSummaryDto } from './dto/update-consultation-summary.dto';

@ApiTags('Consultations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('consultations')
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  @Roles(Role.DOCTOR)
  @Post(':appointmentId/start')
  @ApiOperation({ summary: 'Doctor starts consultation session' })
  startSession(
    @CurrentUser() user: { sub: string },
    @Param('appointmentId') appointmentId: string,
    @Body() dto: StartSessionDto,
  ) {
    return this.consultationService.startSession(user.sub, appointmentId, dto);
  }

  @Roles(Role.PATIENT, Role.DOCTOR, Role.ADMIN)
  @Post(':appointmentId/join')
  @ApiOperation({ summary: 'Participant joins consultation session' })
  joinSession(
    @CurrentUser() user: { sub: string; role: Role },
    @Param('appointmentId') appointmentId: string,
  ) {
    return this.consultationService.joinSession(user.sub, user.role, appointmentId);
  }

  @Roles(Role.DOCTOR)
  @Patch(':appointmentId/end')
  @ApiOperation({ summary: 'Doctor ends consultation session' })
  endSession(@CurrentUser() user: { sub: string }, @Param('appointmentId') appointmentId: string) {
    return this.consultationService.endSession(user.sub, appointmentId);
  }

  @Roles(Role.DOCTOR)
  @Patch(':appointmentId/summary')
  @ApiOperation({ summary: 'Doctor updates consultation summary' })
  updateSummary(
    @CurrentUser() user: { sub: string },
    @Param('appointmentId') appointmentId: string,
    @Body() dto: UpdateConsultationSummaryDto,
  ) {
    return this.consultationService.updateSummary(user.sub, appointmentId, dto);
  }

  @Roles(Role.DOCTOR)
  @Post(':appointmentId/prescriptions')
  @ApiOperation({ summary: 'Doctor creates basic e-prescription for completed consultation' })
  createPrescription(
    @CurrentUser() user: { sub: string },
    @Param('appointmentId') appointmentId: string,
    @Body() dto: CreatePrescriptionDto,
  ) {
    return this.consultationService.createPrescription(user.sub, appointmentId, dto);
  }

  @Roles(Role.PATIENT)
  @Get('mine')
  @ApiOperation({ summary: 'Patient lists own consultation history and outcomes' })
  listMyConsultations(@CurrentUser() user: { sub: string }) {
    return this.consultationService.listMyConsultations(user.sub);
  }

  @Roles(Role.DOCTOR)
  @Get('doctor/me')
  @ApiOperation({ summary: 'Doctor lists own consultation history' })
  listDoctorConsultations(@CurrentUser() user: { sub: string }) {
    return this.consultationService.listDoctorConsultations(user.sub);
  }
}

@ApiTags('Ratings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ratings')
export class RatingController {
  constructor(private readonly consultationService: ConsultationService) {}

  @Roles(Role.PATIENT)
  @Post()
  @ApiOperation({ summary: 'Patient rates a completed consultation appointment' })
  createRating(@CurrentUser() user: { sub: string }, @Body() dto: CreateRatingDto) {
    return this.consultationService.createRating(user.sub, dto);
  }

  @Roles(Role.PATIENT)
  @Get('mine')
  @ApiOperation({ summary: 'Patient lists own ratings' })
  listMyRatings(@CurrentUser() user: { sub: string }) {
    return this.consultationService.listMyRatings(user.sub);
  }
}

@ApiTags('Admin Ratings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/ratings')
export class AdminRatingController {
  constructor(private readonly consultationService: ConsultationService) {}

  @Patch(':id/moderation')
  @ApiOperation({ summary: 'Admin moderates rating visibility' })
  moderateRating(
    @CurrentUser() user: { sub: string },
    @Param('id') ratingId: string,
    @Body() dto: ModerateRatingDto,
  ) {
    return this.consultationService.moderateRating(user.sub, ratingId, dto);
  }
}
