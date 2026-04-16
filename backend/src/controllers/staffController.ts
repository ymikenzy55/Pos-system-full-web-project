import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../config/database.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/env.js';

// Create new staff member with credentials
export async function createStaff(req: Request, res: Response) {
  const { shopId } = req.params;
  const { firstName, lastName, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw ApiError.conflict('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);

  // Create user and staff member in transaction
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    const staffMember = await tx.staffMember.create({
      data: {
        userId: user.id,
        shopId: shopId as string,
        role: role || 'CASHIER',
        isActive: true,
      },
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
    });

    return staffMember;
  });

  res.status(201).json(ApiResponse.success(result));
}

export async function addStaff(req: Request, res: Response) {
  const { shopId } = req.params;
  const { email, role } = req.body;

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw ApiError.notFound('User with this email not found. They must register first.');
  }

  // Check if already staff
  const existing = await prisma.staffMember.findFirst({
    where: {
      userId: user.id,
      shopId: shopId as string,
    },
  });

  if (existing) {
    throw ApiError.conflict('User is already a staff member of this shop');
  }

  const staffMember = await prisma.staffMember.create({
    data: {
      userId: user.id,
      shopId: shopId as string,
      role: role || 'CASHIER',
      isActive: true,
    },
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
  });

  res.status(201).json(ApiResponse.success(staffMember));
}

export async function getAllStaff(req: Request, res: Response) {
  const { shopId } = req.params;

  const staff = await prisma.staffMember.findMany({
    where: { shopId: shopId as string },
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
    orderBy: { createdAt: 'desc' },
  });

  res.json(ApiResponse.success(staff));
}

export async function updateStaffRole(req: Request, res: Response) {
  const { staffId } = req.params;
  const { role } = req.body;

  // Check if the requesting user is super admin
  const requestingUser = await prisma.user.findUnique({
    where: { id: req.user!.id },
  });

  if (requestingUser?.email !== 'admin@store.com') {
    throw ApiError.forbidden('Only the super admin can change staff roles');
  }

  const staffMember = await prisma.staffMember.update({
    where: { id: staffId as string },
    data: { role },
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
  });

  res.json(ApiResponse.success(staffMember));
}

export async function updateStaffStatus(req: Request, res: Response) {
  const { staffId } = req.params;
  const { isActive } = req.body;

  const staffMember = await prisma.staffMember.update({
    where: { id: staffId as string },
    data: { isActive },
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
  });

  res.json(ApiResponse.success(staffMember));
}

export async function deleteStaff(req: Request, res: Response) {
  const { staffId } = req.params;

  // Check if staff member exists
  const staffMember = await prisma.staffMember.findUnique({
    where: { id: staffId as string },
    include: {
      user: true,
      sales: { take: 1 }, // Check if they have any sales
      refunds: { take: 1 }, // Check if they have any refunds
    },
  });

  if (!staffMember) {
    throw ApiError.notFound('Staff member not found');
  }

  // Check if staff member has associated sales or refunds
  if (staffMember.sales.length > 0 || staffMember.refunds.length > 0) {
    // Instead of deleting, deactivate the staff member
    const deactivated = await prisma.staffMember.update({
      where: { id: staffId as string },
      data: { isActive: false },
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
    });

    res.json(
      ApiResponse.success({
        ...deactivated,
        message: 'Staff member has transaction history and has been deactivated instead of deleted',
      })
    );
    return;
  }

  // If no sales or refunds, safe to delete
  await prisma.staffMember.delete({
    where: { id: staffId as string },
  });

  res.json(ApiResponse.success({ message: 'Staff member removed successfully' }));
}
