import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Basic health check
export async function health(_req: Request, res: Response) {
  res.json(
    ApiResponse.success({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    })
  );
}

// Readiness check (includes database connection)
export async function ready(_req: Request, res: Response) {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    res.json(
      ApiResponse.success({
        status: 'ready',
        database: 'connected',
        timestamp: new Date().toISOString(),
      })
    );
  } catch (error) {
    res.status(503).json(
      ApiResponse.error('Service unavailable - database connection failed')
    );
  }
}
