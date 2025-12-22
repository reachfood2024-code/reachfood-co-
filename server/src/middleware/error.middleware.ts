import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.errors,
    });
  }

  return res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
};
