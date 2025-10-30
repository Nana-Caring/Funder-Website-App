import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Share, Star } from 'lucide-react';

// Redux actions and selectors
import {
  fetchProductById,
  selectSelectedProduct,
  selectProductLoading,
  selectProductError,
  clearSelectedProduct
} from '../../../store/slices/products';

import { addToCart, fetchCart, selectAddingToCart, setCartOpen } from '../../../store/slices/cartServer';

// Remove debug components - API works fine

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

// Default fallback image
const defaultProductImage = "https://via.placeholder.com/280x320/f8f9fa/6b7280?text=No+Image";

const PageContainer = styled.div`
  width: ${props => (props.$inline ? '100%' : 'calc(100% - 175px)')};
  margin-left: ${props => (props.$inline ? '0' : '175px')};
  padding: 20px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 60px);
  box-sizing: border-box;
  font-family: Arial, sans-serif;
`;

const Breadcrumb = styled.div`
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;

const ProductContainer = styled.div`
  display: flex;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 20px;
`;

const ImageSection = styled.div`
  width: 35%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
`;

const MainImageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
`;

const ProductImage = styled.img`
  width: 280px;
  height: 320px;
  object-fit: contain;
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const ThumbnailImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    border-color: #185c37;
  }
`;

const InfoSection = styled.div`
  width: 65%;
  padding: 20px;
  position: relative;
`;

const StockTag = styled.div`
  background: #e8f5e9;
  color: #2e7d32;
  font-size: 11px;
  padding: 3px 6px;
  border-radius: 3px;
  font-weight: 500;
  display: inline-block;
`;

const ProductName = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  line-height: 1.3;
`;

const Price = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #e41f3b;
  display: inline-block;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  justify-content: flex-end;
`;

const QuantityLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  margin-right: 15px;
  color: #333;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  background: #f8f9fa;
  border: none;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #e9ecef;
  }
`;

const QuantityInput = styled.input`
  width: 30px;
  height: 30px;
  border: none;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  text-align: center;
  font-size: 13px;
`;

const ProductDescription = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #555;
  margin: 15px 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const DescriptionText = styled.p`
  margin: 0;
  flex: 1;
`;

const IngredientsText = styled.span`
  color: #185c37;
  text-decoration: underline;
  font-weight: 500;
  cursor: pointer;
  margin-left: 20px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
`;

const AddToBasketButton = styled.button`
  flex: 1;
  background: #185c37;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;

  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #124a2c;
  }
`;

const FavoriteButton = styled.button`
  width: 40px;
  height: 40px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background: #f8f9fa;
  }
  
  svg {
    color: #dc3545;
    width: 18px;
    height: 18px;
  }
`;

const TabsContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const TabsHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
`;

const Tab = styled.div`
  padding: 12px 15px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? '#185c37' : 'transparent'};
  color: ${props => props.active ? '#185c37' : '#333'};
`;

const TabContent = styled.div`
  padding: 15px;
  font-size: 13px;
  line-height: 1.5;
  color: #333;
`;

const DescriptionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;

const BrandSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const BrandLogo = styled.div`
  width: 30px;
  height: 30px;
  background-color: #185c37;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  margin-right: 8px;
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
`;

const BrandTitle = styled.span`
  font-size: 11px;
  color: #6c757d;
`;

const BrandValue = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #333;
`;

const ProductSku = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 12px;
  color: #6c757d;
`;

const ShareButton = styled.button`
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: #6c757d;
  background: none;
  border: 1px solid #02542D;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  margin-right: 15px;
  
  &:hover {
    color: #185c37;
  }
  
  svg {
    margin-right: 4px;
    width: 14px;
    height: 14px;
  }
`;
const IdButton = styled.button`
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: #6c757d;
  background: none;
  border: 1px solid #02542D;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  margin-right: 15px;
  
  &:hover {
    color: #185c37;
  }
`;

const AddToFavoritesButton = styled.button`
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: #6c757d;
  background: none;
  border: 1px solid #02542D;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  
  &:hover {
    color: #185c37;
  }
  
  svg {
    margin-right: 4px;
    width: 14px;
    height: 14px;
  }
`;

