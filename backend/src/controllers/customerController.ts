import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export async function createCustomer(req: Request, res: Response) {
  const { shopId } = req.params;
  const { name, phone } = req.body;

  // Validate phone number (must be 10 digits)
  if (phone) {
    const phoneDigits = phone.replace(/\D/g, '');
    
    if (phoneDigits.length !== 10) {
      throw ApiError.badRequest('Phone number must be exactly 10 digits');
    }
  }

  // Check if customer with same phone already exists in this shop
  if (phone) {
    const existingCustomerByPhone = await prisma.customer.findFirst({
      where: {
        shopId: shopId as string,
        phone: phone,
      },
    });

    if (existingCustomerByPhone) {
      // Return existing customer instead of throwing error
      res.status(200).json(ApiResponse.success(existingCustomerByPhone));
      return;
    }
  }

  const customer = await prisma.customer.create({
    data: {
      shopId: shopId as string,
      name,
      phone,
    },
  });

  res.status(201).json(ApiResponse.success(customer));
}

export async function getAllCustomers(req: Request, res: Response) {
  const { shopId } = req.params;

  const customers = await prisma.customer.findMany({
    where: { shopId: shopId as string },
    include: {
      sales: {
        orderBy: { createdAt: 'desc' },
        take: 1, // Get the most recent sale
      },
      _count: {
        select: { sales: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Add lastPurchaseDate and calculate totalSpent for each customer
  const customersWithLastPurchase = customers.map(customer => {
    // Calculate total spent by summing all sales
    const totalSpent = customer.totalSpent || 0;
    
    return {
      ...customer,
      lastPurchaseDate: customer.sales[0]?.createdAt || null,
      totalSpent,
    };
  });

  res.json(ApiResponse.success(customersWithLastPurchase));
}

export async function getCustomerById(req: Request, res: Response) {
  const { shopId, customerId } = req.params;

  const customer = await prisma.customer.findFirst({
    where: {
      id: customerId as string,
      shopId: shopId as string,
    },
    include: {
      sales: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!customer) {
    throw ApiError.notFound('Customer not found');
  }

  res.json(ApiResponse.success(customer));
}

export async function deleteCustomer(req: Request, res: Response) {
  const { shopId, customerId } = req.params;

  // Check if customer exists
  const customer = await prisma.customer.findFirst({
    where: {
      id: customerId as string,
      shopId: shopId as string,
    },
    include: {
      _count: {
        select: { sales: true },
      },
    },
  });

  if (!customer) {
    throw ApiError.notFound('Customer not found');
  }

  // Check if customer has sales
  if (customer._count.sales > 0 || customer.totalSpent > 0) {
    throw ApiError.badRequest(`Cannot delete customer with purchase history. Customer has ${customer._count.sales} sales totaling ${customer.totalSpent}.`);
  }

  await prisma.customer.delete({
    where: { id: customerId as string },
  });

  res.json(ApiResponse.success({ message: 'Customer deleted successfully' }));
}
