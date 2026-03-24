import { useState, useEffect } from 'react';

/**
 * Custom hook to manage localStorage with React state
 * Handles SSR, errors, and sync across tabs
 */
export const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  // Get from local storage then parse stored json or return initialValue
  const readStorageValue = (): T => {
    // Prevent build errors during server side rendering
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      
      // Handle cases where item doesn't exist
      if (item === null) {
        // Set initial value if it doesn't exist
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }

      // Handle corrupted or undefined string values
      if (item === 'undefined' || item === '') {
        return initialValue;
      }

      try {
        // Parse stored json or return initialValue
        return JSON.parse(item) || initialValue;
      } catch {
        // If JSON.parse fails, return initialValue
        return initialValue;
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readStorageValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          // Handle quota exceeded error
          if (error instanceof Error && error.name === 'QuotaExceededError') {
            console.error(`LocalStorage quota exceeded for key "${key}". Clearing some data.`);
            // Clear some old data if quota exceeded
            const keys = Object.keys(window.localStorage);
            for (let i = 0; i < Math.min(3, keys.length); i++) {
              window.localStorage.removeItem(keys[i]);
            }
            // Try to set again
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          } else {
            console.error(`Error setting localStorage key "${key}":`, error);
          }
        }
      }
    } catch (error) {
      console.error(`Error in localStorage hook for key "${key}":`, error);
    }
  };

  // Sync with localStorage across tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        try {
          // When item is removed, event.newValue is null
          if (event.newValue === null) {
            setStoredValue(initialValue);
          } else {
            try {
              setStoredValue(JSON.parse(event.newValue));
            } catch {
              setStoredValue(initialValue);
            }
          }
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}":`, error);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [key, initialValue]);

  return [storedValue, setValue];
};