// API configuration
const getApiBaseUrl = () => {
  // Use environment variable if set (production on Vercel)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In development, use the proxy
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();
