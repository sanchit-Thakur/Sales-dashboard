import { Router } from 'express';
import {
  generateMonthlyReport,
  predictSpendingTrends,
  askFinancialAdvisor,
  getChatHistory,
} from '../controllers/aiController.js';
import { authenticateJwt } from '../middleware/auth.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(authenticateJwt);

router.post('/monthly-report', generateMonthlyReport);
router.get('/predict-spending', predictSpendingTrends);
router.post('/chat-advisor', aiRateLimiter, askFinancialAdvisor);
router.get('/chat-history', getChatHistory);

export default router;
