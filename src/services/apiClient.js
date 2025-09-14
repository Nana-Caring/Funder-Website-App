import axios from 'axios';

const apiBaseURL = 
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 
  'https://nanacaring-backend.onrender.com';

// Create centralized API client
export const apiClient = axios.create({
  baseURL: apiBaseURL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token on every request
apiClient.interceptors.request.use(
  (config) => {
    const token = 
      localStorage.getItem('accessToken') ||
      localStorage.getItem('jwt') ||
      localStorage.getItem('token') ||
      localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request. Clearing tokens...');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('jwt');
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
