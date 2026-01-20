/**
 * Number utility functions
 */

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @param {string} locale - Locale (default: 'en-US')
 * @returns {string} Formatted number
 */
export const formatNumber = (num, locale = 'en-US') => {
  if (num == null || isNaN(num)) return '0';
  return new Intl.NumberFormat(locale).format(num);
};

/**
 * Format number as currency
 * @param {number} num - Number to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale (default: 'en-US')
 * @returns {string} Formatted currency
 */
export const formatCurrency = (num, currency = 'USD', locale = 'en-US') => {
  if (num == null || isNaN(num)) return '$0.00';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(num);
};

/**
 * Format number with abbreviation (K, M, B)
 * @param {number} num - Number to format
 * @returns {string} Abbreviated number
 */
export const formatAbbreviated = (num) => {
  if (num == null || isNaN(num)) return '0';
  
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  
  return num.toString();
};

/**
 * Parse number from string with fallback
 * @param {string|number} value - Value to parse
 * @param {number} fallback - Fallback value (default: 0)
 * @returns {number} Parsed number
 */
export const parseNumber = (value, fallback = 0) => {
  if (typeof value === 'number') return isNaN(value) ? fallback : value;
  if (typeof value !== 'string') return fallback;
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * Check if value is a valid number
 * @param {any} value - Value to check
 * @returns {boolean} True if valid number
 */
export const isValidNumber = (value) => {
  return value != null && !isNaN(value) && isFinite(value);
};

/**
 * Normalize number to 0-1 range
 * @param {number} value - Value to normalize
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Normalized value (0-1)
 */
export const normalize = (value, min, max) => {
  if (max === min) return 0;
  return (value - min) / (max - min);
};

/**
 * Add leading zeros to number
 * @param {number} num - Number to pad
 * @param {number} length - Target length
 * @returns {string} Padded number string
 */
export const padNumber = (num, length) => {
  return String(num).padStart(length, '0');
};

/**
 * Calculate percentage change
 * @param {number} oldValue - Old value
 * @param {number} newValue - New value
 * @returns {number} Percentage change
 */
export const percentChange = (oldValue, newValue) => {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Get ordinal suffix (st, nd, rd, th)
 * @param {number} num - Number
 * @returns {string} Ordinal suffix
 */
export const getOrdinalSuffix = (num) => {
  const j = num % 10;
  const k = num % 100;
  
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
};

/**
 * Format number as ordinal (1st, 2nd, 3rd, etc.)
 * @param {number} num - Number
 * @returns {string} Ordinal number
 */
export const formatOrdinal = (num) => {
  return `${num}${getOrdinalSuffix(num)}`;
};

/**
 * Convert bytes to human readable size
 * @param {number} bytes - Bytes
 * @returns {string} Formatted size
 */
export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
// Style improvement
// Refactor improvement
// Additional performance optimization
