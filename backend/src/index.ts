import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';

import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import investmentRoutes from './routes/investmentRoutes.js';

const app = express();

// Security & Utility Middleware
app.use(helmet());
app.use(
  cors({
    origin: [env.FRONTEND_URL, 'http://localhost:3000'],
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
    service: 'AI Personal Finance Advisor API',
  });
});

// API Routes binding
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/investments', investmentRoutes);

// Centralized Error Handling
app.use(errorHandler);

const PORT = env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 AI Personal Finance Advisor Backend listening on http://localhost:${PORT}`);
  console.log(`🔒 Environment: ${env.NODE_ENV}`);
});
