import { Router } from 'express';
import authRoutes from './auth.routes';
import patientRoutes from './patient.routes';
import doctorRoutes from './doctor.routes';
import adminRoutes from './admin.routes';
import reportRoutes from './report.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Online Health Consultation API',
  });
});

// Mount routes
router.use('/auth', authRoutes);

// Mount patient routes under both plural and singular paths (FE compatibility)
router.use('/patients', patientRoutes);
router.use('/patient', patientRoutes); // Alias for frontend

// Mount doctor routes under both plural and singular paths (FE compatibility)
router.use('/doctors', doctorRoutes);
router.use('/doctor', doctorRoutes); // Alias for frontend

router.use('/admin', adminRoutes);
router.use('/reports', reportRoutes);

export default router;
