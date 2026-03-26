import { Router } from 'express';
import {
  createStaff,
  addStaff,
  getAllStaff,
  updateStaffRole,
  updateStaffStatus,
  deleteStaff,
} from '../controllers/staffController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validators, validate } from '../middleware/validator.js';

const router = Router({ mergeParams: true });

// Create new staff with credentials
router.post(
  '/create',
  authenticate,
  requireRole('ADMIN'),
  [
    validators.required('firstName'),
    validators.required('lastName'),
    validators.email,
    validators.required('password'),
    validators.enum('role', ['ADMIN', 'MANAGER', 'CASHIER']),
    validate,
  ],
  asyncHandler(createStaff)
);

router.post(
  '/',
  authenticate,
  requireRole('ADMIN', 'MANAGER'),
  [
    validators.email,
    validators.enum('role', ['ADMIN', 'MANAGER', 'CASHIER']),
    validate,
  ],
  asyncHandler(addStaff)
);

router.get(
  '/',
  authenticate,
  requireRole('ADMIN', 'MANAGER'),
  asyncHandler(getAllStaff)
);

router.patch(
  '/:staffId/role',
  authenticate,
  requireRole('ADMIN'),
  [validators.enum('role', ['ADMIN', 'MANAGER', 'CASHIER']), validate],
  asyncHandler(updateStaffRole)
);

router.patch(
  '/:staffId/status',
  authenticate,
  requireRole('ADMIN'),
  asyncHandler(updateStaffStatus)
);

router.delete(
  '/:staffId',
  authenticate,
  requireRole('ADMIN'),
  asyncHandler(deleteStaff)
);

export default router;
