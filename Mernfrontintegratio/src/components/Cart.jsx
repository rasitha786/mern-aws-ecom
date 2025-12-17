import { useState } from "react";
import { Link } from "react-router-dom";

export default function Cart({ cart, setCart }) {
  const [quantityMap, setQuantityMap] = useState(
    cart.reduce((acc, item) => ({ ...acc, [item._id]: 1 }), {})
  );

  const removeItem = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setQuantityMap(prev => ({ ...prev, [id]: newQuantity }));
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setCart([]);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const quantity = quantityMap[item._id] || 1;
      return total + (item.price * quantity);
    }, 0);
  };

  const calculateItemTotal = (item) => {
    const quantity = quantityMap[item._id] || 1;
    return item.price * quantity;
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">You have {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Cart Items Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-gray-50 border-b border-gray-200">
                <div className="col-span-6 font-medium text-gray-700">Product</div>
                <div className="col-span-2 font-medium text-gray-700">Price</div>
                <div className="col-span-2 font-medium text-gray-700">Quantity</div>
                <div className="col-span-2 font-medium text-gray-700">Total</div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <div key={item._id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                      {/* Product Info */}
                      <div className="col-span-6 flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                          />
                          <div className="absolute -top-2 -right-2">
                            <span className="flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full">
                              {quantityMap[item._id] || 1}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                            {item.name}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                            {item.description || "Premium quality product"}
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2">
                        <div className="text-lg font-bold text-gray-900">₹{item.price}</div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item._id, (quantityMap[item._id] || 1) - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-150"
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-10 text-center font-medium text-gray-900">
                            {quantityMap[item._id] || 1}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, (quantityMap[item._id] || 1) + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-150"
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Total & Actions */}
                      <div className="col-span-2 flex items-center justify-between">
                        <div className="text-lg font-bold text-blue-600">
                          ₹{calculateItemTotal(item)}
                        </div>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="md:ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-150"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Actions */}
              <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="px-6 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 font-medium rounded-lg transition-colors duration-150"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-medium">₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-medium">₹{(calculateTotal() * 0.18).toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{(calculateTotal() * 1.18).toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Including ₹{(calculateTotal() * 0.18).toFixed(2)} in taxes</p>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Promo code"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors duration-150">
                    Apply
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-lg text-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 mb-4"
              >
                Proceed to Checkout
              </Link>

              {/* Payment Methods */}
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">We accept</p>
                <div className="flex justify-center space-x-4">
                  <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">VISA</span>
                  </div>
                  <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">MC</span>
                  </div>
                  <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">UPI</span>
                  </div>
                  <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">PP</span>
                  </div>
                </div>
              </div>

              {/* Security Info */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Secure checkout • 30-day returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}