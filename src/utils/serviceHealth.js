// Service Health Check Utility
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nanacaring-backend.onrender.com';

/**
 * Check if the backend service is healthy
 * @returns {Promise<{isHealthy: boolean, status: string, responseTime: number}>}
 */
export const checkServiceHealth = async () => {
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Set a shorter timeout for health checks
      signal: AbortSignal.timeout(10000), // 10 seconds
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        isHealthy: true,
        status: 'Service is running normally',
        responseTime,
        statusCode: response.status
      };
    } else {
      return {
        isHealthy: false,
        status: `Service returned ${response.status}: ${response.statusText}`,
        responseTime,
        statusCode: response.status
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    if (error.name === 'TimeoutError') {
      return {
        isHealthy: false,
        status: 'Service timeout - server may be overloaded or down',
        responseTime,
        error: 'TIMEOUT'
      };
    }

    return {
      isHealthy: false,
      status: `Service unavailable: ${error.message}`,
      responseTime,
      error: error.name
    };
  }
};

/**
 * Test specific endpoint connectivity
 * @param {string} endpoint - The endpoint to test (e.g., '/api/caregiver/dependents')
 * @param {string} token - Auth token for authenticated endpoints
 * @returns {Promise<{isAccessible: boolean, status: string, responseTime: number}>}
 */
export const testEndpoint = async (endpoint, token = null) => {
  const startTime = Date.now();
  
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(15000), // 15 seconds
    });

    const responseTime = Date.now() - startTime;

    return {
      isAccessible: response.ok,
      status: `${response.status}: ${response.statusText}`,
      responseTime,
      statusCode: response.status,
      endpoint
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      isAccessible: false,
      status: `Error: ${error.message}`,
      responseTime,
      error: error.name,
      endpoint
    };
  }
};

/**
 * Run comprehensive service diagnostics
 * @param {string} token - Auth token for authenticated endpoints
 * @returns {Promise<Object>} Diagnostic results
 */
export const runServiceDiagnostics = async (token = null) => {
  console.log('🔍 Running service diagnostics...');
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    baseUrl: API_BASE_URL,
    results: {}
  };

  // Test basic health
  console.log('Testing service health...');
  diagnostics.results.health = await checkServiceHealth();

  // Test key endpoints if we have a token
  if (token) {
    console.log('Testing authenticated endpoints...');
    
    const endpoints = [
      '/api/caregiver/dependents',
      '/api/caregiver/stats',
      '/api/caregiver/activity'
    ];

    diagnostics.results.endpoints = {};
    
    for (const endpoint of endpoints) {
      console.log(`Testing ${endpoint}...`);
      diagnostics.results.endpoints[endpoint] = await testEndpoint(endpoint, token);
    }
  }

  // Overall assessment
  const isHealthy = diagnostics.results.health.isHealthy;
  const endpointResults = diagnostics.results.endpoints || {};
  const accessibleEndpoints = Object.values(endpointResults).filter(r => r.isAccessible).length;
  const totalEndpoints = Object.keys(endpointResults).length;

  diagnostics.summary = {
    overallHealth: isHealthy && (totalEndpoints === 0 || accessibleEndpoints === totalEndpoints) ? 'HEALTHY' : 'DEGRADED',
    healthCheck: isHealthy ? 'PASS' : 'FAIL',
    endpointAccessibility: totalEndpoints > 0 ? `${accessibleEndpoints}/${totalEndpoints}` : 'N/A',
    recommendations: []
  };

  // Generate recommendations
  if (!isHealthy) {
    diagnostics.summary.recommendations.push('Backend service appears to be down or unreachable');
  }
  
  if (totalEndpoints > 0 && accessibleEndpoints < totalEndpoints) {
    diagnostics.summary.recommendations.push('Some endpoints are returning errors - check server logs');
  }

  if (diagnostics.results.health.responseTime > 10000) {
    diagnostics.summary.recommendations.push('Service response time is very slow - server may be overloaded');
  }

  console.log('📊 Service diagnostics complete:', diagnostics.summary);
  return diagnostics;
};

/**
 * Display user-friendly service status
 * @param {Object} diagnostics - Results from runServiceDiagnostics
 * @returns {string} User-friendly status message
 */
export const getServiceStatusMessage = (diagnostics) => {
  const { summary, results } = diagnostics;
  
  switch (summary.overallHealth) {
    case 'HEALTHY':
      return '✅ All services are running normally';
    
    case 'DEGRADED':
      if (!results.health.isHealthy) {
        return '🔴 Backend server is currently unavailable. Please try again in a few minutes.';
      } else {
        return '🟡 Some features may be temporarily unavailable due to server issues.';
      }
    
    default:
      return '⚠️ Service status unknown. Please refresh the page and try again.';
  }
};
