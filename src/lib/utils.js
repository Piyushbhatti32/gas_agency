import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { VALIDATION_RULES, DATE_FORMATS, ERROR_MESSAGES } from './constants.js';

/**
 * Utility function to merge Tailwind CSS classes
 * @param {string} inputs - CSS classes to merge
 * @returns {string} Merged CSS classes
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to display format
 * @param {string|Date} date - Date to format
 * @param {string} formatString - Format string (optional)
 * @returns {string} Formatted date string
 */
export function formatDate(date, formatString = DATE_FORMATS.DISPLAY) {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: INR)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'INR') {
  if (amount === null || amount === undefined) return '';
  
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `${currency} ${amount}`;
  }
}

/**
 * Validate phone number
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} True if valid
 */
export function validatePhoneNumber(phoneNumber) {
  return VALIDATION_RULES.phoneNumber.pattern.test(phoneNumber);
}

/**
 * Validate pincode
 * @param {string} pincode - Pincode to validate
 * @returns {boolean} True if valid
 */
export function validatePincode(pincode) {
  return VALIDATION_RULES.pincode.pattern.test(pincode);
}

/**
 * Validate Aadhar number
 * @param {string} aadharNumber - Aadhar number to validate
 * @returns {boolean} True if valid
 */
export function validateAadharNumber(aadharNumber) {
  return VALIDATION_RULES.aadharNumber.pattern.test(aadharNumber);
}

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function validateEmail(email) {
  return VALIDATION_RULES.email.pattern.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and message
 */
export function validatePassword(password) {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < VALIDATION_RULES.password.minLength) {
    return { 
      isValid: false, 
      message: VALIDATION_RULES.password.message 
    };
  }
  
  return { isValid: true, message: 'Password is valid' };
}

/**
 * Generate a random string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
export function generateRandomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  
  return function() {
    const args = arguments;
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export function getInitials(name) {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
}

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to title case
 * @param {string} str - String to convert
 * @returns {string} Title case string
 */
export function toTitleCase(str) {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Get error message based on error type
 * @param {Error|string} error - Error object or message
 * @returns {string} User-friendly error message
 */
export function getErrorMessage(error) {
  if (typeof error === 'string') return error;
  
  if (error?.message) {
    // Map common error messages to user-friendly ones
    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    
    if (errorMessage.includes('validation')) {
      return ERROR_MESSAGES.VALIDATION_ERROR;
    }
    
    if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
      return ERROR_MESSAGES.AUTH_ERROR;
    }
    
    if (errorMessage.includes('not found') || errorMessage.includes('404')) {
      return ERROR_MESSAGES.NOT_FOUND;
    }
    
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      return ERROR_MESSAGES.RATE_LIMIT;
    }
    
    return error.message;
  }
  
  return ERROR_MESSAGES.SERVER_ERROR;
}

/**
 * Check if object is empty
 * @param {object} obj - Object to check
 * @returns {boolean} True if empty
 */
export function isEmpty(obj) {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  return Object.keys(obj).length === 0;
}

/**
 * Remove null/undefined values from object
 * @param {object} obj - Object to clean
 * @returns {object} Cleaned object
 */
export function removeEmptyValues(obj) {
  const cleaned = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '') {
      cleaned[key] = value;
    }
  }
  
  return cleaned;
}

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check if device is mobile
 * @returns {boolean} True if mobile device
 */
export function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Check if device is touch capable
 * @returns {boolean} True if touch capable
 */
export function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Get browser information
 * @returns {object} Browser information
 */
export function getBrowserInfo() {
  if (typeof window === 'undefined') return {};
  
  const userAgent = navigator.userAgent;
  const browserInfo = {
    userAgent,
    isMobile: isMobileDevice(),
    isTouch: isTouchDevice(),
    language: navigator.language,
    platform: navigator.platform
  };
  
  return browserInfo;
}

/**
 * Sleep function for async operations
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxAttempts - Maximum retry attempts
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Promise that resolves with function result
 */
export async function retry(fn, maxAttempts = 3, baseDelay = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await sleep(delay);
    }
  }
  
  throw lastError;
}