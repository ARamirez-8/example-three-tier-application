const { Pool } = require('pg');
const logger = require('./logger');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Log pool events
pool.on('connect', () => {
  logger.debug('Database connection established');
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', { message: err.message });
});

// Wrap query to add logging
const originalQuery = pool.query.bind(pool);
pool.query = function(text, values, callback) {
  const start = Date.now();
  
  // Handle both callback and promise-based usage
  if (typeof values === 'function') {
    callback = values;
    values = [];
  }
  
  if (callback) {
    return originalQuery(text, values, (err, result) => {
      const duration = Date.now() - start;
      if (err) {
        logger.error('Database query failed', { 
          query: text, 
          duration: `${duration}ms`,
          error: err.message 
        });
      } else {
        logger.debug('Database query executed', { 
          query: text.substring(0, 100), 
          duration: `${duration}ms`,
          rows: result?.rowCount || 0
        });
      }
      callback(err, result);
    });
  } else {
    // Promise-based
    return originalQuery(text, values).then(
      (result) => {
        const duration = Date.now() - start;
        logger.debug('Database query executed', { 
          query: text.substring(0, 100), 
          duration: `${duration}ms`,
          rows: result?.rowCount || 0
        });
        return result;
      },
      (err) => {
        const duration = Date.now() - start;
        logger.error('Database query failed', { 
          query: text, 
          duration: `${duration}ms`,
          error: err.message 
        });
        throw err;
      }
    );
  }
};

module.exports = pool;
