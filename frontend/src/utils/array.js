/**
 * ============================================================================
 * Array Utilities
 * ============================================================================
 * Array manipulation and utility functions
 * ============================================================================
 */

/**
 * Chunks an array into smaller arrays of specified size
 * @param {Array} array - The array to chunk
 * @param {number} size - Chunk size
 * @returns {Array} - Array of chunks
 */
export const chunk = (array, size) => {
  if (!Array.isArray(array) || size <= 0) return [];
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Removes duplicate items from an array
 * @param {Array} array - The array
 * @returns {Array} - Array without duplicates
 */
export const unique = (array) => {
  if (!Array.isArray(array)) return [];
  return [...new Set(array)];
};

/**
 * Groups array items by a key
 * @param {Array} array - The array
 * @param {string|Function} key - Key to group by
 * @returns {Object} - Grouped object
 */
export const groupBy = (array, key) => {
  if (!Array.isArray(array)) return {};
  
  return array.reduce((groups, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {});
};

/**
 * Sorts an array by a key
 * @param {Array} array - The array
 * @param {string|Function} key - Key to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} - Sorted array
 */
export const sortBy = (array, key, order = 'asc') => {
  if (!Array.isArray(array)) return [];
  
  const sorted = [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key];
    const bVal = typeof key === 'function' ? key(b) : b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
};

/**
 * Flattens a nested array
 * @param {Array} array - The array
 * @param {number} depth - Flattening depth
 * @returns {Array} - Flattened array
 */
export const flatten = (array, depth = Infinity) => {
  if (!Array.isArray(array)) return [];
  return array.flat(depth);
};

/**
 * Shuffles an array
 * @param {Array} array - The array
 * @returns {Array} - Shuffled array
 */
export const shuffle = (array) => {
  if (!Array.isArray(array)) return [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Gets random item from array
 * @param {Array} array - The array
 * @returns {*} - Random item
 */
export const random = (array) => {
  if (!Array.isArray(array) || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Gets first N items from array
 * @param {Array} array - The array
 * @param {number} n - Number of items
 * @returns {Array} - First N items
 */
export const take = (array, n) => {
  if (!Array.isArray(array)) return [];
  return array.slice(0, n);
};

/**
 * Gets last N items from array
 * @param {Array} array - The array
 * @param {number} n - Number of items
 * @returns {Array} - Last N items
 */
export const takeLast = (array, n) => {
  if (!Array.isArray(array)) return [];
  return array.slice(-n);
};
// Style improvement
// Performance optimization
