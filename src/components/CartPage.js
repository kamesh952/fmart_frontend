// src/components/CartPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft,
  FaShoppingCart, FaCheckCircle
} from 'react-icons/fa';
import Header from '../Layout/Header';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { 
    cart, 
    loading, 
    error, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getTotalItems, 
    getTotalPrice 
  } = useCart();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
    }
  }, [isAuthenticated, navigate]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await handleRemoveItem(productId);
      return;
    }
    
    try {
      setOperationLoading(true);
      const result = await updateQuantity(productId, newQuantity);
      if (!result || !result.success) {
        alert(result?.message || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity. Please try again.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!window.confirm('Are you sure you want to remove this item from your cart?')) {
      return;
    }

    try {
      setOperationLoading(true);
      const result = await removeFromCart(productId);
      if (!result || !result.success) {
        alert(result?.message || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item. Please try again.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart? This action cannot be undone.')) {
      return;
    }

    try {
      setOperationLoading(true);
      const result = await clearCart();
      if (!result || !result.success) {
        alert(result?.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart. Please try again.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    setShowCheckoutModal(true);
  };

  const handlePlaceOrder = async () => {
    try {
      // Create order object
      const order = {
        id: `ORDER-${Date.now()}`,
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: getTotalPrice(),
        orderDate: new Date().toISOString(),
        status: 'confirmed',
        paymentMethod: 'cod',
        deliveryAddress: '123 Main Street, Chennai, Tamil Nadu, India',
        estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };

      // Save order to localStorage
      const existingOrders = JSON.parse(
        localStorage.getItem(`freshmart_orders_${user.id}`) || '[]'
      );
      existingOrders.unshift(order);
      localStorage.setItem(
        `freshmart_orders_${user.id}`, 
        JSON.stringify(existingOrders)
      );

      // Clear cart after successful order
      await clearCart();
      
      setOrderPlaced(true);
      setTimeout(() => {
        setShowCheckoutModal(false);
        setOrderPlaced(false);
        navigate('/orders');
      }, 2000);

    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleQuantityInputChange = (productId, value) => {
    const newQuantity = parseInt(value);
    if (isNaN(newQuantity) || newQuantity < 1) {
      return;
    }
    handleQuantityChange(productId, newQuantity);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-12 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading your cart...</p>
        </div>
      </>
    );
  }

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const isOperationInProgress = operationLoading || loading;

  return (
    <>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-blue-600 mb-2 flex items-center">
                <FaShoppingCart className="mr-3" />
                Shopping Cart
              </h2>
              <p className="text-gray-600">
                {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
              </p>
            </div>
            <Link 
              to="/shop"
              className="flex items-center px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition"
            >
              <FaArrowLeft className="mr-2" />
              Continue Shopping
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              {error}
            </div>
          )}

          {!cart || cart.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm text-center py-12">
              <FaShoppingBag size={64} className="text-gray-400 mx-auto mb-6" />
              <h4 className="text-xl font-bold mb-3">Your cart is empty</h4>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Add some delicious items to your cart and they will appear here.
              </p>
              <Link 
                to="/shop"
                className="no-underline inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-2/3">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium">Cart Items</h5>
                      <button 
                        onClick={handleClearCart}
                        disabled={isOperationInProgress}
                        className={`flex items-center px-4 py-2 rounded-full text-sm ${
                          isOperationInProgress 
                            ? 'bg-gray-200 text-gray-500' 
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                      >
                        {isOperationInProgress ? (
                          <>
                            <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                            Clearing...
                          </>
                        ) : (
                          'Clear Cart'
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {cart.map((item) => (
                          <tr key={item.productId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={item.image || '/images/placeholder-product.jpg'}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded mr-4"
                                  onError={(e) => {
                                    e.target.src = '/images/placeholder-product.jpg';
                                  }}
                                />
                                <div>
                                  <h6 className="text-sm font-medium text-gray-900">{item.name}</h6>
                                  <p className="text-xs text-gray-500">Fresh & Quality</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-medium text-green-600">
                                ₹{parseFloat(item.price).toFixed(2)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <button
                                  onClick={() => handleQuantityChange(
                                    item.productId, 
                                    item.quantity - 1
                                  )}
                                  disabled={isOperationInProgress || item.quantity <= 1}
                                  className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                    isOperationInProgress || item.quantity <= 1
                                      ? 'bg-gray-100 text-gray-400'
                                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                  }`}
                                >
                                  <FaMinus size={12} />
                                </button>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityInputChange(
                                    item.productId, 
                                    e.target.value
                                  )}
                                  onBlur={(e) => {
                                    if (parseInt(e.target.value) < 1) {
                                      e.target.value = 1;
                                      handleQuantityChange(item.productId, 1);
                                    }
                                  }}
                                  disabled={isOperationInProgress}
                                  className="mx-2 w-16 text-center border border-gray-300 rounded py-1"
                                  min="1"
                                />
                                <button
                                  onClick={() => handleQuantityChange(
                                    item.productId, 
                                    item.quantity + 1
                                  )}
                                  disabled={isOperationInProgress}
                                  className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                    isOperationInProgress
                                      ? 'bg-gray-100 text-gray-400'
                                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                  }`}
                                >
                                  <FaPlus size={12} />
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-medium">
                                ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleRemoveItem(item.productId)}
                                disabled={isOperationInProgress}
                                className={`p-2 rounded-full ${
                                  isOperationInProgress
                                    ? 'bg-gray-100 text-gray-400'
                                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                                }`}
                              >
                                {isOperationInProgress ? (
                                  <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <FaTrash size={14} />
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/3">
                <div className="bg-white rounded-lg shadow-sm sticky top-24">
                  <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
                    <h5 className="font-medium">Order Summary</h5>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-700">Items ({totalItems}):</span>
                      <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-700">Delivery:</span>
                      <span className="text-green-600 font-medium">FREE</span>
                    </div>
                    <div className="border-t border-gray-200 my-4"></div>
                    <div className="flex justify-between mb-6">
                      <span className="font-medium">Total:</span>
                      <span className="text-green-600 font-bold text-xl">
                        ₹{totalPrice.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="mb-6">
                      <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm">
                        🎉 FREE Delivery on orders over ₹150
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={isOperationInProgress || !cart || cart.length === 0}
                      className={`w-full py-3 px-4 rounded-full font-medium ${
                        isOperationInProgress || !cart || cart.length === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {isOperationInProgress ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        'Proceed to Checkout'
                      )}
                    </button>

                    <div className="text-center mt-4">
                      <p className="text-xs text-gray-500">
                        🔒 Secure checkout with 256-bit SSL encryption
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Checkout Modal */}
        {showCheckoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-medium">
                  {orderPlaced ? 'Order Confirmed!' : 'Checkout'}
                </h3>
                {!orderPlaced && (
                  <button 
                    onClick={() => setShowCheckoutModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="p-6 text-center">
                {orderPlaced ? (
                  <div>
                    <FaCheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                    <h4 className="text-green-600 font-bold text-xl mb-3">Thank you for your order!</h4>
                    <p className="text-gray-600 mb-4">
                      Your order has been placed successfully. You will be redirected to the orders page.
                    </p>
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : (
                  <div>
                    <h5 className="font-medium text-lg mb-4">Order Summary</h5>
                    <div className="text-left space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Items:</span>
                        <span>{totalItems}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Total Amount:</span>
                        <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Payment Method:</span>
                        <span>Cash on Delivery</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Delivery Address:</p>
                        <p className="text-gray-600 text-sm">
                          123 Main Street, Chennai, Tamil Nadu, India
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {!orderPlaced && (
                <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
                  <button 
                    onClick={() => setShowCheckoutModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handlePlaceOrder}
                    className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                  >
                    Place Order
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;