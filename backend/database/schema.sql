-- Animal Rescue Association Database Schema for Supabase
-- Copy and paste this entire script into Supabase SQL Editor

-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS banking_info CASCADE;
DROP TABLE IF EXISTS contact_info CASCADE;
DROP TABLE IF EXISTS social_links CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- ============================================
-- ADMINS TABLE
-- ============================================
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- POSTS TABLE (Images and Videos)
-- ============================================
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    media_type VARCHAR(20) NOT NULL, -- 'image' or 'video'
    media_url VARCHAR(500),
    media_data BYTEA,
    media_mime_type VARCHAR(50),
    thumbnail_url VARCHAR(500),
    is_published BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SOCIAL LINKS TABLE
-- ============================================
CREATE TABLE social_links (
    platform VARCHAR(50) PRIMARY KEY,
    url VARCHAR(500) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CONTACT INFO TABLE
-- ============================================
CREATE TABLE contact_info (
    id INTEGER PRIMARY KEY DEFAULT 1,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    whatsapp VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- BANKING INFO TABLE
-- ============================================
CREATE TABLE banking_info (
    id INTEGER PRIMARY KEY DEFAULT 1,
    paypal_email VARCHAR(255),
    bank_rib TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_posts_media_type ON posts(media_type);
CREATE INDEX idx_posts_is_published ON posts(is_published);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_created_by ON posts(created_by);

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Initialize social platforms (empty URLs - to be filled via admin panel)
INSERT INTO social_links (platform, url) VALUES 
('facebook', ''),
('instagram', ''),
('twitter', ''),
('youtube', ''),
('tiktok', '');

-- Initialize contact info (empty - to be filled via admin panel)
INSERT INTO contact_info (id, email, phone, address, whatsapp) VALUES 
(1, NULL, NULL, NULL, NULL);

-- Initialize banking info (empty - to be filled via admin panel)
INSERT INTO banking_info (id, paypal_email, bank_rib) VALUES 
(1, NULL, NULL);

-- ============================================
-- IMPORTANT NOTES FOR SUPABASE SETUP
-- ============================================
-- 1. Change the default admin password after first login!
-- 2. To generate a new bcrypt hash for admin password, run:
--    node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YOUR_NEW_PASSWORD', 10));"
-- 3. Update your .env.local file with your Supabase database URL
-- 4. Ensure your backend is configured to connect to this Supabase database
-- 5. You can now manage all content via the admin dashboard
-- 
-- Database is now ready for production use!
