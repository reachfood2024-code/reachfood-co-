import { Router } from 'express';
import { z } from 'zod';
import { productsService } from '../services/products.service.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

const productSchema = z.object({
  nameEn: z.string().min(1),
  nameAr: z.string().min(1),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  category: z.string().min(1),
  badgeEn: z.string().optional(),
  badgeAr: z.string().optional(),
  imageUrl: z.string().url().optional(),
  featuresEn: z.array(z.string()).default([]),
  featuresAr: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  stockQuantity: z.number().int().min(0).default(0),
});

const subscriptionPlanSchema = z.object({
  nameEn: z.string().min(1),
  nameAr: z.string().min(1),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  monthlyPrice: z.number().positive(),
  annualPrice: z.number().positive().optional(),
  savings: z.number().optional(),
  mealsPerMonth: z.number().int().positive(),
  featuresEn: z.array(z.string()).default([]),
  featuresAr: z.array(z.string()).default([]),
  isPopular: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

// ===== ADMIN PRODUCT ROUTES =====

// GET /api/admin/products
router.get('/admin/products', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
    const category = req.query.category as string | undefined;
    const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
    const isFeatured = req.query.isFeatured === 'true' ? true : req.query.isFeatured === 'false' ? false : undefined;

    const result = await productsService.getProducts({
      page,
      limit,
      sortBy,
      sortOrder,
      category,
      isActive,
      isFeatured,
    });

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/products/:id
router.get('/admin/products/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const product = await productsService.getProductById(req.params.id);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/products
router.post('/admin/products', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const data = productSchema.parse(req.body);
    const product = await productsService.createProduct(data);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/products/:id
router.put('/admin/products/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const data = productSchema.partial().parse(req.body);
    const product = await productsService.updateProduct(req.params.id, data);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/products/:id
router.delete('/admin/products/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    await productsService.deleteProduct(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
});

// ===== ADMIN SUBSCRIPTION PLAN ROUTES =====

// GET /api/admin/subscription-plans
router.get('/admin/subscription-plans', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
    const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;

    const result = await productsService.getSubscriptionPlans({
      page,
      limit,
      sortBy,
      sortOrder,
      isActive,
    });

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/subscription-plans/:id
router.get('/admin/subscription-plans/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const plan = await productsService.getSubscriptionPlanById(req.params.id);
    res.json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/subscription-plans
router.post('/admin/subscription-plans', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const data = subscriptionPlanSchema.parse(req.body);
    const plan = await productsService.createSubscriptionPlan(data);
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/subscription-plans/:id
router.put('/admin/subscription-plans/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const data = subscriptionPlanSchema.partial().parse(req.body);
    const plan = await productsService.updateSubscriptionPlan(req.params.id, data);
    res.json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/subscription-plans/:id
router.delete('/admin/subscription-plans/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    await productsService.deleteSubscriptionPlan(req.params.id);
    res.json({ success: true, message: 'Subscription plan deleted' });
  } catch (error) {
    next(error);
  }
});

// ===== PUBLIC ROUTES =====

// GET /api/products
router.get('/products', async (req, res, next) => {
  try {
    const category = req.query.category as string | undefined;
    const products = await productsService.getPublicProducts(category);
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

// GET /api/subscription-plans
router.get('/subscription-plans', async (_req, res, next) => {
  try {
    const plans = await productsService.getPublicSubscriptionPlans();
    res.json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
});

export default router;
