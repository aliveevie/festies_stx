/**
 * Math utility functions
 */

/**
 * Clamp a number between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Linear interpolation between two values
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export const lerp = (start, end, t) => {
  return start + (end - start) * t;
};

/**
 * Map a value from one range to another
 * @param {number} value - Value to map
 * @param {number} inMin - Input range minimum
 * @param {number} inMax - Input range maximum
 * @param {number} outMin - Output range minimum
 * @param {number} outMax - Output range maximum
 * @returns {number} Mapped value
 */
export const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

/**
 * Round to specified decimal places
 * @param {number} value - Value to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} Rounded value
 */
export const roundTo = (value, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

/**
 * Check if number is even
 * @param {number} n - Number to check
 * @returns {boolean} True if even
 */
export const isEven = (n) => {
  return n % 2 === 0;
};

/**
 * Check if number is odd
 * @param {number} n - Number to check
 * @returns {boolean} True if odd
 */
export const isOdd = (n) => {
  return n % 2 !== 0;
};

/**
 * Generate random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
export const random = (min = 0, max = 1) => {
  return Math.random() * (max - min) + min;
};

/**
 * Generate random integer between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export const randomInt = (min = 0, max = 1) => {
  return Math.floor(random(min, max + 1));
};

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number} Percentage (0-100)
 */
export const percentage = (value, total) => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

/**
 * Calculate average of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} Average value
 */
export const average = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
};

/**
 * Calculate sum of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} Sum
 */
export const sum = (numbers) => {
  return numbers.reduce((sum, n) => sum + n, 0);
};

/**
 * Calculate median of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} Median value
 */
export const median = (numbers) => {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

/**
 * Convert degrees to radians
 * @param {number} degrees - Degrees
 * @returns {number} Radians
 */
export const degToRad = (degrees) => {
  return (degrees * Math.PI) / 180;
};

/**
 * Convert radians to degrees
 * @param {number} radians - Radians
 * @returns {number} Degrees
 */
export const radToDeg = (radians) => {
  return (radians * 180) / Math.PI;
};

/**
 * Calculate distance between two points
 * @param {Object} p1 - Point 1 {x, y}
 * @param {Object} p2 - Point 2 {x, y}
 * @returns {number} Distance
 */
export const distance = (p1, p2) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};
// Style improvement
