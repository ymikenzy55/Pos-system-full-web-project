import { Router } from 'express';
import { createSale, getSaleById } from '../controllers/salesController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';
import { requireShopAccess } from '../middleware/rbac.js';
import { validators, validate } from '../middleware/validator.js';

const router = Router({ mergeParams: true });

router.post(
  '/',
  authenticate,
  requireShopAccess,
  [
    validators.enum('paymentMethod', ['CASH', 'MOBILE_MONEY']),
    validate,
  ],
  asyncHandler(createSale)
);

router.get(
  '/:saleId',
  authenticate,
  requireShopAccess,
  asyncHandler(getSaleById)
);

export default router;
