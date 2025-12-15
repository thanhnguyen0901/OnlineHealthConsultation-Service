import { Router } from 'express';
import adminController, {
  createUserSchema,
  updateUserSchema,
  createSpecialtySchema,
  updateSpecialtySchema,
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
router.get('/users', adminController.getUsers);
router.post('/users', validate(createUserSchema), adminController.createUser);
router.put('/users/:id', validate(updateUserSchema), adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Doctor management
router.get('/doctors', adminController.getDoctors);
router.post('/doctors', validate(createUserSchema), adminController.createDoctor);
router.put('/doctors/:id', validate(updateUserSchema), adminController.updateDoctor);
router.delete('/doctors/:id', adminController.deleteDoctor);

// Patient management
router.get('/patients', adminController.getPatients);

// Specialty management
router.get('/specialties', adminController.getSpecialties);
router.post('/specialties', validate(createSpecialtySchema), adminController.createSpecialty);
router.put('/specialties/:id', validate(updateSpecialtySchema), adminController.updateSpecialty);
router.delete('/specialties/:id', adminController.deleteSpecialty);

// Appointment management
router.get('/appointments', adminController.getAppointments);
router.put('/appointments/:id', adminController.updateAppointment);

// Moderation
router.get('/moderation/questions', adminController.getQuestionsForModeration);
router.patch('/questions/:id/moderate', adminController.moderateQuestion);

router.patch('/answers/:id/moderate', adminController.moderateAnswer);

router.get('/moderation/ratings', adminController.getRatingsForModeration);
router.patch('/ratings/:id/moderate', adminController.moderateRating);

// Unified moderation endpoints (FE compatibility)
router.get('/moderation', adminController.getModerationItems);
router.put('/moderation/:id/approve', adminController.approveModerationItem);
router.put('/moderation/:id/reject', adminController.rejectModerationItem);

export default router;
