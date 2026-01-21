/**
 * Time Utilities
 * Functions for time manipulation, formatting, and calculations
 */

/**
 * Format milliseconds to human-readable duration
 */
export const formatDuration = (ms, options = {}) => {
  const {
    showMs = false,
    showDays = true,
    showHours = true,
    showMinutes = true,
    showSeconds = true,
  } = options;

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const parts = [];

  if (showDays && days > 0) parts.push(`${days}d`);
  if (showHours && hours % 24 > 0) parts.push(`${hours % 24}h`);
  if (showMinutes && minutes % 60 > 0) parts.push(`${minutes % 60}m`);
  if (showSeconds && seconds % 60 > 0) parts.push(`${seconds % 60}s`);
  if (showMs && ms % 1000 > 0) parts.push(`${ms % 1000}ms`);

  return parts.length > 0 ? parts.join(' ') : '0s';
};

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 */
export const getRelativeTime = (date, now = new Date()) => {
  const ms = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const isFuture = ms < 0;
  const absMs = Math.abs(ms);

  if (absMs < 60000) {
    return isFuture ? 'in a few seconds' : 'a few seconds ago';
  }
  if (absMs < 3600000) {
    const value = Math.abs(minutes);
    return isFuture ? `in ${value} minute${value !== 1 ? 's' : ''}` : `${value} minute${value !== 1 ? 's' : ''} ago`;
  }
  if (absMs < 86400000) {
    const value = Math.abs(hours);
    return isFuture ? `in ${value} hour${value !== 1 ? 's' : ''}` : `${value} hour${value !== 1 ? 's' : ''} ago`;
  }
  if (absMs < 604800000) {
    const value = Math.abs(days);
    return isFuture ? `in ${value} day${value !== 1 ? 's' : ''}` : `${value} day${value !== 1 ? 's' : ''} ago`;
  }
  if (absMs < 2592000000) {
    const value = Math.abs(weeks);
    return isFuture ? `in ${value} week${value !== 1 ? 's' : ''}` : `${value} week${value !== 1 ? 's' : ''} ago`;
  }
  if (absMs < 31536000000) {
    const value = Math.abs(months);
    return isFuture ? `in ${value} month${value !== 1 ? 's' : ''}` : `${value} month${value !== 1 ? 's' : ''} ago`;
  }
  const value = Math.abs(years);
  return isFuture ? `in ${value} year${value !== 1 ? 's' : ''}` : `${value} year${value !== 1 ? 's' : ''} ago`;
};

/**
 * Get time until a specific date
 */
export const getTimeUntil = (date) => {
  const now = new Date();
  const target = new Date(date);
  const ms = target.getTime() - now.getTime();

  return {
    ms,
    seconds: Math.floor(ms / 1000),
    minutes: Math.floor(ms / 1000 / 60),
    hours: Math.floor(ms / 1000 / 60 / 60),
    days: Math.floor(ms / 1000 / 60 / 60 / 24),
    isPast: ms < 0,
    isFuture: ms > 0,
    formatted: formatDuration(Math.abs(ms)),
  };
};

/**
 * Check if a date is today
 */
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    today.getFullYear() === checkDate.getFullYear() &&
    today.getMonth() === checkDate.getMonth() &&
    today.getDate() === checkDate.getDate()
  );
};

/**
 * Check if a date is yesterday
 */
export const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const checkDate = new Date(date);
  return (
    yesterday.getFullYear() === checkDate.getFullYear() &&
    yesterday.getMonth() === checkDate.getMonth() &&
    yesterday.getDate() === checkDate.getDate()
  );
};

/**
 * Check if a date is tomorrow
 */
export const isTomorrow = (date) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const checkDate = new Date(date);
  return (
    tomorrow.getFullYear() === checkDate.getFullYear() &&
    tomorrow.getMonth() === checkDate.getMonth() &&
    tomorrow.getDate() === checkDate.getDate()
  );
};

/**
 * Get start of day
 */
export const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of day
 */
export const endOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get start of week
 */
export const startOfWeek = (date = new Date(), startDay = 0) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day < startDay ? 7 : 0) + day - startDay;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of week
 */
export const endOfWeek = (date = new Date(), startDay = 0) => {
  const d = startOfWeek(date, startDay);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Add time to a date
 */
export const addTime = (date, amount, unit = 'milliseconds') => {
  const d = new Date(date);
  const units = {
    milliseconds: 1,
    seconds: 1000,
    minutes: 60000,
    hours: 3600000,
    days: 86400000,
    weeks: 604800000,
    months: 2592000000,
    years: 31536000000,
  };
  d.setTime(d.getTime() + amount * (units[unit] || 1));
  return d;
};

/**
 * Get difference between two dates
 */
export const getDateDiff = (date1, date2 = new Date()) => {
  const ms = new Date(date2).getTime() - new Date(date1).getTime();
  return {
    ms,
    seconds: Math.floor(Math.abs(ms) / 1000),
    minutes: Math.floor(Math.abs(ms) / 1000 / 60),
    hours: Math.floor(Math.abs(ms) / 1000 / 60 / 60),
    days: Math.floor(Math.abs(ms) / 1000 / 60 / 60 / 24),
    weeks: Math.floor(Math.abs(ms) / 1000 / 60 / 60 / 24 / 7),
    months: Math.floor(Math.abs(ms) / 1000 / 60 / 60 / 24 / 30),
    years: Math.floor(Math.abs(ms) / 1000 / 60 / 60 / 24 / 365),
  };
};

/**
 * Get "time ago" string from a millisecond timestamp.
 */
export const getTimeAgo = (timestampMs) => {
  const timestamp = Number(timestampMs);
  if (!Number.isFinite(timestamp)) return '';

  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (seconds > 0) return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  return 'just now';
};
