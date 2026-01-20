/**
 * ============================================================================
 * Object Utilities
 * ============================================================================
 * Object manipulation and utility functions
 * ============================================================================
 */

/**
 * Deep clones an object
 * @param {any} obj - Object to clone
 * @returns {any} - Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

/**
 * Merges objects deeply
 * @param {object} target - Target object
 * @param {...object} sources - Source objects
 * @returns {object} - Merged object
 */
export const deepMerge = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
};

/**
 * Checks if value is an object
 * @param {any} value - Value to check
 * @returns {boolean} - True if object
 */
export const isObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

/**
 * Picks specific keys from an object
 * @param {object} obj - Source object
 * @param {Array<string>} keys - Keys to pick
 * @returns {object} - Object with picked keys
 */
export const pick = (obj, keys) => {
  if (!isObject(obj) || !Array.isArray(keys)) return {};
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

/**
 * Omits specific keys from an object
 * @param {object} obj - Source object
 * @param {Array<string>} keys - Keys to omit
 * @returns {object} - Object without omitted keys
 */
export const omit = (obj, keys) => {
  if (!isObject(obj) || !Array.isArray(keys)) return obj;
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

/**
 * Checks if object is empty
 * @param {any} obj - Object to check
 * @returns {boolean} - True if empty
 */
export const isEmpty = (obj) => {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * Gets nested value from object by path
 * @param {object} obj - Source object
 * @param {string} path - Path to value (e.g., 'user.profile.name')
 * @param {any} defaultValue - Default value if not found
 * @returns {any} - Value or default
 */
export const get = (obj, path, defaultValue) => {
  if (!isObject(obj) || !path) return defaultValue;
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result == null || !(key in result)) {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result;
};

/**
 * Sets nested value in object by path
 * @param {object} obj - Target object
 * @param {string} path - Path to set (e.g., 'user.profile.name')
 * @param {any} value - Value to set
 * @returns {object} - Modified object
 */
export const set = (obj, path, value) => {
  if (!isObject(obj) || !path) return obj;
  const keys = path.split('.');
  const result = { ...obj };
  let current = result;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || !isObject(current[key])) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return result;
};
// Style improvement
// Performance optimization
// Documentation update
// Additional performance optimization
