import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { config } from '../src/config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { Client } = pg;

export const runSeeds = async () => {
  console.log('\n' + '='.repeat(60));
  console.log('  CodeCraftHub - Database Seed Runner');
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

    const seedsDir = path.resolve(__dirname, 'seeds');
    const files = fs
      .readdirSync(seedsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('[Notice]: No seed files found in database/seeds.');
      await client.end();
      return { success: true, count: 0 };
    }

    let seededCount = 0;

    for (const file of files) {
      console.log(`  [SEEDING]  ${file}...`);
      const filePath = path.join(seedsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('COMMIT');
        console.log(`  [SUCCESS]  ${file} loaded successfully.`);
        seededCount++;
      } catch (seedErr) {
        await client.query('ROLLBACK');
        console.error(`\n[SEED ERROR in ${file}]:`, seedErr.message);
        throw seedErr;
      }
    }

    // Verify seeded counts
    console.log('\n[Database Verification - Row Counts]:');
    const tables = [
      'roles',
      'users',
      'user_profiles',
      'categories',
      'skills',
      'courses',
      'lessons',
      'enrollments',
      'lesson_progress',
      'learning_paths',
      'ai_recommendations',
      'reviews',
    ];

    for (const t of tables) {
      const res = await client.query(`SELECT COUNT(*) as count FROM ${t};`);
      console.log(`  - ${t.padEnd(20)}: ${res.rows[0].count} records`);
    }

    console.log('\n' + '='.repeat(60));
    console.log(`[Summary]: Successfully executed ${seededCount} seed file(s).`);
    console.log('='.repeat(60) + '\n');

    await client.end();
    return { success: true, count: seededCount };
  } catch (err) {
    if (client) {
      try { await client.end(); } catch (_) {}
    }

    console.error('\n[Seed Runner Failed]:', err.message);
    return { success: false, error: err.message };
  }
};

// Direct CLI invocation
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  runSeeds().then((res) => {
    process.exit(res.success ? 0 : 1);
  });
}

