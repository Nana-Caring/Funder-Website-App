// Environment configuration for frontend
const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://nanacaring-backend.onrender.com',
  API_URL: import.meta.env.VITE_API_URL || 'https://nanacaring-backend.onrender.com/api',
  
  // Stripe Configuration
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  
  // Environment
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  IS_DEVELOPMENT: import.meta.env.VITE_NODE_ENV !== 'production',
  
  // Feature Flags
  SHOW_TEST_CARDS: import.meta.env.VITE_SHOW_TEST_CARDS === 'true' || import.meta.env.VITE_NODE_ENV === 'development',
  
  // Test Card Information (Only in development)
  TEST_CARDS: {
    success: '4242 4242 4242 4242',
    decline: '4000 0000 0000 0002',
    threeDSecure: '4000 0025 0000 3155',
    insufficient: '4000 0000 0000 9995',
    details: {
      cvv: '123',
      expiry: '12/34',
      zip: '12345'
    }
  }
};

// Validation function to ensure required environment variables are present
export const validateConfig = () => {
  const requiredVars = [
    'API_BASE_URL',
    'API_URL',
    'STRIPE_PUBLISHABLE_KEY'
  ];
  
  const missing = requiredVars.filter(key => !config[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  console.log('✅ Environment configuration validated successfully');
  return true;
};

// Log configuration in development (without sensitive data)
if (config.IS_DEVELOPMENT) {
  console.log('🔧 Environment Configuration:', {
    NODE_ENV: config.NODE_ENV,
    API_BASE_URL: config.API_BASE_URL,
    API_URL: config.API_URL,
    STRIPE_KEY_SET: config.STRIPE_PUBLISHABLE_KEY ? '✅ Yes' : '❌ No',
    SHOW_TEST_CARDS: config.SHOW_TEST_CARDS
  });
}

export default config;
