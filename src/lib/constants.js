// Application Constants
export const APP_CONFIG = {
  name: 'Gas Agency Management System',
  version: '1.0.0',
  description: 'Modern web application for managing gas cylinder bookings',
  author: 'Gas Agency Team',
  contact: 'support@gasagency.com'
};

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  retryAttempts: 3
};

// Database Configuration
export const DB_CONFIG = {
  maxConnections: 10,
  idleTimeout: 30000,
  connectionTimeout: 2000
};

// Validation Rules
export const VALIDATION_RULES = {
  phoneNumber: {
    pattern: /^\d{10}$/,
    message: 'Please enter a valid 10-digit phone number'
  },
  pincode: {
    pattern: /^\d{6}$/,
    message: 'Please enter a valid 6-digit pincode'
  },
  aadharNumber: {
    pattern: /^\d{12}$/,
    message: 'Please enter a valid 12-digit Aadhar number'
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  password: {
    minLength: 6,
    message: 'Password must be at least 6 characters long'
  }
};

// User Roles
export const USER_ROLES = {
  USER: 'USER',
  AGENCY: 'AGENCY',
  ADMIN: 'ADMIN'
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

// Payment Methods
export const PAYMENT_METHODS = {
  COD: 'COD',
  ONLINE: 'ONLINE',
  PAYTM_QR: 'PAYTM_QR'
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

// UI Configuration
export const UI_CONFIG = {
  theme: {
    primary: '#3B82F6',
    secondary: '#64748B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#06B6D4'
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTH_ERROR: 'Authentication failed. Please log in again.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  RATE_LIMIT: 'Too many requests. Please try again later.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully!',
  BOOKING_CREATED: 'Booking created successfully!',
  PAYMENT_SUCCESS: 'Payment completed successfully!',
  LOGIN_SUCCESS: 'Logged in successfully!',
  REGISTRATION_SUCCESS: 'Registration completed successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  THEME: 'theme',
  LANGUAGE: 'language',
  CART: 'cart'
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  API: 'yyyy-MM-dd',
  DATETIME: 'dd/MM/yyyy HH:mm',
  TIME: 'HH:mm'
};

// File Upload Configuration
export const FILE_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFiles: 5
};

// Pagination Configuration
export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
  maxPageSize: 100
};
