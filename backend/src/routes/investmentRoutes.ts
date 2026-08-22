import { Router } from 'express';
import { getInvestmentSuggestions } from '../controllers/investmentController.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

router.use(authenticateJwt);

router.get('/suggestions', getInvestmentSuggestions);

export default router;
