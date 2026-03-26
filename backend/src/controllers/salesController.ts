import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export async function createSale(req: Request, res: Response) {
  const { shopId } = req.params;
  const { paymentMethod, items } = req.body;
  const staffMember = (req as any).staffMember;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw ApiError.badRequest('Items array is required and must not be empty');
  }

  if (!paymentMethod) {
    throw ApiError.badRequest('Payment method is required');
  }

  // Validate items structure
  for (const item of items) {
    if (!item.productId) {
      throw ApiError.badRequest('Each item must have a productId');
    }
    if (!item.quantity || item.quantity <= 0) {
      throw ApiError.badRequest('Each item must have a valid quantity');
    }
  }

  // Fetch all products in one query
  const productIds = items.map((item: any) => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      shopId: shopId as string,
    },
  });

  // Create a map for quick lookup
  const productMap = new Map(products.map(p => [p.id, p]));

  // Validate stock and calculate totals
  const itemsWithPrices = items.map((item: any) => {
    const product = productMap.get(item.productId);
    
    if (!product) {
      throw ApiError.notFound(`Product ${item.productId} not found`);
    }

    if (product.stock < item.quantity) {
      throw ApiError.badRequest(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
    }

    return {
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: product.price,
      totalPrice: product.price * item.quantity,
    };
  });

  const totalAmount = itemsWithPrices.reduce((sum, item) => sum + item.totalPrice, 0);

  // Create sale with transaction - batch operations
  const sale = await prisma.$transaction(async (tx) => {
    // Create sale with items in one operation
    const newSale = await tx.sale.create({
      data: {
        shopId: shopId as string,
        staffMemberId: staffMember.id,
        paymentMethod,
        totalAmount,
        items: {
          create: itemsWithPrices,
        },
      },
    });

    // Batch update stock for all products
    await Promise.all(
      itemsWithPrices.map(item =>
        tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );

    // Batch create stock movements
    await tx.stockMovement.createMany({
      data: itemsWithPrices.map(item => ({
        shopId: shopId as string,
        productId: item.productId,
        type: 'SALE' as const,
        quantity: -item.quantity,
        userId: staffMember.userId,
        saleId: newSale.id,
      })),
    });

    return newSale;
  });

  res.status(201).json(ApiResponse.success(sale));
}

export async function getSaleById(req: Request, res: Response) {
  const { shopId, saleId } = req.params;

  const sale = await prisma.sale.findFirst({
    where: {
      id: saleId as string,
      shopId: shopId as string,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      staffMember: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  if (!sale) {
    throw ApiError.notFound('Sale not found');
  }

  res.json(ApiResponse.success(sale));
}
