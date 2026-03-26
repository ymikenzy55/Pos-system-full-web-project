import { Router } from 'express';
import { restockProduct, adjustInventory } from '../controllers/inventoryController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validators, validate } from '../middleware/validator.js';

const router = Router({ mergeParams: true });

router.post(
  '/restock',
  authenticate,
  requireRole('ADMIN', 'MANAGER'),
  [
    validators.required('productId'),
    validators.positiveInteger('quantity'),
    validate,
  ],
  asyncHandler(restockProduct)
);

router.post(
  '/adjust',
  authenticate,
  requireRole('ADMIN', 'MANAGER'),
  [
    validators.required('productId'),
    validators.required('reason'),
    validate,
  ],
  asyncHandler(adjustInventory)
);

export default router;
