import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Login async thunk
export const loginUser = createAsyncThunk(
  'authentication/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Login Request:', credentials);
      
      const response = await fetch('https://nanacaring-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      console.log('Login Response:', data);

      if (!response.ok) {
        console.error('Login Error:', data);
        return rejectWithValue(data.message || 'Login failed');
      }

      // Store user data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('firstName', data.user.firstName);
      localStorage.setItem('lastName', data.user.lastName);
      localStorage.setItem('surname', data.user.surname);
      localStorage.setItem('id', data.user.id);
      localStorage.setItem('role', data.user.role);
      
      return data;
    } catch (error) {
      console.error('Login Error:', error);
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Registration async thunk
export const registerUser = createAsyncThunk(
  'authentication/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // Format user data with proper ID handling
      const formattedData = {
        ...userData,
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

      // Store user data only if registration was successful
      if (data.user && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('firstName', data.user.firstName);
        localStorage.setItem('lastName', data.user.lastName);
        localStorage.setItem('surname', data.user.surname);
        localStorage.setItem('id', data.user.id);
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

const initialState = {
  isAuthenticated: false,
  user: {
    id: localStorage.getItem('id') || null,
    firstName: localStorage.getItem('firstName') || '',
    lastName: localStorage.getItem('lastName') || '',
    surname: localStorage.getItem('surname') || '',
    role: localStorage.getItem('role') || ''
  },
  token: localStorage.getItem('token'),
  loading: false,
};

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      // Clear all stored data
      localStorage.removeItem('token');
      localStorage.removeItem('firstName');
      localStorage.removeItem('lastName');
      localStorage.removeItem('surname');
      localStorage.removeItem('id');
      localStorage.removeItem('role');
    },
    clearError: (state) => {
      state.error = null;
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
        state.user = {
          id: action.payload.user.id,
          firstName: action.payload.user.firstName,
          lastName: action.payload.user.lastName,
          surname: action.payload.user.surname,
          role: action.payload.user.role
        };
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          id: action.payload.user.id,
          firstName: action.payload.user.firstName,
          lastName: action.payload.user.lastName,
          surname: action.payload.user.surname,
          role: action.payload.user.role
        };
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      });
  }
});

export const { 
    loginStart, 
    loginSuccess, 
    loginFailure, 
    logout, 
    clearError 
} = authenticationSlice.actions;

export default authenticationSlice.reducer;