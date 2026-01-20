/**
 * ============================================================================
 * Storage Utilities
 * ============================================================================
 * Enhanced localStorage and sessionStorage utilities
 * ============================================================================
 */

/**
 * Gets an item from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} - Stored value or default
 */
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Sets an item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} - Success status
 */
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Removes an item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} - Success status
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Clears all items from localStorage
 * @returns {boolean} - Success status
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Gets an item from sessionStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} - Stored value or default
 */
export const getSessionItem = (key, defaultValue = null) => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading sessionStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Sets an item in sessionStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} - Success status
 */
export const setSessionItem = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting sessionStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Removes an item from sessionStorage
 * @param {string} key - Storage key
 * @returns {boolean} - Success status
 */
export const removeSessionItem = (key) => {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing sessionStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Clears all items from sessionStorage
 * @returns {boolean} - Success status
 */
export const clearSession = () => {
  try {
    sessionStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing sessionStorage:', error);
    return false;
  }
};

/**
 * Checks if storage is available
 * @param {string} type - 'localStorage' or 'sessionStorage'
 * @returns {boolean} - True if storage is available
 */
export const isStorageAvailable = (type = 'localStorage') => {
  try {
    const storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
};
