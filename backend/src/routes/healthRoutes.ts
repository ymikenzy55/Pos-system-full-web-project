import { Router } from 'express';
import { health, ready } from '../controllers/healthController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// GET /health - Basic health check
router.get('/', asyncHandler(health));

// GET /ready - Readiness check with database
router.get('/ready', asyncHandler(ready));

export default router;
