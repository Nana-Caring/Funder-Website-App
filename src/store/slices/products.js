// src/store/slices/products.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 🏪 Initial State - Based on your API structure
const initialState = {
  // Product data
  items: [], // Array of products from API
  currentProduct: null, // Single product for details page
  
  // Loading states
  loading: false,
  itemLoading: false, // For single product fetch
  
  // Error handling
  error: null,
  itemError: null,
  
  // Pagination from API response
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  },
  
  // Filters for API calls
  filters: {
    category: null,
    brand: null,
    search: null,
    minAge: null,
    maxAge: null,
    inStock: null
  }
};

// 🔄 Async Thunks for API calls

/**
 * Fetch all products with optional filters
 * Maps to: GET /api/products?category=Healthcare&search=baby&page=1&limit=20
 */
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching products with filters:', filters);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.brand) queryParams.append('brand', filters.brand);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.minAge) queryParams.append('minAge', filters.minAge);
      if (filters.maxAge) queryParams.append('maxAge', filters.maxAge);
      if (filters.inStock !== null) queryParams.append('inStock', filters.inStock);
      
      const queryString = queryParams.toString();
      const url = `/api/products${queryString ? '?' + queryString : ''}`;
      
      console.log('🌐 API Call:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch products');
      }
      
      console.log('✅ Products fetched:', {
        count: data.data?.length || 0,
        total: data.pagination?.total || 0
      });
      
      return {
        products: data.data,
        pagination: data.pagination,
        filters
      };
      
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Fetch single product by ID or SKU
 * Maps to: GET /api/products/217 or GET /api/products/TT-BOTTLE-260ML
 */
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (idOrSku, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching product:', idOrSku);
      
      const response = await fetch(`/api/products/${idOrSku}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Product not found');
      }
      
      console.log('✅ Product fetched:', data.data?.name);
      
      return data.data;
      
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      return rejectWithValue(error.message);
    }
  }
);

// 🏪 Products Slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Filter actions
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    // Manual state updates
    clearProducts: (state) => {
      state.items = [];
      state.pagination = initialState.pagination;
    },
    
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.itemError = null;
    },
    
    clearErrors: (state) => {
      state.error = null;
      state.itemError = null;
    },
    
    // Update single product in list (useful for cart actions)
    updateProductInList: (state, action) => {
      const { id, updates } = action.payload;
      const productIndex = state.items.findIndex(product => product.id === id);
      
      if (productIndex !== -1) {
        state.items[productIndex] = { ...state.items[productIndex], ...updates };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch products cases
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.pagination = action.payload.pagination;
        state.filters = { ...state.filters, ...action.payload.filters };
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })
      
      // Fetch single product cases
      .addCase(fetchProductById.pending, (state) => {
        state.itemLoading = true;
        state.itemError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.itemLoading = false;
        state.currentProduct = action.payload;
        state.itemError = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.itemLoading = false;
        state.itemError = action.payload;
        state.currentProduct = null;
      });
  }
});

// 🎯 Action Creators
export const {
  setFilters,
  clearFilters,
  clearProducts,
  clearCurrentProduct,
  clearErrors,
  updateProductInList
} = productsSlice.actions;

// 🔍 Selectors - Based on your API structure
export const selectAllProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectProductsPagination = (state) => state.products.pagination;
export const selectProductsFilters = (state) => state.products.filters;

// Single product selectors
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectCurrentProductLoading = (state) => state.products.itemLoading;
export const selectCurrentProductError = (state) => state.itemError;

// Filtered selectors based on your API data
export const selectProductsByCategory = (state, category) =>
  state.products.items.filter(product => product.category === category);

export const selectInStockProducts = (state) =>
  state.products.items.filter(product => product.inStock === true);

export const selectProductsByBrand = (state, brand) =>
  state.products.items.filter(product => 
    product.brand?.toLowerCase() === brand?.toLowerCase()
  );

export const selectProductsByAgeRange = (state, minAge, maxAge) =>
  state.products.items.filter(product => {
    if (product.minAge === null || product.maxAge === null) return true;
    return product.minAge >= minAge && product.maxAge <= maxAge;
  });

// Search selector
export const selectSearchResults = (state, searchTerm) => {
  if (!searchTerm) return state.products.items;
  
  const term = searchTerm.toLowerCase();
  return state.products.items.filter(product =>
    product.name?.toLowerCase().includes(term) ||
    product.description?.toLowerCase().includes(term) ||
    product.brand?.toLowerCase().includes(term) ||
    product.category?.toLowerCase().includes(term)
  );
};

// Categories selector (unique categories from current products)
export const selectAvailableCategories = (state) => {
  const categories = state.products.items
    .map(product => product.category)
    .filter(Boolean);
  return [...new Set(categories)];
};

// Brands selector (unique brands from current products)
export const selectAvailableBrands = (state) => {
  const brands = state.products.items
    .map(product => product.brand)
    .filter(Boolean);
  return [...new Set(brands)];
};

// Price range selector
export const selectPriceRange = (state) => {
  const prices = state.products.items
    .map(product => parseFloat(product.price))
    .filter(price => !isNaN(price));
    
  if (prices.length === 0) return { min: 0, max: 0 };
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
};

// Product by ID selector (from current items)
export const selectProductById = (state, id) =>
  state.products.items.find(product => product.id === id);

// Product by SKU selector (from current items)
export const selectProductBySku = (state, sku) =>
  state.products.items.find(product => product.sku === sku);

export default productsSlice.reducer;