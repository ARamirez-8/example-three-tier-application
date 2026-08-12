const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Log pool events
pool.on('connect', () => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'Database connection established',
  }));
});

pool.on('error', (err) => {
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'error',
    message: 'Unexpected error on idle client',
    error: err.message,
  }));
});

// Wrap query method to add logging
const originalQuery = pool.query.bind(pool);
pool.query = function(text, values, callback) {
  const start = Date.now();
  const duration = () => Date.now() - start;
  
  // Handle both callback and promise-based usage
  if (typeof callback === 'function') {
    return originalQuery(text, values, (err, result) => {
      if (err) {
        console.error(JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'error',
          message: 'Database query error',
          query: text.substring(0, 100),
          duration: `${duration()}ms`,
          error: err.message,
        }));
      } else {
        console.log(JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'debug',
          message: 'Database query executed',
          query: text.substring(0, 100),
          duration: `${duration()}ms`,
          rows: result.rowCount,
        }));
      }
      callback(err, result);
    });
  } else {
    // Promise-based
    return originalQuery(text, values).then(
      (result) => {
        console.log(JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'debug',
          message: 'Database query executed',
          query: text.substring(0, 100),
          duration: `${duration()}ms`,
          rows: result.rowCount,
        }));
        return result;
      },
      (err) => {
        console.error(JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'error',
          message: 'Database query error',
          query: text.substring(0, 100),
          duration: `${duration()}ms`,
          error: err.message,
        }));
        throw err;
      }
    );
  }
};

module.exports = pool;
