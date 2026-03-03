import { Router } from 'express';
import authController, { registerSchema, loginSchema } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { authRateLimiter, refreshRateLimiter, logoutRateLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

// Public routes with rate limiting
router.post('/register', authRateLimiter, validate({ body: registerSchema.shape.body }), authController.register);
router.post('/login',    authRateLimiter, validate({ body: loginSchema.shape.body }),    authController.login);

// Cookie-only endpoints — no body validation middleware.
// /refresh: reads req.cookies.refreshToken; rejects body.refreshToken with 400 (AUDIT-04).
// /logout:  reads req.cookies.refreshToken; no body expected.
router.post('/refresh', refreshRateLimiter, authController.refresh);
router.post('/logout',  logoutRateLimiter,  authController.logout); // ISSUE-06: rate limiter added

// Protected routes
router.get('/me', authenticate, authController.me);

export default router;
