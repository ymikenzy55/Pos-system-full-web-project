import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validators, validate } from '../middleware/validator.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  authRateLimiter,
  [
    validators.required('firstName'),
    validators.required('lastName'),
    validators.email,
    validators.password,
    validate,
  ],
  asyncHandler(register)
);

// POST /api/auth/login
router.post(
  '/login',
  authRateLimiter,
  [
    validators.email,
    validators.password,
    validate,
  ],
  asyncHandler(login)
);

export default router;
