// src/components/OffersPage.js
import React, { useState } from 'react';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { deals } from '../data/products';

const OffersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Placeholder function for adding to cart
  const addToCart = () => {
    console.log('Added to cart');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Search Header */}
      

      {/* Offers Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map(deal => (
            <div 
              key={deal.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Product Image */}
              <div className="relative">
                <img 
                  src={deal.image} 
                  alt={deal.name}
                  className="w-full h-48 object-cover"
                />
                {/* Discount Badge */}
                <div className="absolute top-3 right-3 bg-red-500 text-white font-bold text-sm px-3 py-1 rounded-full shadow-md">
                  {deal.discount}
                </div>
              </div>
              
              {/* Product Info */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{deal.name}</h3>
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                    <FiStar className="text-yellow-400 mr-1" />
                    <span className="text-yellow-700 font-medium">{deal.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm">{deal.description}</p>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-lg text-green-600">₹{deal.price}</span>
                    {deal.oldPrice && (
                      <span className="text-gray-400 text-sm line-through ml-2">
                        ₹{deal.oldPrice}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={addToCart}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full flex items-center transition-colors duration-300"
                  >
                    <FiShoppingCart className="mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {deals.length === 0 && (
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No Offers Available</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Currently there are no special offers available. Please check back later for exciting deals!
          </p>
        </div>
      )}
    </div>
  );
};

export default OffersPage;