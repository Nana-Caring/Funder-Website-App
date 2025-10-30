import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://nanacaring-backend.onrender.com/api';

// Async thunks for API calls
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ category, page = 1, limit = 20, search = '', sortBy = 'relevance' }, { rejectWithValue }) => {
    console.log('🚀 Redux fetchProducts called with:', { category, page, limit, search, sortBy });
    try {
      let url = `${BASE_URL}/products`;
      
      // Use category-specific endpoint according to API docs
      if (category && category !== 'All') {
        // API docs specify these exact categories: Education, Healthcare, Groceries, Transport, Entertainment, Other
        const categoryMapping = {
          'Healthcare': 'Healthcare',
          'Babycare': 'Groceries',
          'School': 'Education', 
          'Clothing': 'Other',
          'Entertainment': 'Entertainment',
          'Pregnancy': 'Healthcare',
          'Transport': 'Transport',
          'Groceries': 'Groceries',
          'Education': 'Education',
          'Other': 'Other'
        };
        
        const mappedCategory = categoryMapping[category] || category;
        url = `${BASE_URL}/products/category/${mappedCategory}`;
        console.log(`🎯 Using category endpoint for: ${category} -> ${mappedCategory}`);
      } else {
        console.log('🌐 Using main products endpoint (All categories)');
      }
      
      // Add query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (search) params.append('search', search);
      if (sortBy && sortBy !== 'relevance') params.append('sortBy', sortBy);
      
      // Use the same fallback endpoint strategy as the original
      const endpoints = [
        `${url}?${params.toString()}`,
        `${BASE_URL}/products?${params.toString()}`,
        `${BASE_URL}/products`
      ];
      
      let response = null;
      let lastError = null;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Trying endpoint: ${endpoint}`);
          response = await axios.get(endpoint, {
            timeout: 10000,
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          console.log('✅ API Response:', response.data);
          break; // Success, exit loop
        } catch (endpointError) {
          console.warn(`❌ Failed endpoint ${endpoint}:`, endpointError.message);
          lastError = endpointError;
          continue; // Try next endpoint
        }
      }
      
      if (!response) {
        throw lastError || new Error('All product endpoints failed');
      }
      
      // Handle API response structures based on documentation
      let productsData = [];
      let paginationData = null;
      
      console.log('🔍 API Response Structure Debug:');
      console.log('  - response.data:', response.data);
      console.log('  - response.data.success:', response.data.success);
      console.log('  - response.data.data:', response.data.data);
      console.log('  - Type of response.data.data:', typeof response.data.data);
      console.log('  - Is response.data.data an array?:', Array.isArray(response.data.data));
      
      if (response.data.success) {
        // ACTUAL API STRUCTURE: { success: true, data: [...], pagination: {...} }
        if (Array.isArray(response.data.data)) {
          productsData = response.data.data;
          paginationData = response.data.pagination; // Pagination is at root level
          console.log('✅ Using CORRECT API structure: response.data.data as array');
          console.log('📦 Products found:', productsData.length);
          console.log('📊 Pagination from response.data.pagination:', paginationData);
        }
        // Legacy fallback just in case
        else if (response.data.data && response.data.data.products && Array.isArray(response.data.data.products)) {
          productsData = response.data.data.products;
          paginationData = response.data.data.pagination;
          console.log('✅ Using legacy nested structure: response.data.data.products');
          console.log('📦 Products found:', productsData.length);
        }
        else {
          console.warn('❌ Unknown API response structure:', response.data);
          console.log('❓ Expected: { success: true, data: [...], pagination: {...} }');
          console.log('❓ Received structure:', Object.keys(response.data));
          productsData = [];
        }
        
        console.log('✅ Products from API:', productsData.length, 'items');
        console.log('📊 First few products:', productsData.slice(0, 3).map(p => ({ id: p.id, name: p.name, category: p.category })));
        console.log('📊 Pagination info:', paginationData);
        
        // Validate that we actually have products
        if (!productsData || productsData.length === 0) {
          console.warn('⚠️ No products returned from API');
          return rejectWithValue('No products found for this category');
        }
        
        return {
          products: productsData,
          pagination: paginationData || {
            page: page,
            total: productsData.length,
            limit: limit,
            totalPages: Math.ceil(productsData.length / limit)
          },
          category,
          search,
          sortBy
        };
      } else {
        console.warn('❌ API returned success: false');
        return rejectWithValue(response.data.message || 'API returned unsuccessful response');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue, getState }) => {
    try {
      console.log('🔍 fetchProductById called with:', {
        productId,
        productIdType: typeof productId,
        productIdLength: String(productId).length
      });
      
      const url = `${BASE_URL}/products/${productId}`;
      console.log('🌐 Fetching from URL:', url);
      
      const response = await axios.get(url);
      
      console.log('📡 Single product API response:', {
        status: response.status,
        statusText: response.statusText,
        success: response.data.success,
        hasData: !!response.data.data,
        dataType: typeof response.data.data,
        fullResponse: response.data
      });
      
      if (response.data.success) {
        console.log('✅ Product found:', response.data.data);
        return response.data.data;
      } else {
        console.warn('❌ API returned success: false');
        return rejectWithValue('Product not found');
      }
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      console.error('❌ Error response:', error.response?.data);
      
      // If API call failed, try to find product in current state (fallback)
      console.log('🔄 Attempting fallback: searching in current products list');
      const currentState = getState();
      const currentProducts = currentState.products?.products || [];
      
      console.log('🔍 Searching in', currentProducts.length, 'products for:', productId);
      
      const foundProduct = currentProducts.find(p => 
        p.id?.toString() === productId?.toString() || 
        p.sku?.toString() === productId?.toString()
      );
      
      if (foundProduct) {
        console.log('✅ Found product in current list (fallback):', foundProduct.name);
        return foundProduct;
      }
      
      console.error('❌ Product not found in API or current list');
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const fetchRecommendedProducts = createAsyncThunk(
  'products/fetchRecommendedProducts',
  async (limit = 6, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/products?limit=${limit}&featured=true`);
      
      if (response.data.success) {
        return response.data.data || response.data.products || [];
      } else {
        return rejectWithValue('Failed to fetch recommended products');
      }
    } catch (error) {
      console.error('Error fetching recommended products:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommended products');
    }
  }
);

