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

