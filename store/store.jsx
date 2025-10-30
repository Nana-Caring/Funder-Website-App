// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authenticationReducer from './slices/Authentication';
import beneficiariesReducer from './slices/beneficiaries';
import productsReducer from './slices/products'; // This is the existing working one
import cartReducer from './slices/cartServer'; // Server-based cart

export const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    beneficiaries: beneficiariesReducer,
    products: productsReducer,
    cart: cartReducer,
    // ...other reducers can be added here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

