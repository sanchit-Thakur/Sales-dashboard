import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';
import salesRoutes from './routes/salesRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Security & Utility Middleware
app.use(helmet());
app.use(
  cors({
    origin: [env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Global Rate Limiting
app.use('/api', globalRateLimiter);

// Healthcheck Route
app.get('/health', (_req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'OmniSales Enterprise Sales & ML Intelligence API',
  });
});

// Authentication & Sales API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);

// Centralized Error Handling
app.use(errorHandler);

const PORT = env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 OmniSales Data Science & Sales API listening on http://localhost:${PORT}`);
  console.log(`🔒 Environment: ${env.NODE_ENV}`);
});
