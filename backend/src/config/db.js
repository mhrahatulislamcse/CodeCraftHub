import pg from 'pg';
import { config } from './env.js';

const { Pool } = pg;

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  max: config.db.max,
  idleTimeoutMillis: config.db.idleTimeoutMillis,
  connectionTimeoutMillis: config.db.connectionTimeoutMillis,
});

pool.on('error', (err) => {
  console.error('[PostgreSQL Pool Error]: Unexpected client error', err.message);
});

/**
 * Execute parameterized query
 * @param {string} text 
 * @param {Array} params 
 * @returns {Promise<pg.QueryResult>}
 */
export const query = (text, params) => {
  return pool.query(text, params);
};

/**
 * Acquire client for transactional queries
 */
export const getClient = () => {
  return pool.connect();
};

/**
 * Test database connectivity
 * @returns {Promise<{success: boolean, message: string, timestamp?: string, error?: string}>}
 */
export const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW() as current_time, current_database() as database;');
    return {
      success: true,
      message: 'PostgreSQL database connected successfully',
      database: res.rows[0].database,
      timestamp: res.rows[0].current_time,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to connect to PostgreSQL database',
      error: error.message,
    };
  }
};

export default {
  pool,
  query,
  getClient,
  testConnection,
};

