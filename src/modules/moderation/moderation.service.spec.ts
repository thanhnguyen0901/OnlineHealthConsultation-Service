import { BadRequestException, NotFoundException } from '@nestjs/common';
import { QuestionStatus, RatingStatus } from '@prisma/client';

import { ModerationContentType } from './dto/list-moderation-items-query.dto';
import { ModerationAction } from './dto/moderate-content.dto';
import { ModerationService } from './moderation.service';

const now = new Date('2026-01-01T08:00:00.000Z');

const user = (id: string, firstName: string, lastName: string, email = `${id}@example.test`) => ({
  id,
  firstName,
  lastName,
  email,
});

const createPrismaMock = () => {
  const tx: any = {
    question: {
      update: jest.fn(),
    },
    questionModeration: {
      create: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
  };

  const prisma: any = {
    user: {
      findUnique: jest.fn(),
    },
    question: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    answer: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    rating: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
    $transaction: jest.fn(async (callback: (transaction: typeof tx) => unknown) => callback(tx)),
  };

  return { prisma, tx };
};

describe('ModerationService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lists reviewable questions, answers, and ratings with context', async () => {
    const { prisma } = createPrismaMock();
    prisma.question.findMany.mockResolvedValue([
      {
        id: 'question-1',
        title: 'Chest pain',
        content: 'What should I do?',
        status: QuestionStatus.PENDING,
        createdAt: now,
        patient: { user: user('patient-user-1', 'Pat', 'One') },
        doctor: { user: user('doctor-user-1', 'Doc', 'One') },
        answers: [{ id: 'answer-1' }],
      },
    ]);
    prisma.answer.findMany.mockResolvedValue([
      {
        id: 'answer-1',
        questionId: 'question-1',
        content: 'Please book an appointment.',
        isApproved: true,
        createdAt: new Date('2026-01-01T09:00:00.000Z'),
        doctor: { user: user('doctor-user-1', 'Doc', 'One') },
        question: {
          title: 'Chest pain',
          patient: { user: user('patient-user-1', 'Pat', 'One') },
        },
      },
    ]);
    prisma.rating.findMany.mockResolvedValue([
      {
        id: 'rating-1',
        score: 5,
        comment: 'Helpful doctor',
        status: RatingStatus.VISIBLE,
        createdAt: new Date('2026-01-01T10:00:00.000Z'),
        patientId: 'patient-1',
        doctorId: 'doctor-1',
        appointmentId: 'appointment-1',
        patient: { user: user('patient-user-1', 'Pat', 'One') },
        doctor: { user: user('doctor-user-1', 'Doc', 'One') },
        appointment: {
          id: 'appointment-1',
          status: 'COMPLETED',
          scheduledAt: now,
        },
      },
    ]);
    const service = new ModerationService(prisma);

    const result = await service.listItems();

    expect(result.map((item) => item.type)).toEqual([
      ModerationContentType.RATING,
      ModerationContentType.ANSWER,
      ModerationContentType.QUESTION,
    ]);
    expect(result[0]).toMatchObject({
      id: 'RATING_rating-1',
      entityId: 'rating-1',
      author: 'Pat One',
      contentPreview: 'Helpful doctor',
      context: {
        score: 5,
        doctor: 'Doc One',
        appointmentId: 'appointment-1',
      },
    });
  });

  it('hides a question and records moderation/audit logs', async () => {
    const { prisma, tx } = createPrismaMock();
    prisma.user.findUnique.mockResolvedValue({ id: 'admin-user-1' });
    prisma.question.findUnique.mockResolvedValue({
      id: 'question-1',
      answers: [],
    });
    tx.question.update.mockResolvedValue({ id: 'question-1', status: QuestionStatus.MODERATED });
    const service = new ModerationService(prisma);

    await service.moderateItem('admin-user-1', ModerationContentType.QUESTION, 'question-1', {
      action: ModerationAction.HIDE,
      reason: 'Unsafe advice',
    });

    expect(tx.question.update).toHaveBeenCalledWith({
      where: { id: 'question-1' },
      data: { status: QuestionStatus.MODERATED },
    });
    expect(tx.questionModeration.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        questionId: 'question-1',
        adminUserId: 'admin-user-1',
        action: ModerationAction.HIDE,
        reason: 'Unsafe advice',
      }),
    });
    expect(tx.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        actorUserId: 'admin-user-1',
        action: 'QUESTION_MODERATED',
        resource: 'QUESTION',
        resourceId: 'question-1',
      }),
    });
  });

  it('restores an answered question back to ANSWERED instead of PENDING', async () => {
    const { prisma, tx } = createPrismaMock();
    prisma.user.findUnique.mockResolvedValue({ id: 'admin-user-1' });
    prisma.question.findUnique.mockResolvedValue({
      id: 'question-1',
      answers: [{ id: 'answer-1' }],
    });
    tx.question.update.mockResolvedValue({ id: 'question-1', status: QuestionStatus.ANSWERED });
    const service = new ModerationService(prisma);

    await service.moderateItem('admin-user-1', ModerationContentType.QUESTION, 'question-1', {
      action: ModerationAction.RESTORE,
    });

    expect(tx.question.update).toHaveBeenCalledWith({
      where: { id: 'question-1' },
      data: { status: QuestionStatus.ANSWERED },
    });
  });

  it('approves and hides answers using the existing isApproved field', async () => {
    const { prisma } = createPrismaMock();
    prisma.user.findUnique.mockResolvedValue({ id: 'admin-user-1' });
    prisma.answer.findUnique.mockResolvedValue({
      id: 'answer-1',
      questionId: 'question-1',
    });
    prisma.answer.update.mockResolvedValue({ id: 'answer-1', isApproved: true });
    const service = new ModerationService(prisma);

    await service.moderateItem('admin-user-1', ModerationContentType.ANSWER, 'answer-1', {
      action: ModerationAction.APPROVE,
    });

    expect(prisma.answer.update).toHaveBeenCalledWith({
      where: { id: 'answer-1' },
      data: { isApproved: true },
    });
    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        actorUserId: 'admin-user-1',
        action: 'ANSWER_MODERATED',
        resource: 'ANSWER',
        resourceId: 'answer-1',
      }),
    });
  });

  it('hides ratings by setting RatingStatus.HIDDEN and writes audit log', async () => {
    const { prisma } = createPrismaMock();
    prisma.user.findUnique.mockResolvedValue({ id: 'admin-user-1' });
    prisma.rating.findUnique.mockResolvedValue({ id: 'rating-1' });
    prisma.rating.update.mockResolvedValue({ id: 'rating-1', status: RatingStatus.HIDDEN });
    const service = new ModerationService(prisma);

    await service.moderateItem('admin-user-1', ModerationContentType.RATING, 'rating-1', {
      action: ModerationAction.HIDE,
    });

    expect(prisma.rating.update).toHaveBeenCalledWith({
      where: { id: 'rating-1' },
      data: { status: RatingStatus.HIDDEN },
    });
    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        actorUserId: 'admin-user-1',
        action: 'RATING_MODERATED',
        resource: 'RATING',
        resourceId: 'rating-1',
      }),
    });
  });

  it('rejects missing admin or unsupported close action for ratings', async () => {
    const { prisma } = createPrismaMock();
    const service = new ModerationService(prisma);

    prisma.user.findUnique.mockResolvedValue(null);
    await expect(
      service.moderateItem('missing-admin', ModerationContentType.RATING, 'rating-1', {
        action: ModerationAction.HIDE,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);

    prisma.user.findUnique.mockResolvedValue({ id: 'admin-user-1' });
    prisma.rating.findUnique.mockResolvedValue({ id: 'rating-1' });
    await expect(
      service.moderateItem('admin-user-1', ModerationContentType.RATING, 'rating-1', {
        action: ModerationAction.CLOSE,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
