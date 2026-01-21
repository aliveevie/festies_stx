/**
 * Logger Service
 * Centralized logging service with levels, formatting, and persistence
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
};

const LOG_LEVEL_NAMES = {
  0: 'DEBUG',
  1: 'INFO',
  2: 'WARN',
  3: 'ERROR',
};

class Logger {
  constructor() {
    this.level = LOG_LEVELS.INFO;
    this.enableConsole = true;
    this.enableStorage = false;
    this.maxStorageSize = 100;
    this.logs = [];
    this.onLog = null;
  }

  /**
   * Set log level
   */
  setLevel(level) {
    if (typeof level === 'string') {
      this.level = LOG_LEVELS[level.toUpperCase()] ?? LOG_LEVELS.INFO;
    } else {
      this.level = level;
    }
  }

  /**
   * Enable/disable console logging
   */
  setConsoleEnabled(enabled) {
    this.enableConsole = enabled;
  }

  /**
   * Enable/disable storage logging
   */
  setStorageEnabled(enabled) {
    this.enableStorage = enabled;
  }

  /**
   * Set callback for log events
   */
  setOnLog(callback) {
    this.onLog = callback;
  }

  /**
   * Format log message
   */
  formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    const levelName = LOG_LEVEL_NAMES[level] || 'UNKNOWN';
    const prefix = `[${timestamp}] [${levelName}]`;

    if (data) {
      return { timestamp, level: levelName, message, data };
    }
    return { timestamp, level: levelName, message };
  }

  /**
   * Store log
   */
  storeLog(logEntry) {
    if (!this.enableStorage) return;

    this.logs.push(logEntry);

    if (this.logs.length > this.maxStorageSize) {
      this.logs.shift();
    }

    try {
      localStorage.setItem('app_logs', JSON.stringify(this.logs));
    } catch (error) {
      // Storage quota exceeded or disabled
      console.warn('Failed to store log:', error);
    }
  }

  /**
   * Log message
   */
  log(level, message, data) {
    if (level < this.level) return;

    const logEntry = this.formatMessage(level, message, data);

    if (this.enableConsole) {
      const consoleMethod =
        level === LOG_LEVELS.DEBUG
          ? 'debug'
          : level === LOG_LEVELS.INFO
          ? 'info'
          : level === LOG_LEVELS.WARN
          ? 'warn'
          : 'error';

      if (data) {
        console[consoleMethod](logEntry.message, data);
      } else {
        console[consoleMethod](logEntry.message);
      }
    }

    this.storeLog(logEntry);

    if (this.onLog) {
      this.onLog(logEntry);
    }
  }

  /**
   * Debug log
   */
  debug(message, data) {
    this.log(LOG_LEVELS.DEBUG, message, data);
  }

  /**
   * Info log
   */
  info(message, data) {
    this.log(LOG_LEVELS.INFO, message, data);
  }

  /**
   * Warn log
   */
  warn(message, data) {
    this.log(LOG_LEVELS.WARN, message, data);
  }

  /**
   * Error log
   */
  error(message, data) {
    this.log(LOG_LEVELS.ERROR, message, data);
  }

  /**
   * Get stored logs
   */
  getLogs(filter = null) {
    if (filter) {
      return this.logs.filter(filter);
    }
    return [...this.logs];
  }

  /**
   * Clear stored logs
   */
  clearLogs() {
    this.logs = [];
    try {
      localStorage.removeItem('app_logs');
    } catch (error) {
      console.warn('Failed to clear logs:', error);
    }
  }

  /**
   * Export logs
   */
  exportLogs(format = 'json') {
    const logs = this.getLogs();

    if (format === 'json') {
      return JSON.stringify(logs, null, 2);
    } else if (format === 'text') {
      return logs
        .map(
          (log) =>
            `[${log.timestamp}] [${log.level}] ${log.message}${
              log.data ? ` ${JSON.stringify(log.data)}` : ''
            }`
        )
        .join('\n');
    }

    return logs;
  }
}

// Create singleton instance
const logger = new Logger();

export default logger;

// Export for configuration
export { LOG_LEVELS, LOG_LEVEL_NAMES };
// Style improvement
