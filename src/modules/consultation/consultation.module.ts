import { Module } from '@nestjs/common';

import {
  AdminRatingController,
  ConsultationController,
  RatingController,
} from './consultation.controller';
import { ConsultationGateway } from './consultation.gateway';
import { ConsultationService } from './consultation.service';

@Module({
  imports: [],
  controllers: [ConsultationController, RatingController, AdminRatingController],
  providers: [ConsultationService, ConsultationGateway],
  exports: [ConsultationService],
})
export class ConsultationModule {}
