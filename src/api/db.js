const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Log pool events
pool.on('connect', () => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'debug',
    message: 'Database connection established'
  }));
});

pool.on('error', (err) => {
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'error',
    message: 'Unexpected error on idle client',
    error: err.message
  }));
});

// Wrap query method to add logging
const originalQuery = pool.query.bind(pool);
pool.query = function(text, values, callback) {
  const start = Date.now();
  const query = text.replace(/\s+/g, ' ').substring(0, 100);
  
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'debug',
    message: 'Executing query',
    query
  }));

  if (typeof values === 'function') {
    callback = values;
    values = undefined;
  }

  const wrappedCallback = (err, result) => {
    const duration = Date.now() - start;
    if (err) {
      console.error(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        message: 'Query failed',
        query,
        duration: `${duration}ms`,
        error: err.message
      }));
    } else {
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'debug',
        message: 'Query completed',
        query,
        duration: `${duration}ms`,
        rows: result.rowCount
      }));
    }
    if (callback) callback(err, result);
  };

  if (callback) {
    return originalQuery(text, values, wrappedCallback);
  } else {
    return originalQuery(text, values).then(
      (result) => {
        const duration = Date.now() - start;
        console.log(JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'debug',
          message: 'Query completed',
          query,
          duration: `${duration}ms`,
          rows: result.rowCount
        }));
        return result;
      },
      (err) => {
        const duration = Date.now() - start;
        console.error(JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'error',
          message: 'Query failed',
          query,
          duration: `${duration}ms`,
          error: err.message
        }));
        throw err;
      }
    );
  }
};

module.exports = pool;
