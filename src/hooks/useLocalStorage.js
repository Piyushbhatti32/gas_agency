import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for localStorage with error handling and type safety
 * @param {string} key - Storage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {array} [value, setValue, removeValue]
 */
export function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for managing user data in localStorage
 * @returns {object} User data management functions
 */
export function useUserStorage() {
  const [user, setUser, removeUser] = useLocalStorage('user', null);
  const [token, setToken, removeToken] = useLocalStorage('token', null);

  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  }, [setUser, setToken]);

  const logout = useCallback(() => {
    removeUser();
    removeToken();
  }, [removeUser, removeToken]);

  const updateUser = useCallback((updates) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  }, [user, setUser]);

  const isAuthenticated = useCallback(() => {
    return !!(user && token);
  }, [user, token]);

  return {
    user,
    token,
    login,
    logout,
    updateUser,
    isAuthenticated,
  };
}

/**
 * Hook for managing theme preference
 * @returns {object} Theme management functions
 */
export function useThemeStorage() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  const setLightTheme = useCallback(() => {
    setTheme('light');
  }, [setTheme]);

  const setDarkTheme = useCallback(() => {
    setTheme('dark');
  }, [setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
  };
}

/**
 * Hook for managing form data persistence
 * @param {string} formId - Unique identifier for the form
 * @param {object} initialData - Initial form data
 * @returns {object} Form data management functions
 */
export function useFormStorage(formId, initialData = {}) {
  const [formData, setFormData, removeFormData] = useLocalStorage(
    `form_${formId}`,
    initialData
  );

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, [setFormData]);

  const updateFields = useCallback((fields) => {
    setFormData(prev => ({
      ...prev,
      ...fields,
    }));
  }, [setFormData]);

  const resetForm = useCallback(() => {
    removeFormData();
  }, [removeFormData]);

  const clearField = useCallback((field) => {
    setFormData(prev => {
      const newData = { ...prev };
      delete newData[field];
      return newData;
    });
  }, [setFormData]);

  return {
    formData,
    setFormData,
    updateField,
    updateFields,
    resetForm,
    clearField,
    removeFormData,
  };
}

/**
 * Hook for managing shopping cart in localStorage
 * @returns {object} Cart management functions
 */
export function useCartStorage() {
  const [cart, setCart, removeCart] = useLocalStorage('cart', []);

  const addToCart = useCallback((item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
            : cartItem
        );
      }
      
      return [...prevCart, { ...item, quantity: item.quantity || 1 }];
    });
  }, [setCart]);

  const removeFromCart = useCallback((itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  }, [setCart]);

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [setCart, removeFromCart]);

  const clearCart = useCallback(() => {
    removeCart();
  }, [removeCart]);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const getCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };
}
