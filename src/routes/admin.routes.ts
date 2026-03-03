import { Router } from 'express';
import adminController, {
  createUserSchema,
  updateUserSchema,
  updateDoctorSchema,
  createSpecialtySchema,
  updateSpecialtySchema,
  queryPaginationSchema,
  queryAppointmentsSchema,
  queryUsersSchema,
  queryPatientsSchema,
  idParamSchema,
  updateAppointmentSchema,
  moderateQuestionBodySchema,
  moderateAnswerBodySchema,
  moderateRatingBodySchema,
} from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

// All routes require authentication and ADMIN role
router.use(authenticate, requireAdmin);

// NOTE (AUDIT-08): The stats endpoint has been removed from this router.
// Canonical path is GET /api/reports/stats (see src/routes/report.routes.ts).

// User management
router.get('/users', validate({ query: queryUsersSchema }), adminController.getUsers);
router.post('/users', validate({ body: createUserSchema.shape.body }), adminController.createUser);
// GET /users/:id must come BEFORE PUT/DELETE to avoid shadowing concerns
router.get('/users/:id', validate({ params: idParamSchema }), adminController.getUserById);
router.put('/users/:id', validate({ params: idParamSchema, body: updateUserSchema.shape.body }), adminController.updateUser);
router.delete('/users/:id', validate({ params: idParamSchema }), adminController.deleteUser);

// Doctor management
router.get('/doctors', validate({ query: queryPaginationSchema }), adminController.getDoctors);
router.post('/doctors', validate({ body: createUserSchema.shape.body }), adminController.createDoctor);
router.put('/doctors/:id', validate({ params: idParamSchema, body: updateDoctorSchema.shape.body }), adminController.updateDoctor);
router.delete('/doctors/:id', validate({ params: idParamSchema }), adminController.deleteDoctor);

// Patient management
router.get('/patients', validate({ query: queryPatientsSchema }), adminController.getPatients);

// Specialty management
router.get('/specialties', adminController.getSpecialties);
router.post('/specialties', validate({ body: createSpecialtySchema.shape.body }), adminController.createSpecialty);
router.put('/specialties/:id', validate({ params: idParamSchema, body: updateSpecialtySchema.shape.body }), adminController.updateSpecialty);
router.delete('/specialties/:id', validate({ params: idParamSchema }), adminController.deleteSpecialty);

// Appointment management
router.get('/appointments', validate({ query: queryAppointmentsSchema }), adminController.getAppointments);
// GET /appointments/:id detail before PUT update
router.get('/appointments/:id', validate({ params: idParamSchema }), adminController.getAppointmentById);
router.put('/appointments/:id', validate({ params: idParamSchema, body: updateAppointmentSchema.shape.body }), adminController.updateAppointment);

// Question archive (soft-delete via status=MODERATED)
router.delete('/questions/:id', validate({ params: idParamSchema }), adminController.archiveQuestion);

// Moderation
router.get('/moderation/questions', validate({ query: queryPaginationSchema }), adminController.getQuestionsForModeration);
router.patch(
  '/questions/:id/moderate',
  validate({ params: idParamSchema, body: moderateQuestionBodySchema }),
  adminController.moderateQuestion
);

router.patch(
  '/answers/:id/moderate',
  validate({ params: idParamSchema, body: moderateAnswerBodySchema }),
  adminController.moderateAnswer
);

router.get('/moderation/ratings', validate({ query: queryPaginationSchema }), adminController.getRatingsForModeration);
router.patch(
  '/ratings/:id/moderate',
  validate({ params: idParamSchema, body: moderateRatingBodySchema }),
  adminController.moderateRating
);

// Unified moderation endpoints (FE compatibility)
router.get('/moderation', validate({ query: queryPaginationSchema }), adminController.getModerationItems);
router.put('/moderation/:id/approve', validate({ params: idParamSchema }), adminController.approveModerationItem);
router.put('/moderation/:id/reject', validate({ params: idParamSchema }), adminController.rejectModerationItem);

// Export controller instance for public endpoint use
export { adminController };

export default router;
