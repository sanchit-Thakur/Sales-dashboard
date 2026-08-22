import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateJwt, getProfile);

export default router;
