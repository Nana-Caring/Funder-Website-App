import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Grid, List, Heart, Baby, GraduationCap, Shirt, Gamepad2, Users, Car, ShoppingCart, Package } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import chevronIcon from "../../../assets/icons/Chevron down.png";

// Redux actions and selectors
import {
  fetchProducts,
  fetchRecommendedProducts,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
  selectPagination,
  selectCurrentCategory,
  selectCurrentSearch,
  selectCurrentSort,
  selectRecommendedProducts,
  setCurrentCategory,
  setCurrentSearch,
  setCurrentSort,
  setSelectedProduct,
  clearProducts
} from '../../../store/slices/products';

import { addToCart, selectAddingToCart } from '../../../store/slices/cart';
import ProductDetail from './ProductDetail';

// Simple fallback for when no image is available
const defaultProductImage = "https://via.placeholder.com/200x200/f8f9fa/6b7280?text=No+Image";

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 89%;
  margin-left: 175px; /* adjust based on your nav */
  
 margin-top: -3%;
  gap: 20px;
  box-sizing: border-box;
  height: calc(100vh - 60px); /* fill viewport minus header */
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const Sidebar = styled.div`
  width: 180px;
  background: #fff;
  padding: 0;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 33px;
  align-self: flex-start;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
`;

const FiltersTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #333;
`;

const ClearAllButton = styled.button`
  background: #185c37;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #124a2c;
  }
`;

const SidebarContent = styled.div`
  padding: 15px;
`;

const SidebarSection = styled.div`
  margin-bottom: 15px;
  border: none;
  border-radius: 0;
  overflow: hidden;
`;

const SectionTitle = styled.h4`
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  padding: 12px 0;
  background-color: transparent;
  color: #333;
  border-bottom: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  
  &:hover {
    color: #185c37;
  }
`;

const SectionTitleIcon = styled.img`
  width: 12px;
  height: 12px;
  transition: transform 0.2s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const SectionContent = styled.div`
  padding: ${props => props.isOpen ? '15px' : '0 15px'};
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${props => props.isOpen ? '1' : '0'};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 14px;
  margin-bottom: 8px;
  cursor: pointer;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CountBadge = styled.span`
  background: #185c37;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
`;

const Checkbox = styled.input`
  accent-color: #185c37;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: calc(100vh - 120px);
  padding-right: 8px; /* prevent scrollbar overlap */
  padding-bottom: 20px; /* ensure pagination is visible */
`;

const Header = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
  padding: 10px 0;
`;

const Breadcrumb = styled.div`
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 20px;
`;

const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  background: #fff;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 48px;
  z-index: 9;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: relative;
`;

const IconsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
    color: #333;
  }

  &:hover svg {
    color: #185c37;
  }
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: #333;
`;

const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Select = styled.select`
  padding: 6px 30px 6px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #185c37;
  }
`;

const ChevronIcon = styled.img`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  pointer-events: none;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
`;

const ProductCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 10px;
  text-align: center;
  position: relative;
`;

const SaleTag = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: #e63946;
  color: #fff;
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 4px;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: contain;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: #f8f9fa;
`;

// Enhanced image component with Google Images + retailer CDN support
const SmartProductImage = ({ product, alt, ...props }) => {
  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
  
  // Build array of image sources from backend (Google Images + retailer CDNs)
  const imageSources = [];
  
  // Primary image (usually Google Images URL)
  if (product.image) {
    const primaryUrl = getImageUrl(product.image);
    if (primaryUrl) {
      imageSources.push(primaryUrl);
      console.log(`🖼️ Primary image for ${product.name}:`, primaryUrl);
    }
  }
  
  // Images array (multiple Google Images or retailer sources)
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach(img => {
      const url = getImageUrl(img);
      if (url && !imageSources.includes(url)) {
        imageSources.push(url);
      }
    });
    if (product.images.length > 0) {
      console.log(`🖼️ ${product.images.length} images available for ${product.name}`);
    }
  }
  
  // Add fallback only if no images found
  if (imageSources.length === 0) {
    imageSources.push(defaultProductImage);
    console.log(`⚠️ No images found for ${product.name}, using placeholder`);
  }
  
  const handleImageError = (e) => {
    console.log(`❌ Image failed for ${product.name}:`, e.target.src);
    if (currentSrcIndex < imageSources.length - 1) {
      setCurrentSrcIndex(prev => prev + 1);
      console.log(`🔄 Trying next image source for ${product.name}`);
    } else {
      console.log(`❌ All images failed for ${product.name}, showing placeholder`);
    }
  };
  
  const handleImageLoad = (e) => {
    // Only log successful Google Images loads (not placeholder)
    if (e.target.src !== defaultProductImage) {
      console.log(`✅ Image loaded for ${product.name}:`, e.target.src.substring(0, 100) + '...');
    }
  };
  
  return (
    <ProductImage
      src={imageSources[currentSrcIndex]}
      alt={alt || product.name}
      onError={handleImageError}
      onLoad={handleImageLoad}
      {...props}
    />
  );
};

