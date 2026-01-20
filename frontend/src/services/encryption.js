/**
 * Encryption service - Client-side encryption utilities
 */

/**
 * Simple base64 encoding (not secure, for non-sensitive data)
 * @param {string} text - Text to encode
 * @returns {string} Encoded string
 */
export const encodeBase64 = (text) => {
  if (typeof window === 'undefined') return '';
  return btoa(unescape(encodeURIComponent(text)));
};

/**
 * Simple base64 decoding
 * @param {string} encoded - Encoded string
 * @returns {string} Decoded string
 */
export const decodeBase64 = (encoded) => {
  if (typeof window === 'undefined') return '';
  try {
    return decodeURIComponent(escape(atob(encoded)));
  } catch {
    return '';
  }
};

/**
 * Hash string using Web Crypto API
 * @param {string} text - Text to hash
 * @param {string} algorithm - Hash algorithm (default: 'SHA-256')
 * @returns {Promise<string>} Hashed string
 */
export const hashString = async (text, algorithm = 'SHA-256') => {
  if (typeof window === 'undefined' || !window.crypto) {
    throw new Error('Web Crypto API not available');
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await window.crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
};

/**
 * Generate random bytes
 * @param {number} length - Number of bytes
 * @returns {Uint8Array} Random bytes
 */
export const generateRandomBytes = (length = 32) => {
  if (typeof window === 'undefined' || !window.crypto) {
    throw new Error('Web Crypto API not available');
  }

  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return array;
};

/**
 * Generate random hex string
 * @param {number} length - Length in bytes (default: 16)
 * @returns {string} Random hex string
 */
export const generateRandomHex = (length = 16) => {
  const bytes = generateRandomBytes(length);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Simple XOR encryption (not secure, for basic obfuscation)
 * @param {string} text - Text to encrypt
 * @param {string} key - Encryption key
 * @returns {string} Encrypted string
 */
export const xorEncrypt = (text, key) => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return encodeBase64(result);
};

/**
 * Simple XOR decryption
 * @param {string} encrypted - Encrypted string
 * @param {string} key - Decryption key
 * @returns {string} Decrypted string
 */
export const xorDecrypt = (encrypted, key) => {
  const decoded = decodeBase64(encrypted);
  let result = '';
  for (let i = 0; i < decoded.length; i++) {
    result += String.fromCharCode(
      decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return result;
};

/**
 * Encrypt data with AES (requires key derivation)
 * Note: For production, use proper key management
 * @param {string} text - Text to encrypt
 * @param {string} password - Password
 * @returns {Promise<string>} Encrypted data
 */
export const encryptAES = async (text, password) => {
  if (typeof window === 'undefined' || !window.crypto) {
    throw new Error('Web Crypto API not available');
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  // Import password as key
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive key
  const salt = generateRandomBytes(16);
  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  // Encrypt
  const iv = generateRandomBytes(12);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    data
  );

  // Combine salt, iv, and encrypted data
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);

  // Convert to base64
  return btoa(String.fromCharCode(...combined));
};

/**
 * Decrypt AES encrypted data
 * @param {string} encrypted - Encrypted data
 * @param {string} password - Password
 * @returns {Promise<string>} Decrypted text
 */
export const decryptAES = async (encrypted, password) => {
  if (typeof window === 'undefined' || !window.crypto) {
    throw new Error('Web Crypto API not available');
  }

  // Decode from base64
  const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));

  // Extract salt, iv, and encrypted data
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const encryptedData = combined.slice(28);

  // Import password as key
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive key
  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  // Decrypt
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encryptedData
  );

  return new TextDecoder().decode(decrypted);
};
// Style improvement
// Refactor improvement
