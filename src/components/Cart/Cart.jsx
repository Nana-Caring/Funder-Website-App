import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import cartIcon from '../../../assets/icons/cart.png';

// Redux actions and selectors
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
  selectCartItems,
  selectCartLoading,
  selectCartError,
  selectCartTotalItems,
  selectCartTotalAmount,
  selectCartFinalTotal,
  selectShippingEstimate,
  selectTaxEstimate
} from '../../store/slices/cart';

import {
  fetchProducts,
  selectAllProducts,
  selectProductsLoading
} from '../../store/slices/products';

// Helper function to handle product image URLs (same as Products.jsx)
const getImageUrl = (imageData) => {
  if (!imageData) return null;
  
  // Handle string URLs (direct image URLs from Google Images or retailer CDNs)
  if (typeof imageData === 'string') {
    // If it's already a full URL (Google Images, retailer CDNs, etc.)
    if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
      return imageData;
    }
    // If it's just a filename, construct retailer CDN URL
    if (imageData && !imageData.includes('/')) {
      return `https://cdn.babycity.co.za/images/products/large/${imageData}`;
    }
    return null;
  }
  
  // Handle object format with url property
  if (imageData && typeof imageData === 'object') {
    if (imageData.url) return imageData.url;
    if (imageData.src) return imageData.src;
    if (imageData.href) return imageData.href;
  }
  
  return null;
};

// Default fallback image for cart items
const defaultProductImage = "https://via.placeholder.com/200x200/f8f9fa/6b7280?text=No+Image";

const PageContainer = styled.div`
  width: calc(100% - 175px);
  margin-left: 175px;
  margin-top: -30px;
  background-color: #f8f9fa;
  min-height: 100vh;
  max-height: 100vh;
  overflow-y: auto;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
`;

const ErrorMessage = styled.div`
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 12px 16px;
  margin: 16px 24px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  button {
    background: none;
    border: none;
    color: #c33;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 40px;
  
  p {
    color: #666;
    font-size: 18px;
    margin-bottom: 20px;
  }
  
  button {
    background: #02542D;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    
    &:hover {
      background: #034a26;
    }
  }
`;

const CheckoutModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  
  h3 {
    margin: 0;
    color: #02542D;
  }
  
  button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #666;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  
  .form-group {
    margin-bottom: 20px;
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }
    
    select, textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      
      &:focus {
        outline: none;
        border-color: #02542D;
      }
    }
  }
  
  .order-summary {
    background: #f8f9fa;
    padding: 16px;
    border-radius: 8px;
    
    h4 {
      margin: 0 0 12px 0;
      color: #02542D;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      
      &.total {
        font-weight: bold;
        font-size: 16px;
        border-top: 1px solid #ddd;
        padding-top: 8px;
        margin-top: 8px;
      }
    }
  }
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e9ecef;
  
  button {
    flex: 1;
    padding: 12px;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    
    &.cancel-btn {
      background: #f8f9fa;
      border: 1px solid #ddd;
      color: #666;
      
      &:hover {
        background: #e9ecef;
      }
    }
    
    &.confirm-btn {
      background: #02542D;
      border: none;
      color: white;
      
      &:hover:not(:disabled) {
        background: #034a26;
      }
      
      &:disabled {
        background: #ccc;
        cursor: not-allowed;
      }
    }
  }
`;

const CartContainer = styled.div`
  max-width: 800px;
  margin: 0 auto 40px auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CartHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
  
  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #02542D;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .cart-icon {
    width: 20px;
    height: 20px;
    color: #02542D;
  }
  
  .item-count {
    background: white;
    color: #02542D;
    border: 1px solid #02542D;
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 12px;
    font-weight: 500;
    margin-left: auto;
  }
`;

const CartItems = styled.div`
  padding: 0;
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
`;

const CartItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 16px;
`;

const ControlsSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 0 20px;
  margin-left: -20px;
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 16px;
`;

const ProductInfo = styled.div`
  flex: 1;
  
  h4 {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 500;
    color: #02542D;
  }
  
  p {
    margin: 0 0 4px 0;
    font-size: 14px;
    color: #02542D;
  }
  
  .price-text {
    color: #333;
  }
  
  .account-type {
    color: #666;
    font-size: 12px;
    font-style: italic;
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 20px;
  
  button {
    width: 32px;
    height: 32px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    color: #666;
    transition: all 0.2s;
    
    &:hover {
      border-color: #185c37;
      color: #185c37;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  span {
    font-size: 16px;
    font-weight: 500;
    min-width: 20px;
    text-align: center;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
  margin-right: 16px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const PriceInfo = styled.div`
  text-align: right;
  min-width: 80px;
  
  .price {
    font-size: 16px;
    font-weight: 600;
    color: #185c37;
    margin: 0;
  }
  
  .unit-price {
    font-size: 12px;
    color: #666;
    margin: 2px 0 0 0;
  }
`;

const RecommendedSection = styled.div`
  padding: 24px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  
  h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
`;

const RecommendedItems = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2px;
  }
`;

const RecommendedItem = styled.div`
  min-width: 120px;
  text-align: center;
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 8px;
  }
  
  h5 {
    margin: 0 0 4px 0;
    font-size: 12px;
    font-weight: 500;
    color: #333;
  }
  
  .price {
    font-size: 12px;
    font-weight: 600;
    color: #185c37;
  }
  
  .add-btn {
    background: #185c37;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 10px;
    margin-top: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background: #0f3d24;
    }
  }
`;

const BottomSection = styled.div`
  display: flex;
  border-top: 1px solid #e9ecef;
`;

const PromoSection = styled.div`
  flex: 1;
  padding: 20px 24px;
  background: white;
  border-right: 1px solid #e9ecef;
  
  h3 {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .promo-input {
    display: flex;
    gap: 12px;
    
    input {
      flex: 1;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      
      &:focus {
        outline: none;
        border-color: #185c37;
      }
    }
    
    button {
      background: #185c37;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 12px 20px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
      
      &:hover {
        background: #0f3d24;
      }
    }
  }
`;

const TotalSection = styled.div`
  flex: 1;
  padding: 20px 24px 30px 24px;
  background: white;
  min-height: 200px;
  
  .total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    
    .total-price {
      font-size: 24px;
      font-weight: 700;
      color: #185c37;
    }
  }
  
  .checkout-btn {
    width: 100%;
    background: #185c37;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background: #0f3d24;
    }
  }
  
  .continue-shopping {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 500;
    color: #02542D;
    cursor: pointer;
    text-decoration: underline;
    
    &:hover {
      color: #185c37;
    }
  }
