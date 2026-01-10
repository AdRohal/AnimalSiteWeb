import bcrypt from 'bcryptjs';
import pool from '../src/config/database.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function setupAdmin() {
  try {
    console.log('\n🔐 Admin User Setup\n');
    
    const username = await question('Enter admin username: ');
    const password = await question('Enter admin password: ');
    const email = await question('Enter admin email: ');
    
    if (!username || !password) {
      console.error('❌ Username and password are required');
      process.exit(1);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert admin user
    const result = await pool.query(
      'INSERT INTO admins (username, password, email) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, hashedPassword, email || null]
    );
    
    console.log('\n✅ Admin user created successfully!');
    console.log(`📋 Details:`);
    console.log(`   ID: ${result.rows[0].id}`);
    console.log(`   Username: ${result.rows[0].username}`);
    console.log(`   Email: ${result.rows[0].email || 'Not set'}`);
    console.log('\n💡 You can now login with these credentials in the admin dashboard.\n');
    
  } catch (error) {
    if (error.code === '23505') {
      console.error('❌ Username already exists. Please choose a different username.');
    } else {
      console.error('❌ Error creating admin user:', error.message);
    }
    process.exit(1);
  } finally {
    rl.close();
    await pool.end();
  }
}

setupAdmin();
