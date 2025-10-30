import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Grid, List, Heart, Baby, GraduationCap, Shirt, Gamepad2, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import sampleProductImage from "../../../assets/sample-product.png";
import chevronIcon from "../../../assets/icons/Chevron down.png";
import axios from "axios";

// Export sampleProducts to make it available for import in ProductDetail.jsx

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

// Enhanced image component with multiple source fallbacks
const SmartProductImage = ({ product, alt, ...props }) => {
  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  
  // Build array of possible image sources
  const imageSources = [];
  
  // Primary image
  if (product.image) {
    const primaryUrl = getImageUrl(product.image);
    if (primaryUrl) imageSources.push(primaryUrl);
  }
  
  // Images array
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach(img => {
      const url = getImageUrl(img);
      if (url && !imageSources.includes(url)) {
        imageSources.push(url);
      }
    });
  }
  
  // Add sample image as final fallback
  imageSources.push(sampleProductImage);
  
  const handleImageError = () => {
    console.log(`❌ Image ${currentSrcIndex + 1}/${imageSources.length} failed for ${product.name}:`, imageSources[currentSrcIndex]);
    
    if (currentSrcIndex < imageSources.length - 1) {
      setCurrentSrcIndex(prev => prev + 1);
      console.log(`🔄 Trying next image source ${currentSrcIndex + 2}/${imageSources.length}`);
    } else {
      console.log('❌ All image sources failed, using final fallback');
      setHasError(true);
    }
  };
  
  const handleImageLoad = () => {
    if (imageSources[currentSrcIndex] !== sampleProductImage) {
      console.log(`✅ Image loaded for ${product.name}:`, imageSources[currentSrcIndex]);
    }
  };
  
  return (
    <ProductImage
      src={imageSources[currentSrcIndex]}
      alt={alt}
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

// Helper function to handle product image URLs
const getImageUrl = (imageData) => {
  if (!imageData) return null;
  
  console.log('🔍 Processing image data:', imageData, 'Type:', typeof imageData);
  
  // If imageData is a string (direct URL)
  if (typeof imageData === 'string') {
    // Check if it's a full URL
    if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
      console.log('✅ Valid image URL found:', imageData);
      return imageData;
    }
    // If it's just a filename, try to construct a proper URL
    if (imageData && !imageData.includes('/')) {
      console.log('⚠️ Filename only, attempting to construct URL:', imageData);
      // Try common CDN patterns
      const possibleUrls = [
        `https://cdn.babycity.co.za/images/products/large/${imageData}`,
        `https://nanacaring-backend.onrender.com/uploads/${imageData}`,
        `https://nanacaring-backend.onrender.com/images/${imageData}`
      ];
      console.log('🔧 Trying constructed URLs:', possibleUrls);
      return possibleUrls[0]; // Return the first attempt
    }
    console.log('⚠️ Invalid image format:', imageData);
    return null;
  }
  
  // If imageData is an object with url property
  if (imageData && typeof imageData === 'object' && imageData.url) {
    console.log('✅ Using image URL from object:', imageData.url);
    return imageData.url;
  }
  
  console.log('❌ No valid image found in:', imageData);
  return null;
};

