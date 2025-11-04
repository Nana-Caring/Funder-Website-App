import axios from 'axios';

const API_URL = 'https://nanacaring-backend.onrender.com/api/auth';


const authService = {
  login: async (credentials) => {
    try {
      const response = await axios.post(
        `${API_URL}/login`, credentials);
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      return { token, user };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add axios interceptor to add token to all requests
  setupAxiosInterceptors: (token) => {
    axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  },

  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  },

  // Forgot Password API call
  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reset Password API call
  resetPassword: async (token, newPassword, email) => {
    try {
      const response = await axios.post(`${API_URL}/reset-password`, { 
        email,
        token, 
        newPassword 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify Reset Token API call
  verifyResetToken: async (token, email) => {
    try {
      const response = await axios.post(`${API_URL}/verify-reset-token`, { token, email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Register dependent (enhanced infant support)
  registerDependent: async (payload) => {
    try {
      const body = { ...payload };
      // Normalize dateOfBirth to ISO date string (YYYY-MM-DD) if Date object
      if (body.dateOfBirth instanceof Date) {
        body.dateOfBirth = body.dateOfBirth.toISOString().split('T')[0];
      }

      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const response = await axios.post(
        `${API_URL}/register-dependent`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message || 'Failed to register dependent' };
    }
  }
};

export default authService;