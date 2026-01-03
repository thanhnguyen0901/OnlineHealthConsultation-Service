import { Router } from 'express';
import patientController, {
  updateProfileSchema,
  createQuestionSchema,
  createAppointmentSchema,
  createRatingSchema,
} from '../controllers/patient.controller';
import adminController from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requirePatient } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

// Public endpoints (no auth required) for booking
router.get('/specialties', adminController.getSpecialties);
router.get('/doctors', adminController.getDoctors);

// All routes below require authentication and PATIENT role
router.use(authenticate, requirePatient);

// Profile
router.get('/profile', patientController.getProfile);
router.put('/profile', validate({ body: updateProfileSchema.shape.body }), patientController.updateProfile);

// Questions
router.get('/questions', patientController.getQuestions);
router.post('/questions', validate({ body: createQuestionSchema.shape.body }), patientController.createQuestion);

// Appointments
router.get('/appointments', patientController.getAppointments);
router.post('/appointments', validate({ body: createAppointmentSchema.shape.body }), patientController.createAppointment);

// History
router.get('/history', patientController.getHistory);

// Ratings
router.post('/ratings', validate({ body: createRatingSchema.shape.body }), patientController.createRating);
router.get('/ratings', patientController.getRatings);

export default router;
