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
    dateOfBirth: z.string().optional().transform((val) => val ? new Date(val) : undefined),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
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
    reason: z.string().optional(),
    notes: z.string().optional(),
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
    sendSuccess(res, result);
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
}

export default new PatientController();