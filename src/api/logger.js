/**
 * Simple structured logger for the API
 * Logs to stdout with timestamps and structured data
 */

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const CURRENT_LOG_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL || 'info'];

function formatTimestamp() {
  return new Date().toISOString();
}

function formatLog(level, message, data = {}) {
  const timestamp = formatTimestamp();
  const logEntry = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...data,
  };
  return JSON.stringify(logEntry);
}

const logger = {
  debug(message, data) {
    if (LOG_LEVELS.debug >= CURRENT_LOG_LEVEL) {
      console.log(formatLog('debug', message, data));
    }
  },

  info(message, data) {
    if (LOG_LEVELS.info >= CURRENT_LOG_LEVEL) {
      console.log(formatLog('info', message, data));
    }
  },

  warn(message, data) {
    if (LOG_LEVELS.warn >= CURRENT_LOG_LEVEL) {
      console.warn(formatLog('warn', message, data));
    }
  },

  error(message, data) {
    if (LOG_LEVELS.error >= CURRENT_LOG_LEVEL) {
      console.error(formatLog('error', message, data));
    }
  },
};

module.exports = logger;
