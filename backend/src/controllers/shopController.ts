import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

// Create new shop
export async function createShop(req: Request, res: Response) {
  const { name, address, phone } = req.body;
  const userId = req.user!.id;

  // Create shop and assign creator as Admin staff member
  const shop = await prisma.shop.create({
    data: {
      name,
      address,
      phone,
      staff: {
        create: {
          userId,
          role: 'ADMIN',
          isActive: true,
        },
      },
    },
    include: {
      staff: {
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
  });

  logger.info(`Shop created: ${shop.name} by user ${userId}`);

  res.status(201).json(ApiResponse.success(shop));
}

// Get all shops where user is a staff member
export async function getMyShops(req: Request, res: Response) {
  const userId = req.user!.id;

  const staffMembers = await prisma.staffMember.findMany({
    where: { userId },
    include: {
      shop: true,
    },
  });

  const shops = staffMembers.map(sm => ({
    ...sm.shop,
    role: sm.role,
    isActive: sm.isActive,
  }));

  res.json(ApiResponse.success(shops));
}

// Get shop by ID
export async function getShopById(req: Request, res: Response) {
  const { shopId } = req.params;

  const shop = await prisma.shop.findUnique({
    where: { id: shopId as string },
    include: {
      staff: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
      _count: {
        select: {
          products: true,
          customers: true,
          sales: true,
        },
      },
    },
  });

  if (!shop) {
    throw ApiError.notFound('Shop not found');
  }

  res.json(ApiResponse.success(shop));
}

// Update shop
export async function updateShop(req: Request, res: Response) {
  const { shopId } = req.params;
  const { name, address, phone } = req.body;

  const shop = await prisma.shop.update({
    where: { id: shopId as string },
    data: {
      ...(name && { name }),
      ...(address && { address }),
      ...(phone && { phone }),
    },
  });

  logger.info(`Shop updated: ${shopId}`);

  res.json(ApiResponse.success(shop));
}
