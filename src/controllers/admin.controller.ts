import { Request, Response } from 'express';
import { z } from 'zod';
import adminService from '../services/admin.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../middlewares/error.middleware';

// Validation schemas
export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    fullName: z.string().min(1, 'Full name is required'),
    role: z.enum(['PATIENT', 'DOCTOR', 'ADMIN']),
    specialtyId: z.string().optional(),
    bio: z.string().optional(),
    dateOfBirth: z.string().optional().transform((val) => val ? new Date(val) : undefined),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    fullName: z.string().optional(),
    role: z.enum(['PATIENT', 'DOCTOR', 'ADMIN']).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const createSpecialtySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
  }),
});

export const updateSpecialtySchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export class AdminController {
  /**
   * Get all users
   * GET /admin/users
   */
  getUsers = asyncHandler(async (req: Request, res: Response) => {
    const { role, isActive, search, page, limit } = req.query;
    const result = await adminService.getUsers({
      role: role as string,
      isActive: isActive === 'true',
      search: search as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    sendSuccess(res, result.users, result.pagination);
  });

  /**
   * Create a new user
   * POST /admin/users
   */
  createUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await adminService.createUser(req.body);
    sendSuccess(res, result, undefined, 201);
  });

  /**
   * Update a user
   * PUT /admin/users/:id
   */
  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.updateUser(id, req.body);
    sendSuccess(res, result);
  });

  /**
   * Delete (deactivate) a user
   * DELETE /admin/users/:id
   */
  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.deleteUser(id);
    sendSuccess(res, result);
  });

  /**
   * Get all doctors
   * GET /admin/doctors
   */
  getDoctors = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const result = await adminService.getDoctors(
      page ? parseInt(page as string) : undefined,
      limit ? parseInt(limit as string) : undefined
    );
    sendSuccess(res, result.doctors, result.pagination);
  });

  /**
   * Get all patients
   * GET /admin/patients
   */
  getPatients = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const result = await adminService.getPatients(
      page ? parseInt(page as string) : undefined,
      limit ? parseInt(limit as string) : undefined
    );
    sendSuccess(res, result.patients, result.pagination);
  });

  /**
   * Get all specialties
   * GET /admin/specialties
   */
  getSpecialties = asyncHandler(async (req: Request, res: Response) => {
    const result = await adminService.getSpecialties();
    sendSuccess(res, result);
  });

  /**
   * Create a specialty
   * POST /admin/specialties
   */
  createSpecialty = asyncHandler(async (req: Request, res: Response) => {
    const result = await adminService.createSpecialty(req.body);
    sendSuccess(res, result, undefined, 201);
  });

  /**
   * Update a specialty
   * PUT /admin/specialties/:id
   */
  updateSpecialty = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.updateSpecialty(id, req.body);
    sendSuccess(res, result);
  });

  /**
   * Delete a specialty
   * DELETE /admin/specialties/:id
   */
  deleteSpecialty = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.deleteSpecialty(id);
    sendSuccess(res, result);
  });

  /**
   * Get all appointments
   * GET /admin/appointments
   */
  getAppointments = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const result = await adminService.getAppointments(
      page ? parseInt(page as string) : undefined,
      limit ? parseInt(limit as string) : undefined
    );
    sendSuccess(res, result.appointments, result.pagination);
  });

  /**
   * Update an appointment
   * PUT /admin/appointments/:id
   */
  updateAppointment = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await adminService.updateAppointment(id, status);
    sendSuccess(res, result);
  });

  /**
   * Get questions for moderation
   * GET /admin/moderation/questions
   */
  getQuestionsForModeration = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const result = await adminService.getQuestionsForModeration(
      page ? parseInt(page as string) : undefined,
      limit ? parseInt(limit as string) : undefined
    );
    sendSuccess(res, result.questions, result.pagination);
  });

  /**
   * Moderate a question
   * PATCH /admin/questions/:id/moderate
   */
  moderateQuestion = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await adminService.moderateQuestion(id, status);
    sendSuccess(res, result);
  });

  /**
   * Moderate an answer
   * PATCH /admin/answers/:id/moderate
   */
  moderateAnswer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isApproved } = req.body;
    const result = await adminService.moderateAnswer(id, isApproved);
    sendSuccess(res, result);
  });

  /**
   * Get ratings for moderation
   * GET /admin/moderation/ratings
   */
  getRatingsForModeration = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const result = await adminService.getRatingsForModeration(
      page ? parseInt(page as string) : undefined,
      limit ? parseInt(limit as string) : undefined
    );
    sendSuccess(res, result.ratings, result.pagination);
  });

  /**
   * Moderate a rating
   * PATCH /admin/ratings/:id/moderate
   */
  moderateRating = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await adminService.moderateRating(id, status);
    sendSuccess(res, result);
  });
}

export default new AdminController();
