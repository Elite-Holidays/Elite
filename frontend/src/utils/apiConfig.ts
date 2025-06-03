/**
 * API configuration utility
 * Centralizes API URL management to use environment variables
 */

// Get the API URL from environment variables, with a fallback for development
export const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

/**
 * Constructs a full API URL by appending the given endpoint to the base API URL
 * @param endpoint - The API endpoint (with or without leading slash)
 * @returns The complete API URL
 */
export const getApiUrl = (endpoint: string): string => {
  // Handle endpoints with or without leading slash
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_URL}${normalizedEndpoint}`;
};

/**
 * Constructs a full media URL for images and other assets
 * @param url - The media URL path
 * @returns The complete media URL
 */
export const getMediaUrl = (url: string | undefined): string => {
  if (!url) return 'https://via.placeholder.com/400x300?text=No+Image';
  
  // Return as-is if it's already an absolute URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Handle paths with or without leading slash
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
  return `${API_URL}${normalizedUrl}`;
};
