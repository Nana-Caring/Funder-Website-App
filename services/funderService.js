import axios from 'axios';

const API_BASE_URL = 'https://nanacaring-backend.onrender.com/api';

export const funderService = {
  linkDependent: async (dependentData, token) => {
    try {
      console.log('Linking dependent with data:', dependentData);
      console.log('Using token:', token ? 'Token present' : 'No token');
      
      const response = await axios.post(
        `${API_BASE_URL}/funder/link-dependent`,
        dependentData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Link dependent response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error linking dependent:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // More specific error handling
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to link dependents.');
      } else if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Invalid data provided.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw error.response?.data?.message || error.message || 'Failed to link dependent';
      }
    }
  },

  getDependents: async (token) => {
    try {
      console.log('Fetching dependents with token:', token ? 'Token present' : 'No token');
      
      const response = await axios.get(
        `${API_BASE_URL}/funder/dependents`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Dependents response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching dependents:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // More specific error handling
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to view dependents.');
      } else if (error.response?.status === 404) {
        throw new Error('No dependents found.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw error.response?.data?.message || error.message || 'Failed to load beneficiaries';
      }
    }
  },

  // New Smart Transfer System Integration
  smartTransfer: async (transferData, token) => {
    try {
      console.log('🧠 Smart Transfer via funderService:', transferData);
      
      const response = await axios.post(
        `${API_BASE_URL}/funder/transfer`,
        {
          beneficiaryUserId: transferData.beneficiaryUserId,
          accountType: transferData.accountType,
          amount: transferData.amount,
          currency: transferData.currency || 'ZAR',
          description: transferData.description
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Smart transfer response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in smart transfer:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // Enhanced error handling for smart transfer
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('You are not authorized to transfer to this beneficiary.');
      } else if (error.response?.status === 400) {
        const errorData = error.response?.data;
        if (errorData?.errors) {
          const errorMessages = errorData.errors.map(err => `${err.field}: ${err.message}`).join(', ');
          throw new Error(`Validation failed: ${errorMessages}`);
        }
        throw new Error(errorData?.message || 'Invalid transfer data.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Transfer failed');
      }
    }
  },

  // Get beneficiaries with account details (new API)
  getBeneficiariesWithAccounts: async (token) => {
    try {
      console.log('📋 Fetching beneficiaries with accounts...');
      
      const response = await axios.get(
        `${API_BASE_URL}/funder/beneficiaries`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Beneficiaries with accounts response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching beneficiaries with accounts:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to view beneficiaries.');
      } else if (error.response?.status === 404) {
        throw new Error('No beneficiaries found.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to load beneficiaries');
      }
    }
  },

  // Get funder balance (new API)
  getBalance: async (token) => {
    try {
      console.log('💰 Fetching funder balance...');
      
      const response = await axios.get(
        `${API_BASE_URL}/funder/balance`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Funder balance response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching funder balance:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to get balance');
      }
    }
  }
};
