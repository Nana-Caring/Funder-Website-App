// Example: ProductList Component using the new Redux slices
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  setFilters,
  clearFilters,
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
  selectProductsPagination,
  selectAvailableCategories,
  selectAvailableBrands
} from '../store/slices/products';
import {
  addToCart,
  selectCartItemQuantity,
  selectIsProductInCart
} from '../store/slices/cart';

const ProductList = () => {
  const dispatch = useDispatch();
  
  // 🔍 Redux Selectors - Based on your API structure
  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const pagination = useSelector(selectProductsPagination);
  const categories = useSelector(selectAvailableCategories);
  const brands = useSelector(selectAvailableBrands);
  
  // Local state for filters
  const [filters, setLocalFilters] = useState({
    category: '',
    brand: '',
    search: '',
    page: 1,
    limit: 20
  });

  // 🚀 Fetch products on component mount and filter changes
  useEffect(() => {
    const apiFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value)
    );
    
    dispatch(fetchProducts(apiFilters));
  }, [dispatch, filters]);

  // 🎯 Event Handlers
  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (page) => {
    setLocalFilters(prev => ({ ...prev, page }));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleClearFilters = () => {
    setLocalFilters({
      category: '',
      brand: '',
      search: '',
      page: 1,
      limit: 20
    });
    dispatch(clearFilters());
  };

  // 🎨 Render Functions
  const renderFilters = () => (
    <div className="filters">
      <h3>Filters</h3>
      
      {/* Search */}
      <div className="filter-group">
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <label>Category:</label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Brand Filter */}
      <div className="filter-group">
        <label>Brand:</label>
        <select
          value={filters.brand}
          onChange={(e) => handleFilterChange('brand', e.target.value)}
        >
          <option value="">All Brands</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleClearFilters}>Clear Filters</button>
    </div>
  );

  const renderPagination = () => (
    <div className="pagination">
      <button
        disabled={pagination.page === 1}
        onClick={() => handlePageChange(pagination.page - 1)}
      >
        Previous
      </button>
      
      <span>
        Page {pagination.page} of {pagination.totalPages} 
        ({pagination.total} total products)
      </span>
      
      <button
        disabled={pagination.page === pagination.totalPages}
        onClick={() => handlePageChange(pagination.page + 1)}
      >
        Next
      </button>
    </div>
  );

  const ProductCard = ({ product }) => {
    const cartQuantity = useSelector(state => selectCartItemQuantity(state, product.id));
    const inCart = useSelector(state => selectIsProductInCart(state, product.id));

    return (
      <div className="product-card">
        <img src={product.image} alt={product.name} />
        <h4>{product.name}</h4>
        <p className="brand">{product.brand}</p>
        <p className="category">{product.category}</p>
        <p className="price">R{product.price}</p>
        <p className="stock">
          {product.inStock ? 
            `${product.stockQuantity} in stock` : 
            'Out of stock'
          }
        </p>
        
        {product.minAge && (
          <p className="age-range">
            Ages {product.minAge}-{product.maxAge}
          </p>
        )}
        
        <div className="actions">
          <button
            onClick={() => handleAddToCart(product)}
            disabled={!product.inStock}
          >
            {inCart ? `Add More (${cartQuantity} in cart)` : 'Add to Cart'}
          </button>
        </div>
      </div>
    );
  };

  // 🎨 Main Render
  if (error) {
    return (
      <div className="error">
        <h3>Error loading products</h3>
        <p>{error}</p>
        <button onClick={() => dispatch(fetchProducts())}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <h2>Products</h2>
      
      {renderFilters()}
      
      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <>
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {products.length === 0 && (
            <div className="no-products">
              No products found matching your criteria.
            </div>
          )}
          
          {pagination.totalPages > 1 && renderPagination()}
        </>
      )}
    </div>
  );
};

export default ProductList;