import { Router } from 'express';
import reportController, { getReportsQuerySchema } from '../controllers/report.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

// All routes require authentication and ADMIN role
router.use(authenticate, requireAdmin);

// Aggregated reports endpoint (MUST BE FIRST - before /stats, /statistics, etc.)
router.get('/', validate({ query: getReportsQuerySchema }), reportController.getReports);

// Admin statistics endpoints
router.get('/stats', reportController.getOverallStats);
router.get('/stats/consultations', reportController.getConsultationsStats);
router.get('/stats/active-users', reportController.getActiveUsersStats);

// General reports endpoints (can be accessed by admin)
router.get('/statistics', reportController.getStatistics);
router.get('/appointments-chart', reportController.getAppointmentsChart);
router.get('/questions-chart', reportController.getQuestionsChart);
router.get('/top-doctors', reportController.getTopRatedDoctors);
router.get('/specialty-distribution', reportController.getSpecialtyDistribution);

export default router;