const Products = () => {
  const [sortBy, setSortBy] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    promotionType: [],
    inStock: true
  });
  const [openSections, setOpenSections] = useState({
    promotionType: false,
    category: false,
    shopByBrand: false
  });
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCategory = location.state?.category || 'Healthcare';

  // Map frontend category names to backend category names
  const categoryMapping = {
    'Healthcare': 'Healthcare',
    'Babycare': 'Groceries', // Map Babycare to Groceries or create a new category in backend
    'School': 'Education',
    'Clothing': 'Other',
    'Entertainment': 'Entertainment',
    'Pregnancy': 'Healthcare'
  };

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const backendCategory = categoryMapping[selectedCategory] || selectedCategory;
        
        // Build query parameters
        const params = new URLSearchParams({
          category: backendCategory,
          page: currentPage,
          limit: itemsPerPage,
          inStock: selectedFilters.inStock
        });

        // Add brand filter if any selected
        if (selectedBrands.length > 0) {
          selectedBrands.forEach(brand => params.append('brand', brand));
        }

        // Add sorting
        if (sortBy === 'price-low') {
          params.append('sortBy', 'price');
          params.append('sortOrder', 'ASC');
        } else if (sortBy === 'price-high') {
          params.append('sortBy', 'price');
          params.append('sortOrder', 'DESC');
        }

        console.log('🔄 Fetching products from:', `https://nanacaring-backend.onrender.com/api/products?${params.toString()}`);
        
        // Try multiple API endpoints
        const endpoints = [
          `https://nanacaring-backend.onrender.com/api/products?${params.toString()}`,
          `https://nanacaring-backend.onrender.com/api/dependent/products?${params.toString()}`,
          `https://nanacaring-backend.onrender.com/api/products`
        ];
        
        let response = null;
        let lastError = null;
        
        for (const endpoint of endpoints) {
          try {
            console.log(`🔄 Trying endpoint: ${endpoint}`);
            response = await axios.get(endpoint, {
              timeout: 10000,
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            console.log('✅ API Response:', response.data);
            break; // Success, exit loop
          } catch (endpointError) {
            console.warn(`❌ Failed endpoint ${endpoint}:`, endpointError.message);
            lastError = endpointError;
            continue; // Try next endpoint
          }
        }
        
        if (!response) {
          throw lastError || new Error('All product endpoints failed');
        }
        
        // Handle multiple possible response structures
        let productsData = [];
        
        if (response.data.success) {
          productsData = response.data.data?.products || 
                        response.data.data || 
                        response.data.products ||
                        (Array.isArray(response.data.data) ? response.data.data : []);
        } else if (Array.isArray(response.data)) {
          productsData = response.data;
        } else if (response.data.products) {
          productsData = response.data.products;
        } else {
          // Try to extract products from any array in the response
          const dataKeys = Object.keys(response.data);
          for (const key of dataKeys) {
            if (Array.isArray(response.data[key])) {
              productsData = response.data[key];
              break;
            }
          }
        }
        
        const totalPagesData = response.data.pagination?.totalPages || 
                             response.data.data?.totalPages || 
                             response.data.totalPages ||
                             Math.ceil(productsData.length / itemsPerPage);
        
        console.log('📦 Products data:', productsData);
        console.log('📋 Sample product:', productsData[0]);
        console.log('📊 Total pages:', totalPagesData);
        
        // Debug image URLs
        if (productsData && productsData.length > 0) {
          productsData.slice(0, 3).forEach((product, index) => {
            console.log(`🖼️ Product ${index} image data:`, {
              name: product.name,
              image: product.image,
              images: product.images,
              processedUrl: getImageUrl(product.image)
            });
          });
        }
        
        setProducts(productsData || []);
        setTotalPages(totalPagesData);
        
        // Extract unique brands from products - handle your backend response structure
        const uniqueBrands = [...new Set(productsData.map(p => p?.brand).filter(Boolean))];
        setBrands(uniqueBrands);
        
        // Extract unique shops for potential filtering
        const uniqueShops = [...new Set(productsData.map(p => p?.shop).filter(Boolean))];
        console.log('🏪 Available shops:', uniqueShops);
      } catch (err) {
        console.error('❌ Error fetching products:', err);
        console.error('❌ Error response:', err.response?.data);
        console.error('❌ Error status:', err.response?.status);
        console.error('❌ Error config:', err.config?.url);
        
        let errorMessage = 'Failed to load products. Please try again.';
        
        if (err.code === 'NETWORK_ERROR' || err.message.includes('Network')) {
          errorMessage = 'Network connection failed. Please check your internet connection.';
        } else if (err.response?.status === 404) {
          errorMessage = 'Products endpoint not found. The API may be unavailable.';
        } else if (err.response?.status === 500) {
          errorMessage = 'Server error occurred. Please try again later.';
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = `API Error: ${err.message}`;
        }
        
        setError(errorMessage);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, currentPage, sortBy, itemsPerPage, selectedBrands, selectedFilters]);

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

  // Category icon mapping
  const categoryIcons = {
    Healthcare: <Heart size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    Babycare: <Baby size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    School: <GraduationCap size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    Clothing: <Shirt size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    Entertainment: <Gamepad2 size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
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
              <CountBadge>15</CountBadge>
            </CheckboxLabel>
            <CheckboxLabel>
              <CheckboxGroup>
                <Checkbox type="checkbox" /> Babycare
              </CheckboxGroup>
              <CountBadge>8</CountBadge>
            </CheckboxLabel>
            <CheckboxLabel>
              <CheckboxGroup>
                <Checkbox type="checkbox" /> School
              </CheckboxGroup>
              <CountBadge>12</CountBadge>
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
          <Header>{categoryIcons[selectedCategory]}{selectedCategory} Products </Header>
          
          <FiltersRow>
          <FilterGroup>
            <Label>Sort By</Label>
            <SelectWrapper>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="relevance">Relevance</option>
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
            <ProductCard key={p.sku || p.id} onClick={() => navigate(`/product/${p.sku || p.id}`)}>
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
                  // Add to basket logic here
                  alert(`Added ${p.name} to basket`);
                }} 
                disabled={!p.inStock}
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
            <PageButton onClick={() => setCurrentPage(1)}>First</PageButton>
          )}
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const page = i + 1;
            return (
              <PageButton 
                key={page} 
                active={currentPage === page}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PageButton>
            );
          })}
          {currentPage < totalPages && (
            <PageButton onClick={() => setCurrentPage(totalPages)}>Last</PageButton>
          )}
        </Pagination>
        </MainContent>
      </ContentWrapper>
    </PageLayout>
  );
};

export default Products;
