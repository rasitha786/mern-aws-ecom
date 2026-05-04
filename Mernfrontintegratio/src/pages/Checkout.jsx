import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Product data from Products.jsx or Product.jsx (via state)
  const product = location.state?.product;

  const [paymentMethod, setPaymentMethod] = useState("");
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleOrder = () => {
    if (!paymentMethod) {
      alert("⚠️ Please select a payment method!");
      return;
    }
    if (!address.name || !address.phone || !address.street || !address.city || !address.pincode) {
      alert("⚠️ Please fill in all address fields!");
      return;
    }

    // ✅ Order placed successfully
    setOrderPlaced(true);
  };

  // ✅ Order Success Screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-green-600 mb-2">Order Placed!</h2>
          <p className="text-gray-500 mb-4">
            Thank you, <span className="font-semibold text-gray-700">{address.name}</span>!
            Your order has been placed via <span className="font-semibold text-blue-600">{paymentMethod}</span>.
          </p>
          {product && (
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 mb-6">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="text-left">
                <p className="font-semibold text-gray-800">{product.name}</p>
                <p className="text-green-600 font-bold">₹{product.price}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Checkout</h2>

        {/* ✅ Order Summary — shows product from Products.jsx or Product.jsx */}
        {product ? (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🛒 Order Summary</h3>
            <div className="flex items-center gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-xl border"
              />
              <div>
                <p className="text-lg font-semibold text-gray-800">{product.name}</p>
                <p className="text-2xl font-bold text-blue-600">₹{product.price}</p>
                <p className="text-sm text-green-600">✅ Free Shipping</p>
              </div>
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between text-gray-700">
              <span className="font-medium">Total</span>
              <span className="text-xl font-bold text-blue-600">₹{product.price}</span>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-center text-yellow-700">
            ⚠️ No product selected. <a href="/" className="underline text-blue-500">Go back to shop</a>
          </div>
        )}

        {/* ✅ Delivery Address */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📦 Delivery Address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={address.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={address.phone}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="street"
              placeholder="Street Address"
              value={address.street}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={address.pincode}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* ✅ Payment Methods */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">💳 Select Payment Method</h3>
          <div className="space-y-3">

            {/* Cash on Delivery */}
            <div
              onClick={() => setPaymentMethod("Cash on Delivery")}
              className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                paymentMethod === "Cash on Delivery"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-2xl">💵</span>
              <div>
                <p className="font-semibold text-gray-800">Cash on Delivery</p>
                <p className="text-sm text-gray-500">Pay when your order arrives</p>
              </div>
              {paymentMethod === "Cash on Delivery" && (
                <span className="ml-auto text-green-500 font-bold text-xl">✓</span>
              )}
            </div>

            {/* GPay */}
            <div
              onClick={() => setPaymentMethod("Google Pay")}
              className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                paymentMethod === "Google Pay"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-2xl">📲</span>
              <div>
                <p className="font-semibold text-gray-800">Google Pay</p>
                <p className="text-sm text-gray-500">Pay using GPay UPI (Demo)</p>
              </div>
              {paymentMethod === "Google Pay" && (
                <span className="ml-auto text-blue-500 font-bold text-xl">✓</span>
              )}
            </div>

            {/* PhonePe */}
            <div
              onClick={() => setPaymentMethod("PhonePe")}
              className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                paymentMethod === "PhonePe"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-2xl">📱</span>
              <div>
                <p className="font-semibold text-gray-800">PhonePe</p>
                <p className="text-sm text-gray-500">Pay using PhonePe UPI (Demo)</p>
              </div>
              {paymentMethod === "PhonePe" && (
                <span className="ml-auto text-purple-500 font-bold text-xl">✓</span>
              )}
            </div>

            {/* Net Banking */}
            <div
              onClick={() => setPaymentMethod("Net Banking")}
              className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                paymentMethod === "Net Banking"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-2xl">🏦</span>
              <div>
                <p className="font-semibold text-gray-800">Net Banking</p>
                <p className="text-sm text-gray-500">Pay via bank transfer (Demo)</p>
              </div>
              {paymentMethod === "Net Banking" && (
                <span className="ml-auto text-orange-500 font-bold text-xl">✓</span>
              )}
            </div>

          </div>
        </div>

        {/* ✅ Place Order Button */}
        <button
          onClick={handleOrder}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-lg font-bold py-4 rounded-2xl shadow-lg transition-all duration-200"
        >
          🛍️ Place Order
          {product && <span className="ml-2">— ₹{product.price}</span>}
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          🔒 Secure & Safe Checkout
        </p>
      </div>
    </div>
  );
}