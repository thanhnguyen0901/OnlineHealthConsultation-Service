import { Request, Response } from 'express';
import { z } from 'zod';
import adminService from '../services/admin.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../middlewares/error.middleware';
import { normalizeRegisterPayload } from '../utils/normalizers';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    fullName: z.string().optional(),
    name: z.string().optional(),
    role: z.enum(['PATIENT', 'DOCTOR', 'ADMIN']),
    specialtyId: z.string().optional(),
    bio: z.string().optional(),
    dateOfBirth: z.string().optional().transform((val) => val ? new Date(val) : undefined),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'male', 'female', 'other'])
      .transform((val) => val.toUpperCase() as 'MALE' | 'FEMALE' | 'OTHER')
      .optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }).refine((data) => data.firstName || data.fullName || data.name, {
    message: 'firstName or a combined fullName/name field is required',
    path: ['firstName'],
  }).superRefine((data, ctx) => {
    if (data.role === 'DOCTOR' && !data.specialtyId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'specialtyId is required when role is DOCTOR',
        path: ['specialtyId'],
      });
    }
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    role: z.enum(['PATIENT', 'DOCTOR', 'ADMIN']).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateDoctorSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    name: z.string().optional(),  // legacy: split into firstName+lastName by service
    email: z.string().email().optional(),
    specialtyId: z.string().optional(),
    bio: z.string().optional(),
    yearsOfExperience: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const createSpecialtySchema = z.object({
  body: z.object({
    nameEn: z.string().min(1, 'English name is required'),
    nameVi: z.string().min(1, 'Vietnamese name is required'),
    description: z.string().optional(),
  }),
});

export const updateSpecialtySchema = z.object({
  body: z.object({
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

export const queryAppointmentsSchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val) : 20),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
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

export const queryPatientsSchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 20)),
  search: z.string().optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? val === 'true' : undefined)),
});

export const updatePatientSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const createPatientSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    dateOfBirth: z
      .string()
      .optional()
      .transform((val) => (val ? new Date(val) : undefined)),
    gender: z
      .enum(['MALE', 'FEMALE', 'OTHER', 'male', 'female', 'other'])
      .transform((val) => val.toUpperCase() as 'MALE' | 'FEMALE' | 'OTHER')
      .optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
});


export const moderateQuestionBodySchema = z.object({
  status: z.enum(['PENDING', 'ANSWERED', 'MODERATED'], {
    errorMap: () => ({ message: "status must be 'PENDING', 'ANSWERED', or 'MODERATED'" }),
  }),
});

export const moderateAnswerBodySchema = z.object({
  isApproved: z.boolean({
    required_error: 'isApproved is required',
    invalid_type_error: 'isApproved must be a boolean',
  }),
});

export const moderateRatingBodySchema = z.object({
  status: z.enum(['VISIBLE', 'HIDDEN'], {
    errorMap: () => ({ message: "status must be 'VISIBLE' or 'HIDDEN'" }),
  }),
});

export class AdminController {
  getUsers = asyncHandler(async (req: Request, res: Response) => {
    const { role, isActive, search, page, limit } = req.query as {
      role?: string;
      isActive?: boolean;
      search?: string;
      page?: number;
      limit?: number;
    };
    const result = await adminService.getUsers({ role, isActive, search, page, limit });
    sendSuccess(res, result.users, result.pagination);
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.getUserById(id);
    sendSuccess(res, result);
  });

  createUser = asyncHandler(async (req: Request, res: Response) => {
    const normalizedPayload = normalizeRegisterPayload(req.body);
    const result = await adminService.createUser(normalizedPayload);
    sendSuccess(res, result, undefined, 201);
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.updateUser(id, req.body);
    sendSuccess(res, result);
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.deleteUser(id);
    sendSuccess(res, result);
  });

  getDoctors = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const result = await adminService.getDoctors(
      page ? parseInt(page as string) : undefined,
      limit ? parseInt(limit as string) : undefined
    );
    
