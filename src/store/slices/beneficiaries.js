import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { caregiverService } from '../../services/caregiverService';

// Helper function to get user-specific storage key
const getUserStorageKey = (userId) => {
  return `caregiver_dependents_${userId || 'default'}`;
};

// Helper function to load beneficiaries from localStorage with user-specific storage
const loadBeneficiariesFromStorage = (userId = null) => {
  try {
    // Try user-specific storage first
    const userKey = getUserStorageKey(userId);
    let saved = localStorage.getItem(userKey);
    
    // Fallback to generic key if user-specific doesn't exist
    if (!saved) {
      saved = localStorage.getItem('caregiver_dependents');
    }
    
    if (saved) {
      const data = JSON.parse(saved);
      // Check if data is not too old (7 days instead of 24 hours for better persistence)
      const now = new Date().getTime();
      if (data.timestamp && (now - data.timestamp) < 7 * 24 * 60 * 60 * 1000) {
        return data.dependents || [];
      }
    }
  } catch (error) {
    console.error('Error loading dependents from localStorage:', error);
  }
  // Return empty array by default - we'll fetch from database
  return [];
};

// Helper function to save beneficiaries to localStorage with user-specific storage
const saveBeneficiariesToStorage = (dependents, userId = null) => {
  try {
    const dataToSave = {
      dependents: dependents,
      timestamp: new Date().getTime(),
      userId: userId
    };
    
    // Save to user-specific key
    const userKey = getUserStorageKey(userId);
    localStorage.setItem(userKey, JSON.stringify(dataToSave));
    
    // Also save to generic key for backward compatibility
    localStorage.setItem('caregiver_dependents', JSON.stringify(dataToSave));
    
    console.log(`💾 Saved ${dependents.length} dependents to localStorage for user: ${userId || 'default'}`);
  } catch (error) {
    console.error('Error saving dependents to localStorage:', error);
  }
};

// Helper function to clear old user data (when switching users)
const clearOldUserData = (currentUserId) => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('caregiver_dependents_') && !key.includes(currentUserId)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing old user data:', error);
  }
};

// Transform API dependent data to beneficiary format
const transformDependentToBeneficiary = (dependent) => {
  console.log('🔄 Transforming dependent:', dependent);
  
  const transformed = {
    id: dependent.id,
    name: dependent.name || dependent.fullName || `${dependent.firstName || ''} ${dependent.middleName || ''} ${dependent.surname || ''}`.trim(),
    firstName: dependent.firstName || '',
    surname: dependent.surname || '',
    middleName: dependent.middleName || '',
    idNumber: dependent.idNumber || dependent.Idnumber || '',
    relation: dependent.relation || '',
    email: dependent.email || '',
    phoneNumber: dependent.phoneNumber || '',
    status: dependent.status || 'active',
    isBlocked: dependent.isBlocked || false,
    account: dependent.account ? {
      id: dependent.account.id,
      accountNumber: dependent.account.accountNumber,
      balance: dependent.account.balance || 0,
      currency: dependent.account.currency || 'ZAR',
      status: dependent.account.status,
      lastTransactionDate: dependent.account.lastTransactionDate
    } : null,
    createdAt: dependent.createdAt,
    updatedAt: dependent.updatedAt
  };
  
  console.log('✅ Transformed result:', transformed);
  return transformed;
};

