import React from 'react';
import ProductDetailDebugger from './ProductDetailDebugger';

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
          <li><a href="/product/217" target="_blank">/product/217</a> (Note: product, not products)</li>
          <li><a href="/product/216" target="_blank">/product/216</a></li>
          <li><a href="/product/215" target="_blank">/product/215</a></li>
          <li><a href="/product/LG-BUILD-200" target="_blank">/product/LG-BUILD-200</a></li>
        </ul>
        
        <h4>🔍 Current Route Structure:</h4>
        <p>Based on your App.jsx, the routes are:</p>
        <ul>
          <li><code>/products</code> - Products listing page</li>
          <li><code>/product/:id</code> - Individual product detail page</li>
          <li><code>/debug-products</code> - This debug page</li>
        </ul>
      </div>
    </div>
  );
};

export default DebugPage;