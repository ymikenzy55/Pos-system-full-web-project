import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export async function restockProduct(req: Request, res: Response) {
  const { shopId } = req.params;
  const { productId, quantity, note } = req.body;
  const userId = req.user!.id;

  const result = await prisma.$transaction(async (tx) => {
    // Update product stock
    const product = await tx.product.update({
      where: { id: productId },
      data: {
        stock: {
          increment: quantity,
        },
      },
    });

    // Create stock movement
    await tx.stockMovement.create({
      data: {
        shopId: shopId as string,
        productId,
        type: 'RESTOCK',
        quantity,
        userId,
        note,
      },
    });

    return product;
  });

  res.json(ApiResponse.success(result));
}

export async function adjustInventory(req: Request, res: Response) {
  const { shopId } = req.params;
  const { productId, quantity, reason } = req.body;
  const userId = req.user!.id;

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  if (product.stock + quantity < 0) {
    throw ApiError.badRequest('Adjustment would result in negative stock');
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedProduct = await tx.product.update({
      where: { id: productId },
      data: {
        stock: {
          increment: quantity,
        },
      },
    });

    await tx.stockMovement.create({
      data: {
        shopId: shopId as string,
        productId,
        type: 'ADJUSTMENT',
        quantity,
        userId,
        note: reason,
      },
    });

    return updatedProduct;
  });

  res.json(ApiResponse.success(result));
}
