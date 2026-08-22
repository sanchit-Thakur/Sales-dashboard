import { Router } from 'express';
import { getBudgets, createOrUpdateBudget } from '../controllers/budgetController.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

router.use(authenticateJwt);

router.get('/', getBudgets);
router.post('/', createOrUpdateBudget);

export default router;
