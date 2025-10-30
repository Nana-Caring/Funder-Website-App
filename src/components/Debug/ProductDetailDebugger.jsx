import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, selectSelectedProduct, selectProductLoading, selectProductError } from '../../../store/slices/products';

/**
 * 🔍 PRODUCT DETAIL DEBUGGER
 * ==========================
 * Add this to test ProductDetail functionality
 */
const ProductDetailDebugger = () => {
  const dispatch = useDispatch();
  const [testId, setTestId] = useState('217');
  const selectedProduct = useSelector(selectSelectedProduct);
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);
  
  // Test all known product endpoints
  const testKnownProducts = async () => {
    console.log('🧪 TESTING KNOWN PRODUCTS');
    console.log('=========================');
    
    // Based on your API simulation, these should exist
    const knownIds = [217, 216, 215, 214, 213, 212, 211, 210, 209, 208, 207, 206, 205, 204, 203, 202, 201, 200, 199, 198, 197, 196];
    const knownSkus = ['LG-BUILD-200', 'AD-SOCCER-S5', 'CS-CALC-SCI', 'TT-BOTTLE-260ML'];
    
    console.log('📋 Testing IDs:', knownIds);
    console.log('📋 Testing SKUs:', knownSkus);
    
    // Test IDs
    for (const id of knownIds.slice(0, 5)) { // Test first 5
      try {
        console.log(`\n🔍 Testing ID: ${id}`);
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        
        console.log(`   Status: ${response.status}`);
        console.log(`   Success: ${data.success}`);
        if (data.success && data.data) {
          console.log(`   ✅ Found: ${data.data.name} (${data.data.category})`);
        } else {
          console.log(`   ❌ Not found or error`);
        }
      } catch (error) {
        console.error(`   ❌ Network error:`, error);
      }
    }
    
    // Test SKUs
    for (const sku of knownSkus.slice(0, 2)) { // Test first 2 SKUs
      try {
        console.log(`\n🔍 Testing SKU: ${sku}`);
        const response = await fetch(`/api/products/${sku}`);
        const data = await response.json();
        
        console.log(`   Status: ${response.status}`);
        console.log(`   Success: ${data.success}`);
        if (data.success && data.data) {
          console.log(`   ✅ Found: ${data.data.name} (ID: ${data.data.id})`);
        } else {
          console.log(`   ❌ Not found or error`);
        }
      } catch (error) {
        console.error(`   ❌ Network error:`, error);
      }
    }
  };
  
  // Test Redux dispatch
  const testReduxFetch = () => {
    console.log('🏪 Testing Redux fetchProductById with ID:', testId);
    dispatch(fetchProductById(testId));
  };
  
  // Test direct API call
  const testDirectAPI = async () => {
    console.log('🧪 Testing direct API call with ID:', testId);
    
    try {
      const response = await fetch(`/api/products/${testId}`);
      const data = await response.json();
      
      console.log('📡 Direct API Response:', {
        url: `/api/products/${testId}`,
        status: response.status,
        ok: response.ok,
        success: data.success,
        hasData: !!data.data,
        data: data.data,
        error: data.error || data.message
      });
      
      return data;
    } catch (error) {
      console.error('❌ Direct API Error:', error);
      return null;
    }
  };
  
  // Test SKU vs ID API calls
  const testSKUvsID = async () => {
    console.log('🧪 Testing SKU vs ID API calls');
    
    // Test with known SKUs and IDs
    const testCases = [
      { type: 'SKU', value: 'BP-NAPPY-30G' },
      { type: 'SKU', value: 'LG-BUILD-200' },
      { type: 'ID', value: '217' },
      { type: 'ID', value: '216' }
    ];
    
    for (const testCase of testCases) {
      try {
        console.log(`\n🔍 Testing ${testCase.type}: ${testCase.value}`);
        const response = await fetch(`/api/products/${testCase.value}`);
        const data = await response.json();
        
        console.log(`   Status: ${response.status}`);
        console.log(`   Success: ${data.success}`);
        if (data.success && data.data) {
          console.log(`   ✅ Found: ${data.data.name} (ID: ${data.data.id})`);
        } else {
          console.log(`   ❌ Failed: ${data.error || data.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error(`   ❌ Network error:`, error);
      }
    }
  };
  
  // Get all products to find valid IDs
  const findValidIds = async () => {
    console.log('🔍 FINDING VALID PRODUCT IDS');
    console.log('============================');
    
    try {
      const response = await fetch('/api/products?limit=100');
      const data = await response.json();
      
      if (data.success && data.data) {
        const validIds = data.data.map(p => p.id).sort((a, b) => a - b);
        console.log('✅ Valid product IDs found:', validIds);
        console.log('📊 Total products:', validIds.length);
        console.log('🔢 ID range:', `${validIds[0]} - ${validIds[validIds.length - 1]}`);
        
        // Show some sample products
        console.log('📋 Sample products:');
        data.data.slice(0, 10).forEach(product => {
          console.log(`   ID ${product.id}: ${product.name} (${product.category})`);
        });
        
        return validIds;
      } else {
        console.error('❌ Failed to fetch products');
        return [];
      }
    } catch (error) {
      console.error('❌ Error finding valid IDs:', error);
      return [];
    }
  };
  
  return (
    <div style={{
      padding: '20px',
      background: '#fff3cd',
      border: '1px solid #ffeaa7',
      borderRadius: '8px',
      margin: '20px 0'
    }}>
      <h3>🔍 ProductDetail Debugger</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <h4>📊 Current Redux State:</h4>
        <div style={{ background: 'white', padding: '10px', fontSize: '12px', borderRadius: '4px' }}>
          <strong>Loading:</strong> {String(loading)}<br/>
          <strong>Error:</strong> {error || 'none'}<br/>
          <strong>Selected Product:</strong>
          <pre style={{ marginTop: '5px', fontSize: '11px' }}>
            {JSON.stringify(selectedProduct, null, 2) || 'null'}
          </pre>
        </div>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label>
          <strong>Test Product ID: </strong>
          <input
            type="text"
            value={testId}
            onChange={(e) => setTestId(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', width: '100px' }}
          />
        </label>
      </div>
      
      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={testReduxFetch}
          style={{ padding: '8px 12px', background: '#02542D', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          🏪 Test Redux Fetch
        </button>
        
        <button 
          onClick={testDirectAPI}
          style={{ padding: '8px 12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          🧪 Test Direct API
        </button>
        
        <button 
          onClick={testKnownProducts}
          style={{ padding: '8px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          📋 Test Known Products
        </button>
        
        <button 
          onClick={findValidIds}
          style={{ padding: '8px 12px', background: '#ffc107', color: 'black', border: 'none', borderRadius: '4px' }}
        >
          🔍 Find Valid IDs
        </button>
        
        <button 
          onClick={testSKUvsID}
          style={{ padding: '8px 12px', background: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          🆚 Test SKU vs ID
        </button>
      </div>
      
      <div style={{ fontSize: '14px', color: '#666' }}>
        <p><strong>💡 Usage:</strong></p>
        <ul>
          <li>Click "Find Valid IDs" first to see what product IDs exist</li>
          <li>Enter a valid ID in the input field</li>
          <li>Test Redux vs Direct API to see where the issue is</li>
          <li>Check console for detailed logs</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDetailDebugger;