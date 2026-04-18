import { Module } from '@nestjs/common';
import { AdminQuestionController, QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
  controllers: [QuestionController, AdminQuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
