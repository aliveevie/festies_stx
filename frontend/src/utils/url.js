/**
 * URL utility functions
 */

/**
 * Build URL with query parameters
 * @param {string} baseUrl - Base URL
 * @param {Object} params - Query parameters
 * @returns {string} URL with query string
 */
export const buildUrl = (baseUrl, params = {}) => {
  const url = new URL(baseUrl, window.location.origin);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') {
      url.searchParams.append(key, String(value));
    }
  });
  
  return url.toString();
};

/**
 * Parse query string from URL
 * @param {string} url - URL string
 * @returns {Object} Parsed query parameters
 */
export const parseQueryString = (url = window.location.search) => {
  const params = new URLSearchParams(url);
  const result = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
};

/**
 * Get query parameter value
 * @param {string} key - Parameter key
 * @param {string} url - URL string (optional)
 * @returns {string|null} Parameter value
 */
export const getQueryParam = (key, url = window.location.search) => {
  const params = new URLSearchParams(url);
  return params.get(key);
};

/**
 * Set query parameter in URL
 * @param {string} key - Parameter key
 * @param {string} value - Parameter value
 * @param {string} url - URL string (optional)
 * @returns {string} New URL with parameter
 */
export const setQueryParam = (key, value, url = window.location.href) => {
  const urlObj = new URL(url);
  urlObj.searchParams.set(key, value);
  return urlObj.toString();
};

/**
 * Remove query parameter from URL
 * @param {string} key - Parameter key
 * @param {string} url - URL string (optional)
 * @returns {string} New URL without parameter
 */
export const removeQueryParam = (key, url = window.location.href) => {
  const urlObj = new URL(url);
  urlObj.searchParams.delete(key);
  return urlObj.toString();
};

/**
 * Check if URL is valid
 * @param {string} url - URL string
 * @returns {boolean} True if valid URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get domain from URL
 * @param {string} url - URL string
 * @returns {string} Domain name
 */
export const getDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
};

/**
 * Get protocol from URL
 * @param {string} url - URL string
 * @returns {string} Protocol (http/https)
 */
export const getProtocol = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol.replace(':', '');
  } catch {
    return '';
  }
};

/**
 * Normalize URL (ensure protocol)
 * @param {string} url - URL string
 * @param {string} protocol - Default protocol (default: 'https')
 * @returns {string} Normalized URL
 */
export const normalizeUrl = (url, protocol = 'https') => {
  if (!url) return '';
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  return `${protocol}://${url}`;
};

/**
 * Create download link
 * @param {string} url - File URL
 * @param {string} filename - Download filename
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Open URL in new tab
 * @param {string} url - URL to open
 */
export const openInNewTab = (url) => {
  if (typeof window === 'undefined') return;
  window.open(url, '_blank', 'noopener,noreferrer');
};
