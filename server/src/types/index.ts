import { Request } from 'express';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
