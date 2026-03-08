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

// Check if in demo mode (exported for use in other modules)
export const isDemoMode = () => {
  return localStorage.getItem('demoMode') === 'true';
};

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Setup axios interceptor for demo mode
let mockApiModule = null;

const getMockApi = async () => {
  if (!mockApiModule) {
    mockApiModule = await import('../services/mockApi');
  }
  return mockApiModule.mockApi;
};

// Intercept ALL axios requests globally
axios.interceptors.request.use(
  async (config) => {
    if (isDemoMode()) {
      const mockApi = await getMockApi();
      const url = config.url || '';
      
      // Dashboard stats
      if (url.includes('/api/dashboard/stats')) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const role = user?.roles?.[0]?.role || 'student';
        throw { mockData: await mockApi.getDashboardStats(user?.user_ID, role) };
      }
      
      // Online hours chart
      if (url.includes('/api/dashboard/online-hours-chart')) {
        throw { mockData: await mockApi.getOnlineHoursChart() };
      }
      
      // Online hours stats
      if (url.includes('/api/dashboard/online-hours')) {
        throw { mockData: await mockApi.getOnlineHoursStats() };
      }
      
      // Courses
      if (url.includes('/api/courses') && config.method === 'get') {
        throw { mockData: await mockApi.getCourses() };
      }
      
      // Announcements
      if (url.includes('/api/announcements') && config.method === 'get') {
        throw { mockData: await mockApi.getAnnouncements() };
      }
      
      // Assignments
      if (url.includes('/api/assignments') && config.method === 'get') {
        throw { mockData: await mockApi.getAssignments() };
      }
      
      // Materials
      if (url.includes('/api/materials') && config.method === 'get') {
        throw { mockData: await mockApi.getMaterials() };
      }
      
      // Resources
      if (url.includes('/api/resources') && config.method === 'get') {
        throw { mockData: await mockApi.getResources() };
      }
      
      // Schedules
      if (url.includes('/api/schedules') && config.method === 'get') {
        throw { mockData: await mockApi.getSchedules() };
      }
      
      // Discussions
      if (url.includes('/api/discussions') && config.method === 'get') {
        throw { mockData: await mockApi.getDiscussions() };
      }
      
      // Activity logs
      if (url.includes('/api/activity-logs') && config.method === 'get') {
        throw { mockData: await mockApi.getActivityLogs() };
      }
      
      // Enrollments
      if (url.includes('/api/enrollments') && config.method === 'get') {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        throw { mockData: await mockApi.getEnrollments(user?.user_ID) };
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle mock data
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.mockData) {
      return Promise.resolve(error.mockData);
    }
    return Promise.reject(error);
  }
);

// Also apply to the api instance
api.interceptors.request.use(
  async (config) => {
    if (isDemoMode()) {
      const mockApi = await getMockApi();
      const url = config.url || '';
      
      // Same logic as above
      if (url.includes('/api/dashboard/stats')) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const role = user?.roles?.[0]?.role || 'student';
        throw { mockData: await mockApi.getDashboardStats(user?.user_ID, role) };
      }
      
      if (url.includes('/api/dashboard/online-hours-chart')) {
        throw { mockData: await mockApi.getOnlineHoursChart() };
      }
      
      if (url.includes('/api/dashboard/online-hours')) {
        throw { mockData: await mockApi.getOnlineHoursStats() };
      }
      
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
      
      if (url.includes('/api/schedules') && config.method === 'get') {
        throw { mockData: await mockApi.getSchedules() };
      }
      
      if (url.includes('/api/discussions') && config.method === 'get') {
        throw { mockData: await mockApi.getDiscussions() };
      }
      
      if (url.includes('/api/activity-logs') && config.method === 'get') {
        throw { mockData: await mockApi.getActivityLogs() };
      }
      
      if (url.includes('/api/enrollments') && config.method === 'get') {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        throw { mockData: await mockApi.getEnrollments(user?.user_ID) };
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.mockData) {
      return Promise.resolve(error.mockData);
    }
    return Promise.reject(error);
  }
);
