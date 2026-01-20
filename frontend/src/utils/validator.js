/**
 * Advanced validation utility functions
 */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
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
 * Validate phone number
 * @param {string} phone - Phone to validate
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate credit card number
 * @param {string} cardNumber - Card number to validate
 * @returns {boolean} True if valid
 */
export const isValidCreditCard = (cardNumber) => {
  if (!cardNumber || typeof cardNumber !== 'string') return false;
  
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  
  // Check if all digits
  if (!/^\d+$/.test(cleaned)) return false;
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * Validate IP address
 * @param {string} ip - IP to validate
 * @returns {boolean} True if valid
 */
export const isValidIP = (ip) => {
  if (!ip || typeof ip !== 'string') return false;
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
};

/**
 * Validate IPv6 address
 * @param {string} ip - IP to validate
 * @returns {boolean} True if valid
 */
export const isValidIPv6 = (ip) => {
  if (!ip || typeof ip !== 'string') return false;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv6Regex.test(ip);
};

/**
 * Validate hex color
 * @param {string} color - Color to validate
 * @returns {boolean} True if valid
 */
export const isValidHexColor = (color) => {
  if (!color || typeof color !== 'string') return false;
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
};

/**
 * Validate date string
 * @param {string} date - Date to validate
 * @returns {boolean} True if valid
 */
export const isValidDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      valid: false,
      strength: 0,
      errors: ['Password is required'],
    };
  }

  const errors = [];
  let strength = 0;

  if (password.length >= 8) strength += 1;
  else errors.push('Password must be at least 8 characters');

  if (password.length >= 12) strength += 1;

  if (/[a-z]/.test(password)) strength += 1;
  else errors.push('Password must contain lowercase letters');

  if (/[A-Z]/.test(password)) strength += 1;
  else errors.push('Password must contain uppercase letters');

  if (/\d/.test(password)) strength += 1;
  else errors.push('Password must contain numbers');

  if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
  else errors.push('Password must contain special characters');

  return {
    valid: strength >= 4,
    strength: Math.min(strength, 5),
    errors: errors.length > 0 ? errors : [],
  };
};

/**
 * Validate Stacks address
 * @param {string} address - Address to validate
 * @returns {boolean} True if valid
 */
export const isValidStacksAddress = (address) => {
  if (!address || typeof address !== 'string') return false;
  const stacksRegex = /^ST[0-9A-Z]{32,39}$/;
  return stacksRegex.test(address);
};

/**
 * Validate Bitcoin address
 * @param {string} address - Address to validate
 * @returns {boolean} True if valid
 */
export const isValidBitcoinAddress = (address) => {
  if (!address || typeof address !== 'string') return false;
  // Basic Bitcoin address format validation
  const btcRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/;
  return btcRegex.test(address);
};

/**
 * Sanitize input string
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Validate form field
 * @param {string} value - Field value
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result
 */
export const validateField = (value, rules = {}) => {
  const errors = [];

  if (rules.required && (!value || value.trim() === '')) {
    errors.push(rules.requiredMessage || 'This field is required');
  }

  if (rules.minLength && value && value.length < rules.minLength) {
    errors.push(
      rules.minLengthMessage ||
        `Must be at least ${rules.minLength} characters`
    );
  }

  if (rules.maxLength && value && value.length > rules.maxLength) {
    errors.push(
      rules.maxLengthMessage ||
        `Must be at most ${rules.maxLength} characters`
    );
  }

  if (rules.pattern && value && !rules.pattern.test(value)) {
    errors.push(rules.patternMessage || 'Invalid format');
  }

  if (rules.email && value && !isValidEmail(value)) {
    errors.push(rules.emailMessage || 'Invalid email address');
  }

  if (rules.url && value && !isValidURL(value)) {
    errors.push(rules.urlMessage || 'Invalid URL');
  }

  if (rules.custom && value) {
    const customError = rules.custom(value);
    if (customError) errors.push(customError);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
// Style improvement
// Refactor improvement
// Documentation update
