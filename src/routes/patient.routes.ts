import { Router } from 'express';
import patientController, {
  updateProfileSchema,
  createQuestionSchema,
  createAppointmentSchema,
  createRatingSchema,
  idParamSchema,
} from '../controllers/patient.controller';
import doctorController, {
  getPublicDoctorsQuerySchema,
} from '../controllers/doctor.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requirePatient } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

// Public endpoints (no auth required) for booking
// Returns only specialties that have ≥1 active doctor so patients never
// select a specialty where the question cannot be auto-assigned.
router.get('/specialties', patientController.getAvailableSpecialties);

// AUDIT-02: use dedicated public handler — filters inactive/deleted doctors,
// returns only public-safe fields, supports ?specialtyId, ?page, ?limit
router.get(
  '/doctors',
  validate({ query: getPublicDoctorsQuerySchema.shape.query }),
  doctorController.getPublicDoctors
);

// All routes below require authentication and PATIENT role
router.use(authenticate, requirePatient);

// Profile
router.get('/profile', patientController.getProfile);
router.put('/profile', validate({ body: updateProfileSchema.shape.body }), patientController.updateProfile);

// Questions
router.get('/questions', patientController.getQuestions);
router.post('/questions', validate({ body: createQuestionSchema.shape.body }), patientController.createQuestion);
// Detail — must come after the list route
router.get('/questions/:id', validate({ params: idParamSchema.shape.params }), patientController.getQuestionById);

// Appointments
router.get('/appointments', patientController.getAppointments);
router.post('/appointments', validate({ body: createAppointmentSchema.shape.body }), patientController.createAppointment);
// Cancel — registered before :id so Express does not swallow 'cancel' as an id value
router.patch('/appointments/:id/cancel', validate({ params: idParamSchema.shape.params }), patientController.cancelAppointment);
// Detail
router.get('/appointments/:id', validate({ params: idParamSchema.shape.params }), patientController.getAppointmentById);

// History
router.get('/history', patientController.getHistory);

// Ratings
router.post('/ratings', validate({ body: createRatingSchema.shape.body }), patientController.createRating);
router.get('/ratings', patientController.getRatings);

export default router;
