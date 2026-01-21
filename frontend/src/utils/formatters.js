/**
 * ============================================================================
 * Formatter Utilities
 * ============================================================================
 * Comprehensive formatting functions for display
 * ============================================================================
 */

/**
 * Formats a Stacks address with ellipsis
 * @param {string} address - The address to format
 * @param {number} start - Characters to show at start
 * @param {number} end - Characters to show at end
 * @returns {string} - Formatted address
 */
export const formatAddress = (address, start = 6, end = 4) => {
  if (!address || typeof address !== 'string') return 'N/A';
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

/**
 * Formats STX amount with proper decimals
 * @param {number|string} amount - The amount in microSTX
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted STX amount
 */
export const formatSTX = (amount, decimals = 4) => {
  if (!amount && amount !== 0) return '0.0000';
  const stx = typeof amount === 'string' ? parseFloat(amount) : amount;
  const stxAmount = stx / 1000000; // Convert microSTX to STX
  return stxAmount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Formats a number with commas
 * @param {number|string} number - The number to format
 * @returns {string} - Formatted number
 */
export const formatNumber = (number) => {
  if (!number && number !== 0) return '0';
  const num = typeof number === 'string' ? parseFloat(number) : number;
  return num.toLocaleString('en-US');
};

/**
 * Formats a percentage value
 * @param {number|string} value - The percentage value
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (!value && value !== 0) return '0%';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return `${num.toFixed(decimals)}%`;
};

/**
 * Formats a date to relative time (e.g., "2 hours ago")
 * @param {number|Date} timestamp - The timestamp or date
 * @returns {string} - Formatted relative time
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'Unknown';
  
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

/**
 * Formats a date to readable string
 * @param {number|Date} timestamp - The timestamp or date
 * @param {object} options - Formatting options
 * @returns {string} - Formatted date
 */
export const formatDate = (timestamp, options = {}) => {
  if (!timestamp) return 'Unknown';
  
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };
  
  return date.toLocaleDateString('en-US', defaultOptions);
};

/**
 * Formats file size in human-readable format
 * @param {number} bytes - The size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Formats a duration in seconds to human-readable format
 * @param {number} seconds - The duration in seconds
 * @returns {string} - Formatted duration
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds === 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);
  
  return parts.join(' ') || '0s';
};

/**
 * Formats a transaction ID with ellipsis
 * @param {string} txId - The transaction ID
 * @returns {string} - Formatted transaction ID
 */
export const formatTransactionId = (txId) => {
  if (!txId || typeof txId !== 'string') return 'N/A';
  if (txId.length <= 16) return txId;
  return `${txId.slice(0, 8)}...${txId.slice(-8)}`;
};

/**
 * Formats a token ID with padding
 * @param {number|string} tokenId - The token ID
 * @param {number} padding - Number of digits to pad to
 * @returns {string} - Formatted token ID
 */
export const formatTokenId = (tokenId, padding = 4) => {
  if (!tokenId && tokenId !== 0) return 'N/A';
  const id = typeof tokenId === 'string' ? parseInt(tokenId) : tokenId;
  return `#${String(id).padStart(padding, '0')}`;
};

/**
 * Formats a price with currency symbol
 * @param {number|string} amount - The amount
 * @param {string} currency - The currency symbol
 * @returns {string} - Formatted price
 */
export const formatPrice = (amount, currency = 'STX') => {
  if (!amount && amount !== 0) return `0 ${currency}`;
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${formatSTX(num)} ${currency}`;
};
