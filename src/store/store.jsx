// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authenticationReducer from './slices/Authentication';
import beneficiariesReducer from './slices/beneficiaries';

export const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    beneficiaries: beneficiariesReducer,
    // ...other reducers can be added here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Development helper: Log store state changes
if (process.env.NODE_ENV === 'development') {
  store.subscribe(() => {
    const state = store.getState();
    const beneficiariesCount = state.beneficiaries?.list?.length || 0;
    const isLoading = state.beneficiaries?.isLoading;
    const currentUser = state.authentication?.user?.id;
    
    console.log('🏪 Store updated:', {
      beneficiariesCount,
      isLoading,
      currentUser,
      userRole: state.authentication?.user?.role
    });
  });
}

