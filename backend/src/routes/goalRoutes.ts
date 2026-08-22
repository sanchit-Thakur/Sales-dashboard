import { Router } from 'express';
import { getGoals, createGoal, updateGoalProgress } from '../controllers/goalController.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

router.use(authenticateJwt);

router.get('/', getGoals);
router.post('/', createGoal);
router.patch('/:goalId/progress', updateGoalProgress);

export default router;
