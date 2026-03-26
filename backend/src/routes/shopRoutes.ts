import { Router } from 'express';
import {
  createShop,
  getMyShops,
  getShopById,
  updateShop,
} from '../controllers/shopController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';
import { requireShopAccess, requireRole } from '../middleware/rbac.js';
import { validators, validate } from '../middleware/validator.js';

const router = Router();

// POST /api/shops - Create shop
router.post(
  '/',
  authenticate,
  [
    validators.required('name'),
    validators.required('address'),
    validators.required('phone'),
    validate,
  ],
  asyncHandler(createShop)
);

// GET /api/shops/myshops - Get user's shops
router.get(
  '/myshops',
  authenticate,
  asyncHandler(getMyShops)
);

// GET /api/shops/:shopId - Get shop by ID
router.get(
  '/:shopId',
  authenticate,
  requireShopAccess,
  asyncHandler(getShopById)
);

// PATCH /api/shops/:shopId - Update shop
router.patch(
  '/:shopId',
  authenticate,
  requireRole('ADMIN', 'MANAGER'),
  asyncHandler(updateShop)
);

export default router;
