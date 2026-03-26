import { Router } from 'express';
import { createCustomer, getAllCustomers, getCustomerById, deleteCustomer } from '../controllers/customerController.js';
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
    validators.required('phone'),
    validate,
  ],
  asyncHandler(createCustomer)
);

router.get(
  '/',
  authenticate,
  requireShopAccess,
  asyncHandler(getAllCustomers)
);

router.get(
  '/:customerId',
  authenticate,
  requireShopAccess,
  asyncHandler(getCustomerById)
);

router.delete(
  '/:customerId',
  authenticate,
  requireRole('ADMIN'),
  asyncHandler(deleteCustomer)
);

export default router;
