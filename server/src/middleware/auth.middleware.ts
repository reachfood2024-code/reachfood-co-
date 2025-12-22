import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.js';
import { AuthenticatedRequest, TokenPayload } from '../types/index.js';
import { AppError } from './error.middleware.js';

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, authConfig.accessTokenSecret) as TokenPayload;

    if (decoded.type !== 'access') {
      throw new AppError('Invalid token type', 401);
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expired', 401));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else {
      next(error);
    }
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError('Not authenticated', 401));
  }

  const adminRoles = ['admin', 'super_admin', 'manager'];
  if (!adminRoles.includes(req.user.role)) {
    return next(new AppError('Access denied', 403));
  }

  next();
};

export const requireSuperAdmin = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError('Not authenticated', 401));
  }

  if (req.user.role !== 'super_admin') {
    return next(new AppError('Super admin access required', 403));
  }

  next();
};
