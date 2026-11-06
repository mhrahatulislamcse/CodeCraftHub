import pg from 'pg';
import { config } from '../src/config/env.js';
import { runMigrations } from './migrate.js';
import { runSeeds } from './seed.js';

const { Client } = pg;

export const resetDatabase = async () => {
  console.log('\n' + '='.repeat(60));
  console.log('  CodeCraftHub - Database Reset Utility');
  console.log('='.repeat(60));
  console.log(`[Target DB]: ${config.db.database}`);

  const client = new Client({
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password,
  });

  try {
    await client.connect();
    console.log('[Notice]: Dropping public schema cascadingly...');
    await client.query('DROP SCHEMA public CASCADE;');
    await client.query('CREATE SCHEMA public;');
    await client.query('GRANT ALL ON SCHEMA public TO public;');
    console.log('[Success]: Public schema recreated cleanly.');
    await client.end();

    // Run migrations
    console.log('\n[Step 1/2]: Running migrations...');
    const migRes = await runMigrations();
    if (!migRes.success) throw new Error(migRes.error);

    // Run seeds
    console.log('\n[Step 2/2]: Running seeds...');
    const seedRes = await runSeeds();
    if (!seedRes.success) throw new Error(seedRes.error);

    console.log('\n[Database Reset]: Completed successfully! All tables recreated and seeded.');
    return { success: true };
  } catch (err) {
    if (client) {
      try { await client.end(); } catch (_) {}
    }
    console.error('\n[Database Reset Error]:', err.message);
    return { success: false, error: err.message };
  }
};

if (process.argv[1] && process.argv[1].endsWith('reset.js')) {
  resetDatabase().then((res) => {
    process.exit(res.success ? 0 : 1);
  });
}

