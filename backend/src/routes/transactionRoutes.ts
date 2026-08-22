import { Router } from 'express';
import { TransactionController } from '../controllers/transactionController.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

router.use(authenticateJwt);

router.get('/dashboard', TransactionController.getDashboardSummary);
router.get('/accounts', TransactionController.getAccounts);
router.post('/accounts', TransactionController.createAccount);
router.get('/', TransactionController.getTransactions);
router.post('/', TransactionController.createTransaction);
router.post('/sync-plaid', TransactionController.syncPlaidTransactions);

export default router;
