import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole, requireShopAccess } from '../middleware/rbac.js';
import { validators, validate } from '../middleware/validator.js';

const router = Router({ mergeParams: true });

router.post(
  '/',
  authenticate,
  requireRole('ADMIN', 'MANAGER'),
  [
    validators.required('name'),
    validators.required('sku'),
    validators.positiveNumber('price'),
    validators.positiveNumber('costPrice'),
    validators.required('categoryId'),
    validate,
  ],
  asyncHandler(createProduct)
);

router.get(
  '/',
  authenticate,
  requireShopAccess,
  asyncHandler(getAllProducts)
);

router.get(
  '/:productId',
  authenticate,
  requireShopAccess,
  asyncHandler(getProductById)
);

router.patch(
  '/:productId',
  authenticate,
  requireRole('ADMIN', 'MANAGER'),
  asyncHandler(updateProduct)
);

router.delete(
  '/:productId',
  authenticate,
  requireRole('ADMIN'),
  asyncHandler(deleteProduct)
);

export default router;
