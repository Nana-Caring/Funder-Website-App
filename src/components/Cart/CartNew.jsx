// Updated Cart Component using new Redux slices
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalAmount,
  selectCartFinalTotal,
  selectShippingEstimate,
  selectTaxEstimate,
  selectCartIsOpen,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartOpen
} from '../../store/slices/cart';

import './Cart.css'; // You'll need to create this CSS file

const Cart = () => {
  const dispatch = useDispatch();
  
  // 🔍 Redux Selectors
  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotalItems);
  const subtotal = useSelector(selectCartTotalAmount);
  const shipping = useSelector(selectShippingEstimate);
  const tax = useSelector(selectTaxEstimate);
  const finalTotal = useSelector(selectCartFinalTotal);
  const isOpen = useSelector(selectCartIsOpen);
  
  // Local state
  const [showCheckout, setShowCheckout] = useState(false);

  // 🎯 Event Handlers
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  const handleCloseCart = () => {
    dispatch(setCartOpen(false));
  };

  const handleCheckout = () => {
    setShowCheckout(true);
    // Here you would integrate with your payment system
    console.log('Proceeding to checkout with items:', cartItems);
  };

  // 🎨 Render Components
  const CartItem = ({ item }) => {
    const { product, quantity } = item;
    const itemTotal = parseFloat(product.price) * quantity;

    return (
      <div className="cart-item">
        <img 
          src={product.image || 'https://via.placeholder.com/80x80'} 
          alt={product.name}
          className="item-image"
        />
        
        <div className="item-details">
          <h4>{product.name}</h4>
          <p className="brand">{product.brand}</p>
          <p className="price">R{product.price}</p>
          {product.sku && <p className="sku">SKU: {product.sku}</p>}
        </div>
        
        <div className="quantity-controls">
          <button 
            onClick={() => handleQuantityChange(product.id, quantity - 1)}
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="quantity">{quantity}</span>
          <button 
            onClick={() => handleQuantityChange(product.id, quantity + 1)}
            disabled={quantity >= product.stockQuantity}
          >
            +
          </button>
        </div>
        
        <div className="item-total">
          <p>R{itemTotal.toFixed(2)}</p>
          <button 
            onClick={() => handleRemoveItem(product.id)}
            className="remove-btn"
          >
            Remove
          </button>
        </div>
      </div>
    );
  };

  const OrderSummary = () => (
    <div className="order-summary">
      <h3>Order Summary</h3>
      
      <div className="summary-line">
        <span>Subtotal ({totalItems} items):</span>
        <span>R{subtotal.toFixed(2)}</span>
      </div>
      
      <div className="summary-line">
        <span>Shipping:</span>
        <span>{shipping === 0 ? 'FREE' : `R${shipping.toFixed(2)}`}</span>
      </div>
      
      <div className="summary-line">
        <span>Tax (15% VAT):</span>
        <span>R{tax.toFixed(2)}</span>
      </div>
      
      <div className="summary-line total">
        <span><strong>Total:</strong></span>
        <span><strong>R{finalTotal.toFixed(2)}</strong></span>
      </div>
      
      {shipping === 0 && (
        <div className="free-shipping-note">
          🎉 You qualified for FREE shipping!
        </div>
      )}
    </div>
  );

  // 🎨 Main Render
  if (!isOpen) return null;

  return (
    <div className="cart-overlay">
      <div className="cart-container">
        <div className="cart-header">
          <h2>Shopping Cart ({totalItems})</h2>
          <button onClick={handleCloseCart} className="close-btn">
            ×
          </button>
        </div>
        
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <button onClick={handleCloseCart}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(item => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>
              
              <OrderSummary />
              
              <div className="cart-actions">
                <button 
                  onClick={handleClearCart}
                  className="clear-cart-btn"
                >
                  Clear Cart
                </button>
                
                <button 
                  onClick={handleCheckout}
                  className="checkout-btn"
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// 🛒 Cart Toggle Button Component (use this in your header/navbar)
export const CartToggleButton = () => {
  const dispatch = useDispatch();
  const totalItems = useSelector(selectCartTotalItems);
  const isOpen = useSelector(selectCartIsOpen);

  const handleToggle = () => {
    dispatch(setCartOpen(!isOpen));
  };

  return (
    <button onClick={handleToggle} className="cart-toggle-btn">
      🛒 Cart ({totalItems})
    </button>
  );
};

export default Cart;