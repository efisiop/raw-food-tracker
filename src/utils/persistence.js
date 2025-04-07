/**
 * Check if localStorage is available in the browser
 * @returns {boolean} True if localStorage is available and working
 */
export function isLocalStorageAvailable() {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Save data to localStorage with the given key
 * @param {string} key - The key to store the data under
 * @param {any} data - The data to store (will be JSON.stringified)
 * @returns {boolean} True if save was successful
 */
export function saveToLocalStorage(key, data) {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }
  
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    return true;
  } catch (e) {
    console.error('Error saving to localStorage:', e);
    return false;
  }
}

/**
 * Load data from localStorage by key
 * @param {string} key - The key to retrieve data from
 * @returns {any|null} The parsed data or null if not found/error
 */
export function loadFromLocalStorage(key) {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return null;
  }
  
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData);
  } catch (e) {
    console.error('Error loading from localStorage:', e);
    return null;
  }
}

/**
 * Clear data from localStorage by key
 * @param {string} key - The key to clear data for
 * @returns {boolean} True if clear was successful
 */
export function clearFromLocalStorage(key) {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Error clearing from localStorage:', e);
    return false;
  }
}

/**
 * Clear all data from localStorage
 * @returns {boolean} True if clear was successful
 */
export function clearAllFromLocalStorage() {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }
  
  try {
    localStorage.clear();
    return true;
  } catch (e) {
    console.error('Error clearing all from localStorage:', e);
    return false;
  }
} 