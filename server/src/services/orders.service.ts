import prisma from '../config/database.js';
import { PaginationParams, PaginatedResponse } from '../types/index.js';
import { AppError } from '../middleware/error.middleware.js';
import { Order, Prisma } from '@prisma/client';

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RF-${timestamp}-${random}`;
}

export const ordersService = {
  async getOrders(
    params: PaginationParams & { status?: string; orderType?: string; customerId?: string }
  ): Promise<PaginatedResponse<Order>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', status, orderType, customerId } = params;

    const where: Prisma.OrderWhereInput = {};
    if (status) where.status = status;
    if (orderType) where.orderType = orderType;
    if (customerId) where.customerId = customerId;

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          customer: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          items: {
            include: {
              product: true,
              subscriptionPlan: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
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

  async getOrderById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
            subscriptionPlan: true,
          },
        },
        tracking: {
          orderBy: { trackedAt: 'desc' },
        },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  },

  async getOrderByNumber(orderNumber: string) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true,
            subscriptionPlan: true,
          },
        },
        tracking: {
          orderBy: { trackedAt: 'desc' },
        },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  },

  async createOrder(data: {
    customer: {
      email: string;
      firstName: string;
      lastName: string;
      phone?: string;
      address?: string;
    };
    orderType: 'one-time' | 'subscription';
    items: Array<{
      productId?: string;
      subscriptionPlanId?: string;
      quantity: number;
    }>;
    dietaryPreferences?: string[];
    specialNotes?: string;
    deliveryFrequency?: string;
    shippingAddress?: Record<string, unknown>;
  }) {
    // Find or create customer
    let customer = await prisma.customer.findUnique({
      where: { email: data.customer.email },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email: data.customer.email,
          firstName: data.customer.firstName,
          lastName: data.customer.lastName,
          phone: data.customer.phone,
          address: data.customer.address,
          isGuest: true,
        },
      });
    }

    // Calculate order totals
    let subtotal = 0;
    const orderItems: Array<{
      productId?: string;
      subscriptionPlanId?: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }> = [];

    for (const item of data.items) {
      if (item.productId) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new AppError(`Product ${item.productId} not found`, 404);

        const unitPrice = Number(product.price);
        const totalPrice = unitPrice * item.quantity;
        subtotal += totalPrice;

        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          totalPrice,
        });
      } else if (item.subscriptionPlanId) {
        const plan = await prisma.subscriptionPlan.findUnique({ where: { id: item.subscriptionPlanId } });
        if (!plan) throw new AppError(`Subscription plan ${item.subscriptionPlanId} not found`, 404);

        const unitPrice = Number(plan.monthlyPrice);
        const totalPrice = unitPrice * item.quantity;
        subtotal += totalPrice;

        orderItems.push({
          subscriptionPlanId: item.subscriptionPlanId,
          quantity: item.quantity,
          unitPrice,
          totalPrice,
        });
      }
    }

    const shippingCost = 0; // Free shipping for now
    const tax = 0; // No tax for now
    const total = subtotal + shippingCost + tax;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: customer.id,
        orderType: data.orderType,
        subtotal,
        shippingCost,
        tax,
        total,
        shippingAddress: data.shippingAddress || null,
        dietaryPrefs: data.dietaryPreferences || [],
        specialNotes: data.specialNotes,
        deliveryFreq: data.deliveryFrequency,
        items: {
          create: orderItems,
        },
        tracking: {
          create: {
            status: 'Order placed',
            notes: 'Your order has been received',
          },
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
            subscriptionPlan: true,
          },
        },
        tracking: true,
      },
    });

    return order;
  },

  async updateOrderStatus(id: string, status: string, notes?: string) {
    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Order not found', 404);
    }

    const updateData: Prisma.OrderUpdateInput = { status };

    // Set timestamps based on status
    if (status === 'paid') updateData.paidAt = new Date();
    if (status === 'shipped') updateData.shippedAt = new Date();
    if (status === 'delivered') updateData.deliveredAt = new Date();

    const [order] = await Promise.all([
      prisma.order.update({
        where: { id },
        data: updateData,
        include: {
          customer: true,
          items: true,
          tracking: { orderBy: { trackedAt: 'desc' } },
        },
      }),
      prisma.deliveryTracking.create({
        data: {
          orderId: id,
          status,
          notes,
        },
      }),
    ]);

    return order;
  },

  async addTrackingUpdate(orderId: string, data: { status: string; location?: string; notes?: string }) {
    const existing = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existing) {
      throw new AppError('Order not found', 404);
    }

    return prisma.deliveryTracking.create({
      data: {
        orderId,
        status: data.status,
        location: data.location,
        notes: data.notes,
      },
    });
  },

  async getOrderStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      todayOrders,
      weekOrders,
      monthOrders,
      totalOrders,
      pendingOrders,
      statusCounts,
    ] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.order.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    const todayRevenue = await prisma.order.aggregate({
      where: { createdAt: { gte: today }, status: { not: 'cancelled' } },
      _sum: { total: true },
    });

    const monthRevenue = await prisma.order.aggregate({
      where: { createdAt: { gte: startOfMonth }, status: { not: 'cancelled' } },
      _sum: { total: true },
    });

    return {
      orders: {
        today: todayOrders,
        week: weekOrders,
        month: monthOrders,
        total: totalOrders,
        pending: pendingOrders,
      },
      revenue: {
        today: Number(todayRevenue._sum.total) || 0,
        month: Number(monthRevenue._sum.total) || 0,
      },
      byStatus: statusCounts.reduce((acc, curr) => {
        acc[curr.status] = curr._count;
        return acc;
      }, {} as Record<string, number>),
    };
  },
};
