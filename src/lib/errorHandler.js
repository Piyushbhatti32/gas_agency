import { ERROR_MESSAGES } from './constants.js';

/**
 * Error types for different scenarios
 */
export const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  VALIDATION: 'VALIDATION',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER',
  CLIENT: 'CLIENT',
  UNKNOWN: 'UNKNOWN'
};

/**
 * Error severity levels
 */
export const ERROR_SEVERITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

/**
 * Custom Error class with additional context
 */
export class AppError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN, severity = ERROR_SEVERITY.MEDIUM, context = {}) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Network Error class
 */
export class NetworkError extends AppError {
  constructor(message = ERROR_MESSAGES.NETWORK_ERROR, context = {}) {
    super(message, ERROR_TYPES.NETWORK, ERROR_SEVERITY.HIGH, context);
    this.name = 'NetworkError';
  }
}

/**
 * Validation Error class
 */
export class ValidationError extends AppError {
  constructor(message = ERROR_MESSAGES.VALIDATION_ERROR, fields = {}, context = {}) {
    super(message, ERROR_TYPES.VALIDATION, ERROR_SEVERITY.LOW, context);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

/**
 * Authentication Error class
 */
export class AuthenticationError extends AppError {
  constructor(message = ERROR_MESSAGES.AUTH_ERROR, context = {}) {
    super(message, ERROR_TYPES.AUTHENTICATION, ERROR_SEVERITY.MEDIUM, context);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization Error class
 */
export class AuthorizationError extends AppError {
  constructor(message = ERROR_MESSAGES.UNAUTHORIZED, context = {}) {
    super(message, ERROR_TYPES.AUTHORIZATION, ERROR_SEVERITY.MEDIUM, context);
    this.name = 'AuthorizationError';
  }
}

/**
 * Not Found Error class
 */
export class NotFoundError extends AppError {
  constructor(message = ERROR_MESSAGES.NOT_FOUND, context = {}) {
    super(message, ERROR_TYPES.NOT_FOUND, ERROR_SEVERITY.LOW, context);
    this.name = 'NotFoundError';
  }
}

/**
 * Server Error class
 */
export class ServerError extends AppError {
  constructor(message = ERROR_MESSAGES.SERVER_ERROR, context = {}) {
    super(message, ERROR_TYPES.SERVER, ERROR_SEVERITY.CRITICAL, context);
    this.name = 'ServerError';
  }
}

/**
 * Error handler class
 */
export class ErrorHandler {
  constructor() {
    this.errorListeners = [];
    this.errorLog = [];
  }

  /**
   * Add error listener
   * @param {Function} listener - Error listener function
   */
  addListener(listener) {
    this.errorListeners.push(listener);
  }

  /**
   * Remove error listener
   * @param {Function} listener - Error listener function
   */
  removeListener(listener) {
    const index = this.errorListeners.indexOf(listener);
    if (index > -1) {
      this.errorListeners.splice(index, 1);
    }
  }

  /**
   * Handle error
   * @param {Error} error - Error to handle
   * @param {object} context - Additional context
   */
  handle(error, context = {}) {
    const appError = this.normalizeError(error, context);
    
    // Log error
    this.logError(appError);
    
    // Notify listeners
    this.notifyListeners(appError);
    
    // Handle based on severity
    this.handleBySeverity(appError);
    
    return appError;
  }

  /**
   * Normalize error to AppError
   * @param {Error} error - Error to normalize
   * @param {object} context - Additional context
   * @returns {AppError} Normalized error
   */
  normalizeError(error, context = {}) {
    if (error instanceof AppError) {
      return error;
    }

    const message = error.message || 'An unknown error occurred';
    let type = ERROR_TYPES.UNKNOWN;
    let severity = ERROR_SEVERITY.MEDIUM;

    // Determine error type based on message or properties
    if (error.name === 'TypeError' || error.name === 'ReferenceError') {
      type = ERROR_TYPES.CLIENT;
      severity = ERROR_SEVERITY.MEDIUM;
    } else if (error.message?.includes('fetch') || error.message?.includes('network')) {
      type = ERROR_TYPES.NETWORK;
      severity = ERROR_SEVERITY.HIGH;
    } else if (error.message?.includes('validation')) {
      type = ERROR_TYPES.VALIDATION;
      severity = ERROR_SEVERITY.LOW;
    } else if (error.message?.includes('unauthorized') || error.message?.includes('401')) {
      type = ERROR_TYPES.AUTHENTICATION;
      severity = ERROR_SEVERITY.MEDIUM;
    } else if (error.message?.includes('forbidden') || error.message?.includes('403')) {
      type = ERROR_TYPES.AUTHORIZATION;
      severity = ERROR_SEVERITY.MEDIUM;
    } else if (error.message?.includes('not found') || error.message?.includes('404')) {
      type = ERROR_TYPES.NOT_FOUND;
      severity = ERROR_SEVERITY.LOW;
    } else if (error.message?.includes('500') || error.message?.includes('server')) {
      type = ERROR_TYPES.SERVER;
      severity = ERROR_SEVERITY.CRITICAL;
    }

    return new AppError(message, type, severity, {
      originalError: error,
      ...context
    });
  }

  /**
   * Log error
   * @param {AppError} error - Error to log
   */
  logError(error) {
    const errorEntry = {
      timestamp: error.timestamp,
      type: error.type,
      severity: error.severity,
      message: error.message,
      stack: error.stack,
      context: error.context
    };

    this.errorLog.push(errorEntry);

    // Keep only last 100 errors
    if (this.errorLog.length > 100) {
      this.errorLog.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorEntry);
    }

    // Send to external logging service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToLoggingService(errorEntry);
    }
  }

  /**
   * Send error to external logging service
   * @param {object} errorEntry - Error entry to send
   */
  async sendToLoggingService(errorEntry) {
    try {
      // Example: Send to Sentry, LogRocket, or custom logging service
      if (typeof window !== 'undefined' && window.Sentry) {
        window.Sentry.captureException(errorEntry);
      }
    } catch (loggingError) {
      console.error('Failed to send error to logging service:', loggingError);
    }
  }

  /**
   * Notify error listeners
   * @param {AppError} error - Error to notify about
   */
  notifyListeners(error) {
    this.errorListeners.forEach(listener => {
      try {
        listener(error);
      } catch (listenerError) {
        console.error('Error in error listener:', listenerError);
      }
    });
  }

  /**
   * Handle error based on severity
   * @param {AppError} error - Error to handle
   */
  handleBySeverity(error) {
    switch (error.severity) {
      case ERROR_SEVERITY.CRITICAL:
        this.handleCriticalError(error);
        break;
      case ERROR_SEVERITY.HIGH:
        this.handleHighSeverityError(error);
        break;
      case ERROR_SEVERITY.MEDIUM:
        this.handleMediumSeverityError(error);
        break;
      case ERROR_SEVERITY.LOW:
        this.handleLowSeverityError(error);
        break;
      default:
        this.handleMediumSeverityError(error);
    }
  }

  /**
   * Handle critical error
   * @param {AppError} error - Critical error
   */
  handleCriticalError(error) {
    // Show critical error modal/page
    this.showCriticalErrorModal(error);
    
    // Reload page if necessary
    if (error.type === ERROR_TYPES.SERVER) {
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  }

  /**
   * Handle high severity error
   * @param {AppError} error - High severity error
   */
  handleHighSeverityError(error) {
    // Show prominent error notification
    this.showErrorNotification(error, 'error');
    
    // Redirect to error page if necessary
    if (error.type === ERROR_TYPES.AUTHENTICATION) {
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    }
  }

  /**
   * Handle medium severity error
   * @param {AppError} error - Medium severity error
   */
  handleMediumSeverityError(error) {
    // Show standard error notification
    this.showErrorNotification(error, 'warning');
  }

  /**
   * Handle low severity error
   * @param {AppError} error - Low severity error
   */
  handleLowSeverityError(error) {
    // Show subtle error notification
    this.showErrorNotification(error, 'info');
  }

  /**
   * Show error notification
   * @param {AppError} error - Error to show
   * @param {string} type - Notification type
   */
  showErrorNotification(error, type = 'error') {
    // Dispatch custom event for notification system
    const event = new CustomEvent('showNotification', {
      detail: {
        type,
        title: this.getErrorTitle(error),
        message: this.getErrorMessage(error),
        duration: this.getNotificationDuration(error)
      }
    });
    
    window.dispatchEvent(event);
  }

  /**
   * Show critical error modal
   * @param {AppError} error - Critical error
   */
  showCriticalErrorModal(error) {
    // Dispatch custom event for critical error modal
    const event = new CustomEvent('showCriticalError', {
      detail: {
        error: error,
        title: 'Critical Error',
        message: 'A critical error has occurred. Please try again or contact support.',
        actions: [
          { label: 'Retry', action: 'retry' },
          { label: 'Contact Support', action: 'support' }
        ]
      }
    });
    
    window.dispatchEvent(event);
  }

  /**
   * Get error title
   * @param {AppError} error - Error object
   * @returns {string} Error title
   */
  getErrorTitle(error) {
    const titles = {
      [ERROR_TYPES.NETWORK]: 'Connection Error',
      [ERROR_TYPES.VALIDATION]: 'Validation Error',
      [ERROR_TYPES.AUTHENTICATION]: 'Authentication Error',
      [ERROR_TYPES.AUTHORIZATION]: 'Access Denied',
      [ERROR_TYPES.NOT_FOUND]: 'Not Found',
      [ERROR_TYPES.SERVER]: 'Server Error',
      [ERROR_TYPES.CLIENT]: 'Application Error',
      [ERROR_TYPES.UNKNOWN]: 'Error'
    };

    return titles[error.type] || 'Error';
  }

  /**
   * Get user-friendly error message
   * @param {AppError} error - Error object
   * @returns {string} User-friendly message
   */
  getErrorMessage(error) {
    // Use predefined messages for common errors
    const messages = {
      [ERROR_TYPES.NETWORK]: ERROR_MESSAGES.NETWORK_ERROR,
      [ERROR_TYPES.VALIDATION]: ERROR_MESSAGES.VALIDATION_ERROR,
      [ERROR_TYPES.AUTHENTICATION]: ERROR_MESSAGES.AUTH_ERROR,
      [ERROR_TYPES.AUTHORIZATION]: ERROR_MESSAGES.UNAUTHORIZED,
      [ERROR_TYPES.NOT_FOUND]: ERROR_MESSAGES.NOT_FOUND,
      [ERROR_TYPES.SERVER]: ERROR_MESSAGES.SERVER_ERROR
    };

    return messages[error.type] || error.message || ERROR_MESSAGES.SERVER_ERROR;
  }

  /**
   * Get notification duration
   * @param {AppError} error - Error object
   * @returns {number} Duration in milliseconds
   */
  getNotificationDuration(error) {
    const durations = {
      [ERROR_SEVERITY.CRITICAL]: 0, // Don't auto-dismiss
      [ERROR_SEVERITY.HIGH]: 8000,
      [ERROR_SEVERITY.MEDIUM]: 5000,
      [ERROR_SEVERITY.LOW]: 3000
    };

    return durations[error.severity] || 5000;
  }

  /**
   * Get error log
   * @returns {Array} Error log
   */
  getErrorLog() {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  clearErrorLog() {
    this.errorLog = [];
  }

  /**
   * Get error statistics
   * @returns {object} Error statistics
   */
  getErrorStats() {
    const stats = {
      total: this.errorLog.length,
      byType: {},
      bySeverity: {},
      recent: this.errorLog.slice(-10)
    };

    this.errorLog.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
    });

    return stats;
  }
}

// Create global error handler instance
export const errorHandler = new ErrorHandler();

// Global error handler for unhandled errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    errorHandler.handle(event.error, { source: 'global' });
  });

  window.addEventListener('unhandledrejection', (event) => {
    errorHandler.handle(new Error(event.reason), { source: 'unhandledrejection' });
  });
}

// Export error creation helpers
export const createError = {
  network: (message, context) => new NetworkError(message, context),
  validation: (message, fields, context) => new ValidationError(message, fields, context),
  authentication: (message, context) => new AuthenticationError(message, context),
  authorization: (message, context) => new AuthorizationError(message, context),
  notFound: (message, context) => new NotFoundError(message, context),
  server: (message, context) => new ServerError(message, context)
};
