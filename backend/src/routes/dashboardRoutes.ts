import { Router } from 'express';
import {
  getTodaySales,
  getTopProducts,
  getLowStock,
  getSalesSummary,
} from '../controllers/dashboardController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';
import { requireShopAccess } from '../middleware/rbac.js';

const router = Router({ mergeParams: true });

router.get('/today-sales', authenticate, requireShopAccess, asyncHandler(getTodaySales));
router.get('/top-products', authenticate, requireShopAccess, asyncHandler(getTopProducts));
router.get('/low-stock', authenticate, requireShopAccess, asyncHandler(getLowStock));
router.get('/sales-summary', authenticate, requireShopAccess, asyncHandler(getSalesSummary));

export default router;
