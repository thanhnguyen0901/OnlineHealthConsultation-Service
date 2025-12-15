import { Router } from 'express';
import adminController, {
  createUserSchema,
  updateUserSchema,
  createSpecialtySchema,
  updateSpecialtySchema,
  queryPaginationSchema,
  queryUsersSchema,
  idParamSchema,
  updateAppointmentSchema,
} from '../controllers/admin.controller';
import reportController from '../controllers/report.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

// All routes require authentication and ADMIN role
router.use(authenticate, requireAdmin);

// Stats (alias for FE compatibility)
router.get('/stats', reportController.getOverallStats);

// User management
router.get('/users', validate({ query: queryUsersSchema }), adminController.getUsers);
router.post('/users', validate({ body: createUserSchema.shape.body }), adminController.createUser);
router.put('/users/:id', validate({ params: idParamSchema, body: updateUserSchema.shape.body }), adminController.updateUser);
router.delete('/users/:id', validate({ params: idParamSchema }), adminController.deleteUser);

// Doctor management
router.get('/doctors', validate({ query: queryPaginationSchema }), adminController.getDoctors);
router.post('/doctors', validate({ body: createUserSchema.shape.body }), adminController.createDoctor);
router.put('/doctors/:id', validate({ params: idParamSchema, body: updateUserSchema.shape.body }), adminController.updateDoctor);
router.delete('/doctors/:id', validate({ params: idParamSchema }), adminController.deleteDoctor);

// Patient management
router.get('/patients', validate({ query: queryPaginationSchema }), adminController.getPatients);

// Specialty management
router.get('/specialties', adminController.getSpecialties);
router.post('/specialties', validate({ body: createSpecialtySchema.shape.body }), adminController.createSpecialty);
router.put('/specialties/:id', validate({ params: idParamSchema, body: updateSpecialtySchema.shape.body }), adminController.updateSpecialty);
router.delete('/specialties/:id', validate({ params: idParamSchema }), adminController.deleteSpecialty);

// Appointment management
router.get('/appointments', validate({ query: queryPaginationSchema }), adminController.getAppointments);
router.put('/appointments/:id', validate({ params: idParamSchema, body: updateAppointmentSchema.shape.body }), adminController.updateAppointment);

// Moderation
router.get('/moderation/questions', validate({ query: queryPaginationSchema }), adminController.getQuestionsForModeration);
router.patch('/questions/:id/moderate', validate({ params: idParamSchema }), adminController.moderateQuestion);

router.patch('/answers/:id/moderate', validate({ params: idParamSchema }), adminController.moderateAnswer);

router.get('/moderation/ratings', validate({ query: queryPaginationSchema }), adminController.getRatingsForModeration);
router.patch('/ratings/:id/moderate', validate({ params: idParamSchema }), adminController.moderateRating);

// Unified moderation endpoints (FE compatibility)
router.get('/moderation', validate({ query: queryPaginationSchema }), adminController.getModerationItems);
router.put('/moderation/:id/approve', validate({ params: idParamSchema }), adminController.approveModerationItem);
router.put('/moderation/:id/reject', validate({ params: idParamSchema }), adminController.rejectModerationItem);

export default router;
