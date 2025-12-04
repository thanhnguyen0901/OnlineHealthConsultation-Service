import { Request, Response } from 'express';
import { z } from 'zod';
import patientService from '../services/patient.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../middlewares/error.middleware';

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
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    doctorId: z.string().optional(),
  }),
});

export const createAppointmentSchema = z.object({
  body: z.object({
    doctorId: z.string().min(1, 'Doctor ID is required'),
    scheduledAt: z.string().transform((val) => new Date(val)),
    reason: z.string().min(1, 'Reason is required'),
  }),
});

export const createRatingSchema = z.object({
  body: z.object({
    appointmentId: z.string().min(1, 'Appointment ID is required'),
    doctorId: z.string().min(1, 'Doctor ID is required'),
    score: z.number().int().min(1).max(5),
    comment: z.string().optional(),
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
    const result = await patientService.createQuestion(userId, req.body);
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
    const result = await patientService.createAppointment(userId, req.body);
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
    const result = await patientService.createRating(userId, req.body);
    sendSuccess(res, result, undefined, 201);
  });
}

export default new PatientController();
