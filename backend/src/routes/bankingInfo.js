import express from 'express';
import { getBankingInfo, upsertBankingInfo } from '../controllers/bankingInfoController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getBankingInfo);

// Admin
router.put('/', authMiddleware, upsertBankingInfo);

export default router;
