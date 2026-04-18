import { Module } from '@nestjs/common';
import { AdminAppointmentController, AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';

@Module({
  controllers: [AppointmentController, AdminAppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
