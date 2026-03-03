import { Request, Response } from 'express';
import { z } from 'zod';
import patientService from '../services/patient.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler, AppError } from '../middlewares/error.middleware';
import {
  normalizeQuestionPayload,
  normalizeAppointmentPayload,
  normalizeRatingPayload,
  sanitizeTextFields,
} from '../utils/normalizers';
import { ERROR_CODES } from '../constants/errorCodes';

// Validation schemas
export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    dateOfBirth: z.string().optional().transform((val) => val ? new Date(val) : undefined),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'male', 'female', 'other'])
      .transform((val) => val.toUpperCase() as 'MALE' | 'FEMALE' | 'OTHER')
      .optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    medicalHistory: z.string().optional(),
  }),
});

export const createQuestionSchema = z.object({
  body: z.object({
    // Accept either 'question' (FE) or 'title+content' (BE)
    question: z.string().optional(),
    title: z.string().optional(),
    content: z.string().optional(),
    doctorId: z.string().optional(),
  }).refine(data => data.question || (data.title && data.content), {
    message: 'Either question or both title and content are required',
  }),
});

export const createAppointmentSchema = z.object({
  body: z.object({
    doctorId: z.string().min(1, 'Doctor ID is required'),
    // Accept either 'scheduledAt' (BE) or 'date+time' (FE)
    scheduledAt: z.string().optional(),
    date: z.string().optional(),
    time: z.string().optional(),
    // AUDIT-05: reason is TEXT NOT NULL in the DB; require it here so the
    // client receives 400 (not a 500 Prisma constraint error) when it is absent.
    reason: z.string().min(1, 'Reason for appointment is required'),
    notes: z.string().optional(),
    /** Slot duration in minutes. Omit to use server default (60). Min 15, max 480. */
    durationMinutes: z.number().int().min(15).max(480).optional(),
  }).refine(data => data.scheduledAt || (data.date && data.time), {
    message: 'Either scheduledAt or both date and time are required',
  }),
});

export const createRatingSchema = z.object({
  body: z.object({
    // Accept either 'appointmentId' (BE) or 'consultationId' (FE)
    appointmentId: z.string().optional(),
    consultationId: z.string().optional(),
    doctorId: z.string().min(1, 'Doctor ID is required'),
    // Accept either 'score' (BE) or 'rating' (FE)
    score: z.number().int().min(1).max(5).optional(),
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().optional(),
  }).refine(data => data.appointmentId || data.consultationId, {
    message: 'Either appointmentId or consultationId is required',
  }).refine(data => data.score || data.rating, {
    message: 'Either score or rating is required',
  }),
});

/** Validates the :id route parameter (UUID / CUID). */
export const idParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID is required'),
  }),
});

export class PatientController {
  /**
   * Get patient profile
   * GET /patients/profile
   */
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await patientService.getProfile(userId);
    sendSuccess(res, result);
  });

  /**
   * Update patient profile
   * PUT /patients/profile
   */
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await patientService.updateProfile(userId, req.body);
    sendSuccess(res, result);
  });

  /**
   * Get all questions created by patient
   * GET /patients/questions
   */
  getQuestions = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await patientService.getQuestions(userId);
    sendSuccess(res, result);
  });

  /**
   * Create a new question
   * POST /patients/questions
   */
  createQuestion = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    
    // Normalize and sanitize FE payload
    const normalizedPayload = normalizeQuestionPayload(req.body);
    const sanitizedPayload = sanitizeTextFields(normalizedPayload, ['title', 'content'], {
      title: 255,
      content: 10000,
    });
    
    const result = await patientService.createQuestion(userId, sanitizedPayload);
    sendSuccess(res, result, undefined, 201);
  });

  /**
   * Get all appointments for patient
   * GET /patients/appointments
   */
  getAppointments = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await patientService.getAppointments(userId);
    sendSuccess(res, result);
  });

  /**
   * Create a new appointment
   * POST /patients/appointments
   */
  createAppointment = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    
    // Normalize and sanitize FE payload
    const normalizedPayload = normalizeAppointmentPayload(req.body);
    const sanitizedPayload = sanitizeTextFields(normalizedPayload, ['reason', 'notes'], {
      reason: 1000,
      notes: 2000,
    });
    
    // Validate future date
    if (sanitizedPayload.scheduledAt <= new Date()) {
      throw new AppError('Appointment must be scheduled in the future', 400, ERROR_CODES.INVALID_DATE);
    }
    
    const result = await patientService.createAppointment(userId, sanitizedPayload);
    sendSuccess(res, result, undefined, 201);
  });

  /**
   * Get patient consultation history
   * GET /patients/history
   */
  getHistory = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await patientService.getHistory(userId);
    
    // Transform nested structure to flat structure for frontend
    const transformedQuestions = result.questions.map((q: any) => ({
      id: q.id,
      question: q.content || '',
      status: q.status?.toLowerCase() || 'pending',
      createdAt: q.createdAt,
      doctorId: q.doctorId || '',
      doctorName: `${q.doctor?.user?.firstName ?? ''} ${q.doctor?.user?.lastName ?? ''}`.trim(),
      answer: q.answers?.[0]?.content || null,
    }));
    
    const transformedAppointments = result.appointments.map((a: any) => ({
      id: a.id,
      doctorId: a.doctorId || '',
      doctorName: `${a.doctor?.user?.firstName ?? ''} ${a.doctor?.user?.lastName ?? ''}`.trim(),
      date: a.scheduledAt,
      status: a.status?.toLowerCase() || '',
      reason: a.reason || '',
      notes: a.notes || '',
      hasRating: a.rating != null,
    }));
    
    sendSuccess(res, {
      questions: transformedQuestions,
      appointments: transformedAppointments,
    });
  });

  /**
   * Create a rating for a doctor
   * POST /patients/ratings
   */
  createRating = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    
    // Normalize and sanitize FE payload
    const normalizedPayload = normalizeRatingPayload(req.body);
    const sanitizedPayload = sanitizeTextFields(normalizedPayload, ['comment'], {
      comment: 2000,
    });
    
    const result = await patientService.createRating(userId, sanitizedPayload);
    sendSuccess(res, result, undefined, 201);
  });

  /**
   * Get all ratings by patient
   * GET /patients/ratings
   */
  getRatings = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await patientService.getRatings(userId);
    sendSuccess(res, result);
  });

  /**
   * Get a single question with approved answers and doctor info.
   * GET /patients/questions/:id
   */
  getQuestionById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const result = await patientService.getQuestionById(userId, id);
    sendSuccess(res, result);
  });

  /**
   * Get a single appointment with doctor and specialty info.
   * GET /patients/appointments/:id
   */
  getAppointmentById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const result = await patientService.getAppointmentById(userId, id);
    sendSuccess(res, result);
  });

  /**
   * Cancel a patient's own PENDING or CONFIRMED appointment.
   * PATCH /patients/appointments/:id/cancel
   */
  cancelAppointment = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const result = await patientService.cancelAppointment(userId, id);
    sendSuccess(res, result);
  });
}

export default new PatientController();