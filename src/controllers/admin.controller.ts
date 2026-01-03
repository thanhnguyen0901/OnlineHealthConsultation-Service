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
    gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'male', 'female', 'other'])
      .transform((val) => val.toUpperCase() as 'MALE' | 'FEMALE' | 'OTHER')
      .optional(),
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
    nameEn: z.string().min(1, 'English name is required'),
    nameVi: z.string().min(1, 'Vietnamese name is required'),
    description: z.string().optional(),
  }),
});

export const updateSpecialtySchema = z.object({
  body: z.object({
    name: z.string().optional(),
    nameEn: z.string().optional(),
    nameVi: z.string().optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const queryPaginationSchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val) : 20),
});

export const queryUsersSchema = z.object({
  role: z.enum(['PATIENT', 'DOCTOR', 'ADMIN']).optional(),
  isActive: z.string().optional().transform((val) => val !== undefined ? val === 'true' : undefined),
  search: z.string().optional(),
  page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val) : 20),
});

export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const updateAppointmentSchema = z.object({
  body: z.object({
    status: z.enum([
      'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED',
      'pending', 'confirmed', 'completed', 'cancelled'
    ])
      .transform((val) => val.toUpperCase() as 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED')
      .optional(),
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
      isActive: isActive as boolean | undefined,
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
    
    // Transform doctorProfile structure to flat structure for frontend
    const transformedDoctors = result.doctors.map((doc: any) => ({
      id: doc.user.id,
      email: doc.user.email,
      fullName: doc.user.fullName,
      isActive: doc.user.isActive,
      specialtyId: doc.specialtyId,
      specialtyName: doc.specialty?.name || '',
      bio: doc.bio,
      role: 'DOCTOR',
    }));
    
    sendSuccess(res, transformedDoctors, result.pagination);
  });

  /**
   * Create a doctor (FE compatibility)
   * POST /admin/doctors
   */
  createDoctor = asyncHandler(async (req: Request, res: Response) => {
    const result = await adminService.createDoctor(req.body);
    sendSuccess(res, result, undefined, 201);
  });

  /**
   * Update a doctor (FE compatibility)
   * PUT /admin/doctors/:id
   */
  updateDoctor = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.updateDoctor(id, req.body);
    sendSuccess(res, result);
  });

  /**
   * Delete a doctor (FE compatibility)
   * DELETE /admin/doctors/:id
   */
  deleteDoctor = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.deleteDoctor(id);
    sendSuccess(res, result);
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
  getSpecialties = asyncHandler(async (_req: Request, res: Response) => {
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
    
    // Transform nested structure to flat structure for frontend
    const transformedAppointments = result.appointments.map((apt: any) => ({
      id: apt.id,
      patientId: apt.patientId,
      patientName: apt.patient?.user?.fullName || '',
      doctorId: apt.doctorId,
      doctorName: apt.doctor?.user?.fullName || '',
      specialtyId: apt.doctor?.specialtyId || '',
      specialtyName: apt.doctor?.specialty?.name || '',
      date: apt.scheduledAt,
      time: apt.scheduledAt ? new Date(apt.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
      status: apt.status?.toLowerCase() || 'pending',
      notes: apt.notes,
    }));
    
    sendSuccess(res, transformedAppointments, result.pagination);
  });

  /**
   * Update an appointment
   * PUT /admin/appointments/:id
   */
  updateAppointment = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    // Status is already normalized to uppercase by validation schema
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

  /**
   * Get unified moderation items (FE compatibility)
   * GET /admin/moderation
   */
  getModerationItems = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const result = await adminService.getModerationItems(
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 20
    );
    sendSuccess(res, result.items, result.pagination);
  });

  /**
   * Approve a moderation item (FE compatibility)
   * PUT /admin/moderation/:id/approve
   */
  approveModerationItem = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.approveModerationItem(id);
    sendSuccess(res, result);
  });

  /**
   * Reject a moderation item (FE compatibility)
   * PUT /admin/moderation/:id/reject
   */
  rejectModerationItem = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.rejectModerationItem(id);
    sendSuccess(res, result);
  });
}

export default new AdminController();
