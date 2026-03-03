import { Router } from 'express';
import reportController, {
  getReportsQuerySchema,
  dateRangeQuerySchema,
  topDoctorsQuerySchema,
} from '../controllers/report.controller';
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
router.get('/stats/consultations', validate({ query: dateRangeQuerySchema }), reportController.getConsultationsStats);
router.get('/stats/active-users',  validate({ query: dateRangeQuerySchema }), reportController.getActiveUsersStats);

// General reports endpoints (can be accessed by admin)
router.get('/statistics', reportController.getStatistics);
router.get('/appointments-chart',  validate({ query: dateRangeQuerySchema }), reportController.getAppointmentsChart);
router.get('/questions-chart',     validate({ query: dateRangeQuerySchema }), reportController.getQuestionsChart);
router.get('/top-doctors',         validate({ query: topDoctorsQuerySchema }), reportController.getTopRatedDoctors);
router.get('/specialty-distribution', reportController.getSpecialtyDistribution);

export default router;
