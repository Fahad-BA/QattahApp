import '@testing-library/jest-dom';

// Mock لـ window.print و window.open
Object.defineProperty(window, 'print', {
  value: () => {},
  writable: true
});

Object.defineProperty(window, 'open', {
  value: () => ({
    document: { write: () => {}, close: () => {} },
    focus: () => {},
    close: () => {}
  }),
  writable: true
});

// Mock لـ localStorage
const localStorageMock = {
  store: {},
  getItem: function(key) {
    return this.store[key] || null;
  },
  setItem: function(key, value) {
    this.store[key] = String(value);
  },
  removeItem: function(key) {
    delete this.store[key];
  },
  clear: function() {
    this.store = {};
  }
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});