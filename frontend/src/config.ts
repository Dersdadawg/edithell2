// API configuration
// In production (Vercel), uses VITE_API_URL environment variable
// In development, uses the proxy from vite.config.js
const getApiBaseUrl = () => {
  // In development mode, always use the proxy (ignore env var)
  if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
    return '/api';
  }
  
  // In production, use environment variable if set
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback (shouldn't happen in production)
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Log for debugging (always log to help debug)
console.log('API Base URL:', API_BASE_URL);
console.log('VITE_API_URL env var:', import.meta.env.VITE_API_URL);
