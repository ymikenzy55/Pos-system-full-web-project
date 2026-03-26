import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export async function createCategory(req: Request, res: Response) {
  const { shopId } = req.params;
  const { name, description } = req.body;

  // Check if category with same name already exists in this shop
  const existingCategory = await prisma.category.findFirst({
    where: {
      shopId: shopId as string,
      name: {
        equals: name,
        mode: 'insensitive', // Case-insensitive comparison
      },
    },
  });

  if (existingCategory) {
    throw ApiError.conflict(`Category "${name}" already exists in this shop`);
  }

  const category = await prisma.category.create({
    data: {
      shopId: shopId as string,
      name,
      description,
    },
  });

  res.status(201).json(ApiResponse.success(category));
}

export async function getAllCategories(req: Request, res: Response) {
  const { shopId } = req.params;

  const categories = await prisma.category.findMany({
    where: { shopId: shopId as string },
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  res.json(ApiResponse.success(categories));
}

export async function deleteCategory(req: Request, res: Response) {
  const { categoryId } = req.params;

  await prisma.category.delete({
    where: { id: categoryId as string },
  });

  res.json(ApiResponse.success({ message: 'Category deleted successfully' }));
}
