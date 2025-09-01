import { useState, useCallback, useRef } from 'react';
import { API_CONFIG, ERROR_MESSAGES } from '@/lib/constants.js';
import { retry, getErrorMessage } from '@/lib/utils.js';

/**
 * Custom hook for making API calls with error handling and retry logic
 * @param {string} baseUrl - Base URL for API calls
 * @returns {object} API methods and state
 */
export function useApi(baseUrl = API_CONFIG.baseUrl) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  /**
   * Make a generic API request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Fetch options
   * @param {boolean} retryOnFail - Whether to retry on failure
   * @returns {Promise} API response
   */
  const makeRequest = useCallback(async (endpoint, options = {}, retryOnFail = true) => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    const url = `${baseUrl}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: abortControllerRef.current.signal,
    };

    const fetchOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    setLoading(true);
    setError(null);

    try {
      const fetchWithTimeout = async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

        try {
          const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return await response.json();
          }
          return await response.text();
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      };

      const result = retryOnFail
        ? await retry(fetchWithTimeout, API_CONFIG.retryAttempts, 1000)
        : await fetchWithTimeout();

      return result;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [baseUrl]);

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {object} params - Query parameters
   * @param {boolean} retryOnFail - Whether to retry on failure
   * @returns {Promise} API response
   */
  const get = useCallback(async (endpoint, params = {}, retryOnFail = true) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return makeRequest(url, { method: 'GET' }, retryOnFail);
  }, [makeRequest]);

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body
   * @param {boolean} retryOnFail - Whether to retry on failure
   * @returns {Promise} API response
   */
  const post = useCallback(async (endpoint, data = {}, retryOnFail = true) => {
    return makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }, retryOnFail);
  }, [makeRequest]);

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body
   * @param {boolean} retryOnFail - Whether to retry on failure
   * @returns {Promise} API response
   */
  const put = useCallback(async (endpoint, data = {}, retryOnFail = true) => {
    return makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, retryOnFail);
  }, [makeRequest]);

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {boolean} retryOnFail - Whether to retry on failure
   * @returns {Promise} API response
   */
  const del = useCallback(async (endpoint, retryOnFail = true) => {
    return makeRequest(endpoint, { method: 'DELETE' }, retryOnFail);
  }, [makeRequest]);

  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body
   * @param {boolean} retryOnFail - Whether to retry on failure
   * @returns {Promise} API response
   */
  const patch = useCallback(async (endpoint, data = {}, retryOnFail = true) => {
    return makeRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, retryOnFail);
  }, [makeRequest]);

  /**
   * Upload file
   * @param {string} endpoint - API endpoint
   * @param {FormData} formData - Form data with file
   * @param {boolean} retryOnFail - Whether to retry on failure
   * @returns {Promise} API response
   */
  const upload = useCallback(async (endpoint, formData, retryOnFail = true) => {
    return makeRequest(endpoint, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    }, retryOnFail);
  }, [makeRequest]);

  /**
   * Cancel current request
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      setError(null);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    get,
    post,
    put,
    del,
    patch,
    upload,
    cancel,
    clearError,
  };
}
