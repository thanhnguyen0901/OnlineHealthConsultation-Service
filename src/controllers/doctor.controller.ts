import { Request, Response } from 'express';
import { z } from 'zod';
import doctorService from '../services/doctor.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../middlewares/error.middleware';
import { normalizeAnswerPayload, sanitizeTextFields } from '../utils/normalizers';
import { scheduleArraySchema } from '../utils/schedule';

export const createAnswerSchema = z.object({
  body: z.object({
    content: z.string().optional(),
    answer: z.string().optional(),
  }).refine(data => data.content || data.answer, {
    message: 'Either content or answer is required',
  }),
});

export const updateAppointmentSchema = z.object({
  body: z
    .object({
      status: z
        .string()
        .transform((s) => s.toUpperCase())
        .pipe(z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']))
        .optional(),
      notes: z.string().optional(),
      scheduledAt: z
        .string()
        .datetime({ message: 'scheduledAt must be a valid ISO 8601 datetime string' })
        .optional(),
    })
    .refine(
      (data) => data.status !== undefined || data.scheduledAt !== undefined,
      { message: 'At least one of status or scheduledAt must be provided' }
    ),
});

export const updateScheduleSchema = z.object({
  body: z.object({
    // schedule must be an array of validated day-slots (see src/utils/schedule.ts)
    schedule: scheduleArraySchema,
  }),
});

export const getQuestionsQuerySchema = z.object({
  query: z.object({
    status: z.enum(['PENDING', 'ANSWERED', 'MODERATED']).optional(),
    page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
    limit: z.string().optional().transform((val) => val ? parseInt(val) : 20),
  }),
});

export const getAppointmentsQuerySchema = z.object({
  query: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .pipe(z.number().int().min(1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 20))
      .pipe(z.number().int().min(1).max(100)),
  }),
});

export const updateProfileSchema = z.object({
  body: z
    .object({
      bio: z.string().max(2000).optional(),
      yearsOfExperience: z.number().int().min(0).max(60).optional(),
      specialtyId: z.string().uuid('specialtyId must be a valid UUID').optional(),
    })
    .refine(
      (data) => Object.values(data).some((v) => v !== undefined),
      { message: 'At least one field must be provided' }
    ),
});

export const getRatingsQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .pipe(z.number().int().min(1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 20))
      .pipe(z.number().int().min(1).max(100)),
  }),
});

export const doctorIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'id is required'),
  }),
});

export const publicDoctorIdParamSchema = z.object({
  id: z.string().min(1, 'id is required'),
});

export const getPublicDoctorsQuerySchema = z.object({
  query: z.object({
    specialtyId: z.string().optional(),
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .pipe(z.number().int().min(1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 20))
      .pipe(z.number().int().min(1).max(100)),
  }),
});

export class DoctorController {
  getMe = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await doctorService.getMe(userId);
    sendSuccess(res, result);
  });

  getQuestions = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { status, page, limit } = req.query as any;
    const result = await doctorService.getQuestions(userId, status, page, limit);
    
    const transformedQuestions = result.questions.map((q: any) => ({
      id: q.id,
      patientId: q.patientId,
      patientName: `${q.patient?.user?.firstName ?? ''} ${q.patient?.user?.lastName ?? ''}`.trim(),
      question: q.question || q.content || '',
      status: q.status?.toLowerCase() || 'pending',
      createdAt: q.createdAt,
      answer: q.answers?.[0]?.content || null,
      patientMedicalHistory: q.patient?.medicalHistory ?? null,
    }));
    
    sendSuccess(res, transformedQuestions, result.pagination);
  });

  answerQuestion = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    
    const normalizedPayload = normalizeAnswerPayload(req.body);
    const sanitizedPayload = sanitizeTextFields(normalizedPayload, ['content'], {
      content: 10000,
    });
    
    const result = await doctorService.answerQuestion(userId, id, sanitizedPayload);
    sendSuccess(res, result, undefined, 201);
  });

  getAppointments = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { status, page, limit } = req.query as {
      status?: string;
      page?: number;
      limit?: number;
    };
    const result = await doctorService.getAppointments(userId, status, page, limit);

    const transformed = result.appointments.map((a: any) => ({
      id: a.id,
      patientId: a.patientId,
      patientName: `${a.patient?.user?.firstName ?? ''} ${a.patient?.user?.lastName ?? ''}`.trim(),
      specialtyName: '',
      scheduledAt:
        a.scheduledAt instanceof Date ? a.scheduledAt.toISOString() : (a.scheduledAt ?? null),
      reason: a.reason ?? '',
      notes: a.notes ?? null,
      status: (a.status as string).toLowerCase(),
    }));

    sendSuccess(res, transformed, result.pagination);
  });

  getAppointmentById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const result = await doctorService.getAppointmentById(userId, id);
    sendSuccess(res, result);
  });

  getRatings = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { page, limit } = req.query as { page?: number; limit?: number };
    const result = await doctorService.getRatings(userId, page, limit);
    sendSuccess(res, result.ratings, result.pagination);
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await doctorService.updateProfile(userId, req.body);
    sendSuccess(res, result);
  });

  updateAppointment = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const a: any = await doctorService.updateAppointment(userId, id, req.body);
    const transformed = {
      id: a.id,
      patientId: a.patientId,
      patientName: `${a.patient?.user?.firstName ?? ''} ${a.patient?.user?.lastName ?? ''}`.trim(),
      specialtyName: '',
      scheduledAt:
        a.scheduledAt instanceof Date ? a.scheduledAt.toISOString() : (a.scheduledAt ?? null),
      reason: a.reason ?? '',
      notes: a.notes ?? null,
      status: (a.status as string).toLowerCase(),
    };
    sendSuccess(res, transformed);
  });

  getSchedule = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await doctorService.getSchedule(userId);
    const scheduleArray = result.schedule || [];
    sendSuccess(res, scheduleArray);
  });

  updateSchedule = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await doctorService.updateSchedule(userId, req.body);
    sendSuccess(res, result);
  });

  getPublicDoctors = asyncHandler(async (req: Request, res: Response) => {
    const { specialtyId, page, limit } = req.query as any;
    const result = await doctorService.getPublicDoctors(specialtyId, page, limit);
    sendSuccess(res, result.doctors, result.pagination);
  });

  getPublicDoctorById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await doctorService.getPublicDoctorById(id);
    sendSuccess(res, result);
  });

  getPublicDoctorSchedule = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await doctorService.getPublicDoctorSchedule(id);
    sendSuccess(res, result);
  });

  getFeaturedDoctors = asyncHandler(async (_req: Request, res: Response) => {
    const result = await doctorService.getFeaturedDoctors();
    sendSuccess(res, result);
  });
}

export default new DoctorController();
