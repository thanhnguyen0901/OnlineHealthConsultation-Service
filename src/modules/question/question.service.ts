import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuestionStatus } from '@prisma/client';
import { uuidv7 } from 'uuidv7';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { ModerateQuestionDto } from './dto/moderate-question.dto';

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService) {}

  async createQuestion(userId: string, dto: CreateQuestionDto) {
    const patientProfile = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patientProfile) {
      throw new NotFoundException('Patient profile not found');
    }

    if (dto.doctorId) {
      const doctor = await this.prisma.doctorProfile.findUnique({
        where: { id: dto.doctorId },
      });
      if (!doctor || !doctor.isActive || doctor.approvalStatus !== 'APPROVED') {
        throw new BadRequestException('Doctor is not available for assignment');
      }
    }

    return this.prisma.question.create({
      data: {
        id: uuidv7(),
        patientId: patientProfile.id,
        doctorId: dto.doctorId,
        title: dto.title,
        content: dto.content,
        status: QuestionStatus.PENDING,
      },
    });
  }

  async listMyQuestions(userId: string) {
    const patientProfile = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patientProfile) {
      throw new NotFoundException('Patient profile not found');
    }

    return this.prisma.question.findMany({
      where: { patientId: patientProfile.id },
      orderBy: { createdAt: 'desc' },
      include: {
        answers: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async listDoctorQuestions(userId: string) {
    const doctorProfile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctorProfile) {
      throw new NotFoundException('Doctor profile not found');
    }

    return this.prisma.question.findMany({
      where: {
        OR: [
          { doctorId: doctorProfile.id },
          {
            doctorId: null,
            status: QuestionStatus.PENDING,
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        answers: true,
      },
    });
  }

  async answerQuestion(userId: string, questionId: string, dto: CreateAnswerDto) {
    const doctorProfile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctorProfile) {
      throw new NotFoundException('Doctor profile not found');
    }

    const question = await this.prisma.question.findUnique({ where: { id: questionId } });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (question.status !== QuestionStatus.PENDING) {
      throw new BadRequestException('Question is not in pending state');
    }

    if (question.doctorId && question.doctorId !== doctorProfile.id) {
      throw new ForbiddenException('Question is assigned to another doctor');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.question.update({
        where: { id: question.id },
        data: {
          doctorId: doctorProfile.id,
          status: QuestionStatus.ANSWERED,
        },
      });

      await tx.answer.create({
        data: {
          id: uuidv7(),
          questionId: question.id,
          doctorId: doctorProfile.id,
          content: dto.content,
          isApproved: true,
        },
      });

      await tx.outboxEvent.create({
        data: {
          id: uuidv7(),
          aggregateType: 'QUESTION',
          aggregateId: question.id,
          eventType: 'QUESTION_ANSWERED',
          payload: {
            questionId: question.id,
            doctorId: doctorProfile.id,
          },
        },
      });

      return tx.question.findUnique({
        where: { id: question.id },
        include: {
          answers: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    });
  }

  async moderateQuestion(userId: string, questionId: string, dto: ModerateQuestionDto) {
    const admin = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!admin) {
      throw new NotFoundException('Admin user not found');
    }

    const question = await this.prisma.question.findUnique({ where: { id: questionId } });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const status =
      dto.action.toUpperCase() === 'CLOSE'
        ? QuestionStatus.CLOSED
        : dto.action.toUpperCase() === 'REOPEN'
          ? QuestionStatus.PENDING
          : QuestionStatus.MODERATED;

    return this.prisma.$transaction(async (tx) => {
      await tx.question.update({
        where: { id: questionId },
        data: { status },
      });

      await tx.questionModeration.create({
        data: {
          id: uuidv7(),
          questionId,
          adminUserId: userId,
          action: dto.action,
          reason: dto.reason,
        },
      });

      await tx.auditLog.create({
        data: {
          id: uuidv7(),
          actorUserId: userId,
          action: 'QUESTION_MODERATED',
          resource: 'QUESTION',
          resourceId: questionId,
          metadata: {
            moderationAction: dto.action,
            reason: dto.reason ?? null,
          },
        },
      });

      return tx.question.findUnique({ where: { id: questionId } });
    });
  }
}
