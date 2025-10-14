// API configuration for handling CORS in development vs production
const isDevelopment = import.meta.env.DEV;

export const API_ENDPOINTS = {
  // Password reset service endpoints
  FORGOT_PASSWORD: isDevelopment 
    ? '/api/password-reset/forgot-password'
    : 'https://password-reset-29wr.onrender.com/api/auth/forgot-password',
  
  VERIFY_RESET_TOKEN: isDevelopment
    ? '/api/password-reset/verify-reset-token'
    : 'https://password-reset-29wr.onrender.com/api/auth/verify-reset-token',
  
  RESET_PASSWORD: isDevelopment
    ? '/api/password-reset/reset-password'
    : 'https://password-reset-29wr.onrender.com/api/auth/reset-password'
};

// Helper function to make API calls with better error handling
export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    // Check if response has content before trying to parse JSON
    const text = await response.text();
    console.log('🔍 Raw response text:', text);
    console.log('📊 Response status:', response.status);
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
    
    let data = {};
    
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', text);
        throw new Error('Invalid response format from server');
      }
    } else {
      console.warn('⚠️ Empty response received from server');
      // For forgot password, empty response might be considered success
      data = { success: true, message: 'Request processed successfully' };
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    // Enhanced error handling
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
    }
    
    if (error.message.includes('CORS')) {
      throw new Error('CORS error: The server is not configured to accept requests from this domain.');
    }
    
    throw error;
  }
};
