import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/env.js';

// Global error handler middleware
export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  let statusCode = 500;
  let message = 'Internal server error';
  let isOperational = false;

  // Handle ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }
  // Handle Prisma errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    isOperational = true;

    switch (err.code) {
      case 'P2002':
        // Unique constraint violation
        const target = (err.meta?.target as string[]) || [];
        message = `A record with this ${target.join(', ')} already exists`;
        statusCode = 409;
        break;
      case 'P2025':
        // Record not found
        message = 'Record not found';
        statusCode = 404;
        break;
      case 'P2003':
        // Foreign key constraint violation
        message = 'Related record not found';
        statusCode = 400;
        break;
      default:
        message = 'Database operation failed';
    }
  }
  // Handle Prisma validation errors
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data provided';
    isOperational = true;
  }

  // Log error
  const logMessage = {
    requestId: req.requestId,
    method: req.method,
    path: req.path,
    statusCode,
    message: err.message,
    stack: err.stack,
    user: req.user?.id,
  };

  if (statusCode >= 500) {
    logger.error('Server error:', logMessage);
  } else {
    logger.warn('Client error:', logMessage);
  }

  // Send response
  const response: any = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  };

  // Include stack trace in development
  if (config.server.nodeEnv === 'development' && !isOperational) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

// 404 handler for unknown routes
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
  });
}
