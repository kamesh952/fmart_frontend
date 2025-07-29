import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBox } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import userIcon from "./user_icon.png";

const Header = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  // Category data matching GroceryHome
  const categories = [
    {
      name: "Bakery",
      slug: "bakery",
    },
    {
      name: "Dairy & Eggs",
      slug: "dairy-eggs",
    },
    {
      name: "Beverages",
      slug: "beverages",
    },
    {
      name: "Fish & Meat",
      slug: "meat-fish",
    },
    {
      name: "Fruits & Vegetables",
      slug: "fruits-vegetables",
    },
    {
      name: "Snacks",
      slug: "snacks",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemsCount = getTotalItems();

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setSearchTerm('');
      setSuggestions([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sample suggestions - replace with your actual data
  useEffect(() => {
    if (searchTerm.length > 2) {
      // This would typically be an API call in a real app
      const mockSuggestions = [
        'Organic Apples',
        'Fresh Vegetables',
        'Dairy Products',
        'Bakery Items'
      ].filter(item => 
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(mockSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      {/* Search Overlay - appears when search is open */}
      <div
        ref={searchRef}
        className={`flex items-center justify-center w-full transition-all duration-300 ${
          searchOpen ? "absolute top-0 left-0 bg-white w-full h-32 z-50 shadow-md" : "hidden"
        }`}
      >
        {searchOpen && (
          <form
            onSubmit={handleSearch}
            className="relative flex flex-col items-center justify-start w-full pt-2"
          >
            <div className="relative w-2/3">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-100 px-4 py-3 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700 border border-gray-200"
                autoFocus
              />

              {/* Search Icon */}
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                <HiMagnifyingGlass className="h-6 w-6" />
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleSearchToggle}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black p-1.5 rounded-full transition duration-300"
              >
                <HiMiniXMark className="h-5 w-5" />
              </button>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <ul className="mt-2 bg-white shadow rounded w-2/3 max-h-40 overflow-y-auto text-left text-gray-700 text-sm border">
                {suggestions.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setSearchTerm(item);
                      navigate(`/shop?search=${encodeURIComponent(item.trim())}`);
                      setSuggestions([]);
                      setSearchOpen(false);
                    }}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </form>
        )}
      </div>

      {/* Main Header Content */}
      <div className={`container mx-auto px-4 ${searchOpen ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-green-600 no-underline">
            FreshMart
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/shop" className="text-gray-700 hover:text-green-600 font-medium no-underline">
              Shop All
            </Link>
            
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="text-gray-700 hover:text-green-600 font-medium no-underline"
              >
                {category.name}
              </Link>
            ))}
            
            <Link to="/offers" className="text-red-500 hover:text-red-600 font-medium no-underline">
              🔥 Offers
            </Link>
          </nav>

          {/* Right Side Items */}
          <div className="flex items-center space-x-4">
            {/* Search Icon - Desktop */}
            <button 
              onClick={handleSearchToggle}
              className="hidden md:flex p-1 text-gray-600 hover:text-green-600 transition-colors"
            >
              <HiMagnifyingGlass size={20} />
            </button>

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-1 no-underline">
              <FaShoppingCart size={20} className="text-gray-700 hover:text-green-600" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-1 focus:outline-none no-underline"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <img
                      src={userIcon}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Link 
                      to="/orders" 
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 no-underline"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FaBox className="mr-3" />
                      My Orders
                    </Link>
                    <Link 
                      to="/cart" 
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 no-underline"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FaShoppingCart className="mr-3" />
                      My Cart
                      {cartItemsCount > 0 && (
                        <span className="ml-auto bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
                          {cartItemsCount}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 no-underline"
                    >
                      <FaSignOutAlt className="mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-gray-700 hover:text-green-600 font-medium no-underline"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium no-underline"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 focus:outline-none no-underline"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-2 mt-4 text-left">
              <Link 
                to="/" 
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop All
              </Link>
              
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              
              <Link 
                to="/offers" 
                className="px-4 py-2 text-red-500 hover:bg-gray-100 rounded no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                🔥 Offers
              </Link>
            </nav>

            {/* Mobile Search Button */}
            <button 
              onClick={handleSearchToggle}
              className="flex items-center px-4 py-2 mt-4 text-gray-700 hover:bg-gray-100 rounded no-underline w-full"
            >
              <HiMagnifyingGlass className="mr-2" />
              Search products...
            </button>

            {/* Mobile Auth Buttons */}
            {!user && (
              <div className="flex space-x-2 mt-4 px-4">
                <Link 
                  to="/login" 
                  className="flex-1 text-center py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="flex-1 text-center py-2 bg-green-600 text-white rounded-md hover:bg-green-700 no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;