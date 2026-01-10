import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import socialLinksRoutes from './routes/socialLinks.js';
import contactInfoRoutes from './routes/contactInfo.js';
import bankingInfoRoutes from './routes/bankingInfo.js';

// Import database
import pool from './config/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/social-links', socialLinksRoutes);
app.use('/api/contact-info', contactInfoRoutes);
app.use('/api/banking-info', bankingInfoRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Animal Rescue API is running' });
});

// Test database connection
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'Connected', time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
});