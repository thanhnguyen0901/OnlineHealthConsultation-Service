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

// Only specialties with ≥1 active doctor are returned so patients cannot select an unassignable specialty.
router.get('/specialties', patientController.getAvailableSpecialties);

router.get(
  '/doctors',
  validate({ query: getPublicDoctorsQuerySchema.shape.query }),
  doctorController.getPublicDoctors
);

router.use(authenticate, requirePatient);

router.get('/profile', patientController.getProfile);
router.put('/profile', validate({ body: updateProfileSchema.shape.body }), patientController.updateProfile);

router.get('/questions', patientController.getQuestions);
router.post('/questions', validate({ body: createQuestionSchema.shape.body }), patientController.createQuestion);
router.get('/questions/:id', validate({ params: idParamSchema.shape.params }), patientController.getQuestionById);

router.get('/appointments', patientController.getAppointments);
router.post('/appointments', validate({ body: createAppointmentSchema.shape.body }), patientController.createAppointment);
// cancel must be registered before :id or Express would match 'cancel' as a literal id.
router.patch('/appointments/:id/cancel', validate({ params: idParamSchema.shape.params }), patientController.cancelAppointment);
router.get('/appointments/:id', validate({ params: idParamSchema.shape.params }), patientController.getAppointmentById);

router.get('/history', patientController.getHistory);

router.post('/ratings', validate({ body: createRatingSchema.shape.body }), patientController.createRating);
router.get('/ratings', patientController.getRatings);

export default router;
