import { Request, Response } from 'express';
import { z } from 'zod';
import doctorService from '../services/doctor.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../middlewares/error.middleware';
import { normalizeAnswerPayload, sanitizeTextFields } from '../utils/normalizers';
import { scheduleArraySchema } from '../utils/schedule';

// Validation schemas
export const createAnswerSchema = z.object({
  body: z.object({
    // Accept either 'content' (BE) or 'answer' (FE)
    content: z.string().optional(),
    answer: z.string().optional(),
  }).refine(data => data.content || data.answer, {
    message: 'Either content or answer is required',
  }),
});

export const updateAppointmentSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
    notes: z.string().optional(),
  }),
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

/** Schema for PATCH /doctors/me — at least one field required. */
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

/** Schema for GET /doctors/ratings pagination. */
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

/** Reusable id-param schema for appointment detail routes. */
export const doctorIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'id is required'),
  }),
});

/**
 * Validates a public doctor-profile id parameter.
 * Accepts any non-empty string — the service enforces the isActive/deletedAt
 * guard, so the controller just needs to confirm the param is present.
 */
export const publicDoctorIdParamSchema = z.object({
  id: z.string().min(1, 'id is required'),
});

/**
 * Query params for the public doctor listing endpoint used by patients.
 * All fields are optional; sensible defaults are applied in the service.
 */
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
  /**
   * Get doctor profile with stats
   * GET /doctors/me
   */
  getMe = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await doctorService.getMe(userId);
    sendSuccess(res, result);
  });

  /**
   * Get questions for doctor
   * GET /doctors/questions
   */
  getQuestions = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { status, page, limit } = req.query as any;
    const result = await doctorService.getQuestions(userId, status, page, limit);
    
    // Transform nested structure to flat structure for frontend
    const transformedQuestions = result.questions.map((q: any) => ({
      id: q.id,
      patientId: q.patientId,
      patientName: `${q.patient?.user?.firstName ?? ''} ${q.patient?.user?.lastName ?? ''}`.trim(),
      question: q.question || q.content || '',
      status: q.status?.toLowerCase() || 'pending',
      createdAt: q.createdAt,
      answer: q.answers?.[0]?.content || null,
    }));
    
    sendSuccess(res, transformedQuestions, result.pagination);
  });

  /**
   * Answer a question
   * POST /doctors/questions/:id/answers
   */
  answerQuestion = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    
    // Normalize and sanitize FE payload
    const normalizedPayload = normalizeAnswerPayload(req.body);
    const sanitizedPayload = sanitizeTextFields(normalizedPayload, ['content'], {
      content: 10000,
    });
    
    const result = await doctorService.answerQuestion(userId, id, sanitizedPayload);
    sendSuccess(res, result, undefined, 201);
  });

  /**
   * Get appointments for doctor with pagination
   * GET /doctors/appointments
   */
  getAppointments = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { status, page, limit } = req.query as {
      status?: string;
      page?: number;
      limit?: number;
    };
    const result = await doctorService.getAppointments(userId, status, page, limit);
    sendSuccess(res, result.appointments, result.pagination);
  });

  /**
   * Get a single appointment by id (doctor-owned only)
   * GET /doctors/appointments/:id
   */
  getAppointmentById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const result = await doctorService.getAppointmentById(userId, id);
    sendSuccess(res, result);
  });

  /**
   * Get ratings for doctor (VISIBLE, paginated)
   * GET /doctors/ratings
   */
  getRatings = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { page, limit } = req.query as { page?: number; limit?: number };
    const result = await doctorService.getRatings(userId, page, limit);
    sendSuccess(res, result.ratings, result.pagination);
  });

  /**
   * Update own doctor profile (bio, yearsOfExperience, specialtyId)
   * PATCH /doctors/me
   */
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await doctorService.updateProfile(userId, req.body);
    sendSuccess(res, result);
  });

  /**
   * Update appointment status
   * PUT /doctors/appointments/:id
   */
  updateAppointment = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const result = await doctorService.updateAppointment(userId, id, req.body);
    sendSuccess(res, result);
  });

  /**
   * Get doctor's schedule
   * GET /doctors/schedule
   */
  getSchedule = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await doctorService.getSchedule(userId);
    // Return schedule array directly, not wrapped in object
    const scheduleArray = result.schedule || [];
    sendSuccess(res, scheduleArray);
  });

  /**
   * Update doctor's schedule
   * POST /doctors/schedule
   */
  updateSchedule = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await doctorService.updateSchedule(userId, req.body);
    sendSuccess(res, result);
  });

  /**
   * Public doctor listing for patient booking / browsing.
   * GET /api/doctors
   *
   * AUDIT-02: replaces the admin-controller re-use.
   * Only active, non-deleted doctors are returned; no admin-only fields exposed.
   */
  getPublicDoctors = asyncHandler(async (req: Request, res: Response) => {
    const { specialtyId, page, limit } = req.query as any;
    const result = await doctorService.getPublicDoctors(specialtyId, page, limit);
    sendSuccess(res, result.doctors, result.pagination);
  });

  /**
   * Public single-doctor profile
   * GET /api/doctors/:id  (id = DoctorProfile.id, 36-char UUID)
   */
  getPublicDoctorById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await doctorService.getPublicDoctorById(id);
    sendSuccess(res, result);
  });

  /**
   * Public doctor schedule
   * GET /api/doctors/:id/schedule  (id = DoctorProfile.id, 36-char UUID)
   */
  getPublicDoctorSchedule = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await doctorService.getPublicDoctorSchedule(id);
    sendSuccess(res, result);
  });

  /**
   * Get featured doctors (public endpoint)
   * GET /doctors/featured
   * P2-3 Fix: Homepage featured doctors
   */
  getFeaturedDoctors = asyncHandler(async (_req: Request, res: Response) => {
    const result = await doctorService.getFeaturedDoctors();
    sendSuccess(res, result);
  });
}

export default new DoctorController();
