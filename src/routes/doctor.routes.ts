import { Router } from 'express';
import doctorController, {
  createAnswerSchema,
  updateAppointmentSchema,
  updateScheduleSchema,
  getQuestionsQuerySchema,
  getAppointmentsQuerySchema,
} from '../controllers/doctor.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireDoctor } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

// All routes require authentication and DOCTOR role
router.use(authenticate, requireDoctor);

// Profile
router.get('/me', doctorController.getMe);

// Questions
router.get('/questions', validate({ query: getQuestionsQuerySchema.shape.query }), doctorController.getQuestions);
router.post('/questions/:id/answers', validate({ body: createAnswerSchema.shape.body }), doctorController.answerQuestion);
// Alias for FE compatibility (singular 'answer')
router.post('/questions/:id/answer', validate({ body: createAnswerSchema.shape.body }), doctorController.answerQuestion);

// Appointments
router.get('/appointments', validate({ query: getAppointmentsQuerySchema.shape.query }), doctorController.getAppointments);
router.put('/appointments/:id', validate({ body: updateAppointmentSchema.shape.body }), doctorController.updateAppointment);

// Schedule
router.get('/schedule', doctorController.getSchedule);
router.post('/schedule', validate({ body: updateScheduleSchema.shape.body }), doctorController.updateSchedule);

// Export controller instance for public endpoint use
export { doctorController };

export default router;
