import { Request, Response } from 'express';
import { z } from 'zod';
import doctorService from '../services/doctor.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../middlewares/error.middleware';
import { normalizeAnswerPayload, sanitizeTextFields } from '../utils/normalizers';

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
    schedule: z.any(), // Can be any valid JSON structure
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
    sendSuccess(res, result.questions, result.pagination);
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
   * Get appointments for doctor
   * GET /doctors/appointments
   */
  getAppointments = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { status } = req.query as any;
    const result = await doctorService.getAppointments(userId, status);
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
    sendSuccess(res, result);
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
}

export default new DoctorController();
