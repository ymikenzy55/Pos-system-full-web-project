import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { prisma } from '../config/database.js';

export type Role = 'ADMIN' | 'MANAGER' | 'CASHIER';

// Check if user has required role for a shop
export function requireRole(...allowedRoles: Role[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const { shopId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw ApiError.unauthorized('User not authenticated');
      }

      if (!shopId) {
        throw ApiError.badRequest('Shop ID is required');
      }

      // Find staff member record
      const staffMember = await prisma.staffMember.findFirst({
        where: {
          userId,
          shopId: shopId as string,
        },
      });

      if (!staffMember) {
        throw ApiError.forbidden('You do not have access to this shop');
      }

      if (!staffMember.isActive) {
        throw ApiError.forbidden('Your account is inactive');
      }

      if (!allowedRoles.includes(staffMember.role as Role)) {
        throw ApiError.forbidden(`This action requires one of the following roles: ${allowedRoles.join(', ')}`);
      }

      // Attach staff member to request for later use
      (req as any).staffMember = staffMember;

      next();
    } catch (error) {
      next(error);
    }
  };
}

// Check if user has access to a shop (any role)
export async function requireShopAccess(req: Request, _res: Response, next: NextFunction) {
  try {
    const { shopId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw ApiError.unauthorized('User not authenticated');
    }

    if (!shopId) {
      throw ApiError.badRequest('Shop ID is required');
    }

    // Find staff member record
    const staffMember = await prisma.staffMember.findFirst({
      where: {
        userId,
        shopId: shopId as string,
      },
    });

    if (!staffMember) {
      throw ApiError.forbidden('You do not have access to this shop');
    }

    if (!staffMember.isActive) {
      throw ApiError.forbidden('Your account is inactive');
    }

    // Attach staff member to request
    (req as any).staffMember = staffMember;

    next();
  } catch (error) {
    next(error);
  }
}
