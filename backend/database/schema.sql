-- Animal Rescue Association Database Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS banking_info CASCADE;
DROP TABLE IF EXISTS contact_info CASCADE;
DROP TABLE IF EXISTS social_links CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Create admins table
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create posts table for images and videos
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    media_type VARCHAR(20) NOT NULL, -- 'image' or 'video'
    media_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    is_published BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES admins(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Social media links (one row per platform)
CREATE TABLE social_links (
    platform VARCHAR(50) PRIMARY KEY,
    url VARCHAR(500) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact info (single row)
CREATE TABLE contact_info (
    id INTEGER PRIMARY KEY DEFAULT 1,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    whatsapp VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Banking info (PayPal and RIB)
CREATE TABLE banking_info (
    id INTEGER PRIMARY KEY DEFAULT 1,
    paypal_email VARCHAR(255),
    bank_rib TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_posts_media_type ON posts(media_type);
CREATE INDEX idx_posts_is_published ON posts(is_published);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Insert default admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO admins (username, password, email) VALUES 
('admin', '$2a$10$umgFQzVXoFmYzbCBtAOlweADYTU1l7NRePSO/Vrk8gsEzht1LLPyi', 'admin@animalrescue.org');

-- Note: You should change this password after first login!
-- To generate a new bcrypt hash, use the admin panel or run:
-- node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your_new_password', 10));"
