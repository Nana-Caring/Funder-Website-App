// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authenticationReducer from './slices/Authentication';
import beneficiariesReducer from './slices/beneficiaries';
// Use the consolidated slices defined at project root for products and cart (server-backed)
import productsReducer from '../../store/slices/products';
import cartReducer from '../../store/slices/cartServer';
import uiReducer from './slices/ui';

export const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    beneficiaries: beneficiariesReducer,
    products: productsReducer,
    cart: cartReducer,
    ui: uiReducer,
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
  const productsCount = state.products?.items?.length || state.products?.products?.length || 0;
  const cartItemsCount = state.cart?.summary?.totalItems || state.cart?.totalItems || 0;
    const isLoading = state.beneficiaries?.isLoading || state.products?.loading;
    const currentUser = state.authentication?.user?.id;
    
    console.log('🏪 Store updated:', {
      beneficiariesCount,
      productsCount,
      cartItemsCount,
      isLoading,
      currentUser,
      userRole: state.authentication?.user?.role
    });
  });
}

