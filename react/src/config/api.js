// API Configuration
import axios from 'axios';

// This will use the environment variable in production, or localhost in development
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Helper to get full API URL
export const getApiUrl = (path) => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
});
