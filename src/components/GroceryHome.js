// src/components/GroceryHome.js
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaStar,
  FaHeart,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaTruck,
  FaLeaf,
  FaCheckCircle,
  FaHeadset,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcApplePay,
  FaArrowRight,
  FaFire,
  FaClock,
  FaShieldAlt,
} from "react-icons/fa";
import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from "react-router-dom";
import { products, deals } from "../data/products";
import placeholder from "../assets/images/placeholder-category.jpg";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Hero from "./Hero";

// Import category images
import bakery from "../assets/images/categories/bakery.jpg";
import dairyEgg from "../assets/images/categories/dairy_egg.webp";
import beverages from "../assets/images/categories/beverages.png";
import fishMeat from "../assets/images/categories/fish-meat.jpg";
import fruitsVeggies from "../assets/images/categories/fruite_vege.png";
import snacks from "../assets/images/categories/snacks.jpg";

const parentCategories = [
  {
    name: "Bakery",
    slug: "bakery",
    image: bakery,
    subcategories: [],
  },
  {
    name: "Dairy & Eggs",
    slug: "dairy-eggs",
    image: dairyEgg,
    subcategories: [],
  },
  {
    name: "Beverages",
    slug: "beverages",
    image: beverages,
    subcategories: [],
  },
  {
    name: "Fish & Meat",
    slug: "meat-fish",
    image: fishMeat,
    subcategories: [],
  },
  {
    name: "Fruits & Vegetables",
    slug: "fruits-vegetables",
    image: fruitsVeggies,
    subcategories: [],
  },
  {
    name: "Snacks",
    slug: "snacks",
    image: snacks,
    subcategories: [],
  },
];

