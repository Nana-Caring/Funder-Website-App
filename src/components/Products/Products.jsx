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
  fetchProductsForDependent,
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

// Use the server-based cart slice
import { addToCart, selectAddingToCart, fetchCart } from '../../../store/slices/cartServer';
import ProductDetail from './ProductDetail';
import { computeAgeFromSAId } from '../../utils/ageUtils';

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

// Lightweight Toast UI
const ToastContainer = styled.div`
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 3000;
`;

const Toast = styled.div`
  background: #1f2937; /* slate-800 */
  color: #fff;
  padding: 12px 14px;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 360px;
`;

const ToastText = styled.div`
  font-size: 13px;
  line-height: 1.3;
  flex: 1;
`;

const ToastAction = styled.button`
  background: transparent;
  color: #34d399; /* emerald-400 */
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  &:hover {
    background: rgba(52, 211, 153, 0.12);
  }
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
  const authUser = useSelector(state => state.authentication?.user);
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const pagination = useSelector(selectPagination);
  const currentCategory = useSelector(selectCurrentCategory);
  const currentSearch = useSelector(selectCurrentSearch);
  const currentSort = useSelector(selectCurrentSort);
  const addingToCart = useSelector(selectAddingToCart);

  // Pregnancy visibility (only for eligible users per API spec)
  const [canSeePregnancy, setCanSeePregnancy] = useState(false);

  useEffect(() => {
    const checkPregnancyVisibility = async () => {
      try {
        const token =
          localStorage.getItem('token') ||
          localStorage.getItem('accessToken') ||
          sessionStorage.getItem('token');
        if (!token) {
          // Without an auth token, fall back to public view (no Pregnancy)
          setCanSeePregnancy(false);
          return;
        }
        const headers = token
          ? { Authorization: `Bearer ${token}`, Accept: 'application/json' }
          : { Accept: 'application/json' };
        const role = authUser?.role?.toLowerCase();
        const userId = authUser?.id;
        if (!userId || !role) {
          setCanSeePregnancy(false);
          return;
        }
        const BASE_URL = 'https://nanacaring-backend.onrender.com/api/products';
        const url = role === 'dependent'
          ? `${BASE_URL}/dependent/${userId}/categories`
          : `${BASE_URL}/user/${userId}/categories`;

        const res = await fetch(url, { headers });
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          console.warn('Unexpected content-type for categories');
          setCanSeePregnancy(false);
          return;
        }
        const data = await res.json();
        if (!res.ok || !data?.success) {
          console.warn('Failed to retrieve categories:', data?.message || res.status);
          setCanSeePregnancy(false);
          return;
        }
        const categories = Array.isArray(data.data)
          ? data.data.map(c => (typeof c === 'string' ? c : c?.category)).filter(Boolean)
          : [];
        setCanSeePregnancy(categories.includes('Pregnancy'));
      } catch (e) {
        console.warn('Pregnancy category visibility check failed:', e?.message || e);
        setCanSeePregnancy(false);
      }
    };
    checkPregnancyVisibility();
  }, [authUser?.id, authUser?.role]);

  // Determine dependent age (if available) for product-level age filtering
  const fallbackRole = (typeof localStorage !== 'undefined' && (localStorage.getItem('userRole') || localStorage.getItem('role') || '')).toLowerCase();
  const isDependent = (authUser?.role?.toLowerCase() === 'dependent') || (fallbackRole === 'dependent');
  let dependentAge = null;
  if (isDependent) {
    try {
      const saId = authUser?.Idnumber || authUser?.idNumber || (typeof localStorage !== 'undefined' && (localStorage.getItem('Idnumber') || localStorage.getItem('idNumber')));
      if (saId) {
        dependentAge = computeAgeFromSAId(saId);
      }
    } catch (e) {
      // If we cannot compute age, skip client-side age filtering and rely on backend
      console.warn('Unable to compute dependent age from ID:', e?.message || e);
    }
  }

  // Apply product-level age filtering on the client (in addition to backend), when age is known
  const visibleProducts = React.useMemo(() => {
    if (!Array.isArray(products)) return [];
    if (!isDependent || dependentAge == null) return products;
    const age = Number(dependentAge);
    if (Number.isNaN(age)) return products;
    return products.filter(p => {
      const min = p?.minAge != null ? Number(p.minAge) : null;
      const max = p?.maxAge != null ? Number(p.maxAge) : null;
      // If product has no explicit bounds, allow it
      if ((min == null || Number.isNaN(min)) && (max == null || Number.isNaN(max))) return true;
      if (min != null && !Number.isNaN(min) && age < min) return false;
      if (max != null && !Number.isNaN(max) && age > max) return false;
      return true;
    });
  }, [products, isDependent, dependentAge]);
  
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
  console.log('  - Should show no products:', !loading && !error && (Array.isArray(visibleProducts) ? visibleProducts.length === 0 : products.length === 0));
  console.log('  - Should show products:', !loading && !error && products.length > 0);

  // Local state for UI components
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(200); // Pull more items to align with backend pagination
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
    category: true, // Open category section by default
    shopByBrand: false
  });

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastActionLabel, setToastActionLabel] = useState('');
  const toastTimerRef = React.useRef(null);

  const showToast = (message, actionLabel = '', durationMs = 3500) => {
    // Clear any existing timers
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToastMessage(message);
    setToastActionLabel(actionLabel);
    setToastVisible(true);
    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false);
      toastTimerRef.current = null;
    }, durationMs);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);
  
  // Default category (avoid coming-soon categories like Healthcare/Education)
  const getDefaultCategory = () => 'Groceries';
  
  const selectedCategory = location.state?.category || getDefaultCategory();
  
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
    // Determine dependent role/id with localStorage fallbacks
    const fallbackRole = (localStorage.getItem('userRole') || localStorage.getItem('role') || '').toLowerCase();
    const isDependent = (authUser?.role?.toLowerCase() === 'dependent') || (fallbackRole === 'dependent');
    const dependentId = authUser?.id || localStorage.getItem('userId');
    if (isDependent && dependentId) {
      console.log('🧒 Using age-filtered dependent endpoint with id:', dependentId);
      dispatch(fetchProductsForDependent({
        dependentId,
        ...fetchParams
      }));
    } else {
      console.log('👥 Using generic products endpoint');
      dispatch(fetchProducts(fetchParams));
    }
  }, [dispatch, selectedCategory, currentPage, itemsPerPage, searchTerm, sortBy, authUser?.role, authUser?.id]);

  // Extract brands from visible products for filtering
  useEffect(() => {
    if (visibleProducts && visibleProducts.length > 0) {
      const uniqueBrands = [...new Set(visibleProducts.map(p => p?.brand).filter(Boolean))];
      setBrands(uniqueBrands);
    } else {
      setBrands([]);
    }
  }, [visibleProducts]);

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
    // Map UI values to thunk-friendly sort keys
    const mapped = newSort === 'price-low' ? 'price_asc'
                  : newSort === 'price-high' ? 'price_desc'
                  : newSort;
    setSortBy(mapped);
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
        quantity: 1
      })).unwrap();
      
      // Show success message or update UI
      console.log('Product added to cart successfully');
      // Refresh cart so header badge reflects changes
      dispatch(fetchCart());
      // Show non-blocking toast with View cart action
      showToast(`Added "${product.name}" to cart.`, 'View cart');
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      // Friendly feedback for common cases (age-restriction/auth)
      const message = typeof error === 'string' ? error : (error?.message || 'Failed to add to cart');
      const lower = message.toLowerCase();
      if (typeof window !== 'undefined') {
        if (lower.includes('age') || lower.includes('not allowed') || lower.includes('not permitted')) {
          window.alert('This item is not allowed for the dependent’s age.');
        } else if (lower.includes('authentication') || lower.includes('unauthorized') || lower.includes('forbidden')) {
          window.alert('Please sign in to add items to your cart.');
        } else {
          window.alert(message);
        }
      }
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
    Entertainment: <Gamepad2 size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    Other: <Package size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    // Frontend category mappings
    Babycare: <Baby size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    School: <GraduationCap size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    Clothing: <Shirt size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    Pregnancy: <Users size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    // fallback icon if an old route still passes 'Transport'
    Transport: <Users size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />
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
            {canSeePregnancy && (
              <CheckboxLabel>
                <CheckboxGroup>
                  <Checkbox type="checkbox" /> Pregnancy
                </CheckboxGroup>
              </CheckboxLabel>
            )}
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

        {/* Category Filter Section */}
        <SidebarSection>
          <SectionTitle 
            isOpen={openSections.category}
            onClick={() => toggleSection('category')}
          >
            Categories
            <SectionTitleIcon src={chevronIcon} alt="dropdown" isOpen={openSections.category} />
          </SectionTitle>
          <SectionContent isOpen={openSections.category}>
            {(() => {
              // Show base categories to everyone; include Pregnancy only if eligible
              const base = ['Healthcare', 'Education', 'Groceries', 'Entertainment', 'Other'];
              const allCategories = canSeePregnancy
                ? ['Healthcare', 'Education', 'Groceries', 'Pregnancy', 'Entertainment', 'Other']
                : base;
              return allCategories.map((category) => {
                const isComingSoon = category === 'Healthcare' || category === 'Education';
                return (
                  <CheckboxLabel key={category}>
                    <CheckboxGroup>
                      <Checkbox 
                        type="radio" 
                        name="category"
                        checked={selectedCategory === category}
                        disabled={isComingSoon}
                        onChange={() => {
                          if (isComingSoon) return; // Don't allow selection of coming soon categories
                          
                          // Update selected category and refresh products for that category
                          const params = {
                            category: category,
                            page: 1,
                            limit: itemsPerPage,
                            search: searchTerm,
                            sortBy: sortBy
                          };
                          dispatch(setCurrentCategory(category));
                          if (isDependent && authUser?.id) {
                            dispatch(fetchProductsForDependent({ dependentId: authUser.id, ...params }));
                          } else {
                            dispatch(fetchProducts(params));
                          }
                        }}
                      /> 
                      {categoryIcons[category]} {category}
                      {isComingSoon && (
                        <span style={{ 
                          fontSize: '10px', 
                          color: '#666', 
                          marginLeft: '8px',
                          fontStyle: 'italic'
                        }}>
                          (Coming Soon)
                        </span>
                      )}
                    </CheckboxGroup>
                    <CountBadge>
                      {isComingSoon ? 0 : visibleProducts.filter(p => p.category === category || p.Category === category).length}
                    </CountBadge>
                  </CheckboxLabel>
                );
              });
            })()}
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
                <CountBadge>{visibleProducts.filter(p => p.brand === brand).length}</CountBadge>
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
          {!loading && !error && visibleProducts.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
              <p style={{ fontSize: '16px', marginBottom: '10px' }}>No products match your filters.</p>
              {isDependent ? (
                <p style={{ fontSize: '14px', color: '#999' }}>
                  Nothing is available for this category given the dependent’s age. Try a different category or search.
                </p>
              ) : (
                <p style={{ fontSize: '14px', color: '#999' }}>
                  Try adjusting your filters or search.
                </p>
              )}
            </div>
          )}
          {!loading && !error && visibleProducts.map((p) => (
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
        {/* Toast Area */}
        {toastVisible && (
          <ToastContainer>
            <Toast role="status" aria-live="polite">
              <ToastText>{toastMessage}</ToastText>
              {toastActionLabel && (
                <ToastAction
                  onClick={() => {
                    setToastVisible(false);
                    // Prefer opening the cart route for consistency with header UX
                    navigate('/cart');
                  }}
                >
                  {toastActionLabel}
                </ToastAction>
              )}
            </Toast>
          </ToastContainer>
        )}
            </>
          )}
        </MainContent>
      </ContentWrapper>
    </PageLayout>
  );
};

export default Products;
