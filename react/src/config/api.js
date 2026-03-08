// API Configuration
import axios from 'axios';
import { isDemoMode, mockApi } from '../services/mockApi';

// This will use the environment variable in production, or localhost in development
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Helper to get full API URL
export const getApiUrl = (path) => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

// Create axios instance with interceptor for demo mode
export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Intercept requests in demo mode
api.interceptors.request.use(
  async (config) => {
    if (isDemoMode()) {
      // Return mock data instead of making real request
      const url = config.url;
      
      // Map API endpoints to mock functions
      if (url.includes('/api/courses') && config.method === 'get') {
        throw { mockData: await mockApi.getCourses() };
      }
      if (url.includes('/api/announcements') && config.method === 'get') {
        throw { mockData: await mockApi.getAnnouncements() };
      }
      if (url.includes('/api/assignments') && config.method === 'get') {
        throw { mockData: await mockApi.getAssignments() };
      }
      if (url.includes('/api/materials') && config.method === 'get') {
        throw { mockData: await mockApi.getMaterials() };
      }
      if (url.includes('/api/resources') && config.method === 'get') {
        throw { mockData: await mockApi.getResources() };
      }
      if (url.includes('/api/dashboard/stats') && config.method === 'get') {
        const user = JSON.parse(localStorage.getItem('user'));
        const role = user?.roles?.[0]?.role || 'student';
        throw { mockData: await mockApi.getDashboardStats(user?.user_ID, role) };
      }
      if (url.includes('/api/enrollments') && config.method === 'get') {
        const user = JSON.parse(localStorage.getItem('user'));
        throw { mockData: await mockApi.getEnrollments(user?.user_ID) };
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle mock data
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.mockData) {
      return Promise.resolve(error.mockData);
    }
    return Promise.reject(error);
  }
);

// Override global fetch for demo mode
const originalFetch = window.fetch;
window.fetch = async function(...args) {
  const [url, options] = args;
  
  if (isDemoMode() && typeof url === 'string' && url.includes('/api/')) {
    // Extract endpoint from URL
    const urlObj = new URL(url, window.location.origin);
    const pathname = urlObj.pathname;
    
    // Return mock data based on endpoint
    if (pathname.includes('/api/courses') && pathname.includes('/materials')) {
      const courseId = pathname.match(/\/courses\/(\d+)/)?.[1];
      const mockResponse = await mockApi.getMaterials(courseId ? parseInt(courseId) : null);
      return new Response(JSON.stringify(mockResponse.data.materials), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (pathname.includes('/api/courses')) {
      const mockResponse = await mockApi.getCourses();
      return new Response(JSON.stringify(mockResponse.data.courses), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (pathname.includes('/api/schedules')) {
      // Return empty schedules for now
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (pathname.includes('/api/discussions')) {
      const mockResponse = await mockApi.getDiscussions();
      return new Response(JSON.stringify(mockResponse.data.discussions), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  return originalFetch.apply(this, args);
};