const GroceryHome = () => {
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();
  const { addToCart, getTotalItems } = useCart();

  const scrollContainerRef = useRef();

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/" } } });
      return;
    }

    try {
      const result = await addToCart(product, 1);
      if (result.success) {
        toast.success(`${product.name} added to cart!`, {
          icon: '🛒',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      } else {
        console.error("Failed to add to cart:", result.message);
        toast.error(result.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  const toggleWishlist = (productId, productName) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        toast(`Removed from wishlist!`, {
          icon: '💔',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        return prev.filter((id) => id !== productId);
      } else {
        toast.success(`${productName} added to wishlist!`, {
          icon: '❤️',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        return [...prev, productId];
      }
    });
  };

  // Changed from 6 to 8 featured products
  const featuredProducts = products.slice(0, 8);
  const filteredProducts = featuredProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartItemsCount = getTotalItems();

  return (
    <div className="bg-gray-50 no-underline">
      {/* Toast notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      
    
      <Hero />

      {/* Categories Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <section className="py-10 px-4">
            {/* Title Section */}
            <div
              className="mx-auto text-center "
              style={{ maxWidth: "1540px" }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                🛒 Shop by Categories
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover fresh products across all categories
              </p>
            </div>

            {/* Scrollable Grid */}
            <div className="mx-auto px-2" style={{ maxWidth: "1540px" }}>
              {/* Navigation Arrows */}
              <div className="flex justify-end mb-3 space-x-2">
                <button
                  onClick={scrollLeft}
                  className="p-2 rounded-xl border-2 bg-white text-black hover:bg-gray-100 transition"
                  aria-label="Scroll left"
                >
                  <FiChevronLeft className="text-lg" />
                </button>
                <button
                  onClick={scrollRight}
                  className="p-2 rounded-xl border-2 bg-white text-black hover:bg-gray-100 transition"
                  aria-label="Scroll right"
                >
                  <FiChevronRight className="text-lg" />
                </button>
              </div>

              {/* Scrollable Container */}
              <div
                ref={scrollContainerRef}
                className="overflow-x-auto flex space-x-6 scroll-smooth snap-x snap-mandatory pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {parentCategories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/category/${category.slug}`}
                    className="block flex-shrink-0"
                  >
                    <div className="w-52 h-64 bg-white rounded-xl shadow group relative snap-start overflow-hidden transform hover:scale-105 transition duration-300">
                      {/* Category Image */}
                      <img
                        src={category.image || placeholder}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = placeholder;
                        }}
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                      {/* Category Info */}
                      <div className="absolute bottom-0 left-0 right-0 text-white">
                        <h3 className="font-bold text-base group-hover:text-yellow-300 transition">
                          {category.name}
                        </h3>
                        <p className="text-sm text-emerald-300">
                          Fresh & Quality ✨
                        </p>
                      </div>

                      {/* Border on Hover */}
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-xl transition duration-300"></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <div className="text-center ">
            <Link
              to="/shop"
              className="inline-flex no-underline items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Explore All Categories
              <FaArrowRight className="ml-2 -mr-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products - Now showing 8 products */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                ⭐ Featured Products
              </h2>
              <p className="text-gray-600">
                Handpicked fresh items just for you
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center no-underline px-4 py-2 border border-transparent text-base font-medium rounded-full text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all"
            >
              View All
              <FaArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-6"
            style={{ maxWidth: "1540px", margin: "0 auto" }}
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={() => toggleWishlist(product.id, product.name)}
                      className="bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-all"
                      aria-label={
                        wishlist.includes(product.id)
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      <FaHeart
                        className={`${
                          wishlist.includes(product.id)
                            ? "text-rose-500"
                            : "text-gray-400"
                        } transition-colors`}
                      />
                    </button>
                  </div>
                  {product.oldPrice && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                        {Math.round(
                          (1 - product.price / product.oldPrice) * 100
                        )}
                        % OFF
                      </span>
                    </div>
                  )}
                  <div className="overflow-hidden max-h-[180px]">
                    <img
                      src={product.image || "/images/placeholder-product.jpg"}
                      alt={product.name}
                      className="w-full h-[180px] object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = "/images/placeholder-product.jpg";
                      }}
                    />
                  </div>
                </div>
                <div className="p-3">
                  <span className="text-emerald-600 text-xs font-medium mb-1 block">
                    {product.category}
                  </span>
                  <h3 className="text-gray-900 font-semibold text-sm mb-1 truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <div className="flex text-amber-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`${
                            i < Math.floor(product.rating)
                              ? "text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-500 text-xs ml-1">
                      ({Math.floor(product.rating * 20)})
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-bold text-emerald-600">
                        ₹{product.price}
                      </span>
                      {product.oldPrice && (
                        <span className="text-gray-500 text-xs line-through ml-2">
                          ₹{product.oldPrice}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!isAuthenticated}
                      className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                        isAuthenticated
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      } transition-colors duration-300`}
                    >
                      <FaShoppingCart className="mr-1" />
                      {isAuthenticated ? "Add" : "Login"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deal of the Day */}
      <section className="py-16 bg-gradient-to-r from-emerald-500 to-teal-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full mb-4 animate-pulse">
              <FaFire className="mr-2" />
              <span>
                Deal Ends in: {timeLeft.hours.toString().padStart(2, "0")}:
                {timeLeft.minutes.toString().padStart(2, "0")}:
                {timeLeft.seconds.toString().padStart(2, "0")}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              🔥 Deal of the Day
            </h2>
            <p className="text-emerald-100 max-w-2xl mx-auto">
              Limited time offers you can't miss!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:-translate-y-1"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5 relative">
                    <img
                      src={deal.image || "/images/placeholder-product.jpg"}
                      alt={deal.name}
                      className="w-full h-64 md:h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/images/placeholder-product.jpg";
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-lg font-bold bg-rose-100 text-rose-800">
                        {deal.discount}
                      </span>
                    </div>
                  </div>
                  <div className="md:w-3/5 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {deal.name}
                    </h3>
                    <div className="flex items-center mb-4">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`${
                              i < Math.floor(deal.rating)
                                ? "text-amber-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-500 text-sm ml-2">
                        ({deal.rating})
                      </span>
                    </div>
                    <div className="mt-auto">
                      <div className="flex items-baseline mb-4">
                        <span className="text-3xl font-bold text-emerald-600">
                          ₹{deal.price}
                        </span>
                        {deal.oldPrice && (
                          <span className="text-gray-500 text-lg line-through ml-3">
                            ₹{deal.oldPrice}
                          </span>
                        )}
                      </div>
                      <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-amber-400 to-orange-500 h-2.5 rounded-full animate-pulse"
                            style={{ width: "65%" }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                          <span>⚡ Only 12 left in stock!</span>
                          <span className="font-bold text-emerald-600">
                            65% claimed
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddToCart(deal)}
                        disabled={!isAuthenticated}
                        className={`w-full flex items-center justify-center px-6 py-3 rounded-full font-bold text-white transition-all duration-300 ${
                          isAuthenticated
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl animate-pulse"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <FaShoppingCart className="mr-3" />
                        {isAuthenticated ? "Grab Deal Now!" : "Login to Buy"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Why Choose FreshMart
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We bring the best grocery experience right to your doorstep
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaTruck className="text-emerald-500" size={40} />,
                title: "Fast Delivery",
                desc: "Get your order delivered within 2 hours",
              },
              {
                icon: <FaLeaf className="text-emerald-500" size={40} />,
                title: "Fresh Products",
                desc: "Direct from farms to your kitchen",
              },
              {
                icon: <FaShieldAlt className="text-emerald-500" size={40} />,
                title: "Secure Payment",
                desc: "100% secure payment options",
              },
              {
                icon: <FaHeadset className="text-emerald-500" size={40} />,
                title: "24/7 Support",
                desc: "Dedicated customer support team",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 text-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-emerald-100 rounded-full p-4">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Get Exclusive Deals
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for special offers and updates
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
    </div>
  );
};

export default GroceryHome;