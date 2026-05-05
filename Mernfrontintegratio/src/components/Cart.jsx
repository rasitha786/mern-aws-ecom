import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../utils/api";

export default function Cart({ cart, setCart }) {
  const navigate = useNavigate();
  const [quantityMap, setQuantityMap] = useState(
    cart.reduce((acc, item) => ({ ...acc, [item._id]: item.quantity || 1 }), {})
  );
  const [placing, setPlacing] = useState(false);
  const [step, setStep] = useState("cart"); // "cart" | "address" | "payment" | "review" | "success"
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderId, setOrderId] = useState("");

  const [address, setAddress] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return { fullName: user.name || "", phone: "", street: "", city: "", state: "", pincode: "" };
  });

  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [upi, setUpi] = useState("");

  const removeItem = (id) => setCart(cart.filter(item => item._id !== id));

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setQuantityMap(prev => ({ ...prev, [id]: newQty }));
  };

  const clearCart = () => {
    if (window.confirm("Clear your cart?")) setCart([]);
  };

  const subtotal = cart.reduce((total, item) => total + item.price * (quantityMap[item._id] || 1), 0);
  const shipping = subtotal > 999 ? 0 : 49;
  const codCharge = paymentMethod === "cod" ? 40 : 0;
  const totalAmount = subtotal + shipping + codCharge;

  const formatCard = (val) => val.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  const formatExpiry = (val) => val.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").slice(0, 5);

  // ✅ Place order with all cart items
  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const token = localStorage.getItem("token");
      const items = cart.map(item => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: quantityMap[item._id] || 1,
      }));

      const res = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items, shippingAddress: address, paymentMethod: paymentMethod === "cod" ? "COD" : "Online", totalAmount }),
      });

      const data = await res.json();
      if (res.ok) {
        setOrderId(data.order?._id || data._id);
        setCart([]); // ✅ Clear cart after order
        setStep("success");
      } else {
        alert(data.error || "Failed to place order.");
      }
    } catch (err) {
      alert("Connection error. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  // ── SUCCESS PAGE ──
  if (step === "success") return (
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
        <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left text-sm text-gray-600 space-y-2">
          <p>📦 Estimated Delivery: <span className="font-medium text-gray-900">3-5 Business Days</span></p>
          <p>📍 Delivering to: <span className="font-medium text-gray-900">{address.city}, {address.state}</span></p>
          <p>💳 Payment: <span className="font-medium text-gray-900">{paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "upi" ? "UPI" : "Card"}</span></p>
          <p>💰 Total: <span className="font-bold text-blue-600">₹{totalAmount}</span></p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate("/products")} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors">Continue Shopping</button>
          <button onClick={() => navigate("/user/dashboard")} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors">My Orders</button>
        </div>
      </div>
    </div>
  );

  // ── EMPTY CART ──
  if (cart.length === 0 && step === "cart") return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Start shopping to fill it up!</p>
        <Link to="/products" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ── STEP INDICATOR (shown when not on cart step) ── */}
        {step !== "cart" && (
          <div className="flex items-center justify-center mb-8">
            {[{ n: 1, label: "Address", key: "address" }, { n: 2, label: "Payment", key: "payment" }, { n: 3, label: "Review", key: "review" }].map((s, i) => {
              const stepOrder = ["address", "payment", "review"];
              const current = stepOrder.indexOf(step);
              const sIdx = stepOrder.indexOf(s.key);
              return (
                <div key={s.n} className="flex items-center">
                  <div className={`flex items-center gap-2 ${current >= sIdx ? "text-blue-600" : "text-gray-400"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${current > sIdx ? "bg-green-500 text-white" : current === sIdx ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                      {current > sIdx ? "✓" : s.n}
                    </div>
                    <span className="font-medium text-sm hidden sm:block">{s.label}</span>
                  </div>
                  {i < 2 && <div className={`w-16 h-1 mx-2 rounded ${current > sIdx ? "bg-green-500" : "bg-gray-200"}`}></div>}
                </div>
              );
            })}
          </div>
        )}

        {/* ── CART VIEW ── */}
        {step === "cart" && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-2">You have {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-gray-50 border-b border-gray-200">
                  <div className="col-span-6 font-medium text-gray-700">Product</div>
                  <div className="col-span-2 font-medium text-gray-700">Price</div>
                  <div className="col-span-2 font-medium text-gray-700">Quantity</div>
                  <div className="col-span-2 font-medium text-gray-700">Total</div>
                </div>
                <div className="divide-y divide-gray-100">
                  {cart.map(item => (
                    <div key={item._id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                        <div className="col-span-6 flex items-center space-x-4">
                          <div className="relative">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                              {quantityMap[item._id] || 1}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-gray-500 text-sm">{item.description?.slice(0, 40)}...</p>
                          </div>
                        </div>
                        <div className="col-span-2 font-bold text-gray-900">₹{item.price}</div>
                        <div className="col-span-2">
                          <div className="flex items-center space-x-2">
                            <button onClick={() => updateQuantity(item._id, (quantityMap[item._id] || 1) - 1)} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center">−</button>
                            <span className="w-8 text-center font-medium">{quantityMap[item._id] || 1}</span>
                            <button onClick={() => updateQuantity(item._id, (quantityMap[item._id] || 1) + 1)} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center">+</button>
                          </div>
                        </div>
                        <div className="col-span-2 flex items-center justify-between">
                          <span className="text-lg font-bold text-blue-600">₹{item.price * (quantityMap[item._id] || 1)}</span>
                          <button onClick={() => removeItem(item._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">🗑️</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
                  <Link to="/products" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">← Continue Shopping</Link>
                  <button onClick={clearCart} className="px-4 py-2 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors">Clear Cart</button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({cart.length} items)</span>
                      <span className="font-medium">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? "text-green-600 font-medium" : "font-medium"}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                    </div>
                    <div className="pt-3 border-t flex justify-between font-bold text-gray-900 text-base">
                      <span>Total</span>
                      <span className="text-blue-600">₹{subtotal + shipping}</span>
                    </div>
                  </div>
                  {/* ✅ FIXED: goes to address step */}
                  <button
                    onClick={() => setStep("address")}
                    className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-lg text-center shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 mb-4"
                  >
                    Proceed to Checkout →
                  </button>
                  <div className="text-center text-sm text-gray-500">
                    <p className="mb-2">We accept</p>
                    <div className="flex justify-center space-x-2">
                      {["VISA", "MC", "UPI", "COD"].map(m => (
                        <span key={m} className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-600">{m}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t text-sm text-gray-500 flex items-center gap-2">
                    <span className="text-green-500">🔒</span> Secure checkout • 30-day returns
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 1: ADDRESS ── */}
        {step === "address" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📍 Delivery Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { key: "fullName", label: "Full Name *", placeholder: "Your full name", span: false },
                  { key: "phone", label: "Phone Number *", placeholder: "+91 9876543210", span: false },
                  { key: "street", label: "Street Address *", placeholder: "House no, Street name, Area", span: true },
                  { key: "city", label: "City *", placeholder: "Chennai", span: false },
                  { key: "state", label: "State *", placeholder: "Tamil Nadu", span: false },
                  { key: "pincode", label: "Pincode *", placeholder: "600001", span: false },
                ].map(f => (
                  <div key={f.key} className={f.span ? "md:col-span-2" : ""}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{f.label}</label>
                    <input type="text" value={address[f.key]} onChange={e => setAddress({ ...address, [f.key]: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder={f.placeholder} />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep("cart")} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 rounded-xl transition-colors">← Back</button>
                <button onClick={() => {
                  if (!address.fullName || !address.phone || !address.street || !address.city || !address.state || !address.pincode) {
                    alert("Please fill all fields!"); return;
                  }
                  setStep("payment");
                }} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors">
                  Continue to Payment →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: PAYMENT ── */}
        {step === "payment" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">💳 Payment Method</h2>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[{ id: "card", label: "💳 Card", desc: "Credit/Debit" }, { id: "upi", label: "📱 UPI", desc: "GPay/PhonePe" }, { id: "cod", label: "💵 COD", desc: "Cash on Delivery" }].map(m => (
                  <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${paymentMethod === m.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <p className="text-xl mb-1">{m.label}</p>
                    <p className="text-xs text-gray-500">{m.desc}</p>
                  </button>
                ))}
              </div>
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input type="text" value={card.number} onChange={e => setCard({ ...card, number: formatCard(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono" placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                    <input type="text" value={card.name} onChange={e => setCard({ ...card, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Name on card" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
                      <input type="text" value={card.expiry} onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="MM/YY" maxLength={5} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input type="password" value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value.slice(0, 3) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="•••" maxLength={3} />
                    </div>
                  </div>
                </div>
              )}
              {paymentMethod === "upi" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                  <input type="text" value={upi} onChange={e => setUpi(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="yourname@upi" />
                </div>
              )}
              {paymentMethod === "cod" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                  <p className="text-yellow-800 font-medium mb-1">💵 Cash on Delivery</p>
                  <p className="text-yellow-700 text-sm">Pay ₹{totalAmount} when your order arrives. Extra ₹40 COD charge applied.</p>
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep("address")} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 rounded-xl">← Back</button>
                <button onClick={() => {
                  if (paymentMethod === "card" && (!card.number || !card.name || !card.expiry || !card.cvv)) { alert("Fill all card details!"); return; }
                  if (paymentMethod === "upi" && !upi) { alert("Enter UPI ID!"); return; }
                  setStep("review");
                }} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl">Review Order →</button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: REVIEW ── */}
        {step === "review" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">✅ Review Your Order</h2>

              {/* Items */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3 max-h-60 overflow-y-auto">
                {cart.map(item => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {quantityMap[item._id] || 1}</p>
                    </div>
                    <p className="font-bold text-gray-700">₹{item.price * (quantityMap[item._id] || 1)}</p>
                  </div>
                ))}
              </div>

              {/* Address */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h3 className="font-bold text-gray-900 mb-1">📍 Delivery Address</h3>
                <p className="text-gray-700 text-sm">{address.fullName} — {address.street}, {address.city}, {address.state} - {address.pincode}</p>
                <p className="text-gray-500 text-sm">📞 {address.phone}</p>
                <button onClick={() => setStep("address")} className="text-blue-600 text-xs mt-1 hover:underline">Edit</button>
              </div>

              {/* Payment */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h3 className="font-bold text-gray-900 mb-1">💳 Payment</h3>
                <p className="text-gray-700 text-sm">{paymentMethod === "card" ? `Card ending ${card.number.replace(/\s/g,"").slice(-4)}` : paymentMethod === "upi" ? `UPI: ${upi}` : "Cash on Delivery"}</p>
                <button onClick={() => setStep("payment")} className="text-blue-600 text-xs mt-1 hover:underline">Edit</button>
              </div>

              {/* Price Breakdown */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span className={shipping === 0 ? "text-green-600 font-medium" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div>
                {paymentMethod === "cod" && <div className="flex justify-between text-gray-600"><span>COD Charges</span><span>₹40</span></div>}
                <div className="border-t pt-2 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span><span className="text-blue-600">₹{totalAmount}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("payment")} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 rounded-xl">← Back</button>
                <button onClick={handlePlaceOrder} disabled={placing}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl disabled:opacity-50 transition-colors">
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
          </div>
        )}

      </div>
    </div>
  );
}