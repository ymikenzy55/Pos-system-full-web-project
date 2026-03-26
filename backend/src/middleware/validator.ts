import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';

// Middleware to check validation results
export function validate(req: Request, _res: Response, next: NextFunction) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    throw ApiError.badRequest(errorMessages);
  }
  
  next();
}

// Common validation rules
export const validators = {
  // Email validation (RFC 5322 compliant)
  email: body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),

  // Password validation
  password: body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .trim(),

  // UUID validation
  uuid: (field: string) => param(field)
    .isUUID()
    .withMessage(`${field} must be a valid UUID`),

  // Positive number validation
  positiveNumber: (field: string) => body(field)
    .isFloat({ min: 0.01 })
    .withMessage(`${field} must be a positive number`),

  // Integer validation
  positiveInteger: (field: string) => body(field)
    .isInt({ min: 1 })
    .withMessage(`${field} must be a positive integer`),

  // String length validation
  stringLength: (field: string, min: number, max: number) => body(field)
    .isLength({ min, max })
    .withMessage(`${field} must be between ${min} and ${max} characters`)
    .trim(),

  // Required field validation
  required: (field: string) => body(field)
    .notEmpty()
    .withMessage(`${field} is required`)
    .trim(),

  // Enum validation
  enum: (field: string, values: string[]) => body(field)
    .isIn(values)
    .withMessage(`${field} must be one of: ${values.join(', ')}`),

  // Date validation (ISO 8601)
  isoDate: (field: string) => query(field)
    .isISO8601()
    .withMessage(`${field} must be a valid ISO 8601 date`),
};

// Sanitize string inputs
export function sanitizeString(str: string): string {
  return str.trim().replace(/[<>]/g, '');
}
