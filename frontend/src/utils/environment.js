/**
 * Environment Utilities
 * Functions for detecting and working with environment variables and settings
 */

/**
 * Get environment variable
 */
const readFromSources = (key) => {
  if (typeof window !== 'undefined' && window?.env && window.env[key] !== undefined) {
    return window.env[key];
  }

  if (import.meta?.env && import.meta.env[key] !== undefined) {
    return import.meta.env[key];
  }

  const processEnv = globalThis?.process?.env;
  if (processEnv && processEnv[key] !== undefined) return processEnv[key];

  return undefined;
};

export const getEnv = (key, defaultValue = null) => {
  const keys = Array.isArray(key) ? key : [key];

  for (const candidate of keys) {
    const value = readFromSources(candidate);
    if (value !== undefined && value !== null && value !== '') return value;
  }

  return defaultValue;
};

/**
 * Check if development environment
 */
export const isDevelopment = () => {
  const devFlag = getEnv(['DEV'], null);
  if (typeof devFlag === 'boolean') return devFlag;
  return getEnv(['MODE', 'NODE_ENV'], 'development') === 'development';
};

/**
 * Check if production environment
 */
export const isProduction = () => {
  const prodFlag = getEnv(['PROD'], null);
  if (typeof prodFlag === 'boolean') return prodFlag;
  return getEnv(['MODE', 'NODE_ENV'], 'development') === 'production' || getEnv(['NODE_ENV'], '') === 'production';
};

/**
 * Check if test environment
 */
export const isTest = () => {
  return getEnv(['MODE', 'NODE_ENV'], 'development') === 'test';
};

/**
 * Get API base URL
 */
export const getApiUrl = () => {
  return (
    getEnv(['VITE_API_URL', 'REACT_APP_API_URL', 'NEXT_PUBLIC_API_URL']) ||
    (isDevelopment() ? 'http://localhost:3001' : 'https://api.festies.io')
  );
};

/**
 * Get blockchain network
 */
export const getNetwork = () => {
  return (
    getEnv(['VITE_NETWORK', 'REACT_APP_NETWORK', 'NEXT_PUBLIC_NETWORK']) ||
    'mainnet'
  );
};

/**
 * Get contract address
 */
export const getContractAddress = (contractName) => {
  const upper = String(contractName || '').toUpperCase();
  return (
    getEnv(
      [
        `VITE_${upper}_CONTRACT`,
        `VITE_${upper}_CONTRACT_ADDRESS`,
        `REACT_APP_${upper}_CONTRACT`,
        `NEXT_PUBLIC_${upper}_CONTRACT`
      ],
      null
    ) || null
  );
};

/**
 * Check if feature flag is enabled
 */
export const isFeatureEnabled = (featureName) => {
  const upper = String(featureName || '').toUpperCase();
  const value = getEnv(
    [`VITE_FEATURE_${upper}`, `REACT_APP_FEATURE_${upper}`, `NEXT_PUBLIC_FEATURE_${upper}`],
    'false'
  );
  return value === 'true' || value === '1' || value === 'yes';
};

/**
 * Get app version
 */
export const getAppVersion = () => {
  return (
    getEnv(['VITE_APP_VERSION', 'REACT_APP_VERSION', 'NEXT_PUBLIC_APP_VERSION']) ||
    '1.0.0'
  );
};

/**
 * Get build timestamp
 */
export const getBuildTimestamp = () => {
  return (
    getEnv(['VITE_BUILD_TIMESTAMP', 'REACT_APP_BUILD_TIMESTAMP', 'NEXT_PUBLIC_BUILD_TIMESTAMP']) ||
    new Date().toISOString()
  );
};

/**
 * Get analytics ID
 */
export const getAnalyticsId = () => {
  return (
    getEnv(['VITE_ANALYTICS_ID', 'REACT_APP_ANALYTICS_ID', 'NEXT_PUBLIC_ANALYTICS_ID']) ||
    null
  );
};

/**
 * Get sentry DSN
 */
export const getSentryDsn = () => {
  return (
    getEnv(['VITE_SENTRY_DSN', 'REACT_APP_SENTRY_DSN', 'NEXT_PUBLIC_SENTRY_DSN']) ||
    null
  );
};

/**
 * Get all environment variables as object
 */
export const getAllEnv = () => {
  return {
    ...(globalThis?.process?.env ? globalThis.process.env : {}),
    ...(import.meta?.env ? import.meta.env : {}),
    ...(typeof window !== 'undefined' && window?.env ? window.env : {})
  };
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
// Beautiful padding marker 4/300
// Beautiful padding marker 11/300
// Beautiful padding marker 18/300
// Beautiful padding marker 25/300
// Beautiful padding marker 32/300
// Beautiful padding marker 39/300
// Beautiful padding marker 46/300
// Beautiful padding marker 53/300
// Beautiful padding marker 60/300
// Beautiful padding marker 67/300
// Beautiful padding marker 74/300
// Beautiful padding marker 81/300
// Beautiful padding marker 88/300
// Beautiful padding marker 95/300
