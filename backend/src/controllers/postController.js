import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../../uploads');

const deleteLocalMedia = (mediaUrl) => {
  if (!mediaUrl || !mediaUrl.startsWith('/uploads/')) return;
  const filename = mediaUrl.replace('/uploads/', '');
  const filePath = path.join(uploadsDir, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Get all posts (with optional filters)
export const getPosts = async (req, res) => {
  try {
    const { media_type, published, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM posts WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (media_type) {
      query += ` AND media_type = $${paramCount}`;
      params.push(media_type);
      paramCount++;
    }

    if (published !== undefined) {
      query += ` AND is_published = $${paramCount}`;
      params.push(published === 'true');
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);
    
    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) FROM posts WHERE 1=1');
    
    res.json({
      posts: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single post
export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create post
export const createPost = async (req, res) => {
  try {
    const { title_en, title_ar, description_en, description_ar, media_type, is_published } = req.body;
    const normalizedMediaType = media_type ? media_type.toLowerCase() : null;
    const providedUrl = (req.body.media_url || '').trim();

    if (!title_en || !title_ar || !normalizedMediaType) {
      return res.status(400).json({ message: 'Missing required basic fields' });
    }

    let media_url = null;

    if (normalizedMediaType === 'video') {
      if (req.file) {
        media_url = `/uploads/${req.file.filename}`;
      } else if (providedUrl) {
        media_url = providedUrl;
      } else {
        return res.status(400).json({ message: 'Video posts require a media URL or file' });
      }
    } else {
      if (!req.file) {
        return res.status(400).json({ message: 'Image posts require a file upload' });
      }
      media_url = `/uploads/${req.file.filename}`;
    }

    const result = await pool.query(
      `INSERT INTO posts (title_en, title_ar, description_en, description_ar, media_type, media_url, is_published, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title_en, title_ar, description_en || '', description_ar || '', normalizedMediaType, media_url, is_published !== 'false', req.admin.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title_en, title_ar, description_en, description_ar, is_published, media_type } = req.body;
    const providedUrl = (req.body.media_url || '').trim();

    const existingResult = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const existingPost = existingResult.rows[0];
    const normalizedExistingType = existingPost.media_type ? existingPost.media_type.toLowerCase() : 'image';
    const normalizedMediaType = media_type ? media_type.toLowerCase() : normalizedExistingType;

    let media_url = null;
    if (req.file) {
      media_url = `/uploads/${req.file.filename}`;
    } else if (normalizedMediaType === 'video' && providedUrl) {
      media_url = providedUrl;
    }

    if (req.file && existingPost.media_url) {
      deleteLocalMedia(existingPost.media_url);
    } else if (media_url && existingPost.media_url && existingPost.media_url.startsWith('/uploads/') && media_url !== existingPost.media_url) {
      deleteLocalMedia(existingPost.media_url);
    }

    if (normalizedMediaType !== normalizedExistingType) {
      const changingToVideo = normalizedMediaType === 'video';
      if (changingToVideo && !media_url) {
        return res.status(400).json({ message: 'Video posts require a media URL when changing type' });
      }
      const changingToImage = normalizedMediaType !== 'video' && normalizedExistingType === 'video';
      if (changingToImage && !media_url) {
        return res.status(400).json({ message: 'Image posts require a file upload when changing type' });
      }
    }

    let query = 'UPDATE posts SET updated_at = CURRENT_TIMESTAMP';
    const params = [];
    let paramCount = 1;

    if (title_en) {
      query += `, title_en = $${paramCount}`;
      params.push(title_en);
      paramCount++;
    }

    if (title_ar) {
      query += `, title_ar = $${paramCount}`;
      params.push(title_ar);
      paramCount++;
    }

    if (description_en !== undefined) {
      query += `, description_en = $${paramCount}`;
      params.push(description_en);
      paramCount++;
    }

    if (description_ar !== undefined) {
      query += `, description_ar = $${paramCount}`;
      params.push(description_ar);
      paramCount++;
    }

    if (is_published !== undefined) {
      query += `, is_published = $${paramCount}`;
      params.push(is_published === 'true' || is_published === true);
      paramCount++;
    }

    if (media_type) {
      query += `, media_type = $${paramCount}`;
      params.push(normalizedMediaType);
      paramCount++;
    }

    if (media_url) {
      query += `, media_url = $${paramCount}`;
      params.push(media_url);
      paramCount++;
    }

    query += ` WHERE id = $${paramCount} RETURNING *`;
    params.push(id);

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Get post to delete file
    const post = await pool.query('SELECT media_url FROM posts WHERE id = $1', [id]);
    
    if (post.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete local media file if applicable
    deleteLocalMedia(post.rows[0].media_url);

    // Delete from database
    await pool.query('DELETE FROM posts WHERE id = $1', [id]);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
