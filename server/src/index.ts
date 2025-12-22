import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in production for now, can be restricted later
    }
  },
  credentials: true,
}));

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parsing
app.use(cookieParser());

// API routes
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
const PORT = parseInt(env.PORT, 10);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

export default app;
