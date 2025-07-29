// src/components/CategoryPage.js
import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaHeart, 
  FaStar, 
  FaShoppingCart, 
  FaFilter, 
  FaEye, 
  FaShare,
  FaChevronDown, 
  FaLeaf, 
  FaTruck, 
  FaShieldAlt, 
  FaFire, 
  FaThumbsUp,
  FaCheckCircle,
  FaTh,
  FaList,
  FaSortAmountDown
} from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { findCategoryBySlug } from '../utils/categoryUtils';
import Header from '../Layout/Header';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [cartItems, setCartItems] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedFilters, setSelectedFilters] = useState({
    organic: false,
    onSale: false,
    inStock: true,
    freeShipping: false
  });
  
  const productsPerPage = viewMode === 'grid' ? 12 : 8;

  // Find current category
  const currentCategory = findCategoryBySlug(categoryName, categories);
  
  // Get products with enhanced filtering
  const categoryProducts = currentCategory
    ? products.filter(p => 
        p.category === currentCategory.name || 
        p.subcategory === currentCategory.name
      )
    : [];

  // Enhanced filtering logic
  const filteredProducts = categoryProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    const matchesFilters = 
      (!selectedFilters.organic || product.organic) &&
      (!selectedFilters.onSale || product.oldPrice) &&
      (!selectedFilters.inStock || product.inStock !== false) &&
      (!selectedFilters.freeShipping || product.freeShipping);
    
    return matchesSearch && matchesPrice && matchesFilters;
  });

  // Enhanced sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortOption) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      case 'newest': return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
      case 'popular': return (b.popularity || 0) - (a.popularity || 0);
      default: return a.id - b.id;
    }
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Handlers
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const isInWishlist = prev.includes(productId);
      const newWishlist = isInWishlist 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId];
      
      setToastMessage(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
      setShowToast(true);
      
      return newWishlist;
    });
  };

  const addToCart = (product) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCartItems(prev => prev + 1);
      setToastMessage(`${product.name} added to cart!`);
      setShowToast(true);
    }, 500);
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  const resetFilters = () => {
    setSelectedFilters({
      organic: false,
      onSale: false,
      inStock: true,
      freeShipping: false
    });
    setPriceRange([0, 1000]);
    setSearchQuery('');
  };

  // Get display name for the category
  const displayCategoryName = currentCategory?.name || decodeURIComponent(categoryName.replace(/-/g, ' '));

  // Auto-hide toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 opacity-50" />);
    }
    
    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ">
      
  {/* Category Hero Section */}
