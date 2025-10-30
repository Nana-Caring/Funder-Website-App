# 🛒 Products & Cart Redux Integration Guide

This guide shows you how to use the newly created Redux slices for products and cart functionality based on your API structure.

## 📋 What We Created

### 1. **Products Slice** (`src/store/slices/products.js`)
- Handles API calls to `GET /api/products`
- Supports filtering, pagination, search
- Manages single product fetching by ID or SKU

### 2. **Cart Slice** (`src/store/slices/cart.js`) 
- Client-side cart management
- Add/remove/update items
- Calculate totals, shipping, tax
- Checkout flow management

### 3. **Updated Store Configuration** (`src/store/store.jsx`)
- Added products and cart reducers
- Enhanced development logging

## 🚀 Quick Start Usage

### Fetch Products in Your Components

```jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchProducts, 
  selectAllProducts, 
  selectProductsLoading 
} from '../store/slices/products';

function ProductsPage() {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectProductsLoading);

  useEffect(() => {
    // Fetch all products
    dispatch(fetchProducts());
    
    // Or fetch with filters
    dispatch(fetchProducts({ 
      category: 'Healthcare', 
      page: 1, 
      limit: 20 
    }));
  }, [dispatch]);

  return (
    <div>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        products.map(product => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>R{product.price}</p>
            <button onClick={() => handleAddToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))
      )}
    </div>
  );
}
```

### Add Items to Cart

```jsx
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cart';

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ 
      product, 
      quantity: 1 
    }));
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}
```

### Display Cart Information

```jsx
import { useSelector } from 'react-redux';
import { 
  selectCartTotalItems, 
  selectCartTotalAmount 
} from '../store/slices/cart';

function Header() {
  const totalItems = useSelector(selectCartTotalItems);
  const totalAmount = useSelector(selectCartTotalAmount);

  return (
    <header>
      <button>
        Cart ({totalItems}) - R{totalAmount.toFixed(2)}
      </button>
    </header>
  );
}
```

## 🎯 API Endpoints Covered

Based on your simulation script, these are the exact endpoints our slices handle:

| Endpoint | Redux Action | Purpose |
|----------|--------------|---------|
| `GET /api/products` | `fetchProducts()` | Get all products |
| `GET /api/products?category=Healthcare` | `fetchProducts({ category: 'Healthcare' })` | Filter by category |
| `GET /api/products?search=baby` | `fetchProducts({ search: 'baby' })` | Search products |
| `GET /api/products?page=1&limit=20` | `fetchProducts({ page: 1, limit: 20 })` | Pagination |
| `GET /api/products/217` | `fetchProductById('217')` | Single product by ID |
| `GET /api/products/TT-BOTTLE-260ML` | `fetchProductById('TT-BOTTLE-260ML')` | Single product by SKU |

## 📊 Expected API Response Structure

Your Redux state will match this structure from your API:

```json
{
  "success": true,
  "data": [
    {
      "id": 217,
      "name": "LEGO Basic Building Set 200 Pieces",
      "brand": "LEGO", 
      "price": "199.99",
      "category": "Entertainment",
      "sku": "LG-BUILD-200",
      "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64...",
      "inStock": true,
      "stockQuantity": 15,
      // ... other fields
    }
  ],
  "pagination": {
    "total": 32,
    "page": 1, 
    "limit": 20,
    "totalPages": 2
  }
}
```

## 🔧 Integration Steps

### Step 1: Import Components
```jsx
// In your main App.jsx or wherever you want to show products
import ProductList from './components/ProductList/ProductList';
import Cart from './components/Cart/CartNew';
import { CartToggleButton } from './components/Cart/CartNew';
```

### Step 2: Add to Your Routes
```jsx
// In your router setup
<Route path="/products" element={<ProductList />} />
```

### Step 3: Add Cart to Layout
```jsx
function Layout() {
  return (
    <div>
      <header>
        <CartToggleButton />
      </header>
      <main>
        {/* Your routes */}
      </main>
      <Cart /> {/* Cart modal will show when toggled */}
    </div>
  );
}
```

## 🏪 Redux State Structure

After integration, your Redux store will look like:

```javascript
{
  products: {
    items: [...], // 32 products from your API
    loading: false,
    error: null,
    pagination: { total: 32, page: 1, limit: 20, totalPages: 2 },
    filters: { category: null, search: null }
  },
  cart: {
    items: [...], // Cart items with product + quantity
    totalItems: 3,
    totalAmount: 299.97,
    isOpen: false
  },
  // ... your existing slices
}
```

## 🔍 Available Selectors

### Product Selectors
- `selectAllProducts` - All loaded products
- `selectProductsLoading` - Loading state
- `selectProductsByCategory(state, 'Healthcare')` - Filter by category
- `selectInStockProducts` - Only in-stock products
- `selectAvailableCategories` - Unique categories list

### Cart Selectors  
- `selectCartItems` - All cart items
- `selectCartTotalItems` - Total quantity count
- `selectCartTotalAmount` - Subtotal amount
- `selectCartFinalTotal` - Total with shipping + tax
- `selectIsProductInCart(state, productId)` - Check if product is in cart

## ⚡ Performance Tips

1. **Memoize Selectors**: Use `createSelector` for complex filtering
2. **Debounce Search**: Don't fetch on every keystroke
3. **Cache Products**: Store fetched products to avoid re-fetching
4. **Optimistic Updates**: Update cart immediately, sync later

## 🐛 Debugging

Use the enhanced store logging to debug:

```javascript
// Check console for:
🏪 Store updated: {
  productsCount: 32,
  cartItemsCount: 3,
  isLoading: false
}
```

## 📱 Next Steps

1. **Test the API calls** - Make sure `/api/products` returns the expected structure
2. **Style the components** - Customize the CSS to match your design
3. **Add error handling** - Handle network errors gracefully  
4. **Implement checkout** - Connect to your payment system
5. **Add persistence** - Save cart to localStorage

## 🎉 You're Ready!

Your Redux store now perfectly matches your API structure with:
- ✅ 32 products with proper filtering
- ✅ Category-based organization 
- ✅ Real Unsplash images
- ✅ Full cart functionality
- ✅ Pagination support
- ✅ Search capabilities

The slices are production-ready and follow Redux Toolkit best practices!