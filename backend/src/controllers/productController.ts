import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export async function createProduct(req: Request, res: Response) {
  const { shopId } = req.params;
  const { name, sku, barcode, price, costPrice, categoryId, stock, image } = req.body;

  // Check if product with same name already exists in this shop
  const existingProductByName = await prisma.product.findFirst({
    where: {
      shopId: shopId as string,
      name: {
        equals: name,
        mode: 'insensitive',
      },
    },
  });

  if (existingProductByName) {
    throw ApiError.conflict(`Product "${name}" already exists in this shop`);
  }

  // Check if SKU already exists in this shop (SKU should be unique per shop)
  const existingProductBySku = await prisma.product.findFirst({
    where: {
      shopId: shopId as string,
      sku: sku,
    },
  });

  if (existingProductBySku) {
    throw ApiError.conflict(`Product with SKU "${sku}" already exists in this shop`);
  }

  const product = await prisma.product.create({
    data: {
      shopId: shopId as string,
      name,
      sku,
      barcode,
      price: parseFloat(price),
      costPrice: parseFloat(costPrice),
      categoryId,
      stock: stock || 0,
      image: image || null,
    },
    include: {
      category: true,
    },
  });

  res.status(201).json(ApiResponse.success(product));
}

export async function getAllProducts(req: Request, res: Response) {
  const { shopId } = req.params;

  const products = await prisma.product.findMany({
    where: { shopId: shopId as string },
    include: {
      category: true,
    },
    orderBy: { name: 'asc' },
  });

  res.json(ApiResponse.success(products));
}

export async function getProductById(req: Request, res: Response) {
  const { shopId, productId } = req.params;

  const product = await prisma.product.findFirst({
    where: {
      id: productId as string,
      shopId: shopId as string,
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  res.json(ApiResponse.success(product));
}

export async function updateProduct(req: Request, res: Response) {
  const { productId } = req.params;
  const { name, sku, price, costPrice, stock, categoryId, barcode, image } = req.body;

  const updateData: any = {};
  if (name !== undefined) updateData.name = name;
  if (sku !== undefined) updateData.sku = sku;
  if (price !== undefined) updateData.price = parseFloat(price);
  if (costPrice !== undefined) updateData.costPrice = parseFloat(costPrice);
  if (stock !== undefined) updateData.stock = parseInt(stock);
  if (categoryId !== undefined) updateData.categoryId = categoryId;
  if (barcode !== undefined) updateData.barcode = barcode;
  if (image !== undefined) updateData.image = image;

  const product = await prisma.product.update({
    where: { id: productId as string },
    data: updateData,
    include: {
      category: true,
    },
  });

  res.json(ApiResponse.success(product));
}

export async function deleteProduct(req: Request, res: Response) {
  const { productId } = req.params;

  await prisma.product.delete({
    where: { id: productId as string },
  });

  res.json(ApiResponse.success({ message: 'Product deleted successfully' }));
}
