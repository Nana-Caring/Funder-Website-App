import React from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedProduct } from '../../../store/slices/products';

/**
 * 📋 PRODUCT FLOW DEMO
 * ===================
 * Shows how data flows from Products → ProductDetail
 */
const ProductFlowDemo = () => {
  const selectedProduct = useSelector(selectSelectedProduct);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      width: '300px',
      background: '#fff',
      border: '2px solid #02542D',
      borderRadius: '8px',
      padding: '15px',
      fontSize: '13px',
      zIndex: 9999,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <h4 style={{ margin: '0 0 12px 0', color: '#02542D', display: 'flex', alignItems: 'center' }}>
        📋 Product Flow Status
      </h4>
      
      {selectedProduct ? (
        <div>
          <div style={{ marginBottom: '8px', padding: '8px', background: '#e8f5e9', borderRadius: '4px' }}>
            <strong>✅ Product Data Available</strong>
          </div>
          
          <div style={{ marginBottom: '6px' }}>
            <strong>Name:</strong> {selectedProduct.name}
          </div>
          
          <div style={{ marginBottom: '6px' }}>
            <strong>ID:</strong> {selectedProduct.id} 
            {selectedProduct.sku && <span> | SKU: {selectedProduct.sku}</span>}
          </div>
          
          <div style={{ marginBottom: '6px' }}>
            <strong>Price:</strong> R{parseFloat(selectedProduct.price || 0).toFixed(2)}
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <strong>Category:</strong> {selectedProduct.category}
          </div>
          
          <div style={{ fontSize: '11px', color: '#02542D', fontWeight: '500' }}>
            🎯 This product was passed from Products → ProductDetail via Redux
          </div>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '8px', padding: '8px', background: '#fff3cd', borderRadius: '4px' }}>
            <strong>⏳ No Product Selected</strong>
          </div>
          
          <div style={{ fontSize: '11px', color: '#666', lineHeight: 1.4 }}>
            Click a product in the Products page to see how data flows to ProductDetail without needing to fetch from API.
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFlowDemo;