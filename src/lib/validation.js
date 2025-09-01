/**
 * Validate phone number format (10 digits)
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidPhoneNumber(phoneNumber) {
  return /^\d{10}$/.test(phoneNumber);
}

/**
 * Validate Aadhar number format (12 digits)
 * @param {string} aadharNumber - Aadhar number to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidAadharNumber(aadharNumber) {
  return /^\d{12}$/.test(aadharNumber);
}

/**
 * Validate pincode format (6 digits)
 * @param {string} pincode - Pincode to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidPincode(pincode) {
  return /^\d{6}$/.test(pincode);
}

/**
 * Validate and parse date string
 * @param {string} dateString - Date string to validate
 * @returns {Date|null} Parsed Date object or null if invalid
 */
export function parseDate(dateString) {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  return !isNaN(date.getTime()) ? date : null;
}

/**
 * Clean and format address string
 * @param {string} address - Address to clean
 * @returns {string} Cleaned address
 */
export function formatAddress(address) {
  return address
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^\w\s,.-]/g, ''); // Remove special characters except , . -
}

/**
 * Validate required profile fields
 * @param {Object} data - Profile data to validate
 * @throws {Error} If validation fails
 */
export function validateProfileData(data) {
  const { phoneNumber, address, city, state, pincode } = data;

  if (!phoneNumber || !address || !city || !state || !pincode) {
    throw new Error('Missing required fields');
  }

  if (!isValidPhoneNumber(phoneNumber)) {
    throw new Error('Invalid phone number format');
  }

  if (!isValidPincode(pincode)) {
    throw new Error('Invalid pincode format');
  }

  // Additional validations can be added here
}

/**
 * Remove sensitive fields from user data
 * @param {Object} user - User object
 * @returns {Object} User object without sensitive data
 */
export function removeSensitiveData(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Format error message for client
 * @param {Error} error - Error object
 * @returns {string} Formatted error message
 */
export function formatErrorMessage(error) {
  // Add custom error messages based on error types
  const errorMessages = {
    'Missing required fields': 'Please fill in all required fields',
    'Invalid phone number format': 'Please enter a valid 10-digit phone number',
    'Invalid pincode format': 'Please enter a valid 6-digit pincode',
    'User not found': 'User account not found',
    'Database error': 'Unable to update profile. Please try again later'
  };

  return errorMessages[error.message] || 'An unexpected error occurred';
}
