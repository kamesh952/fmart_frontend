// src/components/AboutPage.js
import React, { useState } from 'react';
import { FaLeaf, FaTruck, FaCheckCircle, FaHeadset } from 'react-icons/fa';
import Header from '../Layout/Header';

const AboutPage = () => {
  // Temporary state just for Header props
  const [cartItems, setCartItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Header cartItems={cartItems} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="container mx-auto px-4 py-12 max-w-7xl font-outfit">
        <h1 className="text-3xl font-bold mb-8">About FreshMart</h1>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="mb-4 text-gray-700">
              FreshMart was founded in 2015 with a simple mission: to make fresh, 
              high-quality groceries accessible to everyone. What started as a small 
              local delivery service has grown into a trusted online grocery platform 
              serving thousands of happy customers.
            </p>
            <p className="text-gray-700">
              We partner directly with farmers and producers to bring you the freshest 
              products at competitive prices, all delivered to your doorstep with care.
            </p>
          </div>
          <div className="md:w-1/2">
            <img 
              src="../images/about-us.jpg" 
              alt="FreshMart Team" 
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-8">Why Choose Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Fresh Products Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 text-center h-full flex flex-col items-center">
            <div className="bg-green-50 p-4 rounded-full mb-4">
              <FaLeaf size={30} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fresh Products</h3>
            <p className="text-gray-600">
              Direct from farms to your table in the shortest time possible
            </p>
          </div>

          {/* Fast Delivery Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 text-center h-full flex flex-col items-center">
            <div className="bg-green-50 p-4 rounded-full mb-4">
              <FaTruck size={30} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              Get your groceries in as little as 2 hours with our express service
            </p>
          </div>

          {/* Quality Guarantee Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 text-center h-full flex flex-col items-center">
            <div className="bg-green-50 p-4 rounded-full mb-4">
              <FaCheckCircle size={30} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
            <p className="text-gray-600">
              We inspect every product to ensure it meets our high standards
            </p>
          </div>

          {/* 24/7 Support Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 text-center h-full flex flex-col items-center">
            <div className="bg-green-50 p-4 rounded-full mb-4">
              <FaHeadset size={30} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600">
              Our customer service team is always ready to help you
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;