`;

const Cart = () => {
  // Redux setup
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux selectors
  const cartItems = useSelector(selectCartItems);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const totalItems = useSelector(selectCartTotalItems);
  const totalPrice = useSelector(selectCartTotalAmount); // Fixed: use selectCartTotalAmount instead
  const finalTotal = useSelector(selectCartFinalTotal);
  const shipping = useSelector(selectShippingEstimate);
  const tax = useSelector(selectTaxEstimate);
  // Note: These selectors don't exist in the new cart slice - using defaults for now
  const updatingItem = false; // TODO: Add to new cart slice
  const removingItem = false; // TODO: Add to new cart slice  
  const purchasing = loading; // Use general loading state for now
  const purchaseSuccess = false; // TODO: Add purchase functionality
  const recommendedItems = []; // TODO: Add recommended products
  const recommendedLoading = false; // TODO: Add recommended products loading

  // Local state for UI
  const [promoCode, setPromoCode] = useState('');
  const [selectedAccountType, setSelectedAccountType] = useState('Main');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Load cart and recommendations on component mount
  useEffect(() => {
    // dispatch(fetchCartItems()); // TODO: Cart is client-side now, no need to fetch
    // dispatch(fetchRecommendedProducts(6)); // TODO: Add recommended products
  }, [dispatch]);

  // Handle purchase success
  useEffect(() => {
    if (purchaseSuccess) {
      setShowCheckoutModal(false);
      setDeliveryAddress('');
      // Show success message or redirect
      console.log('Purchase completed successfully!');
      // dispatch(resetPurchaseSuccess()); // TODO: Add to new cart slice
    }
  }, [purchaseSuccess, dispatch]);

  // Redux-based handlers
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart(cartItemId));
      return;
    }
    dispatch(updateCartItem({ cartItemId, quantity: newQuantity }));
  };

  const removeItem = (cartItemId) => {
    dispatch(removeFromCart(cartItemId));
  };

  const addRecommendedItem = async (item) => {
    try {
      await dispatch(addToCart({
        productId: item.id,
        quantity: 1,
        accountType: selectedAccountType
      })).unwrap();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      return;
    }

    if (!deliveryAddress.trim()) {
      return;
    }

    try {
      // TODO: Implement purchase functionality with new cart slice
      console.log('Purchase cart:', {
        accountType: selectedAccountType,
        deliveryAddress: deliveryAddress.trim(),
        items: cartItems,
        total: totalPrice
      });
      
      // Temporary: Just show success for now
      alert('Purchase functionality coming soon!');
      setShowCheckoutModal(false);
      
      // Success handling is done in useEffect
    } catch (err) {
      console.error('Error during checkout:', err);
    }
  };



  // Account type options for purchasing
  const accountTypes = [
    'Main', 'Healthcare', 'Education', 'Groceries', 'Transport', 'Entertainment'
  ];

  return (
    <PageContainer>
      <CartContainer>
        <CartHeader>
          <h2>
            <img src={cartIcon} alt="Cart" className="cart-icon" />
            Shopping basket
          </h2>
          <span className="item-count">{totalItems} items</span>
        </CartHeader>

        {error && (
          <ErrorMessage>
            {error}
            <button onClick={() => dispatch(clearCartErrors())}>✕</button>
          </ErrorMessage>
        )}

        {loading ? (
          <LoadingMessage>Loading cart items...</LoadingMessage>
        ) : (
          <CartItems>
          {cartItems.length === 0 ? (
            <EmptyCart>
              <p>Your cart is empty</p>
              <button onClick={() => navigate('/dependent-dashboard')}>
                Continue Shopping
              </button>
            </EmptyCart>
          ) : (
            cartItems.map((item) => (
              <CartItem key={item.id}>
                <ItemContent>
                  <ProductImage src={item.image} alt={item.name} />
                  <ProductInfo>
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                    <p className="price-text">R{item.price.toFixed(2)} each</p>
                    <p className="account-type">Account: {item.accountType}</p>
                  </ProductInfo>
                  <ControlsSection>
                    <QuantityControls>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        +
                      </button>
                    </QuantityControls>
                    <RemoveButton onClick={() => removeItem(item.id)}>
                      Remove
                    </RemoveButton>
                  </ControlsSection>
                  <PriceInfo>
                    <p className="price">R{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="unit-price">R{item.price.toFixed(2)} each</p>
                  </PriceInfo>
                </ItemContent>
              </CartItem>
            ))
          )}
        </CartItems>
        )}  {/* End of loading condition */}

        <RecommendedSection>
          <h3>What others are buying</h3>
          <RecommendedItems>
            {recommendedItems.map((item) => (
              <RecommendedItem key={item.id}>
                <img src={item.image} alt={item.name} />
                <h5>{item.name}</h5>
                <p className="price">R{item.price.toFixed(2)}</p>
                <button 
                  className="add-btn"
                  onClick={() => addRecommendedItem(item)}
                >
                  Add to cart
                </button>
              </RecommendedItem>
            ))}
          </RecommendedItems>
        </RecommendedSection>

        <BottomSection>
          <PromoSection>
            <h3>
              <img src={cartIcon} alt="cart" className="cart-icon" />
              Promo code
            </h3>
            <div className="promo-input">
              <input 
                type="text" 
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button>Apply</button>
            </div>
          </PromoSection>

          <TotalSection>
            <div className="total-row">
              <h3>Total</h3>
              <span className="total-price">R{totalPrice.toFixed(2)}</span>
            </div>
            <button 
              className="checkout-btn" 
              onClick={() => setShowCheckoutModal(true)}
              disabled={cartItems.length === 0}
            >
              Proceed to checkout
            </button>
            <p className="continue-shopping" onClick={() => navigate('/dependent-dashboard')}>
              Continue shopping
            </p>
          </TotalSection>
        </BottomSection>
      </CartContainer>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <CheckoutModal>
          <ModalContent>
            <ModalHeader>
              <h3>Checkout</h3>
              <button onClick={() => setShowCheckoutModal(false)}>✕</button>
            </ModalHeader>
            
            <ModalBody>
              <div className="form-group">
                <label>Account Type:</label>
                <select 
                  value={selectedAccountType} 
                  onChange={(e) => setSelectedAccountType(e.target.value)}
                >
                  {accountTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Delivery Address:</label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  rows={3}
                />
              </div>

              <div className="order-summary">
                <h4>Order Summary</h4>
                <div className="summary-row">
                  <span>Items ({totalItems}):</span>
                  <span>R{totalPrice.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>R{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handleCheckout}
                disabled={purchasing || !deliveryAddress.trim()}
                className="confirm-btn"
              >
                {purchasing ? 'Processing...' : `Pay R${totalPrice.toFixed(2)}`}
              </button>
            </ModalFooter>
          </ModalContent>
        </CheckoutModal>
      )}
    </PageContainer>
  );
};

export default Cart;