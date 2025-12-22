import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { authConfig } from '../config/auth.js';
import { TokenPayload } from '../types/index.js';
import { AppError } from '../middleware/error.middleware.js';

export const authService = {
  async login(email: string, password: string) {
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin || !admin.isActive) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    // Update last login
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    });

    const accessToken = this.generateAccessToken(admin);
    const refreshToken = this.generateRefreshToken(admin);

    return {
      accessToken,
      refreshToken,
      user: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
      },
    };
  },

  generateAccessToken(admin: { id: string; email: string; role: string }) {
    const payload: TokenPayload = {
      userId: admin.id,
      email: admin.email,
      role: admin.role,
      type: 'access',
    };

    return jwt.sign(payload, authConfig.accessTokenSecret, {
      expiresIn: authConfig.accessTokenExpiry,
    });
  },

  generateRefreshToken(admin: { id: string; email: string; role: string }) {
    const payload: TokenPayload = {
      userId: admin.id,
      email: admin.email,
      role: admin.role,
      type: 'refresh',
    };

    return jwt.sign(payload, authConfig.refreshTokenSecret, {
      expiresIn: authConfig.refreshTokenExpiry,
    });
  },

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        authConfig.refreshTokenSecret
      ) as TokenPayload;

      if (decoded.type !== 'refresh') {
        throw new AppError('Invalid token type', 401);
      }

      const admin = await prisma.adminUser.findUnique({
        where: { id: decoded.userId },
      });

      if (!admin || !admin.isActive) {
        throw new AppError('User not found or inactive', 401);
      }

      const accessToken = this.generateAccessToken(admin);

      return { accessToken };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Refresh token expired', 401);
      }
      throw new AppError('Invalid refresh token', 401);
    }
  },

  async getProfile(userId: string) {
    const admin = await prisma.adminUser.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        lastLogin: true,
        createdAt: true,
      },
    });

    if (!admin) {
      throw new AppError('User not found', 404);
    }

    return admin;
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const admin = await prisma.adminUser.findUnique({
      where: { id: userId },
    });

    if (!admin) {
      throw new AppError('User not found', 404);
    }

    const isValidPassword = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isValidPassword) {
      throw new AppError('Current password is incorrect', 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, authConfig.saltRounds);

    await prisma.adminUser.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: 'Password changed successfully' };
  },

  async createAdmin(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) {
    const existing = await prisma.adminUser.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new AppError('Email already exists', 400);
    }

    const passwordHash = await bcrypt.hash(data.password, authConfig.saltRounds);

    const admin = await prisma.adminUser.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || 'admin',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    return admin;
  },
};
