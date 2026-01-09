import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import pool from '../src/config/database.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
// schema.sql contains the full set of DDL statements we want to apply
const schemaPath = path.resolve(currentDir, '../database/schema.sql');

async function runMigrations() {
  const schema = await fs.readFile(schemaPath, 'utf8');
  console.log('Applying database schema...');
  await pool.query(schema);
  console.log('Schema applied successfully.');
}

runMigrations()
  .catch((error) => {
    console.error('Migration failed:', error.message ?? error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
