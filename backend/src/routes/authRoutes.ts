import { Router } from 'express';
import { login, signup, getMe } from '../controllers/authController.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', getMe);

export default router;
