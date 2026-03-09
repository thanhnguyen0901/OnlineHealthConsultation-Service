import { Router } from 'express';
import authRoutes from './auth.routes';
import patientRoutes from './patient.routes';
import doctorRoutes from './doctor.routes';
import adminRoutes from './admin.routes';
import reportRoutes from './report.routes';
import { adminController } from './admin.routes';
import { doctorController } from './doctor.routes';
import { validate } from '../middlewares/validation.middleware';
import { getPublicDoctorsQuerySchema, publicDoctorIdParamSchema } from '../controllers/doctor.controller';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Online Health Consultation API',
  });
});

router.use('/auth', authRoutes);

router.get('/specialties', adminController.getSpecialties);

// Public /doctors routes must be registered before router.use('/doctors', doctorRoutes) to bypass auth.
router.get(
  '/doctors',
  validate({ query: getPublicDoctorsQuerySchema.shape.query }),
  doctorController.getPublicDoctors
);

// featured must be registered before the /:id wildcard below to take precedence.
router.get('/doctors/featured', doctorController.getFeaturedDoctors);
router.get('/doctor/featured', doctorController.getFeaturedDoctors);

// UUID-only regex prevents this wildcard from shadowing named segments handled by doctorRoutes with auth
// (e.g. 'me', 'ratings', 'questions', 'appointments', 'schedule' — all ≤12 chars).
const UUID_SEGMENT = '[0-9a-fA-F\\-]{36}';
router.get(
  `/doctors/:id(${UUID_SEGMENT})`,
  validate({ params: publicDoctorIdParamSchema }),
  doctorController.getPublicDoctorById
);
router.get(
  `/doctors/:id(${UUID_SEGMENT})/schedule`,
  validate({ params: publicDoctorIdParamSchema }),
  doctorController.getPublicDoctorSchedule
);

router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/admin', adminRoutes);
router.use('/reports', reportRoutes);

router.use('/patient', (req, res) => {
  const code = req.method === 'GET' || req.method === 'HEAD' ? 301 : 308;
  res.redirect(code, `/api/patients${req.url}`);
});

router.use('/doctor', (req, res) => {
  const code = req.method === 'GET' || req.method === 'HEAD' ? 301 : 308;
  res.redirect(code, `/api/doctors${req.url}`);
});

export default router;
