import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env.js';

export interface JwtPayload {
  userId: string;
  email: string;
}

// Generate JWT token
export function generateToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: config.jwt.expiry as any,
  };
  return jwt.sign(payload, config.jwt.secret, options);
}

// Verify JWT token
export function verifyToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
