import { Module } from '@nestjs/common';

import {
  AdminRatingController,
  ConsultationController,
  RatingController,
} from './consultation.controller';
import { ConsultationService } from './consultation.service';

@Module({
  imports: [],
  controllers: [ConsultationController, RatingController, AdminRatingController],
  providers: [ConsultationService],
  exports: [ConsultationService],
})
export class ConsultationModule {}
