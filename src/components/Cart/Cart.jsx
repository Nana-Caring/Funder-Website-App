import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import sampleProductImage from '../../../assets/sample-product.png';
import cartIcon from '../../../assets/icons/cart.png';

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
    margin: 0;
    font-size: 14px;
    color: #02542D;
  }
  
  .price-text {
    color: #333;
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

// Sample cart data
const initialCartItems = [
  {
    id: 1,
    name: 'Clicks',
    description: 'Prenatal Advance',
    price: 399.00,
    quantity: 1,
    image: sampleProductImage
  },
  {
    id: 2,
    name: 'Clicks',
    description: 'Prenatal Advance',
    price: 399.00,
    quantity: 1,
    image: sampleProductImage
  },
  {
    id: 3,
    name: 'Clicks',
    description: 'Prenatal Advance',
    price: 399.00,
    quantity: 1,
    image: sampleProductImage
  }
];

const recommendedItems = [
  { id: 4, name: 'Clicks', price: 399.00, image: sampleProductImage },
  { id: 5, name: 'Clicks', price: 399.00, image: sampleProductImage },
  { id: 6, name: 'Clicks', price: 399.00, image: sampleProductImage },
  { id: 7, name: 'Clicks', price: 399.00, image: sampleProductImage }
];

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const addRecommendedItem = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      updateQuantity(item.id, existingItem.quantity + 1);
    } else {
      setCartItems(items => [...items, { ...item, quantity: 1, description: 'Prenatal Advance' }]);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    // Implement checkout logic
    console.log('Proceeding to checkout with items:', cartItems);
  };

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

        <CartItems>
          {cartItems.map((item) => (
            <CartItem key={item.id}>
              <ItemContent>
                <ProductImage src={item.image} alt={item.name} />
                <ProductInfo>
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <p className="price-text">R{item.price.toFixed(2)} each</p>
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
          ))}
        </CartItems>

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
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to checkout
            </button>
            <p className="continue-shopping">Continue shopping</p>
          </TotalSection>
        </BottomSection>
      </CartContainer>
    </PageContainer>
  );
};

export default Cart;