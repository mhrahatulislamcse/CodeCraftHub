import pg from 'pg';
import { config } from '../src/config/env.js';

const { Client } = pg;

export const initializeDatabase = async () => {
  const targetDbName = config.db.database || 'codecrafthub_db';
  console.log(`[Database Init] Checking if database "${targetDbName}" exists...`);

  // Connect to default 'postgres' database to check / create target database
  const adminClient = new Client({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: 'postgres',
  });

  try {
    await adminClient.connect();
    console.log('[Database Init] Connected to PostgreSQL service successfully.');

    const checkDbRes = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1;`,
      [targetDbName]
    );

    if (checkDbRes.rows.length === 0) {
      console.log(`[Database Init] Creating database "${targetDbName}"...`);
      // CREATE DATABASE cannot run in a transaction block or with parameterized query
      await adminClient.query(`CREATE DATABASE "${targetDbName}" WITH ENCODING = 'UTF8';`);
      console.log(`[Database Init] Database "${targetDbName}" created successfully!`);
    } else {
      console.log(`[Database Init] Database "${targetDbName}" already exists.`);
    }

    await adminClient.end();
    return { success: true, message: `Database "${targetDbName}" ready.` };
  } catch (error) {
    if (adminClient) {
      try { await adminClient.end(); } catch (_) {}
    }

    if (error.code === '28P01') {
      console.error('\n[Database Init Error]: Authentication failed (password incorrect).');
      console.error(`Please update DB_PASSWORD in "backend/.env" with your PostgreSQL password.`);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n[Database Init Error]: Could not connect to PostgreSQL service.');
      console.error(`Ensure PostgreSQL 18 is running on ${config.db.host}:${config.db.port}.`);
    } else {
      console.error('\n[Database Init Error]:', error.message);
    }

    return { success: false, error: error.message };
  }
};

// Execute if run directly from CLI
if (process.argv[1] && process.argv[1].endsWith('init-db.js')) {
  initializeDatabase().then((res) => {
    process.exit(res.success ? 0 : 1);
  });
}
