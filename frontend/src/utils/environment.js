/**
 * Environment Utilities
 * Functions for detecting and working with environment variables and settings
 */

/**
 * Get environment variable
 */
export const getEnv = (key, defaultValue = null) => {
  if (typeof window === 'undefined') {
    // Server-side
    return process.env[key] || defaultValue;
  }
  
  // Client-side - check window.env or import.meta.env
  if (window.env && window.env[key] !== undefined) {
    return window.env[key];
  }
  
  if (typeof import !== 'undefined' && import.meta && import.meta.env) {
    return import.meta.env[key] || defaultValue;
  }
  
  return defaultValue;
};

/**
 * Check if development environment
 */
export const isDevelopment = () => {
  return getEnv('NODE_ENV', 'development') === 'development';
};

/**
 * Check if production environment
 */
export const isProduction = () => {
  return getEnv('NODE_ENV', 'development') === 'production';
};

/**
 * Check if test environment
 */
export const isTest = () => {
  return getEnv('NODE_ENV', 'development') === 'test';
};

/**
 * Get API base URL
 */
export const getApiUrl = () => {
  return (
    getEnv('REACT_APP_API_URL') ||
    getEnv('VITE_API_URL') ||
    getEnv('NEXT_PUBLIC_API_URL') ||
    (isDevelopment() ? 'http://localhost:3001' : 'https://api.festies.io')
  );
};

/**
 * Get blockchain network
 */
export const getNetwork = () => {
  return (
    getEnv('REACT_APP_NETWORK') ||
    getEnv('VITE_NETWORK') ||
    getEnv('NEXT_PUBLIC_NETWORK') ||
    'mainnet'
  );
};

/**
 * Get contract address
 */
export const getContractAddress = (contractName) => {
  const key = `REACT_APP_${contractName.toUpperCase()}_CONTRACT` ||
              `VITE_${contractName.toUpperCase()}_CONTRACT` ||
              `NEXT_PUBLIC_${contractName.toUpperCase()}_CONTRACT`;
  
  return getEnv(key) || null;
};

/**
 * Check if feature flag is enabled
 */
export const isFeatureEnabled = (featureName) => {
  const key = `REACT_APP_FEATURE_${featureName.toUpperCase()}` ||
              `VITE_FEATURE_${featureName.toUpperCase()}` ||
              `NEXT_PUBLIC_FEATURE_${featureName.toUpperCase()}`;
  
  const value = getEnv(key, 'false');
  return value === 'true' || value === '1' || value === 'yes';
};

/**
 * Get app version
 */
export const getAppVersion = () => {
  return (
    getEnv('REACT_APP_VERSION') ||
    getEnv('VITE_APP_VERSION') ||
    getEnv('NEXT_PUBLIC_APP_VERSION') ||
    '1.0.0'
  );
};

/**
 * Get build timestamp
 */
export const getBuildTimestamp = () => {
  return (
    getEnv('REACT_APP_BUILD_TIMESTAMP') ||
    getEnv('VITE_BUILD_TIMESTAMP') ||
    getEnv('NEXT_PUBLIC_BUILD_TIMESTAMP') ||
    new Date().toISOString()
  );
};

/**
 * Get analytics ID
 */
export const getAnalyticsId = () => {
  return (
    getEnv('REACT_APP_ANALYTICS_ID') ||
    getEnv('VITE_ANALYTICS_ID') ||
    getEnv('NEXT_PUBLIC_ANALYTICS_ID') ||
    null
  );
};

/**
 * Get sentry DSN
 */
export const getSentryDsn = () => {
  return (
    getEnv('REACT_APP_SENTRY_DSN') ||
    getEnv('VITE_SENTRY_DSN') ||
    getEnv('NEXT_PUBLIC_SENTRY_DSN') ||
    null
  );
};

/**
 * Get all environment variables as object
 */
export const getAllEnv = () => {
  if (typeof window === 'undefined') {
    return process.env || {};
  }
  
  const env = {};
  
  if (window.env) {
    Object.assign(env, window.env);
  }
  
  if (typeof import !== 'undefined' && import.meta && import.meta.env) {
    Object.assign(env, import.meta.env);
  }
  
  return env;
};

/**
 * Check if debug mode is enabled
 */
export const isDebugMode = () => {
  return (
    getEnv('REACT_APP_DEBUG') === 'true' ||
    getEnv('VITE_DEBUG') === 'true' ||
    getEnv('NEXT_PUBLIC_DEBUG') === 'true' ||
    (!isProduction() && typeof window !== 'undefined' && window.localStorage?.getItem('debug') === 'true')
  );
};
// Style improvement
// Refactor improvement
// Additional style improvement
