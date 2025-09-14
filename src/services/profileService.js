import apiClient from './apiClient';

// Safe localStorage wrapper to handle tracking prevention
const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.log('LocalStorage access blocked, using fallback');
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.log('LocalStorage write blocked, data not persisted');
      return false;
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.log('LocalStorage remove blocked');
      return false;
    }
  }
};

// Create axios instance with default config
const api = apiClient;

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = safeLocalStorage.getItem('token') || 
                  safeLocalStorage.getItem('accessToken') || 
                  safeLocalStorage.getItem('authToken') ||
                  safeLocalStorage.getItem('jwt');
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
    // Suppress console errors for known unavailable profile endpoints
    const isProfileEndpoint = error.config?.url?.includes('/users/profile') || 
                             error.config?.url?.includes('/api/users/profile');
    const is404Error = error.response?.status === 404;
    
    if (isProfileEndpoint && is404Error) {
      // Silently handle profile endpoint 404s - these are expected when backend is unavailable
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      safeLocalStorage.removeItem('token');
      safeLocalStorage.removeItem('user');
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
      const response = await api.get('/api/users/profile');
      console.log('✅ Profile fetched successfully:', response.data);
      
      // Update localStorage with fresh data
      if (response.data.user) {
        safeLocalStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Also update individual fields for backward compatibility
        const user = response.data.user;
        Object.keys(user).forEach(key => {
          if (user[key] !== null && user[key] !== undefined) {
            safeLocalStorage.setItem(key, user[key].toString());
          }
        });
      }
      
      return response.data;
    } catch (error) {
      // Silently handle 404 errors and provide localStorage fallback
      if (error.response?.status === 404 || error.code === 'NETWORK_ERROR') {
        console.log('📱 Loading profile from localStorage (backend unavailable)');
        
        // Return data from localStorage
        const localUser = safeLocalStorage.getItem('user');
        if (localUser) {
          try {
            const userData = JSON.parse(localUser);
            return { user: userData };
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
          }
        }
        
        // Return basic user data from individual localStorage items
        return {
          user: {
            firstName: safeLocalStorage.getItem('firstName') || '',
            lastName: safeLocalStorage.getItem('lastName') || '',
            email: safeLocalStorage.getItem('email') || '',
            role: safeLocalStorage.getItem('role') || 'user',
            phoneNumber: safeLocalStorage.getItem('phoneNumber') || '',
            accountNumber: safeLocalStorage.getItem('accountNumber') || '',
            id: safeLocalStorage.getItem('userId') || safeLocalStorage.getItem('id') || ''
          }
        };
      }
      
      // Only log actual server errors, not 404s
      console.error('❌ Unexpected error fetching user profile:', error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  // Get profile completion status
  getProfileCompletion: async () => {
    // Always use localStorage calculation since backend endpoint is unavailable
    console.log('📱 Calculating profile completion from localStorage');
    
    try {
      // Calculate completion based on localStorage data
      const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber'];
      const completedFields = requiredFields.filter(field => {
        const value = safeLocalStorage.getItem(field);
        return value && value.trim() !== '';
      });
      const percentage = Math.round((completedFields.length / requiredFields.length) * 100);
      
      return { 
        percentage, 
        completed: percentage === 100, 
        message: `Profile ${percentage}% complete`,
        missingFields: requiredFields.filter(field => !completedFields.includes(field))
      };
    } catch (error) {
      console.log('Error calculating profile completion, using defaults');
      return { 
        percentage: 0, 
        completed: false, 
        message: 'Profile completion unavailable',
        missingFields: ['firstName', 'lastName', 'email', 'phoneNumber']
      };
    }
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      console.log('🔄 Updating user profile:', profileData);
      const response = await api.put('/api/users/profile', profileData);
      console.log('✅ Profile updated successfully:', response.data);
      
      // Update localStorage with updated data
      if (response.data.user) {
        safeLocalStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Also update individual fields
        const user = response.data.user;
        Object.keys(user).forEach(key => {
          if (user[key] !== null && user[key] !== undefined) {
            safeLocalStorage.setItem(key, user[key].toString());
          }
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      
      // If backend is not available, update localStorage only
      if (error.response?.status === 404 || error.code === 'NETWORK_ERROR') {
        console.log('📱 Backend not available, updating localStorage only');
        
        // Update localStorage with new data
        const storedUser = safeLocalStorage.getItem('user');
        let user = {};
        if (storedUser) {
          try {
            user = JSON.parse(storedUser);
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
          }
        }
        
        // Merge new data
        const updatedUser = { ...user, ...profileData };
        safeLocalStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Also update individual fields
        Object.keys(profileData).forEach(key => {
          if (profileData[key] !== null && profileData[key] !== undefined) {
            safeLocalStorage.setItem(key, profileData[key].toString());
          }
        });
        
        return { user: updatedUser, message: 'Profile updated locally' };
      }
      
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  // Update specific profile field
  updateProfileField: async (field, value) => {
    try {
      console.log(`🔄 Updating profile field ${field}:`, value);
      const response = await api.put('/api/users/profile', { [field]: value });
      console.log('✅ Profile field updated successfully:', response.data);
      
      // Update localStorage
      const storedUser = safeLocalStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user[field] = value;
        safeLocalStorage.setItem('user', JSON.stringify(user));
      }
      safeLocalStorage.setItem(field, value);
      
      return response.data;
    } catch (error) {
      // Silently handle backend unavailability and update localStorage
      if (error.response?.status === 404 || error.code === 'NETWORK_ERROR') {
        console.log(`📱 Updating ${field} locally (backend unavailable)`);
        
        // Update localStorage
        const storedUser = safeLocalStorage.getItem('user');
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            user[field] = value;
            safeLocalStorage.setItem('user', JSON.stringify(user));
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
          }
        }
        safeLocalStorage.setItem(field, value.toString());
        
        return { message: `${field} updated locally`, [field]: value };
      }
      
      console.error(`❌ Unexpected error updating profile field ${field}:`, error.message);
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
