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

      if (!response.data || !response.data.token) {
        return rejectWithValue('Invalid response from server');
      }

      return response.data;
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
    },
    loginFailure: (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = action.payload;
      // Clear localStorage on failure
      localStorage.clear();
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
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
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  }
});

export const { 
    loginSuccess, 
    loginFailure, 
    logout 
} = authenticationSlice.actions;

export default authenticationSlice.reducer;