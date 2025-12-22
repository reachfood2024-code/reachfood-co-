import { Router } from 'express';
import authRoutes from './auth.routes.js';
import productsRoutes from './products.routes.js';
import ordersRoutes from './orders.routes.js';
import customersRoutes from './customers.routes.js';

const router = Router();

// Auth routes
router.use('/auth', authRoutes);

// Product and subscription routes (includes admin and public)
router.use('/', productsRoutes);

// Order routes (includes admin and public)
router.use('/', ordersRoutes);

// Customer routes (admin only)
router.use('/', customersRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

export default router;
