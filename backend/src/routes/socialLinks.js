import express from 'express';
import { getSocialLinks, upsertSocialLink } from '../controllers/socialLinksController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getSocialLinks);

// Admin only
router.put('/:platform', authMiddleware, upsertSocialLink);

export default router;
