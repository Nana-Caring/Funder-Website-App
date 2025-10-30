import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../store/slices/products';

/**
 * 🔍 FRONTEND REDUX DEBUGGING HELPER
 * ==================================
 * Add this to your React app to debug why products aren't showing
 */
const ProductsDebugger = () => {
  const dispatch = useDispatch();
  
  // Test direct API call
  const testDirectAPI = async () => {
    console.log('🧪 TESTING DIRECT API CALL');
    console.log('==========================');
    
    try {
      const response = await fetch('/api/products');
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      const data = await response.json();
      console.log('📋 API Response:', data);
      console.log('📊 Products count:', data.data?.length || 0);
      console.log('✅ Success flag:', data.success);
      
      if (data.success && data.data) {
        console.log('🔍 First product sample:');
        console.log(data.data[0]);
      }
      
    } catch (error) {
      console.error('❌ Direct API Error:', error);
    }
  };
  
  // Test Redux dispatch
  const testReduxDispatch = () => {
    console.log('🏪 TESTING REDUX DISPATCH');
    console.log('==========================');
    
    // Dispatch with Healthcare category (same as your app)
    dispatch(fetchProducts({ category: 'Healthcare', page: 1, limit: 50 }));
  };
  
  // Monitor Redux state changes with multiple selectors
  const stateDebug = useSelector(state => {
    console.log('🔍 FULL REDUX STATE DEBUG:');
    console.log('  - Full state:', state);
    console.log('  - state.products:', state.products);
    console.log('  - state.products type:', typeof state.products);
    
    if (state.products && typeof state.products === 'object') {
      console.log('  - state.products keys:', Object.keys(state.products));
      console.log('  - state.products.products:', state.products.products);
      console.log('  - state.products.items:', state.products.items);
      console.log('  - state.products.data:', state.products.data);
    }
    
    return state.products;
  });
  
  // Try different selector patterns
  const products1 = useSelector(state => state.products?.products || []);
  const products2 = useSelector(state => state.products?.items || []);
  const products3 = useSelector(state => state.products?.data || []);
  const products4 = useSelector(state => Array.isArray(state.products) ? state.products : []);
  
  const loading = useSelector(state => {
    const loadingState = state.products?.loading || false;
    console.log('⏳ Loading state:', loadingState);
    return loadingState;
  });
  
  const error = useSelector(state => {
    const errorState = state.products?.error || null;
    console.log('❌ Error state:', errorState);
    return errorState;
  });
  
  useEffect(() => {
    console.log('🎬 ProductsDebugger mounted');
    console.log('📊 Selector results:', {
      'products1 (state.products.products)': products1.length,
      'products2 (state.products.items)': products2.length, 
      'products3 (state.products.data)': products3.length,
      'products4 (state.products as array)': products4.length
    });
    console.log('⏳ Initial loading:', loading);
    console.log('❌ Initial error:', error);
  }, [products1, products2, products3, products4, loading, error]);
  
  useEffect(() => {
    console.log('🔄 Products state changed:', {
      'option1 length': products1.length,
      'option2 length': products2.length,
      'option3 length': products3.length,
      'option4 length': products4.length,
      loading,
      error,
      'sample product1': products1[0],
      'sample product2': products2[0]
    });
  }, [products1, products2, products3, products4, loading, error]);
  
  // Determine which selector has data
  const hasData1 = products1.length > 0;
  const hasData2 = products2.length > 0;
  const hasData3 = products3.length > 0;
  const hasData4 = products4.length > 0;
  
  const workingProducts = hasData1 ? products1 : hasData2 ? products2 : hasData3 ? products3 : products4;
  
  return (
    <div style={{ 
      padding: '20px', 
      background: '#f0f8ff', 
      margin: '20px 0', 
      border: '2px solid #02542D',
      borderRadius: '8px'
    }}>
      <h3>🔍 Redux Debugging Panel</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <h4>📊 Selector Results:</h4>
        <p><strong>state.products.products:</strong> {products1.length} items {hasData1 ? '✅' : '❌'}</p>
        <p><strong>state.products.items:</strong> {products2.length} items {hasData2 ? '✅' : '❌'}</p>
        <p><strong>state.products.data:</strong> {products3.length} items {hasData3 ? '✅' : '❌'}</p>
        <p><strong>state.products (as array):</strong> {products4.length} items {hasData4 ? '✅' : '❌'}</p>
        <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
        <p><strong>Error:</strong> {error || 'null'}</p>
      </div>
      
      <div style={{ marginTop: '10px' }}>
        <button 
          onClick={testDirectAPI} 
          style={{ 
            marginRight: '10px',
            padding: '8px 16px',
            background: '#02542D',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🧪 Test Direct API
        </button>
        <button 
          onClick={testReduxDispatch}
          style={{ 
            padding: '8px 16px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🏪 Test Redux Dispatch
        </button>
      </div>
      
      {workingProducts.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <h4>✅ Sample Product Data:</h4>
          <pre style={{ 
            background: 'white', 
            padding: '10px', 
            fontSize: '12px',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '200px'
          }}>
            {JSON.stringify(workingProducts[0], null, 2)}
          </pre>
        </div>
      )}
      
      <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        <p><strong>🎯 Recommendation:</strong> Use the selector that shows ✅ in your components</p>
      </div>
    </div>
  );
};

export default ProductsDebugger;