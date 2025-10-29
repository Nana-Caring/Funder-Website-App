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

  // FIXED: Updated to use the correct working endpoint
  getBeneficiaries: async (token) => {
    try {
      console.log('📋 Fetching beneficiaries with token:', token ? 'Token present' : 'No token');
      
      const response = await axios.get(
        `${API_BASE_URL}/funder/get-beneficiaries`, // ✅ CORRECT endpoint
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Beneficiaries response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching beneficiaries:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // More specific error handling
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to view beneficiaries.');
      } else if (error.response?.status === 404) {
        throw new Error('No beneficiaries found.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw error.response?.data?.message || error.message || 'Failed to load beneficiaries';
      }
    }
  },

  // DEPRECATED: Keep for backward compatibility but use getBeneficiaries instead
  getDependents: async (token) => {
    console.warn('⚠️ getDependents is deprecated. Use getBeneficiaries instead.');
    return this.getBeneficiaries(token);
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

  // FALLBACK: Alternative endpoint (may not work consistently)
  getBeneficiariesWithAccounts: async (token) => {
    try {
      console.log('📋 Fetching beneficiaries with accounts (fallback method)...');
      
      // Try enhanced endpoint first, fallback to main endpoint
      try {
        const response = await axios.get(
          `${API_BASE_URL}/funder/get-beneficiaries-enhanced`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('Enhanced beneficiaries response:', response.data);
        return response.data;
      } catch (enhancedError) {
        console.warn('Enhanced endpoint failed, falling back to standard endpoint');
        return this.getBeneficiaries(token);
      }
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
  },

  // Emergency fund calculation helper
  calculateEmergencyStats: (accounts) => {
    if (!accounts || accounts.length === 0) {
      return {
        emergencyBalance: 0,
        totalBalance: 0,
        categoryBalance: 0,
        emergencyPercentage: 0
      };
    }

    const mainAccount = accounts.find(acc => 
      acc.accountType?.toLowerCase() === 'main' || 
      acc.accountName?.toLowerCase() === 'main'
    );

    const totalBalance = accounts.reduce((sum, acc) => {
      const balance = typeof acc.balance === 'string' 
        ? parseFloat(acc.balance.replace(/[^\d.-]/g, '')) 
        : parseFloat(acc.balance || 0);
      return sum + balance;
    }, 0);

    const emergencyBalance = mainAccount 
      ? (typeof mainAccount.balance === 'string' 
          ? parseFloat(mainAccount.balance.replace(/[^\d.-]/g, '')) 
          : parseFloat(mainAccount.balance || 0))
      : 0;

    const categoryBalance = totalBalance - emergencyBalance;
    const emergencyPercentage = totalBalance > 0 ? (emergencyBalance / totalBalance * 100) : 0;

    return {
      emergencyBalance,
      totalBalance,
      categoryBalance,
      emergencyPercentage: Math.round(emergencyPercentage * 10) / 10
    };
  },

  // Format currency helper
  formatCurrency: (amount) => {
    const num = typeof amount === 'string' 
      ? parseFloat(amount.replace(/[^\d.-]/g, '')) 
      : parseFloat(amount || 0);
    return `R ${num.toFixed(2)}`;
  }
};