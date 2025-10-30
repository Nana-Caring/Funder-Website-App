import React from 'react';
import { useSelector } from 'react-redux';

/**
 * 🩺 QUICK REDUX DIAGNOSTIC
 * Add this component anywhere to see current Redux state
 */
const QuickDiagnostic = () => {
  const reduxState = useSelector((state) => state);
  const products = useSelector((state) => state.products);
  const selectedProduct = useSelector((state) => state.products?.selectedProduct);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      width: '300px',
      maxHeight: '400px',
      overflow: 'auto',
      background: '#fff',
      border: '2px solid #007bff',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999,
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>🩺 Redux State</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Products State Keys:</strong>
        <pre style={{ fontSize: '10px', background: '#f8f9fa', padding: '5px', borderRadius: '3px' }}>
          {products ? Object.keys(products).join(', ') : 'null'}
        </pre>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Selected Product:</strong>
        <pre style={{ fontSize: '10px', background: '#f8f9fa', padding: '5px', borderRadius: '3px', maxHeight: '100px', overflow: 'auto' }}>
          {selectedProduct ? JSON.stringify(selectedProduct, null, 1) : 'null'}
        </pre>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>All Redux Keys:</strong>
        <pre style={{ fontSize: '10px', background: '#f8f9fa', padding: '5px', borderRadius: '3px' }}>
          {Object.keys(reduxState).join(', ')}
        </pre>
      </div>
      
      <div style={{ fontSize: '10px', color: '#666' }}>
        Current URL: {window.location.pathname}
      </div>
    </div>
  );
};

export default QuickDiagnostic;