const ProductDetail = ({ product: productProp, onBack }) => {
  // Redux setup
  const dispatch = useDispatch();
  const { id } = useParams();
  
  // Use prop product if available, otherwise fall back to Redux (for direct URL access)
  const productFromRedux = useSelector(selectSelectedProduct);
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);
  const addingToCart = useSelector(selectAddingToCart);
  
  // Priority: prop product > redux product
  const product = productProp || productFromRedux;
  
  // Clean logs removed after alignment
  
  // Local state
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  useEffect(() => {
    if (id) {
      // Check if we already have the right product in Redux
      const currentProductId = product?.id?.toString();
      const currentProductSku = product?.sku?.toString();
      const urlId = id.toString();
      
      // Only fetch if we don't have the right product
      const hasCorrectProduct = currentProductId === urlId || currentProductSku === urlId;
      
      if (!hasCorrectProduct) {
        dispatch(fetchProductById(id));
      }
    }
    
    // Clear product when component unmounts (but only if navigating away from product pages)
    return () => {
      // Don't clear if we're just switching between product detail pages
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/product')) {
        dispatch(clearSelectedProduct());
      } else {
      }
    };
  }, [id, dispatch]);
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      // Use the server-based cart API (matches your POST /api/cart/add endpoint)
      await dispatch(addToCart({
        productId: product.id,
        quantity
      })).unwrap();
      // Refresh cart from server and optionally open cart panel
      dispatch(fetchCart());
      // If there's a cart UI that can open, this will surface the change immediately
      dispatch(setCartOpen(true));
      
      // Could show success message or redirect to cart
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      const msg = (error && error.message) ? error.message : String(error);
      if (msg && msg.toLowerCase().includes('authentication')) {
        alert('Please sign in to add items to your cart.');
      } else {
        alert(`Failed to add to cart: ${msg}`);
      }
    }
  };
  
  if (loading) {
    return (
      <PageContainer $inline={!!onBack}>
        <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
          Loading product details...
        </div>
      </PageContainer>
    );
  }
  
  if (error) {
    return (
      <PageContainer $inline={!!onBack}>
        <div style={{ textAlign: 'center', padding: '60px', color: '#e63946' }}>
          {error}
        </div>
      </PageContainer>
    );
  }
  
  if (!product) {
    return (
      <PageContainer $inline={!!onBack}>
        <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
          <h3>Product not found</h3>
          <div style={{ fontSize: '14px', marginTop: '20px', textAlign: 'left', maxWidth: '400px', margin: '20px auto' }}>
            <strong>Debug Info:</strong><br/>
            URL ID: {id || 'none'}<br/>
            Loading: {String(loading)}<br/>
            Error: {error || 'none'}<br/>
            Product from props: {productProp ? 'Yes' : 'No'}<br/>
            Product in Redux: {productFromRedux ? 'Yes' : 'No'}<br/>
            {(productProp || productFromRedux) && (
              <>
                Product ID: {(productProp || productFromRedux).id}<br/>
                Product SKU: {(productProp || productFromRedux).sku}<br/>
                Product Name: {(productProp || productFromRedux).name}
              </>
            )}
          </div>
          {onBack && (
            <button 
              onClick={onBack}
              style={{ 
                marginTop: '20px', 
                padding: '10px 20px', 
                background: '#02542D', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ← Back to Products
            </button>
          )}
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer $inline={!!onBack}>
      {/* Back button when used as overlay */}
      {onBack && (
        <div style={{ marginBottom: '15px' }}>
          <button 
            onClick={onBack}
            style={{ 
              padding: '8px 16px', 
              background: '#f8f9fa', 
              color: '#02542D', 
              border: '1px solid #02542D', 
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ← Back to Products
          </button>
        </div>
      )}
      
      {!onBack && (
        <Breadcrumb>Healthcare products &gt; product &gt; Clicks</Breadcrumb>
      )}
      
      <ProductContainer>
        <ImageSection>
          <MainImageContainer>
            <ProductImage 
              src={getImageUrl(product.image) || 
                   (product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : null) ||
                   defaultProductImage} 
              alt={product.name}
              onError={(e) => { e.target.src = defaultProductImage; }}
            />
          </MainImageContainer>
          <ThumbnailContainer>
            {Array.isArray(product.images) && product.images.length > 0 ? (
              product.images.slice(0, 2).map((img, index) => (
                <ThumbnailImage 
                  key={index}
                  src={getImageUrl(img) || defaultProductImage} 
                  alt={`${product.name} view ${index + 1}`}
                  onError={(e) => { e.target.src = defaultProductImage; }}
                />
              ))
            ) : (
              <>
                <ThumbnailImage 
                  src={getImageUrl(product.image) || defaultProductImage} 
                  alt={`${product.name} view 1`}
                  onError={(e) => { e.target.src = defaultProductImage; }}
                />
                <ThumbnailImage 
                  src={getImageUrl(product.image) || defaultProductImage} 
                  alt={`${product.name} view 2`}
                  onError={(e) => { e.target.src = defaultProductImage; }}
                />
              </>
            )}
          </ThumbnailContainer>
        </ImageSection>
        
        <InfoSection>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <ProductName>{product.brand || 'Brand'}</ProductName>
              <ProductName>{product.name}</ProductName>
            
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <ShareButton><Share size={14} /> Share</ShareButton>
                <IdButton>{product.sku || 'N/A'}</IdButton>
                <AddToFavoritesButton><Star size={14} /> Add to favourites</AddToFavoritesButton>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', width: '100%' }}>
                <Price>R{parseFloat(product.price).toFixed(2)}</Price>
                <StockTag>{product.inStock ? 'In Stock' : 'Out of Stock'}</StockTag>
              </div>
              
              <QuantitySelector>
                <QuantityLabel>Quantity</QuantityLabel>
                <QuantityControls>
                  <QuantityButton onClick={decreaseQuantity}>-</QuantityButton>
                  <QuantityInput type="text" value={quantity} readOnly />
                  <QuantityButton onClick={increaseQuantity}>+</QuantityButton>
                </QuantityControls>
              </QuantitySelector>
               <AddToBasketButton 
                 onClick={handleAddToCart}
                 disabled={!product?.inStock || addingToCart}
               >
                 {addingToCart ? 'Adding...' : 'Add To Basket'}
               </AddToBasketButton>
            </div>
          </div>
          
          <ProductDescription>
            <DescriptionText>
              Pregnavit M 30 Capsules are formulated for women before, during and after pregnancy. It combines folic acid and a range of essential vitamins and minerals to improve energy, maintain healthy cells, and promote strong bones and teeth.
            </DescriptionText>
            <IngredientsText>Ingredients</IngredientsText>
          </ProductDescription>

          <DescriptionTitle>More information</DescriptionTitle>

      <div style={{ marginBottom: '12px' }}>
        <strong>Description: </strong>
        <span>{product.description}</span>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <strong>Brand: </strong>
        <span>{product.brand}</span>
      </div>

      <div>
        <strong>Detailed description: </strong>
        <p style={{ marginTop: '6px' }}>{product.detailedDescription}</p>
      </div>
          
          
         
          
         
        </InfoSection>
      </ProductContainer>
      
      
    </PageContainer>
  );
};

export default ProductDetail;