import { Router, Response } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { AuthenticatedRequest } from '../types/index.js';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8),
});

// POST /api/auth/admin/login
router.post('/admin/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.login(email, password);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/admin/logout
router.post('/admin/logout', (_req, res) => {
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully' });
});

// POST /api/auth/admin/refresh
router.post('/admin/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'No refresh token provided',
      });
    }

    const result = await authService.refreshAccessToken(refreshToken);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/admin/me
router.get('/admin/me', authenticate, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    const profile = await authService.getProfile(req.user.userId);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/auth/admin/password
router.put('/admin/password', authenticate, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    const result = await authService.changePassword(req.user.userId, currentPassword, newPassword);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
