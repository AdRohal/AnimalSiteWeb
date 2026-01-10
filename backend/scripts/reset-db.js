import pool from '../src/config/database.js';

async function resetDatabase() {
  try {
    console.log('\n⚠️  DATABASE RESET WARNING\n');
    console.log('This will DELETE all data including:');
    console.log('  • All posts, images, and videos');
    console.log('  • All admin users');
    console.log('  • All social links and contact info');
    console.log('  • All banking information\n');
    
    // Confirm reset
    const confirm = process.argv[2];
    if (confirm !== '--yes') {
      console.log('❌ Reset cancelled. To confirm reset, run:');
      console.log('   npm run reset-db -- --yes\n');
      process.exit(0);
    }
    
    console.log('🔄 Resetting database...\n');
    
    // Drop all tables
    await pool.query(`
      DROP TABLE IF EXISTS banking_info CASCADE;
      DROP TABLE IF EXISTS contact_info CASCADE;
      DROP TABLE IF EXISTS social_links CASCADE;
      DROP TABLE IF EXISTS posts CASCADE;
      DROP TABLE IF EXISTS admins CASCADE;
    `);
    console.log('✅ All tables dropped\n');
    
    // Recreate tables
    const schemaCommands = [
      `CREATE TABLE admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      
      `CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        title_en VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255) NOT NULL,
        description_en TEXT,
        description_ar TEXT,
        media_type VARCHAR(20) NOT NULL,
        media_url VARCHAR(500),
        media_data BYTEA,
        media_mime_type VARCHAR(50),
        thumbnail_url VARCHAR(500),
        is_published BOOLEAN DEFAULT true,
        created_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      
      `CREATE TABLE social_links (
        platform VARCHAR(50) PRIMARY KEY,
        url VARCHAR(500) NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      
      `CREATE TABLE contact_info (
        id INTEGER PRIMARY KEY DEFAULT 1,
        email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        whatsapp VARCHAR(100),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      
      `CREATE TABLE banking_info (
        id INTEGER PRIMARY KEY DEFAULT 1,
        paypal_email VARCHAR(255),
        bank_rib TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      
      `CREATE INDEX idx_posts_media_type ON posts(media_type);`,
      `CREATE INDEX idx_posts_is_published ON posts(is_published);`,
      `CREATE INDEX idx_posts_created_at ON posts(created_at DESC);`,
      `CREATE INDEX idx_posts_created_by ON posts(created_by);`,
    ];
    
    for (const cmd of schemaCommands) {
      await pool.query(cmd);
    }
    console.log('✅ Tables recreated\n');
    
    // Insert initial data
    await pool.query(
      'INSERT INTO admins (username, password, email) VALUES ($1, $2, $3)',
      ['admin', '$2a$10$umgFQzVXoFmYzbCBtAOlweADYTU1l7NRePSO/Vrk8gsEzht1LLPyi', 'admin@animalrescue.org']
    );
    
    await pool.query(
      `INSERT INTO social_links (platform, url) VALUES 
        ('facebook', ''), ('instagram', ''), ('twitter', ''), ('youtube', ''), ('tiktok', '')`
    );
    
    await pool.query(
      'INSERT INTO contact_info (id, email, phone, address, whatsapp) VALUES (1, NULL, NULL, NULL, NULL)'
    );
    
    await pool.query(
      'INSERT INTO banking_info (id, paypal_email, bank_rib) VALUES (1, NULL, NULL)'
    );
    
    console.log('✅ Initial data inserted\n');
    console.log('🎉 Database reset complete!\n');
    console.log('📝 Default admin credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123\n');
    console.log('⚠️  Change the password immediately after login!\n');
    
  } catch (error) {
    console.error('❌ Reset failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetDatabase();
