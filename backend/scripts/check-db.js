import pool from '../src/config/database.js';

async function checkDatabase() {
  try {
    console.log('\n📊 Database Status Check\n');
    
    // Check connection
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection: SUCCESSFUL');
    console.log(`📅 Server time: ${result.rows[0].now}\n`);
    
    // Check tables
    const tableResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    if (tableResult.rows.length === 0) {
      console.log('⚠️  No tables found. Please run: npm run migrate\n');
    } else {
      console.log('📋 Tables found:');
      for (const row of tableResult.rows) {
        const countResult = await pool.query(`SELECT COUNT(*) FROM ${row.table_name}`);
        const count = countResult.rows[0].count;
        console.log(`   • ${row.table_name} (${count} rows)`);
      }
      console.log();
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('\n💡 Make sure your database is running and .env file is configured correctly.\n');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

checkDatabase();