const ProductName = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
`;

const ProductPrice = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #185c37;
  margin-bottom: 10px;
`;

const AddButton = styled.button`
  width: 100%;
  background: #185c37;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #124a2c;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
`;

const PageButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: ${(props) => (props.active ? "#185c37" : "#fff")};
  color: ${(props) => (props.active ? "#fff" : "#333")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
`;

// Helper function to handle product image URLs from backend (Google Images + retailer CDNs)
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
  
  // Handle object format with url property (enhanced image objects from backend)
  if (imageData && typeof imageData === 'object') {
    if (imageData.url) {
      return imageData.url;
    }
    // Some image objects might have different property names
    if (imageData.src) {
      return imageData.src;
    }
    if (imageData.href) {
      return imageData.href;
    }
  }
  
  return null;
};

const Products = () => {
  // Redux setup
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Local state for view management
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'detail'
  const [selectedProductLocal, setSelectedProductLocal] = useState(null);
  
  // Redux selectors
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const pagination = useSelector(selectPagination);
  const currentCategory = useSelector(selectCurrentCategory);
  const currentSearch = useSelector(selectCurrentSearch);
  const currentSort = useSelector(selectCurrentSort);
  const addingToCart = useSelector(selectAddingToCart);
  
  // Debug logging
  console.log('🔍 Products Redux State:');
  console.log('  - Products length:', products?.length || 0);
  console.log('  - Products array:', products);
  console.log('  - Loading:', loading);
  console.log('  - Error:', error);
  console.log('  - Current category:', currentCategory);
  console.log('  - Current search:', currentSearch);
  console.log('  - Current sort:', currentSort);
  console.log('  - Pagination:', pagination);

  // Additional debugging for rendering logic
  console.log('🎭 Render conditions:');
  console.log('  - Loading:', loading);
  console.log('  - Error:', error);
  console.log('  - Has products:', products && products.length > 0);
  console.log('  - Products length:', products?.length);
  console.log('  - Should show no products:', !loading && !error && products.length === 0);
  console.log('  - Should show products:', !loading && !error && products.length > 0);

  // Local state for UI components
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50); // Increased from 20 to fetch more products
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    promotionType: [],
    inStock: true
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [openSections, setOpenSections] = useState({
    promotionType: false,
    category: false,
    shopByBrand: false
  });
  
  const selectedCategory = location.state?.category || 'Healthcare';
  
  // Function to return to product list
  const backToProductList = () => {
    setCurrentView('list');
    setSelectedProductLocal(null);
  };

  // Set initial category in Redux when component mounts
  useEffect(() => {
    dispatch(setCurrentCategory(selectedCategory));
  }, [selectedCategory, dispatch]);

  // Effect to fetch products when parameters change
  useEffect(() => {
    console.log('🔄 Dispatching fetchProducts with params:', {
      category: selectedCategory,
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      sortBy: sortBy
    });
    
    // Fetch products with proper parameters according to API docs
    const fetchParams = {
      category: selectedCategory,
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      sortBy: sortBy
    };
    
    console.log('📋 Fetching products with params:', fetchParams);
    console.log('📂 Selected category:', selectedCategory);
    
    dispatch(fetchProducts(fetchParams));
  }, [dispatch, selectedCategory, currentPage, itemsPerPage, searchTerm, sortBy]);

  // Extract brands from products for filtering
  useEffect(() => {
    if (products && products.length > 0) {
      const uniqueBrands = [...new Set(products.map(p => p?.brand).filter(Boolean))];
      setBrands(uniqueBrands);
    }
  }, [products]);

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedFilters({ promotionType: [], inStock: true });
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    dispatch(setCurrentSearch(searchValue));
    setCurrentPage(1);
  };

  // Handle add to cart
  const handleAddToCart = async (product) => {
    try {
      await dispatch(addToCart({
        productId: product.id,
        quantity: 1,
        accountType: 'Main'
      })).unwrap();
      
      // Show success message or update UI
      console.log('Product added to cart successfully');
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      // Handle error (show toast, etc.)
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Category icon mapping
  const categoryIcons = {
    Healthcare: <Heart size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    Education: <GraduationCap size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    Groceries: <ShoppingCart size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    Transport: <Car size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    Entertainment: <Gamepad2 size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    Other: <Package size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    // Frontend category mappings
    Babycare: <Baby size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    School: <GraduationCap size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    Clothing: <Shirt size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    Pregnancy: <Users size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />
  };

  const toggleSection = (sectionKey) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  return (
    <PageLayout>
      <ContentWrapper>
        {/* LEFT FILTER SIDEBAR */}
        <Sidebar>
          <SidebarHeader>
            <FiltersTitle>Filters</FiltersTitle>
            <ClearAllButton onClick={clearAllFilters}>Clear all</ClearAllButton>
          </SidebarHeader>
          <SidebarContent>
        <SidebarSection>
          <SectionTitle 
            isOpen={openSections.promotionType}
            onClick={() => toggleSection('promotionType')}
          >
            Promotion Type
            <SectionTitleIcon src={chevronIcon} alt="dropdown" isOpen={openSections.promotionType} />
          </SectionTitle>
          <SectionContent isOpen={openSections.promotionType}>
            <CheckboxLabel>
              <CheckboxGroup>
                <Checkbox type="checkbox" /> Discount offers
              </CheckboxGroup>
            </CheckboxLabel>
            <CheckboxLabel>
              <CheckboxGroup>
                <Checkbox type="checkbox" /> Mix and Match
              </CheckboxGroup>
            </CheckboxLabel>
            <CheckboxLabel>
              <CheckboxGroup>
                <Checkbox type="checkbox" /> Bulk offers
              </CheckboxGroup>
            </CheckboxLabel>
          </SectionContent>
        </SidebarSection>

        <SidebarSection>
          <SectionTitle 
            isOpen={openSections.category}
            onClick={() => toggleSection('category')}
          >
            Category
            <SectionTitleIcon src={chevronIcon} alt="dropdown" isOpen={openSections.category} />
          </SectionTitle>
          <SectionContent isOpen={openSections.category}>
            <CheckboxLabel>
              <CheckboxGroup>
                <Checkbox type="checkbox" /> Healthcare
              </CheckboxGroup>
            </CheckboxLabel>
            <CheckboxLabel>
              <CheckboxGroup>
                <Checkbox type="checkbox" /> Education
              </CheckboxGroup>
            </CheckboxLabel>
            <CheckboxLabel>
              <CheckboxGroup>
                <Checkbox type="checkbox" /> Groceries
              </CheckboxGroup>
            </CheckboxLabel>
            <CheckboxLabel>
              <CheckboxGroup>
                <Checkbox type="checkbox" /> Transport
              </CheckboxGroup>
            </CheckboxLabel>
            <CheckboxLabel>
              <CheckboxGroup>
                <Checkbox type="checkbox" /> Entertainment
              </CheckboxGroup>
            </CheckboxLabel>
            <CheckboxLabel>
              <CheckboxGroup>
                <Checkbox type="checkbox" /> Other
              </CheckboxGroup>
            </CheckboxLabel>
          </SectionContent>
        </SidebarSection>

        <SidebarSection>
          <SectionTitle 
            isOpen={openSections.shopByBrand}
            onClick={() => toggleSection('shopByBrand')}
          >
            Shop by Brand
            <SectionTitleIcon src={chevronIcon} alt="dropdown" isOpen={openSections.shopByBrand} />
          </SectionTitle>
          <SectionContent isOpen={openSections.shopByBrand}>
            {brands.map((brand, index) => (
              <CheckboxLabel key={index}>
                <CheckboxGroup>
                  <Checkbox 
                    type="checkbox" 
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                  /> 
                  {brand}
                </CheckboxGroup>
                <CountBadge>{products.filter(p => p.brand === brand).length}</CountBadge>
              </CheckboxLabel>
            ))}
            {brands.length === 0 && <div style={{ fontSize: '12px', color: '#999' }}>No brands available</div>}
          </SectionContent>
        </SidebarSection>
          </SidebarContent>
      </Sidebar>

        {/* RIGHT MAIN PRODUCT CATALOG */}
        <MainContent>
          {currentView === 'detail' && selectedProductLocal ? (
            <ProductDetail 
              product={selectedProductLocal} 
              onBack={backToProductList}
            />
          ) : (
            <>
              <Header>{categoryIcons[selectedCategory]}{selectedCategory} Products </Header>
          
          <FiltersRow>
          <FilterGroup>
            <Label>Search Products</Label>
            <input
              type="text"
              placeholder="Search by name, brand, or description..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                padding: '6px 10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                width: '250px',
                fontSize: '14px'
              }}
            />
          </FilterGroup>

          <FilterGroup>
            <Label>Sort By</Label>
            <SelectWrapper>
              <Select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
                <option value="relevance">Relevance</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </Select>
              <ChevronIcon src={chevronIcon} alt="dropdown" />
            </SelectWrapper>
          </FilterGroup>

          <FilterGroup>
            <Label>Show</Label>
            <SelectWrapper>
              <Select value={itemsPerPage} onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}>
                <option value="20">20 per page</option>
                <option value="40">40 per page</option>
                <option value="60">60 per page</option>
              </Select>
              <ChevronIcon src={chevronIcon} alt="dropdown" />
            </SelectWrapper>
          </FilterGroup>

          {/* NEW ICONS ON RIGHT */}
          <IconsGroup>
            <IconButton><Grid /></IconButton>
            <IconButton><List /></IconButton>
          </IconsGroup>
        </FiltersRow>

        <ProductGrid>
          {loading && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '0px', color: '#666' }}>
              Loading products...
            </div>
          )}
          {error && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#e63946' }}>
              {error}
            </div>
          )}
          {!loading && !error && products.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
              <p style={{ fontSize: '16px', marginBottom: '10px' }}>No products found for this category.</p>
              <p style={{ fontSize: '14px', color: '#999' }}>
                The product database appears to be empty. Please contact the administrator to add products.
              </p>
            </div>
          )}
          {!loading && !error && products.map((p) => (
            <ProductCard 
              key={p.sku || p.id} 
              onClick={() => {
                // Store product data and switch to detail view
                console.log('🎯 Setting selected product:', p);
                setSelectedProductLocal(p);
                dispatch(setSelectedProduct(p)); // Also store in Redux for ProductDetail component
                setCurrentView('detail');
              }}
            >
              {p.onSale && <SaleTag>-10%</SaleTag>}
              <SmartProductImage 
                product={p}
                alt={p.name}
              />
              <ProductName>{p.name}</ProductName>
              {p.brand && (
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                  {p.brand}
                </div>
              )}
              <ProductPrice>R{parseFloat(p.price || 0).toFixed(2)}</ProductPrice>
              {p.shop && (
                <div style={{ fontSize: '11px', color: '#185c37', marginBottom: '8px' }}>
                  Available at {p.shop}
                </div>
              )}
              {p.stockQuantity && (
                <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                  Stock: {p.stockQuantity} available
                </div>
              )}
              <AddButton 
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(p);
                }} 
                disabled={!p.inStock || addingToCart}
                style={{ 
                  opacity: p.inStock ? 1 : 0.6, 
                  cursor: p.inStock ? 'pointer' : 'not-allowed' 
                }}
              >
                {p.inStock ? 'Add To Basket' : 'Out of Stock'}
              </AddButton>
            </ProductCard>
          ))}
        </ProductGrid>

        <Pagination>
          {currentPage > 1 && (
            <PageButton onClick={() => handlePageChange(1)}>First</PageButton>
          )}
          {Array.from({ length: Math.min(pagination.totalPages || 1, 5) }, (_, i) => {
            const page = i + 1;
            return (
              <PageButton 
                key={page} 
                active={currentPage === page}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </PageButton>
            );
          })}
          {currentPage < (pagination.totalPages || 1) && (
            <PageButton onClick={() => handlePageChange(pagination.totalPages || 1)}>Last</PageButton>
          )}
        </Pagination>
            </>
          )}
        </MainContent>
      </ContentWrapper>
    </PageLayout>
  );
};

export default Products;
