// services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with enhanced configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
  // Retry configuration
  retry: 3,
  retryDelay: 1000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic and enhanced error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // Handle network timeouts and connection errors with retry logic
    if (!config._retry && config.retry > 0 && 
        (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR' || 
         error.message.includes('timeout') || error.message.includes('Network Error'))) {
      
      config._retry = true;
      config.retry -= 1;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, config.retryDelay));
      
      return api(config);
    }
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      const isAuthRequest = 
        error.config?.url?.includes('/auth/login') || 
        error.config?.url?.includes('/auth/register') ||
        error.config?.url?.includes('/auth/refresh');
      
      if (!isAuthRequest) {
        // Only redirect if this is not an auth attempt
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Avoid infinite redirects
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?session=expired';
        }
      }
    }
    
    // Handle rate limiting
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      if (retryAfter && !config._retryAfter) {
        config._retryAfter = true;
        await new Promise(resolve => setTimeout(resolve, parseInt(retryAfter) * 1000));
        return api(config);
      }
    }
    
    // Enhance error object with more details
    if (error.response) {
      error.statusCode = error.response.status;
      error.data = error.response.data;
    }
    
    return Promise.reject(error);
  }
);

export default api;