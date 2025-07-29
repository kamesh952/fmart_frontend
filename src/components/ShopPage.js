import React, { useState } from 'react';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import Header from '../Layout/Header';
import { products } from '../data/products';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ShopPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const result = await addToCart(product);
    if (result.success) {
      console.log('Added to cart successfully');
    } else {
      alert(result.message || 'Failed to add to cart');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-7xl font-outfit">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">All Products</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image || '/images/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-product.jpg';
                  }}
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                
                <div className="flex items-center mb-3">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        size={14} 
                        className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'} 
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({product.rating})</span>
                </div>
                
                <div className="mt-auto flex justify-between items-center">
                  <div>
                    <span className="font-bold text-green-600">₹{product.price}</span>
                    {product.oldPrice && (
                      <span className="line-through text-gray-400 text-sm ml-2">
                        ₹{product.oldPrice}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors"
                  >
                    <FaShoppingCart className="mr-1.5" size={12} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ShopPage;