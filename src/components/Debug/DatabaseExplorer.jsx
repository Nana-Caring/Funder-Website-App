/**
 * 🔍 DATABASE EXPLORER - Check what's actually in your database
 * =============================================================
 * This script will help us understand the full scope of your product database
 */

// Add this to your ProductsDebugger component or run it directly
const DatabaseExplorer = () => {
  
  const exploreAllCategories = async () => {
    console.log('🗄️ EXPLORING FULL DATABASE');
    console.log('============================');
    
    const categories = ['Healthcare', 'Education', 'Groceries', 'Entertainment', 'Other', 'Transport'];
    let totalProducts = 0;
    const allProducts = [];
    
    for (const category of categories) {
      try {
        console.log(`\n📂 Checking category: ${category}`);
        const response = await fetch(`/api/products/category/${category}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const count = data.data.length;
          totalProducts += count;
          allProducts.push(...data.data);
          
          console.log(`   ✅ ${category}: ${count} products`);
          
          if (count > 0) {
            console.log(`   📋 Sample products:`, data.data.slice(0, 3).map(p => ({
              id: p.id,
              name: p.name,
              sku: p.sku,
              price: p.price
            })));
          }
        } else {
          console.log(`   ❌ ${category}: No products or API error`);
        }
      } catch (error) {
        console.error(`   ❌ Error fetching ${category}:`, error);
      }
    }
    
    console.log(`\n🎯 TOTAL PRODUCTS FOUND: ${totalProducts}`);
    console.log(`📊 Categories with products:`, categories.filter((cat, index) => 
      allProducts.some(p => p.category === cat)
    ));
    
    // Check if there are products beyond categories
    try {
      console.log(`\n🌐 Checking ALL products endpoint:`);
      const allResponse = await fetch(`/api/products?limit=100`);
      const allData = await allResponse.json();
      
      if (allData.success && allData.data) {
        console.log(`   ✅ Total via /api/products: ${allData.data.length} products`);
        console.log(`   📄 Pagination:`, allData.pagination);
        
        // Group by category
        const byCategory = allData.data.reduce((acc, product) => {
          const cat = product.category || 'Unknown';
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {});
        
        console.log(`   📊 Distribution by category:`, byCategory);
        
        // Show product ID ranges
        const ids = allData.data.map(p => p.id).sort((a, b) => a - b);
        console.log(`   🔢 Product ID range: ${ids[0]} - ${ids[ids.length - 1]}`);
        
        return allData.data;
      }
    } catch (error) {
      console.error(`   ❌ Error fetching all products:`, error);
    }
    
    return allProducts;
  };
  
  const testSpecificProduct = async (productId) => {
    console.log(`\n🔍 TESTING SPECIFIC PRODUCT: ${productId}`);
    console.log('=========================================');
    
    try {
      const response = await fetch(`/api/products/${productId}`);
      console.log(`📡 Response status: ${response.status}`);
      console.log(`📡 Response ok: ${response.ok}`);
      
      const data = await response.json();
      console.log(`📋 Response data:`, data);
      
      if (data.success && data.data) {
        console.log(`✅ Product found:`, {
          id: data.data.id,
          name: data.data.name,
          category: data.data.category,
          sku: data.data.sku,
          price: data.data.price,
          inStock: data.data.inStock,
          isActive: data.data.isActive
        });
        return data.data;
      } else {
        console.log(`❌ Product not found or API error`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Network error:`, error);
      return null;
    }
  };
  
  const testProductsByRange = async (startId = 1, endId = 50) => {
    console.log(`\n🔢 TESTING PRODUCT ID RANGE: ${startId} - ${endId}`);
    console.log('================================================');
    
    const foundProducts = [];
    const missingProducts = [];
    
    for (let id = startId; id <= endId; id++) {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            foundProducts.push({
              id: data.data.id,
              name: data.data.name,
              category: data.data.category
            });
          } else {
            missingProducts.push(id);
          }
        } else {
          missingProducts.push(id);
        }
      } catch (error) {
        missingProducts.push(id);
      }
    }
    
    console.log(`✅ Found products: ${foundProducts.length}`);
    console.log(`❌ Missing IDs: ${missingProducts.length}`, missingProducts.slice(0, 10));
    console.log(`📋 Sample found products:`, foundProducts.slice(0, 5));
    
    return { foundProducts, missingProducts };
  };
  
  return {
    exploreAllCategories,
    testSpecificProduct,
    testProductsByRange
  };
};

// Usage instructions:
console.log(`
🚀 DATABASE EXPLORER READY!
===========================

To use in browser console:
1. const explorer = DatabaseExplorer();
2. await explorer.exploreAllCategories();
3. await explorer.testSpecificProduct(217); // Test specific ID
4. await explorer.testProductsByRange(1, 50); // Test ID range

This will help us understand:
- How many total products exist
- Which categories have products  
- Valid product ID ranges
- Why ProductDetail shows "Product not found"
`);

export default DatabaseExplorer;