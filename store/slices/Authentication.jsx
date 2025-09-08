import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Login async thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://nanacaring-backend.onrender.com/api/auth/login',
        credentials
      );

      // Handle the new response structure with accessToken, jwt, user, and accounts
      if (!response.data || !response.data.accessToken) {
        return rejectWithValue('Invalid response from server');
      }
      
      // For debugging purposes
      console.log('Login response received:', JSON.stringify(response.data));

      // Return a normalized object for your reducer
      return {
        token: response.data.accessToken, // Use accessToken as the main token
        jwt: response.data.jwt, // Store JWT separately if needed
        user: response.data.user,
        accounts: response.data.accounts, // Include accounts array
        rawResponse: response.data // Store the full raw response
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        'Failed to connect to server'
      );
    }
  }
);

// Update the registration thunk formatting
export const registerUser = createAsyncThunk(
  'authentication/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // Format user data with proper ID handling and optional middleName
      const formattedData = {
        ...userData,
        middleName: userData.middleName?.trim() || '', // Make middleName optional
        idNumber: userData.idNumber ? userData.idNumber.toString().trim() : null
      };

      // Debug log
      console.log('Formatted Registration Data:', formattedData);

      const response = await fetch('https://nanacaring-backend.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      });

      const data = await response.json();
      
      // Enhanced error handling
      if (!response.ok) {
        console.error('Server Response:', data);
        return rejectWithValue({
          message: data.message || 'Registration failed',
          status: response.status,
          details: data.error || null
        });
      }

      // Update localStorage to use middleName instead of lastName
      if (data.user && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('firstName', data.user.firstName);
        localStorage.setItem('middleName', data.user.middleName || ''); // Store middleName
        localStorage.setItem('role', data.user.role);
      }

      return data;
    } catch (error) {
      console.error('Registration Error:', error);
      return rejectWithValue({
        message: 'Registration failed - Network or server error',
        details: error.message
      });
    }
  }
);

// Update the initial state
const initialState = {
  isAuthenticated: !!localStorage.getItem('token'),
  user: {
    id: localStorage.getItem('userId'),
    firstName: localStorage.getItem('firstName'),
    middleName: localStorage.getItem('middleName'), // Changed from lastName
    role: localStorage.getItem('role'),
  },
  token: localStorage.getItem('token'),
  loading: false,
  error: null
};

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')),
    token: localStorage.getItem('token'),
    accounts: JSON.parse(localStorage.getItem('userAccounts') || 'null'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      
      // Store accounts if provided
      if (action.payload.accounts) {
        state.accounts = action.payload.accounts;
      }
      
      // Store the raw response if available
      if (action.payload.rawResponse) {
        state.rawResponse = action.payload.rawResponse;
      }
    },
    loginFailure: (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.accounts = null;
      state.loading = false;
      state.error = action.payload;
      // Clear localStorage on failure
      localStorage.clear();
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.accounts = null;
      state.loading = false;
      // Clear localStorage on logout
      localStorage.clear();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.accounts = action.payload.accounts; // Store accounts in state

        // Store comprehensive user and account details in localStorage
        if (action.payload.user && action.payload.token) {        // Store authentication tokens
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('accessToken', action.payload.token); // Also store as accessToken for compatibility
        localStorage.setItem('jwt', action.payload.jwt || action.payload.token);
          
          // Store all user details
          localStorage.setItem('userId', action.payload.user.id);
          localStorage.setItem('firstName', action.payload.user.firstName || '');
          localStorage.setItem('middleName', action.payload.user.middleName || '');
          localStorage.setItem('surname', action.payload.user.surname || '');
          localStorage.setItem('email', action.payload.user.email || '');
          localStorage.setItem('role', action.payload.user.role || '');
          localStorage.setItem('userRole', action.payload.user.role || '');
          localStorage.setItem('userName', action.payload.user.firstName || action.payload.user.email || 'User');
          localStorage.setItem('Idnumber', action.payload.user.Idnumber || '');
          localStorage.setItem('relation', action.payload.user.relation || '');
          localStorage.setItem('createdAt', action.payload.user.createdAt || '');
          localStorage.setItem('updatedAt', action.payload.user.updatedAt || '');
          
          // Store user object as JSON string
          localStorage.setItem('user', JSON.stringify(action.payload.user));
          
          // Store account information if available in user object
          if (action.payload.user.account) {
            localStorage.setItem('account', JSON.stringify(action.payload.user.account));
            localStorage.setItem('accountId', action.payload.user.account.id || '');
            localStorage.setItem('accountType', action.payload.user.account.accountType || '');
            localStorage.setItem('accountBalance', action.payload.user.account.balance?.toString() || '0');
            localStorage.setItem('accountNumber', action.payload.user.account.accountNumber || '');
            localStorage.setItem('parentAccountId', action.payload.user.account.parentAccountId || '');
          }
          
          // Store accounts array if available
          if (action.payload.accounts && Array.isArray(action.payload.accounts)) {
            localStorage.setItem('userAccounts', JSON.stringify(action.payload.accounts));
            
            // Also store individual account details for quick access
            const mainAccount = action.payload.accounts.find(acc => 
              acc.accountType?.toLowerCase() === 'main' || 
              acc.accountType?.toLowerCase() === 'primary'
            );
            if (mainAccount) {
              localStorage.setItem('mainAccountId', mainAccount.id || '');
              localStorage.setItem('mainAccountNumber', mainAccount.accountNumber || '');
              localStorage.setItem('mainAccountBalance', mainAccount.balance?.toString() || '0');
            }
          }
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.accounts = null;
      });
  }
});

export const { 
    loginSuccess, 
    loginFailure, 
    logout 
} = authenticationSlice.actions;

export default authenticationSlice.reducer;