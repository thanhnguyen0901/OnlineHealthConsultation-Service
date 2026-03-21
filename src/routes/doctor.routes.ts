import { Router } from 'express';
import doctorController, {
  createAnswerSchema,
  updateAppointmentSchema,
  updateScheduleSchema,
  getQuestionsQuerySchema,
  getAppointmentsQuerySchema,
  getPatientsQuerySchema,
  updateProfileSchema,
  getRatingsQuerySchema,
  doctorIdParamSchema,
} from '../controllers/doctor.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireDoctor } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

router.use(authenticate, requireDoctor);

router.get('/me', doctorController.getMe);
router.patch('/me', validate({ body: updateProfileSchema.shape.body }), doctorController.updateProfile);

router.get('/ratings', validate({ query: getRatingsQuerySchema.shape.query }), doctorController.getRatings);

router.get('/questions', validate({ query: getQuestionsQuerySchema.shape.query }), doctorController.getQuestions);

router.post('/questions/:id/answers', validate({ body: createAnswerSchema.shape.body }), doctorController.answerQuestion);

// Legacy /answer alias: 308 preserves HTTP method and body on redirect to canonical /answers.
router.post('/questions/:id/answer', (req, res) => {
  const redirectUrl = req.originalUrl.replace(/\/answer(\?.*)?$/, '/answers$1');
  res.redirect(308, redirectUrl);
});

router.get('/appointments', validate({ query: getAppointmentsQuerySchema.shape.query }), doctorController.getAppointments);
router.get('/patients', validate({ query: getPatientsQuerySchema.shape.query }), doctorController.getPatients);
router.get('/appointments/:id', validate({ params: doctorIdParamSchema.shape.params }), doctorController.getAppointmentById);
router.put('/appointments/:id', validate({ params: doctorIdParamSchema.shape.params, body: updateAppointmentSchema.shape.body }), doctorController.updateAppointment);

router.get('/schedule', doctorController.getSchedule);
router.post('/schedule', validate({ body: updateScheduleSchema.shape.body }), doctorController.updateSchedule);

export { doctorController };

export default router;
