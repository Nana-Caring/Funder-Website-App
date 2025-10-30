import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://nanacaring-backend.onrender.com/api';

// Async thunks for cart operations
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        return response.data.data || [];
      } else {
        return rejectWithValue('Failed to fetch cart items');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1, accountType = 'Main' }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/cart/add`, {
        productId,
        quantity,
        accountType
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/cart/${cartItemId}`, {
        quantity
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        return { cartItemId, quantity };
      } else {
        return rejectWithValue('Failed to update cart item');
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/cart/${cartItemId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        return cartItemId;
      } else {
        return rejectWithValue('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item from cart');
    }
  }
);

export const purchaseCart = createAsyncThunk(
  'cart/purchaseCart',
  async ({ accountType, deliveryAddress }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/cart/purchase`, {
        accountType,
        deliveryAddress
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to complete purchase');
      }
    } catch (error) {
      console.error('Error completing purchase:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to complete purchase');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  addingToCart: false,
  updatingItem: null, // ID of item being updated
  removingItem: null, // ID of item being removed
  purchasing: false,
  purchaseSuccess: false,
  lastUpdated: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.error = null;
      state.purchaseSuccess = false;
    },
    clearCartErrors: (state) => {
      state.error = null;
    },
    resetPurchaseSuccess: (state) => {
      state.purchaseSuccess = false;
    },
    // Optimistic updates for better UX
    optimisticUpdateQuantity: (state, action) => {
      const { cartItemId, quantity } = action.payload;
      const item = state.items.find(item => item.id === cartItemId);
      if (item) {
        item.quantity = quantity;
      }
    },
    optimisticRemoveItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart items
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.addingToCart = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.addingToCart = false;
        // If the item already exists, update quantity, otherwise add new item
        const existingItem = state.items.find(item => 
          item.productId === action.meta.arg.productId && 
          item.accountType === action.meta.arg.accountType
        );
        
        if (existingItem) {
          existingItem.quantity += action.meta.arg.quantity;
        } else {
          state.items.push(action.payload);
        }
        state.lastUpdated = Date.now();
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.addingToCart = false;
        state.error = action.payload;
      })
      
      // Update cart item
      .addCase(updateCartItem.pending, (state, action) => {
        state.updatingItem = action.meta.arg.cartItemId;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.updatingItem = null;
        const { cartItemId, quantity } = action.payload;
        const item = state.items.find(item => item.id === cartItemId);
        if (item) {
          item.quantity = quantity;
        }
        state.lastUpdated = Date.now();
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.updatingItem = null;
        state.error = action.payload;
      })
      
      // Remove from cart
      .addCase(removeFromCart.pending, (state, action) => {
        state.removingItem = action.meta.arg;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.removingItem = null;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.lastUpdated = Date.now();
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.removingItem = null;
        state.error = action.payload;
      })
      
      // Purchase cart
      .addCase(purchaseCart.pending, (state) => {
        state.purchasing = true;
        state.error = null;
        state.purchaseSuccess = false;
      })
      .addCase(purchaseCart.fulfilled, (state) => {
        state.purchasing = false;
        state.purchaseSuccess = true;
        state.items = []; // Clear cart after successful purchase
        state.lastUpdated = Date.now();
      })
      .addCase(purchaseCart.rejected, (state, action) => {
        state.purchasing = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearCart,
  clearCartErrors,
  resetPurchaseSuccess,
  optimisticUpdateQuantity,
  optimisticRemoveItem
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors with safety checks
export const selectCartItems = (state) => state.cart?.items || [];
export const selectCartLoading = (state) => state.cart?.loading || false;
export const selectCartError = (state) => state.cart?.error || null;
export const selectAddingToCart = (state) => state.cart?.addingToCart || false;
export const selectUpdatingItem = (state) => state.cart?.updatingItem || null;
export const selectRemovingItem = (state) => state.cart?.removingItem || null;
export const selectPurchasing = (state) => state.cart?.purchasing || false;
export const selectPurchaseSuccess = (state) => state.cart?.purchaseSuccess || false;
export const selectCartTotalItems = (state) => 
  (state.cart?.items || []).reduce((total, item) => total + item.quantity, 0);
export const selectCartTotalPrice = (state) => 
  (state.cart?.items || []).reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectCartLastUpdated = (state) => state.cart?.lastUpdated || null;