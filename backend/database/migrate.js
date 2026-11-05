import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { config } from '../src/config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { Client } = pg;

export const runMigrations = async () => {
  console.log('\n' + '='.repeat(60));
  console.log('  CodeCraftHub - Database Migration Runner');
  console.log('='.repeat(60));
  console.log(`[Target DB]:   ${config.db.database} on ${config.db.host}:${config.db.port}`);

  const client = new Client({
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password,
  });

  try {
    await client.connect();
    console.log('[Connection]:  Connected to target database successfully.\n');

    // 1. Ensure migrations tracking table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Read all migration files
    const migrationsDir = path.resolve(__dirname, 'migrations');
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('[Notice]: No migration files found in database/migrations.');
      await client.end();
      return { success: true, count: 0 };
    }

    // 3. Query already executed migrations
    const executedRes = await client.query('SELECT name FROM schema_migrations;');
    const executedSet = new Set(executedRes.rows.map((r) => r.name));

    let appliedCount = 0;

    for (const file of files) {
      if (executedSet.has(file)) {
        console.log(`  [SKIPPED]  ${file} (already executed)`);
        continue;
      }

      console.log(`  [APPLYING] ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      // Execute migration in atomic transaction
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1);', [file]);
        await client.query('COMMIT');
        console.log(`  [SUCCESS]  ${file} executed successfully.`);
        appliedCount++;
      } catch (migrationErr) {
        await client.query('ROLLBACK');
        console.error(`\n[MIGRATION ERROR in ${file}]:`, migrationErr.message);
        throw migrationErr;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`[Summary]: Applied ${appliedCount} new migration(s). Total registered: ${files.length}`);
    console.log('='.repeat(60) + '\n');

    await client.end();
    return { success: true, count: appliedCount };
  } catch (err) {
    if (client) {
      try { await client.end(); } catch (_) {}
    }

    console.error('\n[Migration Runner Failed]:', err.message);
    if (err.code === '3D000') {
      console.error(`\nDatabase "${config.db.database}" does not exist.`);
      console.error('Run "npm run db:init" first to provision the database.\n');
    } else if (err.code === '28P01') {
      console.error(`\nAuthentication failed for user "${config.db.user}". Check DB_PASSWORD in backend/.env.\n`);
    }

    return { success: false, error: err.message };
  }
};

// Direct CLI invocation
if (process.argv[1] && process.argv[1].endsWith('migrate.js')) {
  runMigrations().then((res) => {
    process.exit(res.success ? 0 : 1);
  });
}
