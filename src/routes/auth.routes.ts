import { Router } from 'express';
import authController, { registerSchema, loginSchema, refreshSchema } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { authRateLimiter, refreshRateLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

// Public routes with rate limiting
router.post('/register', authRateLimiter, validate({ body: registerSchema.shape.body }), authController.register);
router.post('/login', authRateLimiter, validate({ body: loginSchema.shape.body }), authController.login);
router.post('/refresh', refreshRateLimiter, validate({ body: refreshSchema.shape.body }), authController.refresh);
router.post('/logout', validate({ body: refreshSchema.shape.body }), authController.logout);

// Protected routes
router.get('/me', authenticate, authController.me);

export default router;
