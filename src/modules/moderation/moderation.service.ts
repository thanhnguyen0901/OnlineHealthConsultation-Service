import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { QuestionStatus, RatingStatus } from '@prisma/client';
import { uuidv7 } from 'uuidv7';

import { PrismaService } from '../../prisma/prisma.service';
import {
  ListModerationItemsQueryDto,
  ModerationContentType,
} from './dto/list-moderation-items-query.dto';
import { ModerateContentDto, ModerationAction } from './dto/moderate-content.dto';

type ModerationItem = {
  id: string;
  entityId: string;
  type: ModerationContentType;
  status: string;
  content: string;
  contentPreview: string;
  author: string;
  authorId: string;
  createdAt: Date;
  context: Record<string, unknown>;
};

const fullName = (user?: { firstName?: string | null; lastName?: string | null; email?: string | null }) => {
  const name = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
  return name || user?.email || 'Unknown user';
};

const preview = (value: string) => value.slice(0, 180);

@Injectable()
export class ModerationService {
  constructor(private readonly prisma: PrismaService) {}

  async listItems(query: ListModerationItemsQueryDto = {}): Promise<ModerationItem[]> {
    const limit = query.limit ?? 50;
    const types = query.type
      ? [query.type]
      : [
          ModerationContentType.QUESTION,
          ModerationContentType.ANSWER,
          ModerationContentType.RATING,
        ];

    const groups = await Promise.all(
      types.map((type) => {
        if (type === ModerationContentType.QUESTION) return this.listQuestions(limit);
        if (type === ModerationContentType.ANSWER) return this.listAnswers(limit);
        return this.listRatings(limit);
      }),
    );

    return groups
      .flat()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async moderateItem(
    adminUserId: string,
    type: ModerationContentType,
    entityId: string,
    dto: ModerateContentDto,
  ) {
    const admin = await this.prisma.user.findUnique({ where: { id: adminUserId } });
    if (!admin) {
      throw new NotFoundException('Admin user not found');
    }

    if (type === ModerationContentType.QUESTION) {
      return this.moderateQuestion(adminUserId, entityId, dto);
    }
    if (type === ModerationContentType.ANSWER) {
      return this.moderateAnswer(adminUserId, entityId, dto);
    }
    if (type === ModerationContentType.RATING) {
      return this.moderateRating(adminUserId, entityId, dto);
    }

    throw new BadRequestException('Unsupported moderation content type');
  }

  private async listQuestions(limit: number): Promise<ModerationItem[]> {
    const questions = await this.prisma.question.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
        doctor: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
        answers: { select: { id: true } },
      },
    });

    return questions.map((question) => ({
      id: `${ModerationContentType.QUESTION}_${question.id}`,
      entityId: question.id,
      type: ModerationContentType.QUESTION,
      status: question.status,
      content: `${question.title}\n\n${question.content}`,
      contentPreview: preview(question.content),
      author: fullName(question.patient.user),
      authorId: question.patient.user.id,
      createdAt: question.createdAt,
      context: {
        title: question.title,
        doctor: question.doctor ? fullName(question.doctor.user) : null,
        answerCount: question.answers.length,
      },
    }));
  }

  private async listAnswers(limit: number): Promise<ModerationItem[]> {
    const answers = await this.prisma.answer.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        doctor: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
        question: {
          include: {
            patient: {
              include: {
                user: {
                  select: { id: true, firstName: true, lastName: true, email: true },
                },
              },
            },
          },
        },
      },
    });

    return answers.map((answer) => ({
      id: `${ModerationContentType.ANSWER}_${answer.id}`,
      entityId: answer.id,
      type: ModerationContentType.ANSWER,
      status: answer.isApproved ? 'APPROVED' : 'HIDDEN',
      content: answer.content,
      contentPreview: preview(answer.content),
      author: fullName(answer.doctor.user),
      authorId: answer.doctor.user.id,
      createdAt: answer.createdAt,
      context: {
        questionId: answer.questionId,
        questionTitle: answer.question.title,
        patient: fullName(answer.question.patient.user),
      },
    }));
  }

  private async listRatings(limit: number): Promise<ModerationItem[]> {
    const ratings = await this.prisma.rating.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
        doctor: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
        appointment: {
          select: { id: true, scheduledAt: true, status: true },
        },
      },
    });

    return ratings.map((rating) => ({
      id: `${ModerationContentType.RATING}_${rating.id}`,
      entityId: rating.id,
      type: ModerationContentType.RATING,
      status: rating.status,
      content: rating.comment || `Rating score: ${rating.score}/5`,
      contentPreview: preview(rating.comment || `Rating score: ${rating.score}/5`),
      author: fullName(rating.patient.user),
      authorId: rating.patient.user.id,
      createdAt: rating.createdAt,
      context: {
        score: rating.score,
        doctor: fullName(rating.doctor.user),
        appointmentId: rating.appointmentId,
        appointmentStatus: rating.appointment.status,
        scheduledAt: rating.appointment.scheduledAt,
      },
    }));
  }

  private async moderateQuestion(adminUserId: string, questionId: string, dto: ModerateContentDto) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: { answers: { select: { id: true } } },
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const status = this.resolveQuestionStatus(dto.action, question.answers.length > 0);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.question.update({
        where: { id: questionId },
        data: { status },
      });

      await tx.questionModeration.create({
        data: {
          id: uuidv7(),
          questionId,
          adminUserId,
          action: dto.action,
          reason: dto.reason,
        },
      });

      await tx.auditLog.create({
        data: {
          id: uuidv7(),
          actorUserId: adminUserId,
          action: 'QUESTION_MODERATED',
          resource: 'QUESTION',
          resourceId: questionId,
          metadata: {
            moderationAction: dto.action,
            status,
            reason: dto.reason ?? null,
          },
        },
      });

      return updated;
    });
  }

  private async moderateAnswer(adminUserId: string, answerId: string, dto: ModerateContentDto) {
    if (dto.action === ModerationAction.CLOSE) {
      throw new BadRequestException('Answer moderation does not support CLOSE');
    }

    const answer = await this.prisma.answer.findUnique({ where: { id: answerId } });
    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    const isApproved =
      dto.action === ModerationAction.APPROVE || dto.action === ModerationAction.RESTORE;

    const updated = await this.prisma.answer.update({
      where: { id: answerId },
      data: { isApproved },
    });

    await this.prisma.auditLog.create({
      data: {
        id: uuidv7(),
        actorUserId: adminUserId,
        action: 'ANSWER_MODERATED',
        resource: 'ANSWER',
        resourceId: answerId,
        metadata: {
          moderationAction: dto.action,
          isApproved,
          reason: dto.reason ?? null,
          questionId: answer.questionId,
        },
      },
    });

    return updated;
  }

  private async moderateRating(adminUserId: string, ratingId: string, dto: ModerateContentDto) {
    if (dto.action === ModerationAction.CLOSE) {
      throw new BadRequestException('Rating moderation does not support CLOSE');
    }

    const rating = await this.prisma.rating.findUnique({ where: { id: ratingId } });
    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    const status =
      dto.action === ModerationAction.HIDE ? RatingStatus.HIDDEN : RatingStatus.VISIBLE;

    const updated = await this.prisma.rating.update({
      where: { id: ratingId },
      data: { status },
    });

    await this.prisma.auditLog.create({
      data: {
        id: uuidv7(),
        actorUserId: adminUserId,
        action: 'RATING_MODERATED',
        resource: 'RATING',
        resourceId: ratingId,
        metadata: {
          moderationAction: dto.action,
          status,
          reason: dto.reason ?? null,
        },
      },
    });

    return updated;
  }

  private resolveQuestionStatus(action: ModerationAction, hasAnswer: boolean): QuestionStatus {
    if (action === ModerationAction.HIDE) return QuestionStatus.MODERATED;
    if (action === ModerationAction.CLOSE) return QuestionStatus.CLOSED;
    if (action === ModerationAction.APPROVE || action === ModerationAction.RESTORE) {
      return hasAnswer ? QuestionStatus.ANSWERED : QuestionStatus.PENDING;
    }
    throw new BadRequestException('Unsupported moderation action');
  }
}
