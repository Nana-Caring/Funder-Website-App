// Fresh API Configuration Module - Clean Export Structure
export const API_ENDPOINTS = {
  FORGOT_PASSWORD: 'https://nanacaring-backend.onrender.com/api/auth/forgot-password',
  VERIFY_RESET_TOKEN: 'https://nanacaring-backend.onrender.com/api/auth/verify-reset-token', 
  RESET_PASSWORD: 'https://nanacaring-backend.onrender.com/api/auth/reset-password'
};

// API call function with comprehensive error handling
export const apiCall = async (endpoint, options = {}) => {
  try {
    console.log('🔄=== FRONTEND API CALL DEBUG START ===');
    console.log('🎯 Full endpoint URL:', endpoint);
    console.log('🌍 Current location:', window.location.href);
    console.log('🔗 Will resolve to:', new URL(endpoint, window.location.origin).href);
    console.log('📦 Request body:', options.body);
    console.log('⚙️ Request options:', options);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      ...options
    });

    console.log('📊 Response status:', response.status);
    console.log('📋 Response headers:', [...response.headers.entries()]);
    console.log('✅ Response OK:', response.ok);
    
    // Get response text
    const text = await response.text();
    console.log('🔍 Raw response text:', text);
    console.log('📏 Response length:', text.length);
    
    // Try to parse as JSON, or create success response
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        // Not JSON, but if status is OK, treat as success
        if (response.ok) {
          data = { success: true, message: 'Email sent successfully' };
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }
    } else {
      // Empty response but OK status
      if (response.ok) {
        data = { success: true, message: 'Email sent successfully' };
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    console.log('✅ Processed response data:', data);
    console.log('🔄=== FRONTEND API CALL DEBUG END ===');
    return data;
    
  } catch (error) {
    console.error('🚨 API Error:', error);
    
    // Handle CORS error specifically
    if (error.message.includes('CORS') || error.name === 'TypeError') {
      throw new Error('Unable to connect to email service. Please try again or contact support.');
    }
    
    throw error;
  }
};