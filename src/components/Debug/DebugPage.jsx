import React from 'react';
import ProductDetailDebugger from './ProductDetailDebugger';

/**
 * 🔬 DEBUGGING PAGE
 * =================  
 * Temporary page to test ProductDetail functionality
 * Access via: /debug-products
 */
const DebugPage = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🔬 Product Debug Center</h1>
      <p>Use the tools below to debug ProductDetail issues:</p>
      
      <ProductDetailDebugger />
      
      <div style={{ marginTop: '30px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3>🧭 Navigation Tests</h3>
        <p>Try navigating to these URLs to test ProductDetail:</p>
        <ul>
          <li><a href="/products/217" target="_blank">/products/217</a></li>
          <li><a href="/products/216" target="_blank">/products/216</a></li>
          <li><a href="/products/215" target="_blank">/products/215</a></li>
          <li><a href="/products/LG-BUILD-200" target="_blank">/products/LG-BUILD-200</a></li>
        </ul>
      </div>
    </div>
  );
};

export default DebugPage;