const initialState = {
  // Products list
  products: [],
  currentCategory: 'Healthcare',
  currentSearch: '',
  currentSort: 'relevance',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  },
  
  // Individual product details
  selectedProduct: null,
  
  // Recommended products
  recommendedProducts: [],
  
  // Loading states
  loading: false,
  productLoading: false,
  recommendedLoading: false,
  
  // Error states
  error: null,
  productError: null,
  recommendedError: null,
  
  // Cache for performance
  cache: {}, // { category_search_sort_page: { products, timestamp } }
  cacheTimeout: 5 * 60 * 1000 // 5 minutes
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.products = [];
      state.pagination = { currentPage: 1, totalPages: 1, totalItems: 0 };
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.productError = null;
    },
    setSelectedProduct: (state, action) => {
      console.log('🔄 setSelectedProduct action called with:', action.payload);
      state.selectedProduct = action.payload;
      state.productError = null;
      console.log('✅ selectedProduct updated in state');
    },
    clearErrors: (state) => {
      state.error = null;
      state.productError = null;
      state.recommendedError = null;
    },
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
    setCurrentSearch: (state, action) => {
      state.currentSearch = action.payload;
    },
    setCurrentSort: (state, action) => {
      state.currentSort = action.payload;
    },
    clearCache: (state) => {
      state.cache = {};
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        console.log('🎯 Redux fulfilled with payload:', action.payload);
        console.log('🎯 action.payload.products type:', typeof action.payload.products);
        console.log('🎯 action.payload.products length:', action.payload.products?.length);
        console.log('🎯 First product sample:', action.payload.products?.[0]);
        
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
        state.currentCategory = action.payload.category;
        state.currentSearch = action.payload.search;
        state.currentSort = action.payload.sortBy;
        
        console.log('🏪 After setting state.products:', state.products?.length);
        console.log('🏪 State structure after update:', Object.keys(state));
        
        // Cache the results (with safe access to pagination)
        const currentPage = action.payload.pagination?.currentPage || 1;
        const cacheKey = `${action.payload.category}_${action.payload.search}_${action.payload.sortBy}_${currentPage}`;
        state.cache[cacheKey] = {
          data: action.payload,
          timestamp: Date.now()
        };
        
        console.log('🏪 Store updated:', {
          products: state.products?.length || 0,
          pagination: state.pagination,
          loading: state.loading
        });
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productLoading = false;
        state.productError = action.payload;
      })
      
      // Fetch recommended products
      .addCase(fetchRecommendedProducts.pending, (state) => {
        state.recommendedLoading = true;
        state.recommendedError = null;
      })
      .addCase(fetchRecommendedProducts.fulfilled, (state, action) => {
        state.recommendedLoading = false;
        state.recommendedProducts = action.payload;
      })
      .addCase(fetchRecommendedProducts.rejected, (state, action) => {
        state.recommendedLoading = false;
        state.recommendedError = action.payload;
      });
  }
});