    const transformedDoctors = result.doctors.map((doc: any) => ({
      id: doc.user.id,
      email: doc.user.email,
      firstName: doc.user.firstName,
      lastName: doc.user.lastName,
      isActive: doc.user.isActive,
      specialtyId: doc.specialtyId,
      specialtyName: doc.specialty?.nameEn || '',
      specialtyNameVi: doc.specialty?.nameVi || '',
      bio: doc.bio,
      role: 'DOCTOR',
    }));
    
    sendSuccess(res, transformedDoctors, result.pagination);
  });

  createDoctor = asyncHandler(async (req: Request, res: Response) => {
    const result = await adminService.createDoctor(req.body);
    const transformed = {
      id: (result as any).id,
      email: (result as any).email,
      firstName: (result as any).firstName,
      lastName: (result as any).lastName,
      isActive: (result as any).isActive,
      specialtyId: (result as any).doctorProfile?.specialtyId ?? null,
      specialtyName: (result as any).doctorProfile?.specialty?.nameEn ?? '',
      specialtyNameVi: (result as any).doctorProfile?.specialty?.nameVi ?? '',
      bio: (result as any).doctorProfile?.bio ?? null,
      role: 'DOCTOR',
    };
    sendSuccess(res, transformed, undefined, 201);
  });

  updateDoctor = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.updateDoctor(id, req.body);

    const transformedDoctor = {
      id: (result as any).id,
      email: (result as any).email,
      firstName: (result as any).firstName,
      lastName: (result as any).lastName,
      isActive: (result as any).isActive,
      specialtyId: (result as any).doctorProfile?.specialtyId,
      specialtyName: (result as any).doctorProfile?.specialty?.nameEn || '',
      specialtyNameVi: (result as any).doctorProfile?.specialty?.nameVi || '',
      bio: (result as any).doctorProfile?.bio,
      role: 'DOCTOR',
    };

    sendSuccess(res, transformedDoctor);
  });

  deleteDoctor = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.deleteDoctor(id);
    sendSuccess(res, result);
  });

  getPatients = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, search, isActive } = req.query as {
      page?: number;
      limit?: number;
      search?: string;
      isActive?: boolean;
    };
    const result = await adminService.getPatients(page, limit, search, isActive);

    const transformedPatients = result.patients.map((p: any) => ({
      id: p.user.id,
      profileId: p.id,
      email: p.user.email,
      firstName: p.user.firstName,
      lastName: p.user.lastName,
      isActive: p.user.isActive,
      phone: p.phone ?? null,
      gender: p.gender ?? null,
      dateOfBirth: p.dateOfBirth ?? null,
      address: p.address ?? null,
      role: 'PATIENT',
    }));

    sendSuccess(res, transformedPatients, result.pagination);
  });

  createPatient = asyncHandler(async (req: Request, res: Response) => {
    const result = await adminService.createPatient(req.body);
    sendSuccess(res, result, undefined, 201);
  });

  updatePatient = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.updatePatient(id, req.body);
    sendSuccess(res, result);
  });

  deletePatient = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.deletePatient(id);
    sendSuccess(res, result);
  });

  getSpecialties = asyncHandler(async (_req: Request, res: Response) => {
    const result = await adminService.getSpecialties();
    sendSuccess(res, result);
  });

  createSpecialty = asyncHandler(async (req: Request, res: Response) => {
    const result = await adminService.createSpecialty(req.body);
    sendSuccess(res, result, undefined, 201);
  });

  updateSpecialty = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.updateSpecialty(id, req.body);
    sendSuccess(res, result);
  });

  deleteSpecialty = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.deleteSpecialty(id);
    sendSuccess(res, result);
  });

  getAppointments = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, status, startDate, endDate } = req.query;
    const result = await adminService.getAppointments(
      page ? parseInt(page as string) : undefined,
      limit ? parseInt(limit as string) : undefined,
      status as string | undefined,
      startDate as string | undefined,
      endDate as string | undefined
    );
    
    const transformedAppointments = result.appointments.map((apt: any) => ({
      id: apt.id,
      patientId: apt.patientId,
      patientName: `${apt.patient?.user?.firstName ?? ''} ${apt.patient?.user?.lastName ?? ''}`.trim(),
      doctorId: apt.doctorId,
      doctorName: `${apt.doctor?.user?.firstName ?? ''} ${apt.doctor?.user?.lastName ?? ''}`.trim(),
      specialtyId: apt.doctor?.specialtyId || '',
      specialtyName: apt.doctor?.specialty?.nameEn || '',
      specialtyNameVi: apt.doctor?.specialty?.nameVi || '',
      date: apt.scheduledAt,
      time: apt.scheduledAt ? new Date(apt.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
      status: apt.status?.toLowerCase() || 'pending',
      notes: apt.notes,
    }));
    
    sendSuccess(res, transformedAppointments, result.pagination);
  });

  getAppointmentById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const appointment = await adminService.getAppointmentById(id);

    const result = {
      id: appointment.id,
      patientId: appointment.patientId,
      patientName: `${(appointment as any).patient?.user?.firstName ?? ''} ${(appointment as any).patient?.user?.lastName ?? ''}`.trim(),
      patientEmail: (appointment as any).patient?.user?.email ?? null,
      doctorId: appointment.doctorId,
      doctorName: `${(appointment as any).doctor?.user?.firstName ?? ''} ${(appointment as any).doctor?.user?.lastName ?? ''}`.trim(),
      doctorEmail: (appointment as any).doctor?.user?.email ?? null,
      specialtyId: (appointment as any).doctor?.specialtyId || '',
      specialtyName: (appointment as any).doctor?.specialty?.nameEn || '',
      specialtyNameVi: (appointment as any).doctor?.specialty?.nameVi || '',
      scheduledAt: appointment.scheduledAt,
      status: appointment.status?.toLowerCase() || 'pending',
      reason: appointment.reason,
      notes: appointment.notes ?? null,
      rating: (appointment as any).rating ?? null,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    };

    sendSuccess(res, result);
  });

  updateAppointment = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await adminService.updateAppointment(id, status);

    const transformed = {
      id: (result as any).id,
      patientId: (result as any).patientId,
      patientName: `${(result as any).patient?.user?.firstName ?? ''} ${(result as any).patient?.user?.lastName ?? ''}`.trim(),
      doctorId: (result as any).doctorId,
      doctorName: `${(result as any).doctor?.user?.firstName ?? ''} ${(result as any).doctor?.user?.lastName ?? ''}`.trim(),
      specialtyId: (result as any).doctor?.specialtyId || '',
      specialtyName: (result as any).doctor?.specialty?.nameEn || '',
      specialtyNameVi: (result as any).doctor?.specialty?.nameVi || '',
      date: (result as any).scheduledAt,
      time: (result as any).scheduledAt
        ? new Date((result as any).scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : '',
      status: (result as any).status?.toLowerCase() || 'pending',
      notes: (result as any).notes,
    };

    sendSuccess(res, transformed);
  });

  archiveQuestion = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.archiveQuestion(id);
    sendSuccess(res, result);
  });

  getQuestionsForModeration = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const result = await adminService.getQuestionsForModeration(
      page ? parseInt(page as string) : undefined,
      limit ? parseInt(limit as string) : undefined
    );
    sendSuccess(res, result.questions, result.pagination);
  });

  moderateQuestion = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body as { status: 'PENDING' | 'ANSWERED' | 'MODERATED' };
    const result = await adminService.moderateQuestion(id, status);
    sendSuccess(res, result);
  });

  moderateAnswer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isApproved } = req.body as { isApproved: boolean };
    const result = await adminService.moderateAnswer(id, isApproved);
    sendSuccess(res, result);
  });

  getRatingsForModeration = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const result = await adminService.getRatingsForModeration(
      page ? parseInt(page as string) : undefined,
      limit ? parseInt(limit as string) : undefined
    );
    sendSuccess(res, result.ratings, result.pagination);
  });

  moderateRating = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body as { status: 'VISIBLE' | 'HIDDEN' };
    const result = await adminService.moderateRating(id, status);
    sendSuccess(res, result);
  });

  getModerationItems = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const result = await adminService.getModerationItems(
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 20
    );
    sendSuccess(res, result.items, result.pagination);
  });

  approveModerationItem = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.approveModerationItem(id);
    sendSuccess(res, result);
  });

  rejectModerationItem = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.rejectModerationItem(id);
    sendSuccess(res, result);
  });
}

export default new AdminController();
