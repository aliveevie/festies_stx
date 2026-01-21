/**
 * ============================================================================
 * Cache Service
 * ============================================================================
 * Service for caching API responses and data
 * ============================================================================
 */

const CACHE_PREFIX = 'festies_cache_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached data
 * @param {string} key - Cache key
 * @returns {any|null} - Cached data or null
 */
export const getCache = (key) => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (!cached) return null;
    
    const { data, expires } = JSON.parse(cached);
    
    if (Date.now() > expires) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

/**
 * Set cached data
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttl - Time to live in milliseconds
 */
export const setCache = (key, data, ttl = DEFAULT_TTL) => {
  try {
    const cached = {
      data,
      expires: Date.now() + ttl,
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cached));
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

/**
 * Remove cached data
 * @param {string} key - Cache key
 */
export const removeCache = (key) => {
  try {
    localStorage.removeItem(CACHE_PREFIX + key);
  } catch (error) {
    console.error('Cache remove error:', error);
  }
};

/**
 * Clear all cache
 */
export const clearCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Cache clear error:', error);
  }
};

/**
 * Get cache statistics
 * @returns {object} - Cache statistics
 */
export const getCacheStats = () => {
  try {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    
    let totalSize = 0;
    let expiredCount = 0;
    const now = Date.now();
    
    cacheKeys.forEach(key => {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          totalSize += cached.length;
          const { expires } = JSON.parse(cached);
          if (now > expires) {
            expiredCount++;
          }
        }
      } catch {
        // Ignore parse errors
      }
    });
    
    return {
      totalKeys: cacheKeys.length,
      expiredKeys: expiredCount,
      totalSize,
      sizeFormatted: `${(totalSize / 1024).toFixed(2)} KB`,
    };
  } catch (error) {
    console.error('Cache stats error:', error);
    return { totalKeys: 0, expiredKeys: 0, totalSize: 0, sizeFormatted: '0 KB' };
  }
};

/**
 * Cache with async function
 * @param {string} key - Cache key
 * @param {Function} fn - Async function to execute
 * @param {number} ttl - Time to live in milliseconds
 * @returns {Promise<any>} - Cached or fresh data
 */
export const cacheAsync = async (key, fn, ttl = DEFAULT_TTL) => {
  const cached = getCache(key);
  if (cached !== null) {
    return cached;
  }
  
  const data = await fn();
  setCache(key, data, ttl);
  return data;
};
// Performance optimization
// Documentation update
