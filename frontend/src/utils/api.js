/**
 * ============================================================================
 * API Utilities
 * ============================================================================
 * Functions for making API calls and handling responses
 * ============================================================================
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.festies.io';

/**
 * Makes a GET request
 * @param {string} endpoint - API endpoint
 * @param {object} options - Request options
 * @returns {Promise<any>} - Response data
 */
export const get = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('GET request failed:', error);
    throw error;
  }
};

/**
 * Makes a POST request
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body
 * @param {object} options - Request options
 * @returns {Promise<any>} - Response data
 */
export const post = async (endpoint, data, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('POST request failed:', error);
    throw error;
  }
};

/**
 * Makes a PUT request
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body
 * @param {object} options - Request options
 * @returns {Promise<any>} - Response data
 */
export const put = async (endpoint, data, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('PUT request failed:', error);
    throw error;
  }
};

/**
 * Makes a DELETE request
 * @param {string} endpoint - API endpoint
 * @param {object} options - Request options
 * @returns {Promise<any>} - Response data
 */
export const del = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('DELETE request failed:', error);
    throw error;
  }
};

/**
 * Makes a request with retry logic
 * @param {Function} requestFn - Function that makes the request
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise<any>} - Response data
 */
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError;
};

/**
 * Handles API errors and extracts error messages
 * @param {Error} error - The error object
 * @returns {string} - User-friendly error message
 */
export const handleApiError = (error) => {
  if (error.message.includes('Failed to fetch')) {
    return 'Network error. Please check your connection.';
  }
  if (error.message.includes('401')) {
    return 'Unauthorized. Please log in again.';
  }
  if (error.message.includes('403')) {
    return 'Access forbidden.';
  }
  if (error.message.includes('404')) {
    return 'Resource not found.';
  }
  if (error.message.includes('500')) {
    return 'Server error. Please try again later.';
  }
  return error.message || 'An unexpected error occurred.';
};
// Performance optimization
