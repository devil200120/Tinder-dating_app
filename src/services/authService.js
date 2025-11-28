// services/authService.js
import api from './api.js';

export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      // Check if response indicates success
      if (response.data && response.data.success !== false) {
        const responseData = response.data.data || response.data; // Handle both response structures
        if (responseData.accessToken) {
          localStorage.setItem('token', responseData.accessToken);
          localStorage.setItem('user', JSON.stringify(responseData.user));
        }
        return {
          success: true,
          user: responseData.user,
          token: responseData.accessToken,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Registration failed'
        };
      }
    } catch (error) {
      console.error('Auth service register error:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        return {
          success: false,
          message: error.response.data?.message || 'Registration failed'
        };
      } else if (error.request) {
        // Network error
        return {
          success: false,
          message: 'Network error. Please check your connection.'
        };
      } else {
        // Other error
        return {
          success: false,
          message: 'An unexpected error occurred'
        };
      }
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      // Input validation
      if (!credentials?.email || !credentials?.password) {
        return {
          success: false,
          message: 'Email and password are required'
        };
      }

      // Sanitize credentials
      const sanitizedCredentials = {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password
      };

      const response = await api.post('/auth/login', sanitizedCredentials);
      
      // Check if response indicates success
      if (response.data && response.data.success !== false) {
        // Handle the nested data structure from backend
        const userData = response.data.data || response.data;
        const token = userData.accessToken || userData.token || response.data.token;
        const user = userData.user || response.data.user;
        
        if (token && user) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        return {
          success: true,
          user: user,
          token: token,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Auth service login error:', error);
      
      // Handle different types of errors with more specific messages
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 400:
            return {
              success: false,
              message: data?.message || 'Invalid request. Please check your input.'
            };
          case 401:
            return {
              success: false,
              message: data?.message || 'Invalid email or password.',
              errorType: data?.errorType || 'INVALID_CREDENTIALS'
            };
          case 403:
            return {
              success: false,
              message: data?.message || 'Your account has been suspended. Please contact support.'
            };
          case 404:
            return {
              success: false,
              message: data?.message || 'No account found with this email address.',
              errorType: data?.errorType || 'EMAIL_NOT_FOUND'
            };
          case 422:
            return {
              success: false,
              message: data?.message || 'Please verify your email address before logging in.'
            };
          case 429:
            return {
              success: false,
              message: 'Too many login attempts. Please wait before trying again.'
            };
          case 500:
            return {
              success: false,
              message: 'Server error. Please try again in a few minutes.'
            };
          case 503:
            return {
              success: false,
              message: 'Service temporarily unavailable. Please try again later.'
            };
          default:
            return {
              success: false,
              message: data?.message || 'Login failed. Please try again.'
            };
        }
      } else if (error.request) {
        // Network error - check if it's a timeout
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          return {
            success: false,
            message: 'Request timed out. Please check your connection and try again.'
          };
        }
        return {
          success: false,
          message: 'Network error. Please check your internet connection.'
        };
      } else if (error.message === 'Request timeout') {
        return {
          success: false,
          message: 'Request timed out. Please try again.'
        };
      } else {
        // Other error
        return {
          success: false,
          message: error.message || 'An unexpected error occurred'
        };
      }
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
};