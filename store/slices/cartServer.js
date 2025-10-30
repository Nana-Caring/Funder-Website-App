// Server-based cart slice that works with your actual API endpoints
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'https://nanacaring-backend.onrender.com/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// 🛒 Async Thunks for Server Cart Operations

/**
 * Add item to cart on server
 * POST /api/cart/add
 */
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      console.log('🛒 Adding to cart:', { productId, quantity });
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to add to cart');
      }

      console.log('✅ Added to cart successfully:', data.data);
      return data.data;
      
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Fetch cart from server
 * GET /api/cart
 */
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching cart from server...');
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${BASE_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch cart');
      }

      console.log('✅ Cart fetched successfully:', {
        itemsCount: data.data.items?.length || 0,
        totalAmount: data.data.summary?.totalAmount || 0
      });
      
      return data.data;
      
    } catch (error) {
      console.error('❌ Error fetching cart:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Update cart item quantity
 * PUT /api/cart/:id
 */
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      console.log('🔄 Updating cart item:', { cartItemId, quantity });
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to update cart item');
      }

      console.log('✅ Cart item updated successfully');
      return { cartItemId, quantity, updatedData: data.data };
      
    } catch (error) {
      console.error('❌ Error updating cart item:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Remove item from cart
 * DELETE /api/cart/:id
 */
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId, { rejectWithValue }) => {
    try {
      console.log('🗑️ Removing from cart:', cartItemId);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to remove from cart');
      }

      console.log('✅ Item removed from cart successfully');
      return cartItemId;
      
    } catch (error) {
      console.error('❌ Error removing from cart:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Clear entire cart
 * DELETE /api/cart
 */
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🧹 Clearing entire cart...');
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${BASE_URL}/cart`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to clear cart');
      }

      console.log('✅ Cart cleared successfully');
      return null;
      
    } catch (error) {
      console.error('❌ Error clearing cart:', error);
      return rejectWithValue(error.message);
    }
  }
);

// 🏪 Cart Slice
const initialState = {
  // Cart data from server
  items: [], // Array of cart items with product details
  summary: {
    totalItems: 0,
    totalAmount: 0,
    itemCount: 0
  },
  
  // UI state
  isOpen: false,
  
  // Loading states
  loading: false,
  addingToCart: false,
  updatingItem: false,
  removingItem: false,
  
  // Error handling
  error: null,
  
  // Success messages
  successMessage: null,
  
  // Last operation
  lastOperation: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // UI actions
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    
    setCartOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    
    // Clear messages
    clearCartError: (state) => {
      state.error = null;
    },
    
    clearCartSuccess: (state) => {
      state.successMessage = null;
    },
    
    // Set success message
    setCartSuccess: (state, action) => {
      state.successMessage = action.payload;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.addingToCart = true;
        state.error = null;
        state.lastOperation = 'adding';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.addingToCart = false;
        state.successMessage = 'Product added to cart successfully!';
        state.lastOperation = 'added';
        // Note: We'll fetch cart after this to get updated totals
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.addingToCart = false;
        state.error = action.payload;
        state.lastOperation = 'add_failed';
      })
      
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.summary = action.payload.summary || initialState.summary;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Don't clear items on error, keep existing state
      })
      
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.updatingItem = true;
        state.error = null;
        state.lastOperation = 'updating';
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.updatingItem = false;
        state.successMessage = 'Cart updated successfully!';
        state.lastOperation = 'updated';
        // Update the item in local state
        const { cartItemId, quantity } = action.payload;
        const itemIndex = state.items.findIndex(item => item.id === cartItemId);
        if (itemIndex !== -1) {
          state.items[itemIndex].quantity = quantity;
          // Recalculate summary
          const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
          const totalAmount = state.items.reduce((sum, item) => 
            sum + (parseFloat(item.priceAtTime) * item.quantity), 0
          );
          state.summary = {
            totalItems,
            totalAmount,
            itemCount: state.items.length
          };
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.updatingItem = false;
        state.error = action.payload;
        state.lastOperation = 'update_failed';
      })
      
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.removingItem = true;
        state.error = null;
        state.lastOperation = 'removing';
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.removingItem = false;
        state.successMessage = 'Item removed from cart!';
        state.lastOperation = 'removed';
        // Remove item from local state
        const cartItemId = action.payload;
        state.items = state.items.filter(item => item.id !== cartItemId);
        // Recalculate summary
        const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = state.items.reduce((sum, item) => 
          sum + (parseFloat(item.priceAtTime) * item.quantity), 0
        );
        state.summary = {
          totalItems,
          totalAmount,
          itemCount: state.items.length
        };
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.removingItem = false;
        state.error = action.payload;
        state.lastOperation = 'remove_failed';
      })
      
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastOperation = 'clearing';
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.summary = initialState.summary;
        state.successMessage = 'Cart cleared successfully!';
        state.lastOperation = 'cleared';
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.lastOperation = 'clear_failed';
      });
  }
});

// 🎯 Action Creators
export const {
  toggleCart,
  setCartOpen,
  clearCartError,
  clearCartSuccess,
  setCartSuccess
} = cartSlice.actions;

// 🔍 Selectors for Server Cart
export const selectCartItems = (state) => state.cart.items;
export const selectCartSummary = (state) => state.cart.summary;
export const selectCartIsOpen = (state) => state.cart.isOpen;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectCartSuccess = (state) => state.cart.successMessage;

// Loading state selectors
export const selectAddingToCart = (state) => state.cart.addingToCart;
export const selectUpdatingCartItem = (state) => state.cart.updatingItem;
export const selectRemovingFromCart = (state) => state.cart.removingItem;

// Cart summary selectors
export const selectCartTotalItems = (state) => state.cart.summary.totalItems;
export const selectCartTotalAmount = (state) => state.cart.summary.totalAmount;
export const selectCartItemCount = (state) => state.cart.summary.itemCount;

// Advanced selectors
export const selectIsProductInCart = (state, productId) =>
  state.cart.items.some(item => item.productId === productId);

export const selectCartItemByProductId = (state, productId) =>
  state.cart.items.find(item => item.productId === productId);

export const selectCartItemQuantity = (state, productId) => {
  const item = selectCartItemByProductId(state, productId);
  return item ? item.quantity : 0;
};

// Helper selector for cart badge
export const selectCartBadgeCount = (state) => {
  const itemCount = state.cart.summary.itemCount;
  return itemCount > 0 ? itemCount : null;
};

export default cartSlice.reducer;