import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { IdentityModule } from './modules/identity/identity.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { PatientModule } from './modules/patient/patient.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { QuestionModule } from './modules/question/question.module';
import { ConsultationModule } from './modules/consultation/consultation.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ReportingModule } from './modules/reporting/reporting.module';

import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    PrismaModule,
    IdentityModule,
    DoctorModule,
    PatientModule,
    AppointmentModule,
    QuestionModule,
    ConsultationModule,
    NotificationModule,
    ReportingModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
