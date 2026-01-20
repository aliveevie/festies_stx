/**
 * ============================================================================
 * Validation Utilities
 * ============================================================================
 * Comprehensive validation functions for forms and data
 * ============================================================================
 */

/**
 * Validates a Stacks address
 * @param {string} address - The address to validate
 * @returns {boolean} - True if valid
 */
export const isValidStacksAddress = (address) => {
  if (!address || typeof address !== 'string') return false;
  
  // Stacks addresses start with SP or ST and are 39-41 characters
  const stacksAddressRegex = /^[SP][0-9A-Z]{38,40}$/;
  return stacksAddressRegex.test(address);
};

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid
 */
export const isValidURL = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates IPFS hash
 * @param {string} hash - The IPFS hash to validate
 * @returns {boolean} - True if valid
 */
export const isValidIPFSHash = (hash) => {
  if (!hash || typeof hash !== 'string') return false;
  // IPFS hashes start with Qm or bafy and are 46 characters
  const ipfsRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]{56})$/;
  return ipfsRegex.test(hash);
};

/**
 * Validates greeting card name
 * @param {string} name - The name to validate
 * @returns {{ valid: boolean, error?: string }} - Validation result
 */
export const validateGreetingName = (name) => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }
  if (name.length > 40) {
    return { valid: false, error: 'Name must be 40 characters or less' };
  }
  if (name.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  return { valid: true };
};

/**
 * Validates greeting card message
 * @param {string} message - The message to validate
 * @returns {{ valid: boolean, error?: string }} - Validation result
 */
export const validateGreetingMessage = (message) => {
  if (!message || message.trim().length === 0) {
    return { valid: false, error: 'Message is required' };
  }
  if (message.length > 500) {
    return { valid: false, error: 'Message must be 500 characters or less' };
  }
  if (message.length < 10) {
    return { valid: false, error: 'Message must be at least 10 characters' };
  }
  return { valid: true };
};

/**
 * Validates festival name
 * @param {string} festival - The festival name to validate
 * @returns {{ valid: boolean, error?: string }} - Validation result
 */
export const validateFestival = (festival) => {
  if (!festival || festival.trim().length === 0) {
    return { valid: false, error: 'Festival is required' };
  }
  if (festival.length > 100) {
    return { valid: false, error: 'Festival name must be 100 characters or less' };
  }
  return { valid: true };
};

/**
 * Validates image URI
 * @param {string} uri - The URI to validate
 * @returns {{ valid: boolean, error?: string }} - Validation result
 */
export const validateImageURI = (uri) => {
  if (!uri || uri.trim().length === 0) {
    return { valid: false, error: 'Image URI is required' };
  }
  if (uri.length > 500) {
    return { valid: false, error: 'Image URI must be 500 characters or less' };
  }
  if (!isValidURL(uri) && !isValidIPFSHash(uri)) {
    return { valid: false, error: 'Image URI must be a valid URL or IPFS hash' };
  }
  return { valid: true };
};

/**
 * Validates metadata URI
 * @param {string} uri - The URI to validate
 * @returns {{ valid: boolean, error?: string }} - Validation result
 */
export const validateMetadataURI = (uri) => {
  if (!uri || uri.trim().length === 0) {
    return { valid: false, error: 'Metadata URI is required' };
  }
  if (uri.length > 500) {
    return { valid: false, error: 'Metadata URI must be 500 characters or less' };
  }
  if (!isValidURL(uri) && !isValidIPFSHash(uri)) {
    return { valid: false, error: 'Metadata URI must be a valid URL or IPFS hash' };
  }
  return { valid: true };
};

/**
 * Validates a complete greeting card form
 * @param {object} formData - The form data to validate
 * @returns {{ valid: boolean, errors: object }} - Validation result
 */
export const validateGreetingCardForm = (formData) => {
  const errors = {};
  
  const nameValidation = validateGreetingName(formData.recipientName);
  if (!nameValidation.valid) errors.recipientName = nameValidation.error;
  
  const messageValidation = validateGreetingMessage(formData.message);
  if (!messageValidation.valid) errors.message = messageValidation.error;
  
  const festivalValidation = validateFestival(formData.festival);
  if (!festivalValidation.valid) errors.festival = festivalValidation.error;
  
  if (!isValidStacksAddress(formData.recipientAddress)) {
    errors.recipientAddress = 'Invalid Stacks address';
  }
  
  if (formData.imageUri) {
    const imageValidation = validateImageURI(formData.imageUri);
    if (!imageValidation.valid) errors.imageUri = imageValidation.error;
  }
  
  if (formData.metadataUri) {
    const metadataValidation = validateMetadataURI(formData.metadataUri);
    if (!metadataValidation.valid) errors.metadataUri = metadataValidation.error;
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates a number is within range
 * @param {number} value - The value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {{ valid: boolean, error?: string }} - Validation result
 */
export const validateNumberRange = (value, min, max) => {
  const num = Number(value);
  if (isNaN(num)) {
    return { valid: false, error: 'Must be a number' };
  }
  if (num < min) {
    return { valid: false, error: `Must be at least ${min}` };
  }
  if (num > max) {
    return { valid: false, error: `Must be at most ${max}` };
  }
  return { valid: true };
};

/**
 * Validates a percentage value (0-100)
 * @param {number} value - The percentage to validate
 * @returns {{ valid: boolean, error?: string }} - Validation result
 */
export const validatePercentage = (value) => {
  return validateNumberRange(value, 0, 100);
};
// Refactor improvement
// Documentation update
