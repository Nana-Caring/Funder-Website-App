import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://nanacaring-backend.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('accessToken') || 
                  localStorage.getItem('authToken') ||
                  localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const profileService = {
  // Get user profile
  getUserProfile: async () => {
    try {
      console.log('🔍 Fetching user profile from backend...');
      const response = await api.get('/users/profile');
      console.log('✅ Profile fetched successfully:', response.data);
      
      // Update localStorage with fresh data
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Also update individual fields for backward compatibility
        const user = response.data.user;
        Object.keys(user).forEach(key => {
          if (user[key] !== null && user[key] !== undefined) {
            localStorage.setItem(key, user[key].toString());
          }
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  // Get profile completion status
  getProfileCompletion: async () => {
    try {
      console.log('🔍 Fetching profile completion status...');
      const response = await api.get('/users/profile/completion');
      console.log('✅ Profile completion status fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching profile completion:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch profile completion');
    }
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      console.log('🔄 Updating user profile:', profileData);
      const response = await api.put('/users/profile', profileData);
      console.log('✅ Profile updated successfully:', response.data);
      
      // Update localStorage with updated data
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Also update individual fields
        const user = response.data.user;
        Object.keys(user).forEach(key => {
          if (user[key] !== null && user[key] !== undefined) {
            localStorage.setItem(key, user[key].toString());
          }
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  // Update specific profile field
  updateProfileField: async (field, value) => {
    try {
      console.log(`🔄 Updating profile field ${field}:`, value);
      const response = await api.put('/users/profile', { [field]: value });
      console.log('✅ Profile field updated successfully:', response.data);
      
      // Update localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user[field] = value;
        localStorage.setItem('user', JSON.stringify(user));
      }
      localStorage.setItem(field, value);
      
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating profile field ${field}:`, error);
      throw new Error(error.response?.data?.message || `Failed to update ${field}`);
    }
  },

  // Upload profile document
  uploadDocument: async (file, documentType = 'identity') => {
    try {
      console.log('📤 Uploading document:', file.name);
      const formData = new FormData();
      formData.append('document', file);
      formData.append('type', documentType);

      const response = await api.post('/users/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ Document uploaded successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error uploading document:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload document');
    }
  },

  // Get user documents
  getUserDocuments: async () => {
    try {
      console.log('🔍 Fetching user documents...');
      const response = await api.get('/users/documents');
      console.log('✅ Documents fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching documents:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch documents');
    }
  },

  // Delete user document
  deleteDocument: async (documentId) => {
    try {
      console.log('🗑️ Deleting document:', documentId);
      const response = await api.delete(`/users/documents/${documentId}`);
      console.log('✅ Document deleted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting document:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete document');
    }
  }
};

export default profileService;
