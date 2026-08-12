const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Log connection events
pool.on('connect', () => {
  console.log('[DEBUG] New database connection established');
});

pool.on('error', (err) => {
  console.error('[ERROR] Unexpected error on idle client:', err.message);
});

// Log when pool is created
console.log('[INFO] Database connection pool initialized');

module.exports = pool;