export const {
  clearProducts,
  clearSelectedProduct,
  setSelectedProduct,
  clearErrors,
  setCurrentCategory,
  setCurrentSearch,
  setCurrentSort,
  clearCache
} = productsSlice.actions;

export default productsSlice.reducer;

// Selectors with safety checks
export const selectProducts = (state) => {
  console.log('🔍 DEBUG selectProducts - Full state structure:');
  console.log('  - state:', state);
  console.log('  - state.products:', state.products);
  console.log('  - state.products type:', typeof state.products);
  console.log('  - state.products keys:', state.products ? Object.keys(state.products) : 'null');
  
  // Try different possible structures
  const option1 = state.products?.products || [];
  const option2 = state.products || [];
  const option3 = state.products?.items || [];
  
  console.log('  - Option 1 (state.products.products):', option1.length);
  console.log('  - Option 2 (state.products):', Array.isArray(option2) ? option2.length : 'not array');
  console.log('  - Option 3 (state.products.items):', option3.length);
  
  // Return the one that has data
  if (Array.isArray(option1) && option1.length > 0) {
    console.log('  ✅ Using option 1 (state.products.products)');
    return option1;
  } else if (Array.isArray(option2) && option2.length > 0) {
    console.log('  ✅ Using option 2 (state.products)');
    return option2;
  } else if (Array.isArray(option3) && option3.length > 0) {
    console.log('  ✅ Using option 3 (state.products.items)');
    return option3;
  } else {
    console.log('  ❌ No products found in any structure, returning empty array');
    return [];
  }
};
export const selectSelectedProduct = (state) => state.products?.selectedProduct || null;
export const selectRecommendedProducts = (state) => state.products?.recommendedProducts || [];
export const selectProductsLoading = (state) => {
  const loading = state.products?.loading || false;
  console.log('🔄 selectProductsLoading called:', loading);
  return loading;
};
export const selectProductLoading = (state) => state.products?.productLoading || false;
export const selectRecommendedLoading = (state) => state.products?.recommendedLoading || false;
export const selectProductsError = (state) => state.products?.error || null;
export const selectProductError = (state) => state.products?.productError || null;
export const selectRecommendedError = (state) => state.products?.recommendedError || null;
export const selectCurrentCategory = (state) => state.products?.currentCategory || 'Healthcare';
export const selectCurrentSearch = (state) => state.products?.currentSearch || '';
export const selectCurrentSort = (state) => state.products?.currentSort || 'relevance';
export const selectPagination = (state) => state.products?.pagination || { page: 1, totalPages: 1, total: 0, limit: 20 };