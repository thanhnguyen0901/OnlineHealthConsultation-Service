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
router.get('/questions', validate(getQuestionsQuerySchema), doctorController.getQuestions);
router.post('/questions/:id/answers', validate(createAnswerSchema), doctorController.answerQuestion);
// Alias for FE compatibility (singular 'answer')
router.post('/questions/:id/answer', validate(createAnswerSchema), doctorController.answerQuestion);

// Appointments
router.get('/appointments', validate(getAppointmentsQuerySchema), doctorController.getAppointments);
router.put('/appointments/:id', validate(updateAppointmentSchema), doctorController.updateAppointment);

// Schedule
router.get('/schedule', doctorController.getSchedule);
router.post('/schedule', validate(updateScheduleSchema), doctorController.updateSchedule);

export default router;
