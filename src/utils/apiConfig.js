// API configuration for handling CORS in development vs production
const isDevelopment = import.meta.env.DEV;

export const API_ENDPOINTS = {
  // Password reset service endpoints - with fallback for proxy issues
  FORGOT_PASSWORD: isDevelopment 
    ? '/api/auth/forgot-password'  // This should work through Vite proxy
    : 'https://password-reset-29wr.onrender.com/api/auth/forgot-password',
  
  VERIFY_RESET_TOKEN: isDevelopment
    ? '/api/auth/verify-reset-token'
    : 'https://password-reset-29wr.onrender.com/api/auth/verify-reset-token',
  
  RESET_PASSWORD: isDevelopment
    ? '/api/auth/reset-password'
    : 'https://password-reset-29wr.onrender.com/api/auth/reset-password'
};

// Fallback endpoint for when proxy fails
export const DIRECT_API_ENDPOINTS = {
  FORGOT_PASSWORD: 'https://password-reset-29wr.onrender.com/api/auth/forgot-password',
  VERIFY_RESET_TOKEN: 'https://password-reset-29wr.onrender.com/api/auth/verify-reset-token',
  RESET_PASSWORD: 'https://password-reset-29wr.onrender.com/api/auth/reset-password'
};

// Helper function to make API calls with better error handling and fallback
export const apiCall = async (endpoint, options = {}) => {
  try {
    // Log the exact fetch request being made
    const requestConfig = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    console.log('🚀 === ACTUAL FETCH REQUEST ===');
    console.log('🎯 Endpoint:', endpoint);
    console.log('🔧 Method:', requestConfig.method || 'GET');
    console.log('📋 Headers:', requestConfig.headers);
    console.log('📦 Body:', requestConfig.body);
    console.log('🌐 Full request config:', requestConfig);
    
    const response = await fetch(endpoint, requestConfig);

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
      
      // If we get an empty response and we're in development using a proxy endpoint,
      // try the direct endpoint as fallback
      if (isDevelopment && endpoint.startsWith('/api/')) {
        console.warn('🔄 Proxy may have failed, trying direct endpoint...');
        
        const directEndpoint = endpoint.replace('/api/auth/forgot-password', DIRECT_API_ENDPOINTS.FORGOT_PASSWORD)
                                      .replace('/api/auth/verify-reset-token', DIRECT_API_ENDPOINTS.VERIFY_RESET_TOKEN)
                                      .replace('/api/auth/reset-password', DIRECT_API_ENDPOINTS.RESET_PASSWORD);
        
        if (directEndpoint !== endpoint) {
          console.log('🎯 Trying direct endpoint:', directEndpoint);
          return await apiCall(directEndpoint, options);
        }
      }
      
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
