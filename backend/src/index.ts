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
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Dynamic CORS configuration supporting local and production domains
const allowedOrigins = [
  env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin server-side calls)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.onrender.com') ||
        origin.endsWith('.railway.app') ||
        origin.endsWith('.netlify.app')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive fallback for seamless portfolio demonstration
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
    uptime: process.uptime(),
    environment: env.NODE_ENV,
  });
});

// Root API Welcome Route
app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to OmniSales Enterprise Data Science & Sales Intelligence API',
    docs: '/api/sales/overview',
    health: '/health',
    version: '2.0.0',
  });
});

// Authentication & Sales API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);

// Centralized Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`🚀 OmniSales Data Science API listening on http://localhost:${PORT}`);
  console.log(`🔒 Environment: ${env.NODE_ENV}`);
});

// Graceful Shutdown
const handleShutdown = (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed cleanly.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
