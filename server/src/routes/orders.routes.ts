import { Router } from 'express';
import { z } from 'zod';
import { ordersService } from '../services/orders.service.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

const createOrderSchema = z.object({
  customer: z.object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
  orderType: z.enum(['one-time', 'subscription']),
  items: z.array(z.object({
    productId: z.string().uuid().optional(),
    subscriptionPlanId: z.string().uuid().optional(),
    quantity: z.number().int().positive(),
  })).min(1),
  dietaryPreferences: z.array(z.string()).optional(),
  specialNotes: z.string().optional(),
  deliveryFrequency: z.string().optional(),
  shippingAddress: z.record(z.unknown()).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
  notes: z.string().optional(),
});

const trackingSchema = z.object({
  status: z.string().min(1),
  location: z.string().optional(),
  notes: z.string().optional(),
});

// ===== ADMIN ROUTES =====

// GET /api/admin/orders
router.get('/admin/orders', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
    const status = req.query.status as string | undefined;
    const orderType = req.query.orderType as string | undefined;
    const customerId = req.query.customerId as string | undefined;

    const result = await ordersService.getOrders({
      page,
      limit,
      sortBy,
      sortOrder,
      status,
      orderType,
      customerId,
    });

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/orders/stats
router.get('/admin/orders/stats', authenticate, requireAdmin, async (_req, res, next) => {
  try {
    const stats = await ordersService.getOrderStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/orders/:id
router.get('/admin/orders/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const order = await ordersService.getOrderById(req.params.id);
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/orders/:id/status
router.put('/admin/orders/:id/status', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { status, notes } = updateStatusSchema.parse(req.body);
    const order = await ordersService.updateOrderStatus(req.params.id, status, notes);
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/orders/:id/tracking
router.post('/admin/orders/:id/tracking', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const data = trackingSchema.parse(req.body);
    const tracking = await ordersService.addTrackingUpdate(req.params.id, data);
    res.status(201).json({ success: true, data: tracking });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/orders/:id/tracking
router.get('/admin/orders/:id/tracking', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const order = await ordersService.getOrderById(req.params.id);
    res.json({ success: true, data: order.tracking });
  } catch (error) {
    next(error);
  }
});

// ===== PUBLIC ROUTES =====

// POST /api/orders
router.post('/orders', async (req, res, next) => {
  try {
    const data = createOrderSchema.parse(req.body);
    const order = await ordersService.createOrder(data);
    res.status(201).json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:orderNumber
router.get('/orders/:orderNumber', async (req, res, next) => {
  try {
    const order = await ordersService.getOrderByNumber(req.params.orderNumber);
    res.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        items: order.items,
        tracking: order.tracking,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
