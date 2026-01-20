/**
 * ============================================================================
 * Application Constants
 * ============================================================================
 * Centralized constants for the application
 * ============================================================================
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.festies.io',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Storage Keys
export const STORAGE_KEYS = {
  THEME: 'festies-theme',
  USER_PREFERENCES: 'festies-user-preferences',
  RECENT_SEARCHES: 'festies-recent-searches',
  FAVORITES: 'festies-favorites',
  CART: 'festies-cart',
};

// Network Configuration
export const NETWORKS = {
  MAINNET: {
    name: 'Mainnet',
    chainId: 1,
    apiUrl: 'https://api.stacks.co',
    explorerUrl: 'https://explorer.stacks.co',
  },
  TESTNET: {
    name: 'Testnet',
    chainId: 2147483648,
    apiUrl: 'https://api.testnet.stacks.co',
    explorerUrl: 'https://explorer.stacks.co',
  },
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
};

// Validation Limits
export const VALIDATION_LIMITS = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  MESSAGE_MIN_LENGTH: 10,
  MESSAGE_MAX_LENGTH: 500,
  ADDRESS_LENGTH: 39,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};

// Animation Durations (ms)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
};

// Debounce Delays (ms)
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  INPUT: 500,
  SCROLL: 100,
  RESIZE: 200,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Unauthorized. Please log in again.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully!',
  DELETED: 'Item deleted successfully!',
  COPIED: 'Copied to clipboard!',
  CONNECTED: 'Wallet connected successfully!',
  DISCONNECTED: 'Wallet disconnected successfully!',
};

// Festival Types
export const FESTIVAL_TYPES = [
  'Birthday',
  'Anniversary',
  'Wedding',
  'Graduation',
  'New Year',
  'Christmas',
  'Valentine\'s Day',
  'Easter',
  'Halloween',
  'Thanksgiving',
  'Other',
];

// Color Themes
export const COLOR_THEMES = {
  BLUE: 'blue',
  PURPLE: 'purple',
  GREEN: 'green',
  ORANGE: 'orange',
  PINK: 'pink',
};

// Status Types
export const STATUS_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};