<div className="bg-white border-b border-gray-200">
  <div className="container mx-auto px-4 py-3">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
      {/* Left - Category Title & Product Count */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-2">
        <h1 className="text-2xl font-semibold text-gray-800">
          {displayCategoryName}
        </h1>
        <span className="text-sm font-medium text-green-600">
          {sortedProducts.length} products
        </span>
      </div>

      {/* View Toggle - Mobile */}
      <div className="lg:hidden flex justify-between items-center bg-white rounded-lg shadow-sm p-2">
        <div className="text-sm text-gray-500">
          Showing {currentProducts.length} of {sortedProducts.length} products
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg ${
              viewMode === "grid"
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <FaTh />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${
              viewMode === "list"
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <FaList />
          </button>
        </div>
      </div>

      {/* View Toggle - Desktop */}
      <div className="hidden lg:flex items-center gap-2">
        <div className="text-sm text-gray-500">
          Showing {currentProducts.length} of {sortedProducts.length} products
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium ${
              viewMode === "grid"
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <FaTh /> Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium ${
              viewMode === "list"
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <FaList /> List
          </button>
        </div>
      </div>
    </div>
  </div>
</div>


      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar - Left */}
          <div className="lg:w-72 xl:w-80 flex-shrink-0 l-0 relative ">
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-32 h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FaFilter className="text-green-500" />
                  Filters
                </h3>
                <button 
                  onClick={resetFilters}
                  className="text-xs font-medium text-red-500 hover:text-red-600 px-3 py-1 rounded-full border border-red-200 hover:border-red-300 transition-colors"
                >
                  Reset All
                </button>
              </div>

              {/* Search Filter */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="search"
                    placeholder={`Search in ${displayCategoryName}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600">
                    <FaSearch />
                  </button>
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-green-500">💰</span> Price Range
                </h4>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500 mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>₹0</span>
                  <span className="font-bold text-green-600">₹{priceRange[1]}</span>
                </div>
              </div>

              {/* Filter Options */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-green-500">🏷️</span> Product Types
                </h4>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.organic}
                      onChange={(e) => setSelectedFilters(prev => ({...prev, organic: e.target.checked}))}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-600">🌱 Organic Products</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.onSale}
                      onChange={(e) => setSelectedFilters(prev => ({...prev, onSale: e.target.checked}))}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-600">🔥 On Sale</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.freeShipping}
                      onChange={(e) => setSelectedFilters(prev => ({...prev, freeShipping: e.target.checked}))}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-600">🚚 Free Shipping</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.inStock}
                      onChange={(e) => setSelectedFilters(prev => ({...prev, inStock: e.target.checked}))}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-600">✅ In Stock Only</span>
                  </label>
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-green-500">📊</span> Sort By
                </h4>
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none transition-all text-sm"
                  >
                    <option value="featured">⭐ Featured</option>
                    <option value="price-low">💰 Price: Low to High</option>
                    <option value="price-high">💎 Price: High to Low</option>
                    <option value="rating">⭐ Customer Rating</option>
                    <option value="newest">🆕 Newest First</option>
                    <option value="popular">🔥 Most Popular</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                    <FaChevronDown size={12} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section - Right */}
          <div className="flex-1">
            {/* View Toggle - Mobile */}
           

            {/* Products Grid */}
            {currentProducts.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProducts.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                    >
                      <div className="relative h-48 overflow-hidden bg-gray-50">
                        {/* Product Badges */}
                        <div className="absolute top-3 left-3 z-10 space-y-2">
                          {product.organic && (
                            <span className="inline-block px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow">
                              🌱 Organic
                            </span>
                          )}
                          {product.oldPrice && (
                            <span className="inline-block px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow">
                              🔥 {Math.round((1 - product.price/product.oldPrice) * 100)}% OFF
                            </span>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <button 
                          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                          onClick={() => toggleWishlist(product.id)}
                        >
                          <FaHeart 
                            size={14} 
                            className={wishlist.includes(product.id) ? 'text-red-500' : 'text-gray-400'} 
                          />
                        </button>

                        <img
                          src={product.image || '/images/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            e.target.src = '/images/placeholder-product.jpg';
                          }}
                        />

                        {/* Hover Overlay with Quick Actions */}
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <div className="flex gap-3">
                            <button 
                              className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-gray-700 hover:bg-green-500 hover:text-white transition-all"
                              onClick={() => handleQuickView(product)}
                            >
                              <FaEye size={14} />
                            </button>
                            <button 
                              className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-gray-700 hover:bg-green-500 hover:text-white transition-all"
                              onClick={() => addToCart(product)}
                            >
                              <FaShoppingCart size={14} />
                            </button>
                            <button 
                              className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-gray-700 hover:bg-green-500 hover:text-white transition-all"
                            >
                              <FaShare size={14} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="mb-2">
                          <span className="text-xs font-semibold text-green-600">
                            {product.category || product.subcategory}
                          </span>
                          <h3 className="text-sm font-bold text-gray-800 mt-1 mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          
                          {/* Rating */}
                          <div className="flex items-center mb-3">
                            <div className="flex mr-2">
                              {renderStars(product.rating || 4.5)}
                            </div>
                            <span className="text-xs text-gray-500">
                              ({Math.floor((product.rating || 4.5) * 20)})
                            </span>
                          </div>
                        </div>

                        {/* Price Container */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <span className="font-bold text-lg text-green-600">
                                ₹{product.price}
                              </span>
                              {product.oldPrice && (
                                <span className="text-xs text-gray-400 line-through ml-2">
                                  ₹{product.oldPrice}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">{product.unit || 'per lb'}</span>
                          </div>
                          
                          {/* Product Features */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {product.freeShipping && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FaTruck className="mr-1" size={8} />
                                Free
                              </span>
                            )}
                            {product.organic && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FaLeaf className="mr-1" size={8} />
                                Organic
                              </span>
                            )}
                          </div>

                          <button 
                            onClick={() => addToCart(product)}
                            disabled={loading}
                            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                          >
                            {loading ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Adding...
                              </>
                            ) : (
                              <>
                                <FaShoppingCart className="mr-2" size={12} />
                                Add to Cart
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // List View
                <div className="space-y-4">
                  {currentProducts.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-48 h-48 flex-shrink-0">
                          <img
                            src={product.image || '/images/placeholder-product.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex flex-col h-full">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="text-xs font-semibold text-green-600">
                                  {product.category || product.subcategory}
                                </span>
                                {product.organic && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    🌱 Organic
                                  </span>
                                )}
                                {product.oldPrice && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    🔥 Sale
                                  </span>
                                )}
                              </div>
                              <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
                              <div className="flex items-center mb-2">
                                <div className="flex mr-2">
                                  {renderStars(product.rating || 4.5)}
                                </div>
                                <span className="text-xs text-gray-500">
                                  ({Math.floor((product.rating || 4.5) * 20)} reviews)
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {product.description || "Fresh, high-quality product perfect for your daily needs."}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {product.freeShipping && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                    <FaTruck className="mr-1" size={8} />
                                    Free Shipping
                                  </span>
                                )}
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                  <FaShieldAlt className="mr-1" size={8} />
                                  Quality Guaranteed
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full md:w-48 p-4 border-t md:border-t-0 md:border-l border-gray-100 flex-shrink-0">
                          <div className="flex flex-col h-full">
                            <div className="mb-4">
                              <span className="block text-xl font-bold text-green-600">
                                ₹{product.price}
                              </span>
                              {product.oldPrice && (
                                <span className="text-sm text-gray-400 line-through">
                                  ₹{product.oldPrice}
                                </span>
                              )}
                              <span className="block text-xs text-gray-500 mt-1">{product.unit || 'per lb'}</span>
                            </div>
                            <div className="mt-auto space-y-2">
                              <button 
                                onClick={() => addToCart(product)}
                                disabled={loading}
                                className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                              >
                                <FaShoppingCart className="mr-2" size={12} />
                                Add to Cart
                              </button>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleQuickView(product)}
                                  className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center"
                                >
                                  <FaEye size={12} />
                                </button>
                                <button 
                                  onClick={() => toggleWishlist(product.id)}
                                  className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center"
                                >
                                  <FaHeart 
                                    size={12} 
                                    className={wishlist.includes(product.id) ? 'text-red-500' : 'text-gray-500'} 
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <div className="mb-6 text-gray-400">
                  <FaSearch size={48} className="mx-auto" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">No products found</h4>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  We couldn't find any products matching your criteria.
                </p>
                <button 
                  onClick={resetFilters}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &lt;
                  </button>
                  
                  {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = index + 1;
                    } else if (currentPage <= 3) {
                      pageNum = index + 1;
                    } else if (currentPage > totalPages - 3) {
                      pageNum = totalPages - 4 + index;
                    } else {
                      pageNum = currentPage - 2 + index;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg border ${currentPage === pageNum ? 'border-green-500 bg-green-50 text-green-600' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &gt;
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowQuickView(false)}></div>
            </div>

            {/* Modal content */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Quick View</h3>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={() => setShowQuickView(false)}
                      >
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-1/2">
                        <img
                          src={selectedProduct.image || '/images/placeholder-product.jpg'}
                          alt={selectedProduct.name}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      </div>
                      <div className="w-full md:w-1/2">
                        <div className="mb-2">
                          <span className="text-xs font-semibold text-green-600">
                            {selectedProduct.category}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-3">{selectedProduct.name}</h4>
                        <div className="flex items-center mb-3">
                          <div className="flex mr-2">
                            {renderStars(selectedProduct.rating || 4.5)}
                          </div>
                          <span className="text-xs text-gray-500">
                            ({Math.floor((selectedProduct.rating || 4.5) * 20)} reviews)
                          </span>
                        </div>
                        <div className="mb-4">
                          <span className="font-bold text-2xl text-green-600">
                            ₹{selectedProduct.price}
                          </span>
                          {selectedProduct.oldPrice && (
                            <span className="text-sm text-gray-400 line-through ml-2">
                              ₹{selectedProduct.oldPrice}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          {selectedProduct.description || "Fresh, high-quality product perfect for your daily needs."}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {selectedProduct.organic && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              🌱 Organic
                            </span>
                          )}
                          {selectedProduct.freeShipping && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              🚚 Free Shipping
                            </span>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <button 
                            onClick={() => {
                              addToCart(selectedProduct);
                              setShowQuickView(false);
                            }}
                            className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                          >
                            <FaShoppingCart className="mr-2" />
                            Add to Cart
                          </button>
                          <button 
                            onClick={() => toggleWishlist(selectedProduct.id)}
                            className="w-12 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center"
                          >
                            <FaHeart 
                              className={wishlist.includes(selectedProduct.id) ? 'text-red-500' : 'text-gray-500'} 
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900">Adding to cart...</h3>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 z-50">
          <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center animate-fade-in-up">
            <FaCheckCircle className="mr-2" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;