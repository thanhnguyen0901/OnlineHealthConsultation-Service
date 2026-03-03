import { Router } from 'express';
import authRoutes from './auth.routes';
import patientRoutes from './patient.routes';
import doctorRoutes from './doctor.routes';
import adminRoutes from './admin.routes';
import reportRoutes from './report.routes';
// Re-exported controller instances used by shared public endpoints
import { adminController } from './admin.routes';
import { doctorController } from './doctor.routes';
import { validate } from '../middlewares/validation.middleware';
import { getPublicDoctorsQuerySchema, publicDoctorIdParamSchema } from '../controllers/doctor.controller';

const router = Router();

// ── Health check ────────────────────────────────────────────────────────────
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Online Health Consultation API',
  });
});

// ── Auth ─────────────────────────────────────────────────────────────────────
router.use('/auth', authRoutes);

// ── Public endpoints (no auth required) ─────────────────────────────────────
// Specialties listing used by patient booking pages.
router.get('/specialties', adminController.getSpecialties);

// ── Public doctor discovery ──────────────────────────────────────────────────
// GET /api/doctors — paginated list filtered by specialtyId
// MUST be before router.use('/doctors', doctorRoutes) so it is served without
// the authenticate+requireDoctor guard that doctorRoutes applies globally.
router.get(
  '/doctors',
  validate({ query: getPublicDoctorsQuerySchema.shape.query }),
  doctorController.getPublicDoctors
);

// GET /api/doctors/featured — homepage featured list (exact literal path,
// registered BEFORE the /:id wildcard below so it takes precedence).
router.get('/doctors/featured', doctorController.getFeaturedDoctors);

// AUDIT-01: /doctor/featured (singular) served by the SAME handler.
router.get('/doctor/featured', doctorController.getFeaturedDoctors);

// GET /api/doctors/:id          — public profile
// GET /api/doctors/:id/schedule — public schedule
//
// Route-parameter regex [0-9a-fA-F\-]{36} restricts :id to 36-char UUID-like
// strings (UUID v7 format used by newId()).  This prevents these wildcards from
// shadowing named segments that doctorRoutes handles with auth:
//   "me", "ratings", "questions", "appointments", "schedule"  (all ≤12 chars)
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

// ── Canonical route mounts ───────────────────────────────────────────────────
// NOTE: The public GET /doctors, GET /doctors/:id, GET /doctors/:id/schedule
// routes are registered above WITHOUT auth so they must appear before this
// mount. All other /doctors/* paths (POST, PUT, PATCH, and auth-required GETs
// like /me, /questions, /appointments, /ratings, /schedule) are handled here.
router.use('/patients', patientRoutes); // canonical plural
router.use('/doctors', doctorRoutes);   // canonical plural
router.use('/admin', adminRoutes);
router.use('/reports', reportRoutes);

// ── Legacy singular-path aliases (AUDIT-03) ──────────────────────────────────
// Redirect /api/patient/* → /api/patients/*  and
//          /api/doctor/*  → /api/doctors/*
// so that any remaining FE calls to the old singular paths keep working.
//
// GET / HEAD  → 301 Moved Permanently  (safe; clients re-issue as GET)
// Other verbs → 308 Permanent Redirect  (preserves method + body)
//
// NOTE: GET /api/doctor/featured is handled above as a direct alias and will
// never reach these middleware functions.
router.use('/patient', (req, res) => {
  const code = req.method === 'GET' || req.method === 'HEAD' ? 301 : 308;
  // req.url is the subpath + query string relative to the /patient prefix
  res.redirect(code, `/api/patients${req.url}`);
});

router.use('/doctor', (req, res) => {
  const code = req.method === 'GET' || req.method === 'HEAD' ? 301 : 308;
  res.redirect(code, `/api/doctors${req.url}`);
});

export default router;
