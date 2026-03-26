import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

// Register new user
export async function register(req: Request, res: Response) {
  const { firstName, lastName, email, password, shopName, shopAddress, shopPhone } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw ApiError.conflict('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);

  // Create user, shop, and staff member atomically in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create user
    const user = await tx.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    // Create shop
    const shop = await tx.shop.create({
      data: {
        name: shopName,
        address: shopAddress || '',
        phone: shopPhone || '',
      },
    });

    // Create staff member linking user to shop with ADMIN role
    const staffMember = await tx.staffMember.create({
      data: {
        userId: user.id,
        shopId: shop.id,
        role: 'ADMIN',
        isActive: true,
      },
    });

    return { user, shop, staffMember };
  });

  // Generate JWT token
  const token = generateToken({
    userId: result.user.id,
    email: result.user.email,
  });

  logger.info(`User registered and shop created: ${email}`);

  res.status(201).json(
    ApiResponse.success({
      user: {
        id: result.user.id,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        email: result.user.email,
        name: `${result.user.firstName} ${result.user.lastName}`,
        role: 'ADMIN',
        shop: result.shop,
      },
      token,
    })
  );
}

// Login user
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  // Find user with their staff memberships
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      staffMembers: {
        where: { isActive: true },
        include: {
          shop: true,
        },
      },
    },
  });

  if (!user) {
    logger.warn(`Failed login attempt for email: ${email}`);
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    logger.warn(`Failed login attempt for email: ${email}`);
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  logger.info(`User logged in: ${email}`);

  res.json(
    ApiResponse.success({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.staffMembers[0]?.role || null,
        shop: user.staffMembers[0]?.shop || null,
        staffMemberships: user.staffMembers,
      },
      token,
    })
  );
}
