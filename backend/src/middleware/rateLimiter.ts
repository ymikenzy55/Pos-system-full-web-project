import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

// Rate limiter for authentication endpoints - per IP address
export const authRateLimiter = rateLimit({
  windowMs: config.rateLimit.auth.windowMs, // 1 minute
  max: config.rateLimit.auth.max, // 70 requests per minute
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  // Use IP address as key for rate limiting (per user)
  keyGenerator: (req) => {
    // Use email from request body if available, otherwise use IP
    return req.body?.email || req.ip || 'unknown';
  },
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts from this account. Please try again in 1 minute.',
      timestamp: new Date().toISOString(),
    });
  },
  // Skip successful requests - only count failed attempts
  skipSuccessfulRequests: true,
});

// Rate limiter for general API endpoints - per user (authenticated)
export const apiRateLimiter = rateLimit({
  windowMs: config.rateLimit.api.windowMs, // 1 minute
  max: config.rateLimit.api.max, // 70 requests per minute
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  // Use user ID from auth token if available, otherwise use IP
  keyGenerator: (req) => {
    // @ts-ignore - user is added by auth middleware
    return req.user?.id || req.ip || 'unknown';
  },
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests. Please slow down and try again in 1 minute.',
      timestamp: new Date().toISOString(),
    });
  },
});
