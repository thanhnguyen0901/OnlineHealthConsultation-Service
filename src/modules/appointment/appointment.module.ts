import { Module } from '@nestjs/common';
import {
  AdminAppointmentController,
  AppointmentController,
  PublicDoctorAvailabilityController,
} from './appointment.controller';
import { AppointmentService } from './appointment.service';

@Module({
  controllers: [
    PublicDoctorAvailabilityController,
    AppointmentController,
    AdminAppointmentController,
  ],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
