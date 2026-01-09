import express from 'express';
import { getPosts, getPost, createPost, updatePost, deletePost } from '../controllers/postController.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/:id', getPost);

// Protected routes (admin only)
router.post('/', authMiddleware, upload.single('media'), createPost);
router.put('/:id', authMiddleware, upload.single('media'), updatePost);
router.delete('/:id', authMiddleware, deletePost);

export default router;
