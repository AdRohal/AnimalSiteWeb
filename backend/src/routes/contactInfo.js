import express from 'express';
import { getContactInfo, upsertContactInfo } from '../controllers/contactInfoController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getContactInfo);

// Admin
router.put('/', authMiddleware, upsertContactInfo);

export default router;
