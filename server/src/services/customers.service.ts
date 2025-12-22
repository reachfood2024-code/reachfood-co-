import prisma from '../config/database.js';
import { PaginationParams, PaginatedResponse } from '../types/index.js';
import { AppError } from '../middleware/error.middleware.js';
import { Customer, Prisma } from '@prisma/client';

export const customersService = {
  async getCustomers(
    params: PaginationParams & { search?: string; isActive?: boolean }
  ): Promise<PaginatedResponse<Customer>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search, isActive } = params;

    const where: Prisma.CustomerWhereInput = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    if (typeof isActive === 'boolean') where.isActive = isActive;

    const [data, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: { orders: true, subscriptions: true },
          },
        },
      }),
      prisma.customer.count({ where }),
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

  async getCustomerById(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            items: {
              include: {
                product: true,
                subscriptionPlan: true,
              },
            },
          },
        },
        subscriptions: {
          include: {
            plan: true,
          },
        },
        _count: {
          select: { orders: true, subscriptions: true },
        },
      },
    });

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    // Calculate total spent
    const totalSpent = await prisma.order.aggregate({
      where: { customerId: id, status: { not: 'cancelled' } },
      _sum: { total: true },
    });

    return {
      ...customer,
      totalSpent: Number(totalSpent._sum.total) || 0,
    };
  },

  async updateCustomer(id: string, data: Prisma.CustomerUpdateInput) {
    const existing = await prisma.customer.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Customer not found', 404);
    }

    return prisma.customer.update({
      where: { id },
      data,
    });
  },

  async getCustomerOrders(
    customerId: string,
    params: PaginationParams
  ) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params;

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where: { customerId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          items: {
            include: {
              product: true,
              subscriptionPlan: true,
            },
          },
        },
      }),
      prisma.order.count({ where: { customerId } }),
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

  async getCustomerSubscriptions(customerId: string) {
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    return prisma.subscription.findMany({
      where: { customerId },
      include: {
        plan: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getCustomerStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalCustomers,
      newCustomersToday,
      newCustomersMonth,
      guestCustomers,
      activeSubscriptions,
    ] = await Promise.all([
      prisma.customer.count({ where: { isActive: true } }),
      prisma.customer.count({ where: { createdAt: { gte: today } } }),
      prisma.customer.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.customer.count({ where: { isGuest: true } }),
      prisma.subscription.count({ where: { status: 'active' } }),
    ]);

    return {
      total: totalCustomers,
      newToday: newCustomersToday,
      newThisMonth: newCustomersMonth,
      guests: guestCustomers,
      activeSubscriptions,
    };
  },
};