// Async thunk to fetch dependents from caregiver API
const fetchDependents = createAsyncThunk(
  'beneficiaries/fetchDependents',
  async ({ token, params = {} }, { rejectWithValue }) => {
    try {
      if (!token) {
        throw new Error('No authentication token provided');
      }
      
      console.log('🔍 Fetching dependents with params:', params);
      const response = await caregiverService.getDependents(token, params);
      console.log('📋 Raw caregiver API response:', response);
      console.log('📋 Response keys:', Object.keys(response || {}));
      console.log('📋 Response.data keys:', Object.keys(response?.data || {}));
      
      // Handle the correct response structure - the API returns nested data
      let dependents = [];
      let pagination = null;
      
      // Try multiple possible structures
      if (response?.data?.data?.dependents) {
        // Nested structure: { data: { data: { dependents: [...], pagination: {...} } } }
        dependents = response.data.data.dependents;
        pagination = response.data.data.pagination;
        console.log('📊 Using nested data.data structure, found:', dependents.length, 'dependents');
      } else if (response?.data?.dependents) {
        // Direct structure: { data: { dependents: [...], pagination: {...} } }
        dependents = response.data.dependents;
        pagination = response.data.pagination;
        console.log('📊 Using data.dependents structure, found:', dependents.length, 'dependents');
      } else if (response?.dependents) {
        // Root level: { dependents: [...], pagination: {...} }
        dependents = response.dependents;
        pagination = response.pagination;
        console.log('📊 Using root level structure, found:', dependents.length, 'dependents');
      } else if (Array.isArray(response?.data)) {
        // Direct array: { data: [...] }
        dependents = response.data;
        pagination = null;
        console.log('📊 Using direct array structure, found:', dependents.length, 'dependents');
      } else if (Array.isArray(response)) {
        // Response is directly an array: [...]
        dependents = response;
        pagination = null;
        console.log('📊 Using response as array, found:', dependents.length, 'dependents');
      } else {
        console.log('❌ Could not find dependents in response structure');
        console.log('📋 Full response structure:', JSON.stringify(response, null, 2));
      }
      
      console.log('📊 Final extracted dependents:', dependents);
      
      // Transform the dependents data
      const transformedDependents = dependents.map(transformDependentToBeneficiary) || [];
      
      console.log('✅ Transformed dependents:', transformedDependents.length, 'items');
      
      return {
        dependents: transformedDependents,
        pagination: pagination,
        stats: {
          // Note: This is the total count across all pages (from pagination.total)
          // or current page count if pagination is not available
          totalDependents: pagination?.total || transformedDependents.length,
          currentPageCount: transformedDependents.length
        }
      };
    } catch (error) {
      console.error('❌ fetchDependents error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch a specific dependent
const fetchDependentById = createAsyncThunk(
  'beneficiaries/fetchDependentById',
  async ({ token, dependentId }, { rejectWithValue }) => {
    try {
      console.log('🔍 Fetching dependent by ID:', dependentId);
      const response = await caregiverService.getDependentById(token, dependentId);
      console.log('📋 Dependent details response:', response);
      
      // Handle the correct response structure
      const dependentData = response.data || response;
      return transformDependentToBeneficiary(dependentData);
    } catch (error) {
      console.error('❌ fetchDependentById error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch caregiver stats
const fetchCaregiverStats = createAsyncThunk(
  'beneficiaries/fetchCaregiverStats',
  async (token, { rejectWithValue }) => {
    try {
      console.log('🔍 Fetching caregiver stats');
      const response = await caregiverService.getStats(token);
      console.log('📊 Stats response:', response);
      
      // Handle the correct response structure
      const statsData = response.data || response;
      return statsData;
    } catch (error) {
      console.error('❌ fetchCaregiverStats error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch recent activity
const fetchRecentActivity = createAsyncThunk(
  'beneficiaries/fetchRecentActivity',
  async ({ token, params = {} }, { rejectWithValue }) => {
    try {
      console.log('🔍 Fetching recent activity with params:', params);
      const response = await caregiverService.getActivity(token, params);
      console.log('📋 Activity response:', response);
      
      // Handle the correct response structure
      const activityData = response.data || response;
      return activityData;
    } catch (error) {
      console.error('❌ fetchRecentActivity error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch caregiver transactions
const fetchCaregiverTransactions = createAsyncThunk(
  'beneficiaries/fetchCaregiverTransactions',
  async ({ token, params = {} }, { rejectWithValue }) => {
    try {
      console.log('🔍 Fetching caregiver transactions with params:', params);
      const response = await caregiverService.getAllTransactions(token, params);
      console.log('📋 Transactions response:', response);
      
      // Handle the correct response structure
      const transactionsData = response.data || response;
      return transactionsData;
    } catch (error) {
      console.error('❌ fetchCaregiverTransactions error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch specific dependent transactions
const fetchDependentTransactions = createAsyncThunk(
  'beneficiaries/fetchDependentTransactions',
  async ({ token, dependentId, params = {} }, { rejectWithValue }) => {
    try {
      console.log('🔍 Fetching dependent transactions for:', dependentId, 'with params:', params);
      const response = await caregiverService.getDependentTransactions(token, dependentId, params);
      console.log('📋 Dependent transactions response:', response);
      
      // Handle the correct response structure
      const transactionsData = response.data || response;
      return { dependentId, ...transactionsData };
    } catch (error) {
      console.error('❌ fetchDependentTransactions error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch transaction analytics
const fetchTransactionAnalytics = createAsyncThunk(
  'beneficiaries/fetchTransactionAnalytics',
  async ({ token, params = {} }, { rejectWithValue }) => {
    try {
      console.log('🔍 Fetching transaction analytics with params:', params);
      const response = await caregiverService.getTransactionAnalytics(token, params);
      console.log('📊 Analytics response:', response);
      
      // Handle the correct response structure
      const analyticsData = response.data || response;
      return analyticsData;
    } catch (error) {
      console.error('❌ fetchTransactionAnalytics error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to load complete dashboard data efficiently
const loadDashboardData = createAsyncThunk(
  'beneficiaries/loadDashboardData',
  async ({ token, params = {} }, { rejectWithValue }) => {
    try {
      const response = await caregiverService.loadDashboardData(token, params);
      
      let transformedDependents = [];
      let pagination = null;
      let stats = null;
      let activity = null;

      // Handle dependents data
      if (response.dependents?.data?.dependents) {
        transformedDependents = response.dependents.data.dependents.map(transformDependentToBeneficiary);
        pagination = response.dependents.data.pagination;
      }

      // Handle stats data
      if (response.stats?.data) {
        stats = response.stats.data;
      }

      // Handle activity data
      if (response.activity?.data) {
        activity = response.activity.data;
      }

      return {
        dependents: transformedDependents,
        pagination,
        stats,
        activity,
        errors: response.errors || []
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to search dependents with enhanced options
const searchDependents = createAsyncThunk(
  'beneficiaries/searchDependents',
  async ({ token, searchOptions = {} }, { rejectWithValue }) => {
    try {
      const response = await caregiverService.searchDependents(token, searchOptions);
      
      const transformedDependents = response.data?.dependents?.map(transformDependentToBeneficiary) || [];
      
      return {
        dependents: transformedDependents,
        pagination: response.data?.pagination || null,
        searchOptions
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to get all dependents' accounts (financial view)
const fetchDependentsAccounts = createAsyncThunk(
  'beneficiaries/fetchDependentsAccounts',
  async (token, { rejectWithValue }) => {
    try {
      const response = await caregiverService.getAllDependentsAccounts(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to get specific dependent's accounts
const fetchDependentAccounts = createAsyncThunk(
  'beneficiaries/fetchDependentAccounts',
  async ({ token, dependentId }, { rejectWithValue }) => {
    try {
      const response = await caregiverService.getDependentAccounts(token, dependentId);
      return {
        dependentId,
        accounts: response.data
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to register a new dependent
const registerDependent = createAsyncThunk(
  'beneficiaries/registerDependent',
  async ({ token, dependentData }, { rejectWithValue }) => {
    try {
      // Validate data before sending
      const validation = caregiverService.validateDependentData(dependentData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      console.log('📤 Sending registration request with data:', dependentData);
      const response = await caregiverService.registerDependent(token, dependentData);
      console.log('📥 Registration response received:', response);
      
      // Transform the registered dependent to our beneficiary format immediately
      if (response.dependent) {
        const transformedDependent = transformDependentToBeneficiary(response.dependent);
        console.log('🔄 Transformed dependent for Redux:', transformedDependent);
        return {
          dependent: transformedDependent,
          message: response.message
        };
      }
      
      return response;
    } catch (error) {
      console.error('❌ Registration error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to initialize beneficiaries on app startup
const initializeBeneficiaries = createAsyncThunk(
  'beneficiaries/initializeBeneficiaries',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      console.log('🚀 Initializing beneficiaries on app startup...');
      
      // Helper function to get safe localStorage wrapper
      const safeLocalStorage = {
        getItem: (key) => {
          try {
            return localStorage.getItem(key);
          } catch (error) {
            console.log('LocalStorage access blocked, using fallback');
            return null;
          }
        }
      };
      
      // Get authentication state
      const state = getState();
      const { authentication } = state;
      
      // Check if user is authenticated
      const token = authentication.token || 
                   safeLocalStorage.getItem('token') || 
                   safeLocalStorage.getItem('accessToken') || 
                   safeLocalStorage.getItem('authToken') ||
                   safeLocalStorage.getItem('jwt');
                   
      if (!token) {
        console.log('⚠️ No token found, skipping beneficiary initialization');
        return { message: 'No authentication token found' };
      }
      
      // Get current user ID
      const user = authentication.user;
      const currentUserId = user?.id || 
                           safeLocalStorage.getItem('userId') || 
                           safeLocalStorage.getItem('id');
      
      if (currentUserId) {
        // Set current user for proper data segmentation
        dispatch(setCurrentUser(currentUserId));
        
        // Load existing data from localStorage first for instant UI
        dispatch(loadUserData(currentUserId));
      }
      
      // Check user role to determine if we should load beneficiaries
      const userRole = user?.role || safeLocalStorage.getItem('role');
      if (userRole === 'caregiver' || userRole === 'funder') {
        console.log('👤 User is caregiver/funder, loading beneficiaries...');
        
        // Fetch fresh data from API
        const fetchResult = await dispatch(fetchDependents({ 
          token, 
          params: { 
            page: 1, 
            limit: 50, 
            status: 'active' 
          } 
        }));
        
        // Also fetch stats
        const statsResult = await dispatch(fetchCaregiverStats(token));
        
        console.log('✅ Beneficiaries initialization completed');
        console.log('📊 Dependents loaded:', fetchResult.payload?.dependents?.length || 0);
        console.log('📊 Stats API result:', statsResult.payload);
        
        return { 
          message: 'Beneficiaries loaded successfully', 
          dependentsCount: fetchResult.payload?.dependents?.length || 0,
          statsData: statsResult.payload
        };
      } else {
        console.log('👤 User role does not require beneficiary loading');
        return { message: 'User role does not require beneficiary data' };
      }
      
    } catch (error) {
      console.error('❌ Error initializing beneficiaries:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  list: [], // Will be loaded dynamically based on current user
  isLoading: false,
  error: null,
  statsError: null, // Separate error tracking for stats (non-critical)
  pagination: null,
  selectedDependent: null,
  currentUserId: null, // Track current user for data persistence
  stats: {
    totalDependents: 0,
    dependentsByStatus: {},
    totalAccountBalance: 0,
    recentTransactionsCount: 0,
    currency: 'ZAR'
  },
  recentActivity: {
    transactions: [],
    period: '',
    totalTransactions: 0
  },
  // New transaction-specific state
  transactions: {
    all: [],
    byDependent: {},
    analytics: null,
    pagination: null,
    isLoading: false,
    error: null
  },
  searchParams: {
    page: 1,
    limit: 10,
    search: '',
    status: 'active',
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  },
  // UI State
  ui: {
    showFormModal: false,
    formStep: 1,
    formData: {
      firstName: '',
      middleName: '',
      surname: '',
      email: '',
      idNumber: ''
    },
    relation: '',
    password: '',
    confirmPassword: '',
    feedback: null,
    isSubmitting: false
  },
  // Additional data stores
  accountsData: null,
  selectedDependentAccounts: null,
  dashboardErrors: []
};

const beneficiariesSlice = createSlice({
  name: 'beneficiaries',
  initialState,
  reducers: {
    // Legacy actions for backward compatibility
    addBeneficiary: (state, action) => {
      const newBeneficiary = {
        ...action.payload,
        id: Math.max(...state.list.map(b => b.id), 0) + 1,
      };
      state.list.push(newBeneficiary);
      saveBeneficiariesToStorage(state.list, state.currentUserId);
    },
    removeBeneficiary: (state, action) => {
      state.list = state.list.filter(beneficiary => beneficiary.id !== action.payload);
      saveBeneficiariesToStorage(state.list, state.currentUserId);
    },
    updateBeneficiary: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.list.findIndex(beneficiary => beneficiary.id === id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...updates };
        saveBeneficiariesToStorage(state.list, state.currentUserId);
      }
    },
    setBeneficiaries: (state, action) => {
      state.list = action.payload;
      saveBeneficiariesToStorage(state.list, state.currentUserId);
    },
    
    // New user management actions
    setCurrentUser: (state, action) => {
      const userId = action.payload;
      if (state.currentUserId !== userId) {
        // User changed, load their specific data
        state.currentUserId = userId;
        state.list = loadBeneficiariesFromStorage(userId);
        
        // Clear old user data to save space
        if (userId) {
          clearOldUserData(userId);
        }
        
        console.log(`👤 Switched to user ${userId}, loaded ${state.list.length} dependents`);
      }
    },
    loadUserData: (state, action) => {
      const userId = action.payload || state.currentUserId;
      state.list = loadBeneficiariesFromStorage(userId);
      console.log(`📱 Loaded ${state.list.length} dependents for user ${userId}`);
    },
    clearUserData: (state) => {
      state.list = [];
      state.selectedDependent = null;
      state.recentActivity = {
        transactions: [],
        period: '',
        totalTransactions: 0
      };
      state.accountsData = null;
      state.selectedDependentAccounts = null;
      state.stats = {
        totalDependents: 0,
        dependentsByStatus: {},
        totalAccountBalance: 0,
        recentTransactionsCount: 0,
        currency: 'ZAR'
      };
    },
    
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    refreshFromStorage: (state) => {
      state.list = loadBeneficiariesFromStorage(state.currentUserId);
    },
    
    // New actions for caregiver functionality
    setSearchParams: (state, action) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    clearSelectedDependent: (state) => {
      state.selectedDependent = null;
    },
    clearRecentActivity: (state) => {
      state.recentActivity = {
        transactions: [],
        period: '',
        totalTransactions: 0
      };
    },
    
    // UI State actions
    showModal: (state) => {
      state.ui.showFormModal = true;
      state.ui.formStep = 1;
      state.ui.formData = {
        firstName: '',
        middleName: '',
        surname: '',
        email: '',
        idNumber: ''
      };
      state.ui.relation = '';
      state.ui.password = '';
      state.ui.confirmPassword = '';
      state.ui.feedback = null;
    },
    hideModal: (state) => {
      state.ui.showFormModal = false;
      state.ui.formStep = 1;
      state.ui.formData = {
        firstName: '',
        middleName: '',
        surname: '',
        email: '',
        idNumber: ''
      };
      state.ui.relation = '';
      state.ui.password = '';
      state.ui.confirmPassword = '';
      state.ui.feedback = null;
    },
    setFormStep: (state, action) => {
      state.ui.formStep = action.payload;
    },
    setFormData: (state, action) => {
      state.ui.formData = { ...state.ui.formData, ...action.payload };
    },
    setRelation: (state, action) => {
      state.ui.relation = action.payload;
    },
    setPassword: (state, action) => {
      state.ui.password = action.payload;
    },
    setConfirmPassword: (state, action) => {
      state.ui.confirmPassword = action.payload;
    },
    setFeedback: (state, action) => {
      state.ui.feedback = action.payload;
    },
    clearFeedback: (state) => {
      state.ui.feedback = null;
    },
    setSubmitting: (state, action) => {
      state.ui.isSubmitting = action.payload;
    },
    // Reset form data completely
    resetForm: (state) => {
      state.ui.formStep = 1;
      state.ui.formData = {
        firstName: '',
        middleName: '',
        surname: '',
        email: '',
        idNumber: ''
      };
      state.ui.relation = '';
      state.ui.password = '';
      state.ui.confirmPassword = '';
      state.ui.feedback = null;
      state.ui.isSubmitting = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch dependents
      .addCase(fetchDependents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDependents.fulfilled, (state, action) => {
        console.log('🎯 fetchDependents.fulfilled received:', action.payload);
        state.isLoading = false;
        state.list = action.payload.dependents || [];
        state.pagination = action.payload.pagination;
        
        // Use pagination total for totalDependents if available (across all pages)
        // Otherwise use current loaded list length
        const totalDependentsCount = action.payload.pagination?.total || state.list.length;
        state.stats = { 
          ...state.stats, 
          ...action.payload.stats,
          totalDependents: totalDependentsCount
        };
        
        console.log('📊 Updated state.list length:', state.list.length);
        console.log('📊 Total dependents (across all pages):', totalDependentsCount);
        console.log('📊 Current page dependents:', state.list.length);
        saveBeneficiariesToStorage(action.payload.dependents || [], state.currentUserId);
      })
      .addCase(fetchDependents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch dependents';
        // Keep existing data from localStorage if API fails
        const storedData = loadBeneficiariesFromStorage(state.currentUserId);
        state.list = storedData;
      })
      
      // Fetch specific dependent
      .addCase(fetchDependentById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDependentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedDependent = action.payload;
        
        // Update the dependent in the list if it exists
        const index = state.list.findIndex(dep => dep.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
          saveBeneficiariesToStorage(state.list, state.currentUserId);
        }
      })
      .addCase(fetchDependentById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch dependent details';
      })
      
      // Fetch caregiver stats
      .addCase(fetchCaregiverStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.statsError = null;
      })
      .addCase(fetchCaregiverStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.statsError = null; // Clear stats error on success
        // Merge stats but be careful about totalDependents
        // Only update totalDependents from stats API if we don't have dependents loaded yet
        const shouldUseDependentsCount = state.list.length > 0;
        const totalDependentsCount = shouldUseDependentsCount 
          ? (state.pagination?.total || state.list.length)
          : (action.payload.totalDependents || 0);
          
        state.stats = { 
          ...state.stats, 
          ...action.payload,
          totalDependents: totalDependentsCount
        };
        
        console.log(`📊 Updated stats from API - using dependents count: ${shouldUseDependentsCount}, totalDependents: ${totalDependentsCount}`);
        console.log('📊 Stats API response:', action.payload);
      })
      .addCase(fetchCaregiverStats.rejected, (state, action) => {
        state.isLoading = false;
        // Don't set global error for stats failures - store in separate field
        state.statsError = action.payload || 'Failed to fetch statistics';
        console.log('📊 Stats fetch failed (non-critical):', state.statsError);
      })
      
      // Fetch recent activity
      .addCase(fetchRecentActivity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recentActivity = action.payload;
      })
      .addCase(fetchRecentActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch recent activity';
      })
      
      // Load dashboard data
      .addCase(loadDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.dashboardErrors = [];
      })
      .addCase(loadDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.dependents || [];
        state.pagination = action.payload.pagination;
        
        // Always set totalDependents based on actual dependents list, not API stats
        const actualDependentsCount = state.list.length;
        if (action.payload.stats) {
          state.stats = { 
            ...state.stats, 
            ...action.payload.stats,
            totalDependents: actualDependentsCount
          };
        } else {
          // Ensure totalDependents is updated even if no stats from API
          state.stats.totalDependents = actualDependentsCount;
        }
        
        if (action.payload.activity) {
          state.recentActivity = action.payload.activity;
        }
        state.dashboardErrors = action.payload.errors || [];
        console.log('📊 Dashboard loaded - totalDependents set to:', actualDependentsCount);
        saveBeneficiariesToStorage(action.payload.dependents || [], state.currentUserId);
      })
      .addCase(loadDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to load dashboard data';
        state.list = loadBeneficiariesFromStorage(state.currentUserId);
      })
      
      // Search dependents
      .addCase(searchDependents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchDependents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.dependents;
        state.pagination = action.payload.pagination;
        // Update search params with what was actually used
        if (action.payload.searchOptions) {
          state.searchParams = { ...state.searchParams, ...action.payload.searchOptions };
        }
        saveBeneficiariesToStorage(action.payload.dependents, state.currentUserId);
      })
      .addCase(searchDependents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to search dependents';
      })
      
      // Fetch caregiver transactions
      .addCase(fetchCaregiverTransactions.pending, (state) => {
        state.transactions.isLoading = true;
        state.transactions.error = null;
      })
      .addCase(fetchCaregiverTransactions.fulfilled, (state, action) => {
        state.transactions.isLoading = false;
        state.transactions.all = action.payload.transactions || [];
        state.transactions.pagination = action.payload.pagination;
      })
      .addCase(fetchCaregiverTransactions.rejected, (state, action) => {
        state.transactions.isLoading = false;
        state.transactions.error = action.payload || 'Failed to fetch transactions';
      })
      
      // Fetch dependent transactions
      .addCase(fetchDependentTransactions.pending, (state) => {
        state.transactions.isLoading = true;
        state.transactions.error = null;
      })
      .addCase(fetchDependentTransactions.fulfilled, (state, action) => {
        state.transactions.isLoading = false;
        const { dependentId, transactions = [], pagination } = action.payload;
        state.transactions.byDependent[dependentId] = {
          transactions,
          pagination,
          lastFetched: new Date().toISOString()
        };
      })
      .addCase(fetchDependentTransactions.rejected, (state, action) => {
        state.transactions.isLoading = false;
        state.transactions.error = action.payload || 'Failed to fetch dependent transactions';
      })
      
      // Fetch transaction analytics
      .addCase(fetchTransactionAnalytics.pending, (state) => {
        state.transactions.isLoading = true;
        state.transactions.error = null;
      })
      .addCase(fetchTransactionAnalytics.fulfilled, (state, action) => {
        state.transactions.isLoading = false;
        state.transactions.analytics = action.payload;
      })
      .addCase(fetchTransactionAnalytics.rejected, (state, action) => {
        state.transactions.isLoading = false;
        state.transactions.error = action.payload || 'Failed to fetch transaction analytics';
      })
      
      // Fetch dependents accounts
      .addCase(fetchDependentsAccounts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDependentsAccounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accountsData = action.payload;
      })
      .addCase(fetchDependentsAccounts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch accounts data';
      })
      
      // Fetch specific dependent accounts
      .addCase(fetchDependentAccounts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDependentAccounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedDependentAccounts = action.payload.accounts;
        state.selectedDependent = action.payload.dependentId;
      })
      .addCase(fetchDependentAccounts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch dependent accounts';
      })
      
      // Register dependent
      .addCase(registerDependent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerDependent.fulfilled, (state, action) => {
        console.log('🎯 registerDependent.fulfilled received:', action.payload);
        state.isLoading = false;
        
        // If we received a dependent object, add it immediately to the list
        if (action.payload.dependent) {
          const newDependent = action.payload.dependent;
          console.log('👥 Current list before adding:', state.list.length);
          console.log('🆕 New dependent to add:', newDependent);
          
          // Check if the dependent is already in the list (avoid duplicates)
          const existingIndex = state.list.findIndex(dep => 
            dep.id === newDependent.id || 
            dep.email === newDependent.email
          );
          
          if (existingIndex === -1) {
            // Add new dependent to the beginning of the list
            state.list.unshift(newDependent);
            
            // Update stats
            state.stats.totalDependents = state.list.length;
            
            // Save to localStorage
            saveBeneficiariesToStorage(state.list, state.currentUserId);
            
            console.log('✅ Added new dependent to list. New list length:', state.list.length);
          } else {
            // Update existing dependent
            state.list[existingIndex] = newDependent;
            saveBeneficiariesToStorage(state.list, state.currentUserId);
            
            console.log('✅ Updated existing dependent in list at index:', existingIndex);
          }
        } else {
          console.log('⚠️ No dependent object in registration response');
        }
      })
      .addCase(registerDependent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to register dependent';
      })
      
      // Initialize beneficiaries on app startup
      .addCase(initializeBeneficiaries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeBeneficiaries.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('🎉 Beneficiaries initialization successful:', action.payload);
        
        // If dependents were loaded, update the list and stats
        if (action.payload.dependentsCount > 0) {
          // Fetch fresh stats
          //dispatch(fetchCaregiverStats(state.authentication.token));
          
          // Optionally, you can refetch dependents to ensure latest data
          //dispatch(fetchDependents({ token: state.authentication.token, params: { page: 1, limit: 50, status: 'active' } }));
        }
      })
      .addCase(initializeBeneficiaries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to initialize beneficiaries';
      });
  },
});

export const {
  addBeneficiary,
  removeBeneficiary,
  updateBeneficiary,
  setBeneficiaries,
  setCurrentUser,
  loadUserData,
  clearUserData,
  setLoading,
  setError,
  clearError,
  refreshFromStorage,
  setSearchParams,
  clearSelectedDependent,
  clearRecentActivity,
  // UI State actions
  showModal,
  hideModal,
  setFormStep,
  setFormData,
  setRelation,
  setPassword,
  setConfirmPassword,
  setFeedback,
  clearFeedback,
  setSubmitting,
  resetForm,
} = beneficiariesSlice.actions;

export default beneficiariesSlice.reducer;

// Export async thunks
export {
  fetchDependents,
  fetchDependentById,
  fetchCaregiverStats,
  fetchRecentActivity,
  fetchCaregiverTransactions,
  fetchDependentTransactions,
  fetchTransactionAnalytics,
  loadDashboardData,
  searchDependents,
  fetchDependentsAccounts,
  fetchDependentAccounts,
  registerDependent,
  initializeBeneficiaries
};
