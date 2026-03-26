import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export async function getTodaySales(req: Request, res: Response) {
  const { shopId } = req.params;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sales = await prisma.sale.findMany({
    where: {
      shopId: shopId as string,
      createdAt: {
        gte: today,
      },
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const transactionCount = sales.length;
  const itemsSold = sales.reduce((sum, sale) => 
    sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );

  res.json(ApiResponse.success({
    totalRevenue,
    transactionCount,
    itemsSold,
    date: today.toISOString(),
    sales,
  }));
}

export async function getTopProducts(req: Request, res: Response) {
  const { shopId } = req.params;
  const limit = parseInt(req.query.limit as string) || 10;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const topProducts = await prisma.saleItem.groupBy({
    by: ['productId'],
    where: {
      sale: {
        shopId: shopId as string,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    },
    _sum: {
      quantity: true,
      totalPrice: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: limit,
  });

  // Fetch product details in a single query
  const productIds = topProducts.map(item => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    select: {
      id: true,
      name: true,
      sku: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const productMap = new Map(products.map(p => [p.id, p]));

  const productsWithDetails = topProducts.map((item) => ({
    product: productMap.get(item.productId),
    quantitySold: item._sum.quantity,
    totalRevenue: item._sum.totalPrice,
  }));

  res.json(ApiResponse.success(productsWithDetails));
}

export async function getLowStock(req: Request, res: Response) {
  const { shopId } = req.params;

  // Get products with stock less than or equal to 10 (low stock threshold)
  const lowStockProducts = await prisma.product.findMany({
    where: {
      shopId: shopId as string,
      stock: {
        lte: 10, // Low stock threshold
      },
    },
    include: {
      category: true,
    },
    orderBy: {
      stock: 'asc',
    },
  });

  res.json(ApiResponse.success(lowStockProducts));
}

export async function getSalesSummary(req: Request, res: Response) {
  const { shopId } = req.params;
  const { startDate, endDate } = req.query;

  const whereClause: any = {
    shopId: shopId as string,
  };

  if (startDate || endDate) {
    whereClause.createdAt = {};
    if (startDate) {
      whereClause.createdAt.gte = new Date(startDate as string);
    }
    if (endDate) {
      const end = new Date(endDate as string);
      end.setHours(23, 59, 59, 999);
      whereClause.createdAt.lte = end;
    }
  }

  const sales = await prisma.sale.findMany({
    where: whereClause,
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
      staffMember: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalOrders = sales.length;

  // Group by date
  const salesByDate = sales.reduce((acc, sale) => {
    const date = new Date(sale.createdAt).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { date, revenue: 0, orders: 0 };
    }
    acc[date].revenue += sale.totalAmount;
    acc[date].orders += 1;
    return acc;
  }, {} as Record<string, { date: string; revenue: number; orders: number }>);

  // Group by category
  const salesByCategory = sales.reduce((acc, sale) => {
    sale.items.forEach((item) => {
      const categoryName = item.product.category?.name || 'Uncategorized';
      if (!acc[categoryName]) {
        acc[categoryName] = { category: categoryName, revenue: 0, quantity: 0 };
      }
      acc[categoryName].revenue += item.totalPrice;
      acc[categoryName].quantity += item.quantity;
    });
    return acc;
  }, {} as Record<string, { category: string; revenue: number; quantity: number }>);

  // Group by payment method
  const salesByPaymentMethod = sales.reduce((acc, sale) => {
    const method = sale.paymentMethod;
    if (!acc[method]) {
      acc[method] = { method, revenue: 0, orders: 0 };
    }
    acc[method].revenue += sale.totalAmount;
    acc[method].orders += 1;
    return acc;
  }, {} as Record<string, { method: string; revenue: number; orders: number }>);

  res.json(ApiResponse.success({
    summary: {
      totalRevenue,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    },
    salesByDate: Object.values(salesByDate),
    salesByCategory: Object.values(salesByCategory),
    salesByPaymentMethod: Object.values(salesByPaymentMethod),
    sales,
  }));
}
