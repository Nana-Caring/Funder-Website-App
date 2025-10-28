/**
 * Smart Funder Transfer Service
 * Implements the new comprehensive Smart Transfer System with auto-distribution
 * Based on the Backend Integration Guide for Funder Transfer System
 */

const API_BASE_URL = 'https://nanacaring-backend.onrender.com/api';

// Safe localStorage wrapper
const safeStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Storage access error:', error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Storage write error:', error);
      return false;
    }
  }
};

// Get authorization headers
const getAuthHeaders = () => {
  const token = safeStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const smartTransferService = {
  /**
   * Transfer funds with smart distribution support
   * @param {Object} transferData - Transfer request data
   * @param {number} transferData.beneficiaryUserId - Dependent's user ID
   * @param {string} transferData.accountType - "Main" or specific category name
   * @param {number} transferData.amount - Amount in ZAR
   * @param {string} transferData.currency - Currency code (default: "ZAR")
   * @param {string} transferData.description - Transfer description (optional)
   * @returns {Promise<Object>} Transfer result with auto-distribution details
   */
  transfer: async (transferData) => {
    try {
      console.log('🚀 Smart Transfer Service - Processing transfer:', transferData);

      const response = await fetch(`${API_BASE_URL}/funder/transfer`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          beneficiaryUserId: transferData.beneficiaryUserId,
          accountType: transferData.accountType,
          amount: transferData.amount,
          currency: transferData.currency || 'ZAR',
          description: transferData.description || `Transfer to ${transferData.accountType} account`
        })
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        console.error('❌ Transfer failed:', result);
        throw new Error(result.message || 'Transfer failed');
      }

      console.log('✅ Transfer successful:', result.data);
      
      // Cache the new balance
      if (result.data.funder?.newBalance) {
        safeStorage.setItem('funderMainBalance', result.data.funder.newBalance.toString());
      }

      return result.data;
    } catch (error) {
      console.error('Smart Transfer Service Error:', error);
      throw error;
    }
  },

  /**
   * Get list of funder's dependents/beneficiaries with account information
   * @returns {Promise<Array>} List of beneficiaries with their accounts
   */
  getBeneficiaries: async () => {
    try {
      console.log('📋 Fetching beneficiaries...');

      const response = await fetch(`${API_BASE_URL}/funder/beneficiaries`, {
        headers: getAuthHeaders()
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to load beneficiaries');
      }

      const beneficiaries = result.data || [];
      
      // Cache beneficiaries for offline support
      safeStorage.setItem('beneficiaries_cache', JSON.stringify(beneficiaries));
      
      console.log('✅ Loaded beneficiaries:', beneficiaries.length);
      return beneficiaries;
    } catch (error) {
      console.error('Get Beneficiaries Error:', error);
      
      // Try loading from cache
      const cached = safeStorage.getItem('beneficiaries_cache');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          console.log('📱 Using cached beneficiaries:', parsed.length);
          return parsed;
        } catch (parseError) {
          console.error('Cache parse error:', parseError);
        }
      }
      
      throw error;
    }
  },

  /**
   * Get funder's account balance
   * @returns {Promise<Object>} Balance information
   */
  getBalance: async () => {
    try {
      console.log('💰 Fetching funder balance...');

      const response = await fetch(`${API_BASE_URL}/funder/balance`, {
        headers: getAuthHeaders()
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to get balance');
      }

      const balanceData = result.data;
      
      // Cache balance
      safeStorage.setItem('funderMainBalance', balanceData.balance.toString());
      
      console.log('✅ Balance loaded:', balanceData.balance);
      return balanceData;
    } catch (error) {
      console.error('Get Balance Error:', error);
      
      // Try using cached balance
      const cached = safeStorage.getItem('funderMainBalance');
      if (cached) {
        console.log('📱 Using cached balance');
        return {
          balance: parseFloat(cached),
          currency: 'ZAR',
          cached: true
        };
      }
      
      throw error;
    }
  },

  /**
   * Get transfer history with pagination
   * @param {Object} options - Query options
   * @param {number} options.limit - Number of records (default: 10)
   * @param {number} options.offset - Records to skip (default: 0)
   * @param {number} options.beneficiaryUserId - Filter by beneficiary (optional)
   * @returns {Promise<Object>} Transfer history with pagination
   */
  getTransferHistory: async (options = {}) => {
    try {
      const { limit = 10, offset = 0, beneficiaryUserId } = options;
      
      let url = `${API_BASE_URL}/funder/transfers?limit=${limit}&offset=${offset}`;
      if (beneficiaryUserId) {
        url += `&beneficiaryUserId=${beneficiaryUserId}`;
      }

      console.log('📊 Fetching transfer history...');

      const response = await fetch(url, {
        headers: getAuthHeaders()
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to get transfer history');
      }

      console.log('✅ Transfer history loaded:', result.data.transfers.length, 'records');
      return result.data;
    } catch (error) {
      console.error('Get Transfer History Error:', error);
      throw error;
    }
  },

  /**
   * Validate transfer parameters before submission
   * @param {Object} transferData - Transfer data to validate
   * @returns {Object} Validation result
   */
  validateTransfer: (transferData) => {
    const errors = [];

    if (!transferData.beneficiaryUserId) {
      errors.push({ field: 'beneficiaryUserId', message: 'Beneficiary is required' });
    }

    if (!transferData.accountType) {
      errors.push({ field: 'accountType', message: 'Account type is required' });
    }

    if (!transferData.amount || transferData.amount <= 0) {
      errors.push({ field: 'amount', message: 'Amount must be greater than 0' });
    }

    // Check available balance
    const cachedBalance = safeStorage.getItem('funderMainBalance');
    if (cachedBalance && transferData.amount > parseFloat(cachedBalance)) {
      errors.push({ 
        field: 'amount', 
        message: `Insufficient funds. Available: R${cachedBalance}` 
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Get account types available for transfers
   * @returns {Array} Available account types with labels
   */
  getAccountTypes: () => [
    { value: 'Main', label: '🧠 General Support (Smart Auto-Distribution)', isMain: true },
    { value: 'Healthcare', label: '🏥 Healthcare', isMain: false },
    { value: 'Education', label: '🎓 Education', isMain: false },
    { value: 'Groceries', label: '🛒 Groceries', isMain: false },
    { value: 'Transport', label: '🚗 Transport', isMain: false },
    { value: 'Entertainment', label: '🎮 Entertainment', isMain: false },
    { value: 'Clothing', label: '👕 Clothing', isMain: false },
    { value: 'Baby Care', label: '👶 Baby Care', isMain: false },
    { value: 'Pregnancy', label: '🤱 Pregnancy', isMain: false },
    { value: 'Savings', label: '💰 Savings', isMain: false },
    { value: 'Other', label: '📦 Other', isMain: false }
  ],

  /**
   * Get quick amount suggestions
   * @returns {Array} Suggested amounts in ZAR
   */
  getQuickAmounts: () => [50, 100, 200, 500],

  /**
   * Format transfer success message
   * @param {Object} transferResult - Result from transfer API
   * @returns {string} Formatted success message
   */
  formatSuccessMessage: (transferResult) => {
    if (transferResult.autoDistribution) {
      const distributionText = transferResult.autoDistribution.categories
        .filter(cat => cat.amount > 0)
        .map(cat => `• ${cat.category}: R${cat.amount} (${cat.percentage}%)`)
        .join('\n');
      
      return `✅ Smart Distribution Completed!\n\nR${transferResult.amount} sent to ${transferResult.beneficiary.name}\n\n🧠 Auto-Distribution Applied:\n${distributionText}\n\n📄 Reference: ${transferResult.transferReference}`;
    } else {
      return `✅ Transfer Successful!\n\nR${transferResult.amount} sent directly to ${transferResult.beneficiary.name}'s ${transferResult.targetAccountType}\n\n💳 New ${transferResult.targetAccountType} Balance: R${transferResult.beneficiary.newBalance}\n\n📄 Reference: ${transferResult.transferReference}`;
    }
  }
};

export default smartTransferService;