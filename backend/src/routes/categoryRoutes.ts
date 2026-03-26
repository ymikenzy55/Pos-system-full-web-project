import { Router } from 'express';
import { createCategory, getAllCategories, deleteCategory } from '../controllers/categoryController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole, requireShopAccess } from '../middleware/rbac.js';
import { validators, validate } from '../middleware/validator.js';

const router = Router({ mergeParams: true });

router.post(
  '/',
  authenticate,
  requireRole('ADMIN', 'MANAGER'),
  [validators.required('name'), validate],
  asyncHandler(createCategory)
);

router.get(
  '/',
  authenticate,
  requireShopAccess,
  asyncHandler(getAllCategories)
);

router.delete(
  '/:categoryId',
  authenticate,
  requireRole('ADMIN'),
  asyncHandler(deleteCategory)
);

export default router;
