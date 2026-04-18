import { Module } from '@nestjs/common';

import { AdminOperationsController, OperationsController } from './operations.controller';
import { OperationsService } from './operations.service';

@Module({
  imports: [],
  controllers: [OperationsController, AdminOperationsController],
  providers: [OperationsService],
  exports: [OperationsService],
})
export class OperationsModule {}
