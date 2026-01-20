/**
 * Crypto utility functions
 */

/**
 * Generate secure random string
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
export const generateSecureRandom = (length = 32) => {
  if (typeof window === 'undefined' || !window.crypto) {
    throw new Error('Web Crypto API not available');
  }

  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Create hash from string using SHA-256
 * @param {string} text - Text to hash
 * @returns {Promise<string>} Hex hash
 */
export const sha256 = async (text) => {
  if (typeof window === 'undefined' || !window.crypto) {
    throw new Error('Web Crypto API not available');
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Create hash from string using SHA-512
 * @param {string} text - Text to hash
 * @returns {Promise<string>} Hex hash
 */
export const sha512 = async (text) => {
  if (typeof window === 'undefined' || !window.crypto) {
    throw new Error('Web Crypto API not available');
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await window.crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Create MD5-like hash (using crypto if available)
 * @param {string} text - Text to hash
 * @returns {Promise<string>} Hex hash
 */
export const md5 = async (text) => {
  // Note: MD5 is not available in Web Crypto API
  // This is a simplified implementation for compatibility
  const hash = await sha256(text);
  return hash.substring(0, 32); // Return first 32 chars
};

/**
 * Create HMAC signature
 * @param {string} message - Message to sign
 * @param {string} secret - Secret key
 * @returns {Promise<string>} HMAC signature
 */
export const hmac = async (message, secret) => {
  if (typeof window === 'undefined' || !window.crypto) {
    throw new Error('Web Crypto API not available');
  }

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Derive key using PBKDF2
 * @param {string} password - Password
 * @param {string} salt - Salt
 * @param {number} iterations - Iterations (default: 100000)
 * @returns {Promise<ArrayBuffer>} Derived key
 */
export const deriveKey = async (password, salt, iterations = 100000) => {
  if (typeof window === 'undefined' || !window.crypto) {
    throw new Error('Web Crypto API not available');
  }

  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  const saltData = encoder.encode(salt);

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    passwordData,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  return await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltData,
      iterations: iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
};

/**
 * Generate UUID v4
 * @returns {string} UUID
 */
export const generateUUID = () => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }

  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Verify signature
 * @param {string} message - Original message
 * @param {string} signature - Signature to verify
 * @param {string} secret - Secret key
 * @returns {Promise<boolean>} True if valid
 */
export const verifySignature = async (message, signature, secret) => {
  try {
    const expectedSignature = await hmac(message, secret);
    return expectedSignature === signature;
  } catch {
    return false;
  }
};
// Style improvement
// Performance optimization
