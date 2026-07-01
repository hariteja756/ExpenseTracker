import express from 'express';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes in this router
router.use(protect);

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.route('/:id')
  .put(updateTransaction)
  .delete(deleteTransaction);

export default router;
