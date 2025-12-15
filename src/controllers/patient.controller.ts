import { Request, Response } from 'express';
import { z } from 'zod';
import patientService from '../services/patient.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler, AppError } from '../middlewares/error.middleware';

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
    
    // Normalize FE payload: 'question' -> 'title' + 'content'
    let payload;
    if (req.body.question) {
      const questionText = req.body.question;
      payload = {
        title: questionText.substring(0, 80) || 'Question',
        content: questionText,
        doctorId: req.body.doctorId,
      };
    } else {
      payload = req.body;
    }
    
    const result = await patientService.createQuestion(userId, payload);
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
    
    // Normalize FE payload: 'date' + 'time' -> 'scheduledAt'
    let payload;
    if (req.body.date && req.body.time) {
      const scheduledAt = new Date(`${req.body.date}T${req.body.time}:00.000Z`);
      payload = {
        doctorId: req.body.doctorId,
        scheduledAt,
        reason: req.body.reason || req.body.notes || 'Consultation',
        notes: req.body.notes,
      };
    } else {
      payload = {
        ...req.body,
        scheduledAt: new Date(req.body.scheduledAt),
        reason: req.body.reason || 'Consultation',
      };
    }
    
    // Validate future date
    if (payload.scheduledAt <= new Date()) {
      throw new AppError('Appointment must be scheduled in the future', 400, 'INVALID_DATE');
    }
    
    const result = await patientService.createAppointment(userId, payload);
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
    
    // Normalize FE payload: 'consultationId' -> 'appointmentId', 'rating' -> 'score'
    const payload = {
      appointmentId: req.body.appointmentId || req.body.consultationId,
      doctorId: req.body.doctorId,
      score: req.body.score || req.body.rating,
      comment: req.body.comment,
    };
    
    const result = await patientService.createRating(userId, payload);
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
