import { Router } from 'express';
import authController, { registerSchema, loginSchema } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { authRateLimiter, refreshRateLimiter, logoutRateLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

router.post('/register', authRateLimiter, validate({ body: registerSchema.shape.body }), authController.register);
router.post('/login',    authRateLimiter, validate({ body: loginSchema.shape.body }),    authController.login);

// /refresh and /logout read req.cookies.refreshToken only; body.refreshToken is rejected with 400.
router.post('/refresh', refreshRateLimiter, authController.refresh);
router.post('/logout',  logoutRateLimiter,  authController.logout);

router.get('/me', authenticate, authController.me);

export default router;
