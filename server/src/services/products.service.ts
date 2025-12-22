import prisma from '../config/database.js';
import { PaginationParams, PaginatedResponse } from '../types/index.js';
import { AppError } from '../middleware/error.middleware.js';
import { Product, SubscriptionPlan, Prisma } from '@prisma/client';

export const productsService = {
  // Products
  async getProducts(
    params: PaginationParams & { category?: string; isActive?: boolean; isFeatured?: boolean }
  ): Promise<PaginatedResponse<Product>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', category, isActive, isFeatured } = params;

    const where: Prisma.ProductWhereInput = {};
    if (category) where.category = category;
    if (typeof isActive === 'boolean') where.isActive = isActive;
    if (typeof isFeatured === 'boolean') where.isFeatured = isFeatured;

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  },

  async createProduct(data: Prisma.ProductCreateInput) {
    return prisma.product.create({ data });
  },

  async updateProduct(id: string, data: Prisma.ProductUpdateInput) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Product not found', 404);
    }

    return prisma.product.update({
      where: { id },
      data,
    });
  },

  async deleteProduct(id: string) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Product not found', 404);
    }

    // Soft delete by setting isActive to false
    return prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  },

  // Public endpoint - only active products
  async getPublicProducts(category?: string) {
    const where: Prisma.ProductWhereInput = { isActive: true };
    if (category) where.category = category;

    return prisma.product.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    });
  },

  // Subscription Plans
  async getSubscriptionPlans(
    params: PaginationParams & { isActive?: boolean }
  ): Promise<PaginatedResponse<SubscriptionPlan>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', isActive } = params;

    const where: Prisma.SubscriptionPlanWhereInput = {};
    if (typeof isActive === 'boolean') where.isActive = isActive;

    const [data, total] = await Promise.all([
      prisma.subscriptionPlan.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.subscriptionPlan.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getSubscriptionPlanById(id: string) {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      throw new AppError('Subscription plan not found', 404);
    }

    return plan;
  },

  async createSubscriptionPlan(data: Prisma.SubscriptionPlanCreateInput) {
    return prisma.subscriptionPlan.create({ data });
  },

  async updateSubscriptionPlan(id: string, data: Prisma.SubscriptionPlanUpdateInput) {
    const existing = await prisma.subscriptionPlan.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Subscription plan not found', 404);
    }

    return prisma.subscriptionPlan.update({
      where: { id },
      data,
    });
  },

  async deleteSubscriptionPlan(id: string) {
    const existing = await prisma.subscriptionPlan.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Subscription plan not found', 404);
    }

    // Soft delete
    return prisma.subscriptionPlan.update({
      where: { id },
      data: { isActive: false },
    });
  },

  // Public endpoint
  async getPublicSubscriptionPlans() {
    return prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: [{ isPopular: 'desc' }, { monthlyPrice: 'asc' }],
    });
  },
};
