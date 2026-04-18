import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { ModerateQuestionDto } from './dto/moderate-question.dto';

@ApiTags('Questions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Roles(Role.PATIENT)
  @Post()
  @ApiOperation({ summary: 'Patient creates a health question' })
  createQuestion(@CurrentUser() user: { sub: string }, @Body() dto: CreateQuestionDto) {
    return this.questionService.createQuestion(user.sub, dto);
  }

  @Roles(Role.PATIENT)
  @Get('mine')
  @ApiOperation({ summary: 'Patient lists own questions' })
  listMyQuestions(@CurrentUser() user: { sub: string }) {
    return this.questionService.listMyQuestions(user.sub);
  }

  @Roles(Role.DOCTOR)
  @Get('assigned')
  @ApiOperation({ summary: 'Doctor lists assigned/open questions' })
  listDoctorQuestions(@CurrentUser() user: { sub: string }) {
    return this.questionService.listDoctorQuestions(user.sub);
  }

  @Roles(Role.DOCTOR)
  @Post(':id/answers')
  @ApiOperation({ summary: 'Doctor answers a question' })
  answerQuestion(
    @CurrentUser() user: { sub: string },
    @Param('id') questionId: string,
    @Body() dto: CreateAnswerDto,
  ) {
    return this.questionService.answerQuestion(user.sub, questionId, dto);
  }
}

@ApiTags('Admin Questions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/questions')
export class AdminQuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Patch(':id/moderation')
  @ApiOperation({ summary: 'Admin moderates question content' })
  moderateQuestion(
    @CurrentUser() user: { sub: string },
    @Param('id') questionId: string,
    @Body() dto: ModerateQuestionDto,
  ) {
    return this.questionService.moderateQuestion(user.sub, questionId, dto);
  }
}
