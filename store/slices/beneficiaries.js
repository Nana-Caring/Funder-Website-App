import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { caregiverService } from '../../services/caregiverService';

// Helper function to load beneficiaries from localStorage
const loadBeneficiariesFromStorage = () => {
  try {
    const saved = localStorage.getItem('caregiver_dependents');
    if (saved) {
      const data = JSON.parse(saved);
      // Check if data is not too old (24 hours)
      const now = new Date().getTime();
      if (data.timestamp && (now - data.timestamp) < 24 * 60 * 60 * 1000) {
        return data.dependents || [];
      }
    }
  } catch (error) {
    console.error('Error loading dependents from localStorage:', error);
  }
  // Return empty array by default - we'll fetch from database
  return [];
};

// Helper function to save beneficiaries to localStorage
const saveBeneficiariesToStorage = (dependents) => {
  try {
    const dataToSave = {
      dependents: dependents,
      timestamp: new Date().getTime()
    };
    localStorage.setItem('caregiver_dependents', JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Error saving dependents to localStorage:', error);
  }
};

// Transform API dependent data to beneficiary format
const transformDependentToBeneficiary = (dependent) => ({
  id: dependent.id,
  name: dependent.fullName || `${dependent.firstName || ''} ${dependent.middleName || ''} ${dependent.surname || ''}`.trim(),
  idNumber: dependent.idNumber || '',
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
});

// Async thunk to fetch dependents from caregiver API
export const fetchDependents = createAsyncThunk(
  'beneficiaries/fetchDependents',
  async ({ token, params = {} }, { rejectWithValue }) => {
    try {
      if (!token) {
        throw new Error('No authentication token provided');
      }
      
      const response = await caregiverService.getDependents(token, params);
      
      // Transform the dependents data
      const transformedDependents = response.data?.dependents?.map(transformDependentToBeneficiary) || [];
      
      return {
        dependents: transformedDependents,
        pagination: response.data?.pagination || null,
        stats: {
          totalDependents: response.data?.pagination?.totalDependents || transformedDependents.length
        }
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch a specific dependent
export const fetchDependentById = createAsyncThunk(
  'beneficiaries/fetchDependentById',
  async ({ token, dependentId }, { rejectWithValue }) => {
    try {
      const response = await caregiverService.getDependentById(token, dependentId);
      return transformDependentToBeneficiary(response.data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch caregiver stats
export const fetchCaregiverStats = createAsyncThunk(
  'beneficiaries/fetchCaregiverStats',
  async (token, { rejectWithValue }) => {
    try {
      const response = await caregiverService.getStats(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch recent activity
export const fetchRecentActivity = createAsyncThunk(
  'beneficiaries/fetchRecentActivity',
  async ({ token, params = {} }, { rejectWithValue }) => {
    try {
      const response = await caregiverService.getActivity(token, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to load complete dashboard data efficiently
export const loadDashboardData = createAsyncThunk(
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
export const searchDependents = createAsyncThunk(
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
export const fetchDependentsAccounts = createAsyncThunk(
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
export const fetchDependentAccounts = createAsyncThunk(
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
export const registerDependent = createAsyncThunk(
  'beneficiaries/registerDependent',
  async ({ token, dependentData }, { rejectWithValue }) => {
    try {
      // Validate data before sending
      const validation = caregiverService.validateDependentData(dependentData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const response = await caregiverService.registerDependent(token, dependentData);
      
      // Transform the registered dependent to our beneficiary format
      if (response.dependent) {
        const transformedDependent = transformDependentToBeneficiary(response.dependent);
        return {
          dependent: transformedDependent,
          message: response.message
        };
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  list: loadBeneficiariesFromStorage(),
  isLoading: false,
  error: null,
  pagination: null,
  selectedDependent: null,
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
      saveBeneficiariesToStorage(state.list);
    },
    removeBeneficiary: (state, action) => {
      state.list = state.list.filter(beneficiary => beneficiary.id !== action.payload);
      saveBeneficiariesToStorage(state.list);
    },
    updateBeneficiary: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.list.findIndex(beneficiary => beneficiary.id === id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...updates };
        saveBeneficiariesToStorage(state.list);
      }
    },
    setBeneficiaries: (state, action) => {
      state.list = action.payload;
      saveBeneficiariesToStorage(state.list);
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
      state.list = loadBeneficiariesFromStorage();
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
        state.isLoading = false;
        state.list = action.payload.dependents || [];
        state.pagination = action.payload.pagination;
        state.stats = { ...state.stats, ...action.payload.stats };
        saveBeneficiariesToStorage(action.payload.dependents || []);
      })
      .addCase(fetchDependents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch dependents';
        // Keep existing data from localStorage if API fails
        const storedData = loadBeneficiariesFromStorage();
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
          saveBeneficiariesToStorage(state.list);
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
      })
      .addCase(fetchCaregiverStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchCaregiverStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch statistics';
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
        if (action.payload.stats) {
          state.stats = action.payload.stats;
        }
        if (action.payload.activity) {
          state.recentActivity = action.payload.activity;
        }
        state.dashboardErrors = action.payload.errors || [];
        saveBeneficiariesToStorage(action.payload.dependents || []);
      })
      .addCase(loadDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to load dashboard data';
        state.list = loadBeneficiariesFromStorage();
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
        saveBeneficiariesToStorage(action.payload.dependents);
      })
      .addCase(searchDependents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to search dependents';
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
        state.isLoading = false;
        // Don't add to list here - let the component refresh from server instead
        // This ensures we get the complete data with all backend-generated accounts
      })
      .addCase(registerDependent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to register dependent';
      });
  },
});

export const {
  addBeneficiary,
  removeBeneficiary,
  updateBeneficiary,
  setBeneficiaries,
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
