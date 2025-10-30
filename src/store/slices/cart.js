// src/store/slices/cart.js
import { createSlice } from '@reduxjs/toolkit';

// 🛒 Cart Initial State
const initialState = {
  items: [], // Array of cart items { product, quantity, addedAt }
  isOpen: false, // Cart modal/sidebar visibility
  loading: false,
  error: null,
  
  // Cart summary
  totalItems: 0,
  totalAmount: 0,
  
  // Checkout state
  checkoutStep: 'cart', // 'cart' | 'shipping' | 'payment' | 'confirmation'
  shippingInfo: null,
  paymentInfo: null
};

// 🛒 Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add product to cart
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      
      // Check if product already exists in cart
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        state.items.push({
          product,
          quantity,
          addedAt: new Date().toISOString()
        });
      }
      
      cartSlice.caseReducers.calculateCartSummary(state);
    },
    
    // Remove product from cart
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.product.id !== productId);
      cartSlice.caseReducers.calculateCartSummary(state);
    },
    
    // Update quantity of item in cart
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        state.items = state.items.filter(item => item.product.id !== productId);
      } else {
        // Update quantity
        const itemIndex = state.items.findIndex(item => item.product.id === productId);
        if (itemIndex >= 0) {
          state.items[itemIndex].quantity = quantity;
        }
      }
      
      cartSlice.caseReducers.calculateCartSummary(state);
    },
    
    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      state.error = null;
    },
    
    // Toggle cart visibility
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    
    // Set cart visibility
    setCartOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    
    // Calculate cart summary (internal helper)
    calculateCartSummary: (state) => {
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => {
        const price = parseFloat(item.product.price) || 0;
        return total + (price * item.quantity);
      }, 0);
    },
    
    // Checkout steps
    setCheckoutStep: (state, action) => {
      state.checkoutStep = action.payload;
    },
    
    // Set shipping info
    setShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
    },
    
    // Set payment info
    setPaymentInfo: (state, action) => {
      state.paymentInfo = action.payload;
    },
    
    // Reset checkout
    resetCheckout: (state) => {
      state.checkoutStep = 'cart';
      state.shippingInfo = null;
      state.paymentInfo = null;
    },
    
    // Set cart error
    setCartError: (state, action) => {
      state.error = action.payload;
    },
    
    // Clear cart error
    clearCartError: (state) => {
      state.error = null;
    }
  }
});

// 🎯 Action Creators
export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
  setCheckoutStep,
  setShippingInfo,
  setPaymentInfo,
  resetCheckout,
  setCartError,
  clearCartError
} = cartSlice.actions;

// 🔍 Cart Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartIsOpen = (state) => state.cart.isOpen;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectCartTotalItems = (state) => state.cart.totalItems;
export const selectCartTotalAmount = (state) => state.cart.totalAmount;
export const selectCheckoutStep = (state) => state.cart.checkoutStep;
export const selectShippingInfo = (state) => state.cart.shippingInfo;
export const selectPaymentInfo = (state) => state.cart.paymentInfo;

// Advanced selectors
export const selectCartItemById = (state, productId) =>
  state.cart.items.find(item => item.product.id === productId);

export const selectCartItemQuantity = (state, productId) => {
  const item = selectCartItemById(state, productId);
  return item ? item.quantity : 0;
};

export const selectIsProductInCart = (state, productId) =>
  state.cart.items.some(item => item.product.id === productId);

// Group cart items by category
export const selectCartItemsByCategory = (state) => {
  return state.cart.items.reduce((categories, item) => {
    const category = item.product.category || 'Other';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(item);
    return categories;
  }, {});
};

// Calculate shipping estimate (you can customize this logic)
export const selectShippingEstimate = (state) => {
  const totalAmount = state.cart.totalAmount;
  
  if (totalAmount >= 500) return 0; // Free shipping over R500
  if (totalAmount >= 200) return 50; // R50 shipping
  return 99; // Standard R99 shipping
};

// Calculate tax estimate (you can customize this logic)
export const selectTaxEstimate = (state) => {
  return state.cart.totalAmount * 0.15; // 15% VAT
};

// Calculate final total with shipping and tax
export const selectCartFinalTotal = (state) => {
  const subtotal = state.cart.totalAmount;
  const shipping = selectShippingEstimate(state);
  const tax = selectTaxEstimate(state);
  
  return subtotal + shipping + tax;
};

export default cartSlice.reducer;