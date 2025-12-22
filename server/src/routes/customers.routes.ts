import { Router } from 'express';
import { z } from 'zod';
import { customersService } from '../services/customers.service.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

const updateCustomerSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  isActive: z.boolean().optional(),
});

// GET /api/admin/customers
router.get('/admin/customers', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
    const search = req.query.search as string | undefined;
    const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;

    const result = await customersService.getCustomers({
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      isActive,
    });

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/customers/stats
router.get('/admin/customers/stats', authenticate, requireAdmin, async (_req, res, next) => {
  try {
    const stats = await customersService.getCustomerStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/customers/:id
router.get('/admin/customers/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const customer = await customersService.getCustomerById(req.params.id);
    res.json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/customers/:id
router.put('/admin/customers/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const data = updateCustomerSchema.parse(req.body);
    const customer = await customersService.updateCustomer(req.params.id, data);
    res.json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/customers/:id/orders
router.get('/admin/customers/:id/orders', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

    const result = await customersService.getCustomerOrders(req.params.id, {
      page,
      limit,
      sortBy,
      sortOrder,
    });

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/customers/:id/subscriptions
router.get('/admin/customers/:id/subscriptions', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const subscriptions = await customersService.getCustomerSubscriptions(req.params.id);
    res.json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
});

export default router;
