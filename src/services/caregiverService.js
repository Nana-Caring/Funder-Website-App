import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nanacaring-backend.onrender.com';

export const caregiverService = {
  // ===== PRIMARY CAREGIVER ROUTES =====
  
  // Get all dependents assigned to the caregiver (MAIN ENDPOINT)
  getDependents: async (token, params = {}) => {
    try {
      console.log('Fetching dependents with params:', params);
      
      const queryParams = {
        page: params.page || 1,
        limit: Math.min(params.limit || 10, 100), // Max 100 as per backend limits
        search: params.search || '',
        status: params.status || 'active',
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'DESC'
      };
      
      const response = await axios.get(`${API_BASE_URL}/api/caregiver/dependents`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: queryParams
      });
      
      console.log('Dependents response:', response.data);
      
      // Handle the new API response structure
      if (response.data.success) {
        return {
          success: true,
          dependents: response.data.data.dependents || [],
          pagination: response.data.data.pagination || {},
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch dependents');
      }
    } catch (error) {
      console.error('Error fetching dependents:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // Enhanced error handling based on API documentation
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Caregiver role required.');
      } else if (error.response?.status === 404) {
        throw new Error('No dependents found.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch dependents');
      }
    }
  },

  // Get specific dependent by ID with complete profile and transaction history
  getDependentById: async (token, dependentId) => {
    try {
      console.log('Fetching dependent by ID:', dependentId);
      
      const response = await axios.get(`${API_BASE_URL}/api/caregiver/dependents/${dependentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Dependent details response:', response.data);
      
      // Handle the new API response structure
      if (response.data.success) {
        return {
          success: true,
          dependent: response.data.data.dependent || {},
          accounts: response.data.data.accounts || [],
          summary: response.data.data.summary || {},
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch dependent details');
      }
    } catch (error) {
      console.error('Error fetching dependent details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Caregiver role required.');
      } else if (error.response?.status === 404) {
        throw new Error('Dependent not found or you do not have caregiver access to this user.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch dependent details');
      }
    }
  },

  // Get caregiver dashboard statistics (total dependents, balances, etc.)
  getStats: async (token) => {
    try {
      console.log('Fetching caregiver statistics');
      
      const response = await axios.get(`${API_BASE_URL}/api/caregiver/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Caregiver stats response:', response.data);
      
      // Handle the new API response structure
      if (response.data.success) {
        return {
          success: true,
          stats: response.data.data || {},
          totalDependents: response.data.data.totalDependents || 0,
          totalAccountBalance: response.data.data.totalBalance || 0,
          currency: 'ZAR',
          dependentsByStatus: response.data.data.dependentsByStatus || {},
          accountSummary: response.data.data.accountSummary || {},
          recentActivity: response.data.data.recentActivity || {},
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching caregiver stats:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Caregiver role required.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch statistics');
      }
    }
  },

  // Get recent activity across all assigned dependents
  getActivity: async (token, params = {}) => {
    try {
      console.log('Fetching recent activity with params:', params);
      
      const queryParams = {
        limit: params.limit || 20,
        days: params.days || 7
      };
      
      const response = await axios.get(`${API_BASE_URL}/api/caregiver/activity`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: queryParams
      });
      
      console.log('Activity response:', response.data);
      
      // Handle the new API response structure
      if (response.data.success) {
        return {
          success: true,
          activities: response.data.data.activities || [],
          summary: response.data.data.summary || {},
          transactions: response.data.data.activities || [], // for backward compatibility
          totalTransactions: response.data.data.summary?.totalActivities || 0,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch activity');
      }
    } catch (error) {
      console.error('Error fetching activity:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Caregiver role required.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch activity');
      }
    }
  },

  // ===== ACCOUNT MANAGEMENT ROUTES =====
  
  // Get all dependents' accounts (account-focused view)
  getAllDependentsAccounts: async (token) => {
    try {
      console.log('Fetching all dependents accounts');
      
      const response = await axios.get(`${API_BASE_URL}/accounts/caregiver/all-dependents`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('All dependents accounts response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching all dependents accounts:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Caregiver role required.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch accounts');
      }
    }
  },

  // Get specific dependent's accounts
  getDependentAccounts: async (token, dependentId) => {
    try {
      console.log('Fetching accounts for dependent:', dependentId);
      
      const response = await axios.get(`${API_BASE_URL}/accounts/caregiver/dependent/${dependentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Dependent accounts response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching dependent accounts:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Caregiver role required.');
      } else if (error.response?.status === 404) {
        throw new Error('Dependent accounts not found or access denied.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch dependent accounts');
      }
    }
  },

  // ===== TRANSFER/BENEFICIARY ROUTES =====
  
  // Get beneficiaries list for transfer purposes
  getBeneficiaries: async (token) => {
    try {
      console.log('Fetching beneficiaries list');
      
      const response = await axios.get(`${API_BASE_URL}/transfer/beneficiaries`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Beneficiaries response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching beneficiaries:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Caregiver role required.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch beneficiaries');
      }
    }
  },

  // ===== USER MANAGEMENT ROUTES =====
  
  // Get dependents (general user information)
  getDependentsGeneral: async (token) => {
    try {
      console.log('Fetching general dependents information');
      
      const response = await axios.get(`${API_BASE_URL}/users/dependents`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('General dependents response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching general dependents:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch dependents');
      }
    }
  },

  // ===== TRANSACTION ROUTES =====
  
  // Get all dependent transactions for the caregiver
  getAllTransactions: async (token, params = {}) => {
    try {
      console.log('Fetching all caregiver transactions with params:', params);
      
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 20,
        ...(params.startDate && { startDate: params.startDate }),
        ...(params.endDate && { endDate: params.endDate }),
        ...(params.accountType && { accountType: params.accountType }),
        ...(params.transactionType && { transactionType: params.transactionType }),
        ...(params.dependentId && { dependentId: params.dependentId }),
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'DESC'
      };
      
      const response = await axios.get(`${API_BASE_URL}/api/caregiver/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: queryParams
      });
      
      console.log('All transactions response:', response.data);
      
      // Handle the new API response structure
      if (response.data.success) {
        return {
          success: true,
          transactions: response.data.data.transactions || [],
          summary: response.data.data.summary || {},
          pagination: response.data.data.pagination || {},
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching all transactions:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Caregiver role required.');
      } else if (error.response?.status === 404) {
        throw new Error('No transactions found.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch transactions');
      }
    }
  },

  // Get transactions for a specific dependent
  getDependentTransactions: async (token, dependentId, params = {}) => {
    try {
      console.log('Fetching transactions for dependent:', dependentId, 'with params:', params);
      
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 20,
        ...(params.accountType && { accountType: params.accountType }),
        ...(params.startDate && { startDate: params.startDate }),
        ...(params.endDate && { endDate: params.endDate }),
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'DESC'
      };
      
      const response = await axios.get(`${API_BASE_URL}/api/caregiver/dependents/${dependentId}/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: queryParams
      });
      
      console.log('Dependent transactions response:', response.data);
      
      // Handle the new API response structure
      if (response.data.success) {
        return {
          success: true,
          dependent: response.data.data.dependent || {},
          transactions: response.data.data.transactions || [],
          summary: response.data.data.summary || {},
          pagination: response.data.data.pagination || {},
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch dependent transactions');
      }
    } catch (error) {
      console.error('Error fetching dependent transactions:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Caregiver role required.');
      } else if (error.response?.status === 404) {
        throw new Error('Dependent not found or no transactions available.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch dependent transactions');
      }
    }
  },

  // Get transaction analytics for caregiver dashboard
  getTransactionAnalytics: async (token, params = {}) => {
    try {
      console.log('Fetching transaction analytics with params:', params);
      
      const queryParams = {
        period: params.period || 'month', // week, month, quarter, year
        ...(params.dependentId && { dependentId: params.dependentId })
      };
      
      const response = await axios.get(`${API_BASE_URL}/api/caregiver/transactions/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: queryParams
      });
      
      console.log('Transaction analytics response:', response.data);
      
      // Handle the new API response structure
      if (response.data.success) {
        return {
          success: true,
          analytics: response.data.data || {},
          period: response.data.data.period || params.period,
          dateRange: response.data.data.dateRange || {},
          totalSpending: response.data.data.totalSpending || 0,
          totalIncome: response.data.data.totalIncome || 0,
          netBalance: response.data.data.netBalance || 0,
          transactionCount: response.data.data.transactionCount || 0,
          spendingByCategory: response.data.data.spendingByCategory || {},
          spendingTrend: response.data.data.spendingTrend || [],
          topMerchants: response.data.data.topMerchants || [],
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch transaction analytics');
      }
    } catch (error) {
      console.error('Error fetching transaction analytics:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Caregiver role required.');
      } else if (error.response?.status === 404) {
        throw new Error('No analytics data found.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch transaction analytics');
      }
    }
  },

  // ===== CONVENIENCE METHODS =====
  
  // Load complete dashboard data (stats + dependents + activity)
  loadDashboardData: async (token, params = {}) => {
    try {
      console.log('Loading complete dashboard data');
      
      const [statsData, dependentsData, activityData] = await Promise.allSettled([
        caregiverService.getStats(token),
        caregiverService.getDependents(token, { page: 1, limit: 10, ...params }),
        caregiverService.getActivity(token, { limit: 5 })
      ]);

      const result = {
        stats: null,
        dependents: null,
        activity: null,
        errors: []
      };

      if (statsData.status === 'fulfilled') {
        result.stats = statsData.value;
      } else {
        result.errors.push({ type: 'stats', error: statsData.reason.message });
      }

      if (dependentsData.status === 'fulfilled') {
        result.dependents = dependentsData.value;
      } else {
        result.errors.push({ type: 'dependents', error: dependentsData.reason.message });
      }

      if (activityData.status === 'fulfilled') {
        result.activity = activityData.value;
      } else {
        result.errors.push({ type: 'activity', error: activityData.reason.message });
      }

      console.log('Dashboard data loaded:', result);
      return result;
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      throw new Error('Failed to load dashboard data');
    }
  },

  // Search dependents with enhanced options
  searchDependents: async (token, searchOptions = {}) => {
    const {
      query = '',
      status = 'all',
      sortBy = 'firstName',
      sortOrder = 'ASC',
      page = 1,
      limit = 50
    } = searchOptions;

    return caregiverService.getDependents(token, {
      search: query,
      status,
      sortBy,
      sortOrder,
      page,
      limit
    });
  },

  // ===== DEPENDENT REGISTRATION ROUTES =====
  
  // Register a new dependent (PRIMARY ENDPOINT - RECOMMENDED)
  registerDependent: async (token, dependentData) => {
    try {
      console.log('Registering new dependent:', { ...dependentData, password: '[HIDDEN]' });
      
      // Validate required fields
      const requiredFields = ['firstName', 'surname', 'email', 'password', 'Idnumber', 'relation'];
      const missingFields = requiredFields.filter(field => !dependentData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(dependentData.email)) {
        throw new Error('Valid email address required');
      }

      // Validate ID number format (13 digits)
      const idRegex = /^\d{13}$/;
      if (!idRegex.test(dependentData.Idnumber)) {
        throw new Error('Valid 13-digit numeric ID number required');
      }

      // Try primary endpoint first
      let response;
      const requestData = {
        firstName: dependentData.firstName.trim(),
        middleName: dependentData.middleName?.trim() || null,
        surname: dependentData.surname.trim(),
        email: dependentData.email.trim().toLowerCase(),
        password: dependentData.password,
        Idnumber: dependentData.Idnumber.trim(),
        relation: dependentData.relation.trim()
      };

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      console.log('Attempting registration with endpoint:', `${API_BASE_URL}/api/auth/register-dependent`);
      
      try {
        response = await axios.post(`${API_BASE_URL}/api/auth/register-dependent`, requestData, { headers });
      } catch (primaryError) {
        console.log('Auth endpoint failed, trying alternative endpoint:', `${API_BASE_URL}/api/register-dependent`);
        
        try {
          response = await axios.post(`${API_BASE_URL}/api/register-dependent`, requestData, { headers });
        } catch (fallbackError) {
          console.log('Fallback endpoint failed, trying users endpoint:', `${API_BASE_URL}/api/users/dependents`);
          
          try {
            response = await axios.post(`${API_BASE_URL}/api/users/dependents`, requestData, { headers });
          } catch (usersError) {
            console.log('All endpoints failed. Auth error:', primaryError.response?.status, primaryError.response?.data);
            console.log('Fallback error:', fallbackError.response?.status, fallbackError.response?.data);
            console.log('Users error:', usersError.response?.status, usersError.response?.data);
            
            // Throw the most relevant error (auth endpoint since it's primary)
            throw primaryError;
          }
        }
      }
      
      console.log('Dependent registration successful:', {
        id: response.data.dependent?.id,
        name: `${response.data.dependent?.firstName} ${response.data.dependent?.surname}`,
        accounts: response.data.dependent?.accounts?.length || 0
      });
      
      return response.data;
    } catch (error) {
      console.error('Error registering dependent:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 400) {
        // Client-side validation errors
        throw new Error(error.response?.data?.message || 'Invalid registration data');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Only caregivers can register dependents.');
      } else if (error.response?.status === 409) {
        throw new Error('Email or ID number already in use');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to register dependent');
      }
    }
  },

  // Alternative registration route (for compatibility)
  registerDependentAlt: async (token, dependentData) => {
    try {
      console.log('Registering dependent via alternative route');
      
      const response = await axios.post(`${API_BASE_URL}/users/dependents`, dependentData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Alternative dependent registration successful');
      return response.data;
    } catch (error) {
      console.error('Error in alternative dependent registration:', error);
      throw error;
    }
  },

  // Validate dependent data before registration
  validateDependentData: (dependentData) => {
    const errors = [];
    
    // Required field validation
    if (!dependentData.firstName?.trim()) {
      errors.push('First name is required');
    }
    
    if (!dependentData.surname?.trim()) {
      errors.push('Surname is required');
    }
    
    if (!dependentData.email?.trim()) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(dependentData.email)) {
        errors.push('Valid email address required');
      }
    }
    
    if (!dependentData.password) {
      errors.push('Password is required');
    } else if (dependentData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    
    if (!dependentData.Idnumber?.trim()) {
      errors.push('ID number is required');
    } else {
      const idRegex = /^\d{13}$/;
      if (!idRegex.test(dependentData.Idnumber)) {
        errors.push('ID number must be exactly 13 digits');
      }
    }
    
    if (!dependentData.relation?.trim()) {
      errors.push('Relationship is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // ===== DEBUG AND UTILITY FUNCTIONS =====

  // Debug token function to help diagnose authentication issues
  debugToken: (token) => {
    try {
      if (!token) {
        console.error('❌ No token provided');
        return { valid: false, reason: 'No token provided' };
      }

      // Try to decode JWT (basic decoding, not verification)
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('❌ Invalid token format - not a valid JWT');
        return { valid: false, reason: 'Invalid JWT format' };
      }

      try {
        const payload = JSON.parse(atob(parts[1]));
        console.log('🔍 Token payload:', {
          id: payload.id,
          role: payload.role,
          iat: payload.iat,
          exp: payload.exp,
          expired: payload.exp ? Date.now() / 1000 > payload.exp : 'No expiry'
        });

        if (payload.role !== 'caregiver') {
          console.warn('⚠️ Token role is not caregiver:', payload.role);
          return { valid: false, reason: `Wrong role: ${payload.role}` };
        }

        if (payload.exp && Date.now() / 1000 > payload.exp) {
          console.error('❌ Token has expired');
          return { valid: false, reason: 'Token expired' };
        }

        console.log('✅ Token appears valid for caregiver role');
        return { valid: true, payload };
      } catch (decodeError) {
        console.error('❌ Failed to decode token payload:', decodeError);
        return { valid: false, reason: 'Failed to decode token' };
      }
    } catch (error) {
      console.error('❌ Token debug error:', error);
      return { valid: false, reason: error.message };
    }
  },

  // Check token from multiple sources
  getValidToken: () => {
    const sources = [
      { name: 'localStorage.token', value: localStorage.getItem('token') },
      { name: 'localStorage.accessToken', value: localStorage.getItem('accessToken') },
      { name: 'localStorage.authToken', value: localStorage.getItem('authToken') },
      { name: 'localStorage.jwt', value: localStorage.getItem('jwt') }
    ];

    console.log('🔍 Checking token sources:');
    for (const source of sources) {
      if (source.value) {
        console.log(`✅ Found token in ${source.name}:`, source.value.substring(0, 20) + '...');
        const debugResult = caregiverService.debugToken(source.value);
        if (debugResult.valid) {
          console.log(`✅ Using valid token from ${source.name}`);
          return source.value;
        } else {
          console.log(`❌ Token from ${source.name} is invalid: ${debugResult.reason}`);
        }
      } else {
        console.log(`❌ No token found in ${source.name}`);
      }
    }

    console.error('❌ No valid caregiver token found in any source');
    return null;
  },

  // Test API connectivity with current token
  testConnection: async () => {
    const token = caregiverService.getValidToken();
    if (!token) {
      return { success: false, error: 'No valid token found' };
    }

    try {
      console.log('🔄 Testing caregiver API connection...');
      
      // Test with a simple stats call
      const response = await axios.get(`${API_BASE_URL}/caregiver/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ API connection successful:', response.status);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ API connection failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message,
        status: error.response?.status 
      };
    }
  },

  // Test which registration endpoints are available
  testRegistrationEndpoints: async (token) => {
    const endpoints = [
      `${API_BASE_URL}/auth/register-dependent`,
      `${API_BASE_URL}/register-dependent`,
      `${API_BASE_URL}/users/dependents`
    ];

    const results = {};
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Testing endpoint: ${endpoint}`);
        
        // Make a HEAD request or GET to see if endpoint exists
        const response = await axios.get(endpoint.replace('/register-dependent', '/me').replace('/dependents', '/profile'), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        results[endpoint] = { available: true, status: response.status };
      } catch (error) {
        results[endpoint] = { 
          available: false, 
          status: error.response?.status || 'Network Error',
          message: error.response?.statusText || error.message
        };
      }
    }
    
    console.log('Endpoint availability test results:', results);
    return results;
  },

  // Download statements as CSV or PDF
  downloadStatements: async (token, params = {}) => {
    try {
      console.log('Downloading statements with params:', params);
      
      const response = await axios.get(`${API_BASE_URL}/caregiver/transactions/export`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          format: params.format || 'csv', // csv, pdf
          startDate: params.startDate,
          endDate: params.endDate,
          dependentId: params.dependentId,
          category: params.category
        },
        responseType: 'blob' // Important for file downloads
      });
      
      // Create blob and download
      const blob = new Blob([response.data], { 
        type: params.format === 'pdf' ? 'application/pdf' : 'text/csv' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `statements_${new Date().toISOString().split('T')[0]}.${params.format || 'csv'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('Statements downloaded successfully');
      return { success: true };
    } catch (error) {
      console.error('Error downloading statements:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Caregiver role required.');
      } else if (error.response?.status === 404) {
        throw new Error('No statements found for the specified criteria.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to download statements');
      }
    }
  },
};

export default caregiverService;
