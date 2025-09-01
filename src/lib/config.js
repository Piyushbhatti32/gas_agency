/**
 * Application-wide configuration constants
 */

export const config = {
  // API Routes
  api: {
    auth: '/api/auth',
    user: '/api/user',
    booking: '/api/booking',
    notifications: '/api/notifications',
    payment: '/api/payment',
    admin: '/api/admin',
    agency: '/api/agency'
  },

  // Form Validation
  validation: {
    phone: {
      pattern: /^\d{10}$/,
      message: 'Please enter a valid 10-digit phone number'
    },
    aadhar: {
      pattern: /^\d{12}$/,
      message: 'Please enter a valid 12-digit Aadhar number'
    },
    pincode: {
      pattern: /^\d{6}$/,
      message: 'Please enter a valid 6-digit pincode'
    }
  },

  // User Roles
  roles: {
    ADMIN: 'ADMIN',
    USER: 'USER',
    AGENCY: 'AGENCY'
  },

  // Booking Status
  bookingStatus: {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    DELIVERED: 'DELIVERED'
  },

  // Payment Methods
  paymentMethods: {
    COD: 'COD',
    ONLINE: 'ONLINE',
    PAYTM_QR: 'PAYTM_QR'
  },

  // Payment Status
  paymentStatus: {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED'
  },

  // UI Constants
  ui: {
    toastDuration: 3000,
    paginationSize: 10,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp']
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },

  // Cache Control
  cache: {
    maxAge: 60 * 60 * 24, // 24 hours
    staleWhileRevalidate: 60 // 1 minute
  }
};
