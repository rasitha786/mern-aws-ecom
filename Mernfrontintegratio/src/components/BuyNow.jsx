import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../utils/api";

export default function BuyNow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1=address, 2=payment, 3=review, 4=success
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [address, setAddress] = useState({
    fullName: "", phone: "", street: "", city: "", state: "", pincode: ""
  });

  const [card, setCard] = useState({
    number: "", name: "", expiry: "", cvv: ""
  });

  const [upi, setUpi] = useState("");

  useEffect(() => {
    fetch(`${API}/api/getproduct`)
      .then(res => res.json())
      .then(allProducts => {
        const found = allProducts.find(p => p._id === id);
        setProduct(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.name) setAddress(prev => ({ ...prev, fullName: user.name }));
  }, []);

  const shippingCost = product?.price > 999 ? 0 : 49;
  const codCharge = paymentMethod === "cod" ? 40 : 0;
  const totalAmount = product ? product.price + shippingCost + codCharge : 0;

  // ✅ Real order save to backend
  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const token = localStorage.getItem("token");

      const orderData = {
        items: [{
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: 1,
        }],
        shippingAddress: address,
        paymentMethod: paymentMethod === "cod" ? "COD" : "Online",
        totalAmount,
      };

      const res = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        setOrderId(data._id);
        setStep(4); // ✅ Go to success
      } else {
        alert(data.error || "Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Order error:", err);
      alert("Connection error. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const formatCard = (val) =>
    val.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);

  const formatExpiry = (val) =>
    val.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").slice(0, 5);

  // ─── Loading ───
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading product...</p>
      </div>
    </div>
  );

  // ─── Not Found ───
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-5xl mb-4">😕</p>
        <p className="text-xl text-gray-600 mb-4">Product not found</p>
        <button onClick={() => navigate("/products")} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
          Back to Products
        </button>
      </div>
    </div>
  );

  // ─── Step 4: Success ───
  if (step === 4) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Order Placed! 🎉</h2>
        <p className="text-gray-500 mb-2">Thank you for your purchase!</p>
        {orderId && <p className="text-xs text-gray-400 mb-6">Order ID: #{orderId}</p>}

        <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left">
          <div className="flex items-center gap-4 mb-4">
            <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
            <div>
              <p className="font-bold text-gray-900">{product.name}</p>
              <p className="text-green-600 font-bold text-lg">₹{product.price}</p>
            </div>
          </div>
          <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
            <p>📦 Estimated Delivery: <span className="font-medium text-gray-900">3-5 Business Days</span></p>
            <p>📍 Delivering to: <span className="font-medium text-gray-900">{address.city}, {address.state}</span></p>
            <p>💳 Payment: <span className="font-medium text-gray-900 capitalize">
              {paymentMethod === "card" ? "Credit/Debit Card" : paymentMethod === "upi" ? "UPI" : "Cash on Delivery"}
            </span></p>
            <p>💰 Total Paid: <span className="font-medium text-gray-900">₹{totalAmount}</span></p>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => navigate("/products")} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors">
            Continue Shopping
          </button>
          <button onClick={() => navigate("/user/dashboard")} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors">
            My Orders
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ── Progress Steps (now 3 visible steps) ── */}
        <div className="flex items-center justify-center mb-8">
          {[
            { n: 1, label: "Delivery" },
            { n: 2, label: "Payment" },
            { n: 3, label: "Review" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center">
              <div className={`flex items-center gap-2 ${step >= s.n ? "text-blue-600" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${step > s.n ? "bg-green-500 text-white" : step === s.n ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                  {step > s.n ? "✓" : s.n}
                </div>
                <span className="font-medium text-sm hidden sm:block">{s.label}</span>
              </div>
              {i < 2 && <div className={`w-16 h-1 mx-2 rounded ${step > s.n ? "bg-green-500" : "bg-gray-200"}`}></div>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main Form ── */}
          <div className="lg:col-span-2">

            {/* ── STEP 1: Delivery Address ── */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📍 Delivery Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input type="text" value={address.fullName}
                      onChange={e => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input type="tel" value={address.phone}
                      onChange={e => setAddress({ ...address, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="+91 9876543210" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                    <input type="text" value={address.street}
                      onChange={e => setAddress({ ...address, street: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="House no, Street name, Area" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input type="text" value={address.city}
                      onChange={e => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Chennai" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input type="text" value={address.state}
                      onChange={e => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Tamil Nadu" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                    <input type="text" value={address.pincode}
                      onChange={e => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="600001" />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!address.fullName || !address.phone || !address.street || !address.city || !address.state || !address.pincode) {
                      alert("Please fill all required fields!"); return;
                    }
                    setStep(2);
                  }}
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors text-lg"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* ── STEP 2: Payment ── */}
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">💳 Payment Method</h2>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { id: "card", label: "💳 Card", desc: "Credit/Debit" },
                    { id: "upi", label: "📱 UPI", desc: "GPay/PhonePe" },
                    { id: "cod", label: "💵 COD", desc: "Cash on Delivery" },
                  ].map(m => (
                    <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${paymentMethod === m.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <p className="text-xl mb-1">{m.label}</p>
                      <p className="text-xs text-gray-500">{m.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Card */}
                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                      <input type="text" value={card.number}
                        onChange={e => setCard({ ...card, number: formatCard(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                        placeholder="1234 5678 9012 3456" maxLength={19} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                      <input type="text" value={card.name}
                        onChange={e => setCard({ ...card, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Name on card" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <input type="text" value={card.expiry}
                          onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="MM/YY" maxLength={5} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input type="password" value={card.cvv}
                          onChange={e => setCard({ ...card, cvv: e.target.value.slice(0, 3) })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="•••" maxLength={3} />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI */}
                {paymentMethod === "upi" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                    <input type="text" value={upi} onChange={e => setUpi(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="yourname@upi" />
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {["GPay", "PhonePe", "Paytm"].map(app => (
                        <div key={app} className="border border-gray-200 rounded-xl p-3 text-center hover:border-blue-300 cursor-pointer transition-colors">
                          <p className="text-sm font-medium text-gray-700">{app}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* COD */}
                {paymentMethod === "cod" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                    <p className="text-yellow-800 font-medium mb-2">💵 Cash on Delivery</p>
                    <p className="text-yellow-700 text-sm">Pay ₹{totalAmount} when your order arrives. Extra ₹40 COD charge applied.</p>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 rounded-xl transition-colors">
                    ← Back
                  </button>
                  <button
                    onClick={() => {
                      if (paymentMethod === "card" && (!card.number || !card.name || !card.expiry || !card.cvv)) {
                        alert("Please fill all card details!"); return;
                      }
                      if (paymentMethod === "upi" && !upi) {
                        alert("Please enter UPI ID!"); return;
                      }
                      setStep(3); // ✅ Goes to REVIEW now, not success
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors"
                  >
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Review & Confirm ── */}
            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">✅ Review Your Order</h2>

                {/* Product */}
                <div className="bg-gray-50 rounded-xl p-5 mb-4 flex gap-4 items-center">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div>
                    <p className="font-bold text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                    <p className="text-blue-600 font-bold">₹{product.price}</p>
                  </div>
                </div>

                {/* Address Summary */}
                <div className="bg-gray-50 rounded-xl p-5 mb-4">
                  <h3 className="font-bold text-gray-900 mb-2">📍 Delivery Address</h3>
                  <p className="text-gray-700">{address.fullName}</p>
                  <p className="text-gray-600">{address.street}, {address.city}</p>
                  <p className="text-gray-600">{address.state} — {address.pincode}</p>
                  <p className="text-gray-600">📞 {address.phone}</p>
                  <button onClick={() => setStep(1)} className="mt-2 text-blue-600 text-sm hover:underline">Edit</button>
                </div>

                {/* Payment Summary */}
                <div className="bg-gray-50 rounded-xl p-5 mb-6">
                  <h3 className="font-bold text-gray-900 mb-2">💳 Payment Method</h3>
                  <p className="text-gray-700 capitalize">
                    {paymentMethod === "card" ? `Card ending in ${card.number.replace(/\s/g, "").slice(-4)}` :
                     paymentMethod === "upi" ? `UPI: ${upi}` : "Cash on Delivery"}
                  </p>
                  <button onClick={() => setStep(2)} className="mt-2 text-blue-600 text-sm hover:underline">Edit</button>
                </div>

                {/* Price Breakdown */}
                <div className="bg-blue-50 rounded-xl p-5 mb-6 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span><span>₹{product.price}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                      {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                    </span>
                  </div>
                  {paymentMethod === "cod" && (
                    <div className="flex justify-between text-gray-600">
                      <span>COD Charges</span><span>₹40</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-bold text-gray-900 text-base">
                    <span>Total</span>
                    <span className="text-blue-600">₹{totalAmount}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 rounded-xl transition-colors">
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {placing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Placing Order...
                      </span>
                    ) : "🎉 Place Order"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Order Summary Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="flex gap-3 mb-4">
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                  <p className="font-bold text-blue-600">₹{product.price}</p>
                </div>
              </div>
              <div className="border-t pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span><span>₹{product.price}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                    {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                  </span>
                </div>
                {paymentMethod === "cod" && (
                  <div className="flex justify-between text-gray-600">
                    <span>COD Charges</span><span>₹40</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span className="text-blue-600">₹{totalAmount}</span>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-xs text-gray-500">
                <p>🔒 100% Secure Payments</p>
                <p>↩️ Easy 30-day Returns</p>
                <p>🚚 Fast Delivery</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}