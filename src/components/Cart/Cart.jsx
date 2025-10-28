import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import sampleProductImage from '../../../assets/sample-product.png';
import cartIcon from '../../../assets/icons/cart.png';
import cartService from '../../services/cartService';

const PageContainer = styled.div`
  width: calc(100% - 175px);
  margin-left: 175px;
  padding: 20px;
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
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState('Main');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Load cart and recommendations on component mount
  useEffect(() => {
    loadCartItems();
    loadRecommendations();
  }, []);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      
      if (response.success) {
        // Transform backend data to match component structure
        const transformedItems = response.data.items.map(item => ({
          id: item.id,
          productId: item.productId,
          name: item.product?.brand || item.product?.name || 'Product',
          description: item.product?.name || item.product?.description || 'Product Description',
          price: parseFloat(item.price),
          quantity: item.quantity,
          totalPrice: parseFloat(item.totalPrice),
          accountType: item.accountType,
          image: item.product?.image || sampleProductImage,
          stockQuantity: item.product?.stockQuantity || 0
        }));
        setCartItems(transformedItems);
      } else {
        setError(response.message || 'Failed to load cart');
      }
    } catch (err) {
      console.error('Error loading cart:', err);
      setError('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      const response = await cartService.getProducts('Healthcare', 4);
      
      if (response.success) {
        const transformedRecommendations = response.data.products.map(product => ({
          id: product.id,
          name: product.brand || product.name,
          price: parseFloat(product.price),
          image: product.image || sampleProductImage,
          inStock: product.inStock,
          stockQuantity: product.stockQuantity
        }));
        setRecommendedItems(transformedRecommendations);
      }
    } catch (err) {
      console.error('Error loading recommendations:', err);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeItem(cartItemId);
      return;
    }

    try {
      const response = await cartService.updateCartItem(cartItemId, newQuantity);
      
      if (response.success) {
        // Update local state immediately for better UX
        setCartItems(items => 
          items.map(item => 
            item.id === cartItemId ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity } : item
          )
        );
      } else {
        setError(response.message || 'Failed to update quantity');
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update item quantity');
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const response = await cartService.removeFromCart(cartItemId);
      
      if (response.success) {
        // Remove item from local state immediately for better UX
        setCartItems(items => items.filter(item => item.id !== cartItemId));
      } else {
        setError(response.message || 'Failed to remove item');
      }
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item from cart');
    }
  };

  const addRecommendedItem = async (item) => {
    try {
      const response = await cartService.addToCart({
        productId: item.id,
        quantity: 1,
        accountType: selectedAccountType
      });
      
      if (response.success) {
        // Reload cart to show new item
        await loadCartItems();
      } else {
        setError(response.message || 'Failed to add item to cart');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart');
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!deliveryAddress.trim()) {
      setError('Please enter a delivery address');
      return;
    }

    try {
      setPurchaseLoading(true);
      const response = await cartService.purchaseCart({
        accountType: selectedAccountType,
        deliveryAddress: deliveryAddress.trim()
      });
      
      if (response.success) {
        // Clear cart and show success
        setCartItems([]);
        setShowCheckoutModal(false);
        setDeliveryAddress('');
        alert('Order placed successfully! Check your order history for details.');
        
        // Navigate to order history or dashboard
        navigate('/dependent-dashboard');
      } else {
        setError(response.message || 'Failed to complete purchase');
      }
    } catch (err) {
      console.error('Error during checkout:', err);
      setError('Failed to complete purchase');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
            <button onClick={() => setError('')}>✕</button>
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
          <h3>You might also like</h3>
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
                disabled={purchaseLoading || !deliveryAddress.trim()}
                className="confirm-btn"
              >
                {purchaseLoading ? 'Processing...' : `Pay R${totalPrice.toFixed(2)}`}
              </button>
            </ModalFooter>
          </ModalContent>
        </CheckoutModal>
      )}
    </PageContainer>
  );
};

export default Cart;