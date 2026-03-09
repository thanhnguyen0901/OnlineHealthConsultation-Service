import { Router } from 'express';
import reportController, {
  getReportsQuerySchema,
  dateRangeQuerySchema,
  topDoctorsQuerySchema,
} from '../controllers/report.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

router.use(authenticate, requireRole(['ADMIN', 'DOCTOR']));

// Must be registered first; /stats and /statistics would otherwise shadow this base route.
router.get('/', validate({ query: getReportsQuerySchema }), reportController.getReports);

router.get('/stats', reportController.getOverallStats);
router.get('/stats/consultations', validate({ query: dateRangeQuerySchema }), reportController.getConsultationsStats);
router.get('/stats/active-users',  validate({ query: dateRangeQuerySchema }), reportController.getActiveUsersStats);

router.get('/statistics', reportController.getStatistics);
router.get('/appointments-chart',  validate({ query: dateRangeQuerySchema }), reportController.getAppointmentsChart);
router.get('/questions-chart',     validate({ query: dateRangeQuerySchema }), reportController.getQuestionsChart);
router.get('/top-doctors',         validate({ query: topDoctorsQuerySchema }), reportController.getTopRatedDoctors);
router.get('/specialty-distribution', reportController.getSpecialtyDistribution);

export default router;
