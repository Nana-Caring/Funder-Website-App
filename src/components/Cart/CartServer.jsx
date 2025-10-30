// Server-based Cart Component that works with your actual API
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  toggleCart,
  setCartOpen,
  clearCartError,
  clearCartSuccess,
  selectCartItems,
  selectCartSummary,
  selectCartIsOpen,
  selectCartLoading,
  selectCartError,
  selectCartSuccess,
  selectAddingToCart,
  selectUpdatingCartItem,
  selectRemovingFromCart
} from '../../store/slices/cartServer';

import './CartServer.css'; // You'll need to create this

const CartServer = () => {
  const dispatch = useDispatch();
  
  // 🔍 Redux Selectors
  const items = useSelector(selectCartItems);
  const summary = useSelector(selectCartSummary);
  const isOpen = useSelector(selectCartIsOpen);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const success = useSelector(selectCartSuccess);
  
  // Loading states for individual operations
  const addingToCart = useSelector(selectAddingToCart);
  const updatingItem = useSelector(selectUpdatingCartItem);
  const removingItem = useSelector(selectRemovingFromCart);
  
  // Local state
  const [showCheckout, setShowCheckout] = useState(false);

  // 🚀 Fetch cart on component mount and when cart is opened
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCart());
    }
  }, [dispatch, isOpen]);

  // Auto-refresh cart after successful operations
  useEffect(() => {
    if (success && (success.includes('added') || success.includes('updated') || success.includes('removed'))) {
      const timer = setTimeout(() => {
        dispatch(fetchCart());
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearCartSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  // 🎯 Event Handlers
  const handleQuantityChange = (cartItemId, currentQuantity, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(cartItemId);
    } else {
      dispatch(updateCartItem({ cartItemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (cartItemId) => {
    if (window.confirm('Remove this item from your cart?')) {
      dispatch(removeFromCart(cartItemId));
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      dispatch(clearCart());
    }
  };

  const handleCloseCart = () => {
    dispatch(setCartOpen(false));
    dispatch(clearCartError());
    dispatch(clearCartSuccess());
  };

  const handleCheckout = () => {
    setShowCheckout(true);
    // Here you would integrate with your checkout system
    console.log('🛒 Proceeding to checkout with items:', items);
    alert('Checkout functionality would be implemented here!');
  };

  // 🎨 Helper Components
  const LoadingSpinner = ({ text = 'Loading...' }) => (
    <div className="cart-loading">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );

  const ErrorMessage = ({ message, onClose }) => (
    <div className="cart-error">
      <span>{message}</span>
      <button onClick={onClose}>×</button>
    </div>
  );

  const SuccessMessage = ({ message, onClose }) => (
    <div className="cart-success">
      <span>{message}</span>
      <button onClick={onClose}>×</button>
    </div>
  );

  const CartItem = ({ item }) => {
    const { id, productId, quantity, priceAtTime, product } = item;
    const itemTotal = parseFloat(priceAtTime) * quantity;

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
          <p className="price">R{priceAtTime} each</p>
          <p className="stock-status">
            {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
          </p>
        </div>
        
        <div className="quantity-controls">
          <button 
            onClick={() => handleQuantityChange(id, quantity, quantity - 1)}
            disabled={updatingItem || quantity <= 1}
            className="qty-btn"
          >
            -
          </button>
          <span className="quantity">{quantity}</span>
          <button 
            onClick={() => handleQuantityChange(id, quantity, quantity + 1)}
            disabled={updatingItem}
            className="qty-btn"
          >
            +
          </button>
        </div>
        
        <div className="item-total">
          <p className="total-price">R{itemTotal.toFixed(2)}</p>
          <button 
            onClick={() => handleRemoveItem(id)}
            disabled={removingItem}
            className="remove-btn"
          >
            {removingItem ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </div>
    );
  };

  const CartSummary = () => (
    <div className="cart-summary">
      <h3>Order Summary</h3>
      
      <div className="summary-line">
        <span>Items ({summary.itemCount}):</span>
        <span>{summary.totalItems} total</span>
      </div>
      
      <div className="summary-line">
        <span>Subtotal:</span>
        <span>R{summary.totalAmount.toFixed(2)}</span>
      </div>
      
      <div className="summary-line total">
        <span><strong>Total:</strong></span>
        <span><strong>R{summary.totalAmount.toFixed(2)}</strong></span>
      </div>
      
      <p className="summary-note">
        * Final total may include shipping and taxes at checkout
      </p>
    </div>
  );

  // 🎨 Main Render
  if (!isOpen) return null;

  return (
    <div className="cart-overlay">
      <div className="cart-container">
        <div className="cart-header">
          <h2>Shopping Cart ({summary.totalItems})</h2>
          <button onClick={handleCloseCart} className="close-btn">
            ×
          </button>
        </div>
        
        <div className="cart-content">
          {/* Messages */}
          {error && (
            <ErrorMessage 
              message={error} 
              onClose={() => dispatch(clearCartError())} 
            />
          )}
          
          {success && (
            <SuccessMessage 
              message={success} 
              onClose={() => dispatch(clearCartSuccess())} 
            />
          )}
          
          {/* Loading State */}
          {loading && <LoadingSpinner text="Loading your cart..." />}
          
          {/* Empty Cart */}
          {!loading && items.length === 0 && (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Add some products to get started!</p>
              <button onClick={handleCloseCart} className="continue-shopping-btn">
                Continue Shopping
              </button>
            </div>
          )}
          
          {/* Cart Items */}
          {!loading && items.length > 0 && (
            <>
              <div className="cart-items">
                {items.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
              
              <CartSummary />
              
              <div className="cart-actions">
                <button 
                  onClick={handleClearCart}
                  disabled={loading || removingItem}
                  className="clear-cart-btn"
                >
                  Clear Cart
                </button>
                
                <button 
                  onClick={handleCheckout}
                  disabled={loading || items.length === 0}
                  className="checkout-btn"
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
  const summary = useSelector(selectCartSummary);
  const isOpen = useSelector(selectCartIsOpen);
  const addingToCart = useSelector(selectAddingToCart);

  const handleToggle = () => {
    dispatch(toggleCart());
  };

  return (
    <button 
      onClick={handleToggle} 
      className={`cart-toggle-btn ${isOpen ? 'active' : ''} ${addingToCart ? 'loading' : ''}`}
    >
      <span className="cart-icon">🛒</span>
      <span className="cart-text">Cart</span>
      {summary.itemCount > 0 && (
        <span className="cart-badge">{summary.itemCount}</span>
      )}
      {addingToCart && <span className="loading-dot">●</span>}
    </button>
  );
};

// 🛒 Add to Cart Button Component (use this in product listings)
export const AddToCartButton = ({ product, quantity = 1, className = '' }) => {
  const dispatch = useDispatch();
  const addingToCart = useSelector(selectAddingToCart);
  const isInCart = useSelector(state => 
    state.cart.items.some(item => item.productId === product.id)
  );

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product.id, quantity }))
      .then(() => {
        // Optionally open cart after adding
        dispatch(setCartOpen(true));
      });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={addingToCart || !product.inStock || !product.isActive}
      className={`add-to-cart-btn ${className} ${isInCart ? 'in-cart' : ''}`}
    >
      {addingToCart ? (
        <>
          <span className="spinner-small"></span>
          Adding...
        </>
      ) : isInCart ? (
        'Add More'
      ) : (
        'Add to Cart'
      )}
    </button>
  );
};

export default CartServer;