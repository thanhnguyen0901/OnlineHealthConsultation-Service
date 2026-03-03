import { Router } from 'express';
import doctorController, {
  createAnswerSchema,
  updateAppointmentSchema,
  updateScheduleSchema,
  getQuestionsQuerySchema,
  getAppointmentsQuerySchema,
  updateProfileSchema,
  getRatingsQuerySchema,
  doctorIdParamSchema,
} from '../controllers/doctor.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireDoctor } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

// All routes require authentication and DOCTOR role
router.use(authenticate, requireDoctor);

// Profile
router.get('/me', doctorController.getMe);
router.patch('/me', validate({ body: updateProfileSchema.shape.body }), doctorController.updateProfile);

// Ratings
router.get('/ratings', validate({ query: getRatingsQuerySchema.shape.query }), doctorController.getRatings);

// Questions
router.get('/questions', validate({ query: getQuestionsQuerySchema.shape.query }), doctorController.getQuestions);

// Canonical answer endpoint: POST /api/doctors/questions/:id/answers
router.post('/questions/:id/answers', validate({ body: createAnswerSchema.shape.body }), doctorController.answerQuestion);

// AUDIT-03: legacy singular alias POST /api/doctors/questions/:id/answer
// → 308 Permanent Redirect to canonical /answers (308 preserves method + body).
// Remove this block once the frontend is confirmed to use /answers everywhere.
router.post('/questions/:id/answer', (req, res) => {
  // Replace the trailing /answer (with optional query string) with /answers
  const redirectUrl = req.originalUrl.replace(/\/answer(\?.*)?$/, '/answers$1');
  res.redirect(308, redirectUrl);
});

// Appointments
router.get('/appointments', validate({ query: getAppointmentsQuerySchema.shape.query }), doctorController.getAppointments);
// GET detail BEFORE PUT update to avoid any potential ordering ambiguity
router.get('/appointments/:id', validate({ params: doctorIdParamSchema.shape.params }), doctorController.getAppointmentById);
router.put('/appointments/:id', validate({ params: doctorIdParamSchema.shape.params, body: updateAppointmentSchema.shape.body }), doctorController.updateAppointment);

// Schedule
router.get('/schedule', doctorController.getSchedule);
router.post('/schedule', validate({ body: updateScheduleSchema.shape.body }), doctorController.updateSchedule);

// Export controller instance for public endpoint use
export { doctorController };

export default router;
