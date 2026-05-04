import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../utils/api";

const slides = [
  {
    tag: "New Arrivals 2025",
    title: "Sale 20% Off",
    subtitle: "On Everything",
    desc: "Discover the best deals on electronics, fashion, and more. Limited time offer — grab yours before it's gone!",
    btn: "Shop Now",
    bg: "from-rose-50 to-slate-100",
    accent: "text-rose-500",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
  },
  {
    tag: "Top Picks",
    title: "Latest Gadgets",
    subtitle: "Best Prices",
    desc: "From phones to headphones — premium tech at unbeatable prices. Free shipping on all orders above ₹999.",
    btn: "Explore Now",
    bg: "from-blue-50 to-indigo-100",
    accent: "text-blue-500",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80",
  },
  {
    tag: "Flash Sale",
    title: "Up to 50% Off",
    subtitle: "Today Only",
    desc: "Flash sale is live! Hurry up and grab the hottest products at the lowest prices before stock runs out.",
    btn: "Buy Now",
    bg: "from-amber-50 to-orange-100",
    accent: "text-amber-500",
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
  },
];

const categories = [
  { name: "Electronics", icon: "📱", color: "bg-blue-100 text-blue-700" },
  { name: "Fashion", icon: "👗", color: "bg-pink-100 text-pink-700" },
  { name: "Home & Living", icon: "🏠", color: "bg-green-100 text-green-700" },
  { name: "Sports", icon: "⚽", color: "bg-orange-100 text-orange-700" },
  { name: "Books", icon: "📚", color: "bg-purple-100 text-purple-700" },
  { name: "Beauty", icon: "💄", color: "bg-rose-100 text-rose-700" },
];

const features = [
  { icon: "🚚", title: "Free Delivery", desc: "On orders above ₹999" },
  { icon: "🔒", title: "Secure Payment", desc: "100% protected checkout" },
  { icon: "↩️", title: "Easy Returns", desc: "30-day hassle-free returns" },
  { icon: "🎧", title: "24/7 Support", desc: "We're always here for you" },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [products, setProducts] = useState([]);
  const [animating, setAnimating] = useState(false);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  function goToSlide(indexOrUpdater) {
    setAnimating(true);
    setTimeout(() => {
      setCurrent(typeof indexOrUpdater === "function" ? indexOrUpdater(current) : indexOrUpdater);
      setAnimating(false);
    }, 300);
  }

  // Fetch featured products
  useEffect(() => {
    fetch(`${API}/api/getproduct`)
      .then((r) => r.json())
      .then((d) => setProducts(Array.isArray(d) ? d.slice(0, 4) : []))
      .catch((err) => console.error(err));
  }, []);

  const slide = slides[current];

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ─── HERO SLIDER ─── */}
      <section className={`bg-gradient-to-r ${slide.bg} transition-all duration-500`}>
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 flex flex-col md:flex-row items-center gap-8 min-h-[480px]">

          {/* Text Side */}
          <div
            className={`flex-1 transition-all duration-300 ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
          >
            <span className={`inline-block text-sm font-semibold uppercase tracking-widest ${slide.accent} bg-white px-3 py-1 rounded-full shadow-sm mb-4`}>
              {slide.tag}
            </span>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-1">
              <span className={slide.accent}>{slide.title}</span>
            </h1>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-5">
              {slide.subtitle}
            </h2>
            <p className="text-gray-500 text-lg max-w-md mb-8 leading-relaxed">
              {slide.desc}
            </p>
            <Link
              to="/products"
              className={`inline-block bg-rose-500 hover:bg-rose-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-lg`}
            >
              {slide.btn} →
            </Link>

            {/* Dots */}
            <div className="flex gap-3 mt-10">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    i === current ? "w-8 bg-rose-500" : "w-3 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Image Side */}
          <div
            className={`flex-1 flex justify-center transition-all duration-300 ${animating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-white/40 rounded-3xl blur-xl"></div>
              <img
                src={slide.img}
                alt="hero"
                className="relative w-full max-w-sm md:max-w-md h-72 md:h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY SHOP WITH US ─── */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900">Why Shop With Us</h2>
            <div className="w-16 h-1 bg-rose-500 mx-auto mt-3 rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 hover:bg-rose-50 hover:shadow-md transition-all duration-200 group"
              >
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{f.icon}</span>
                <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900">Shop by Category</h2>
            <div className="w-16 h-1 bg-rose-500 mx-auto mt-3 rounded-full"></div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <Link
                to="/products"
                key={i}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl ${cat.color} hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer`}
              >
                <span className="text-3xl mb-2">{cat.icon}</span>
                <span className="text-sm font-semibold text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BANNER ─── */}
      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-r from-rose-500 to-rose-600 rounded-3xl overflow-hidden px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-20 w-40 h-40 bg-white/10 rounded-full translate-y-1/2"></div>
            <div className="relative z-10">
              <p className="text-white/80 font-medium mb-1 uppercase tracking-widest text-sm">Limited Time Offer</p>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-2">Get 30% Off Your First Order</h3>
              <p className="text-white/80 text-lg">Use code <span className="bg-white text-rose-500 font-black px-2 py-0.5 rounded-lg">AKIRA30</span> at checkout</p>
            </div>
            <Link
              to="/products"
              className="relative z-10 bg-white text-rose-600 font-black px-8 py-4 rounded-xl hover:bg-rose-50 transition-colors duration-200 shadow-lg text-lg whitespace-nowrap"
            >
              Claim Offer →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      {products.length > 0 && (
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-gray-900">Featured Products</h2>
                <div className="w-16 h-1 bg-rose-500 mt-3 rounded-full"></div>
              </div>
              <Link
                to="/products"
                className="text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1 transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                >
                  <div className="overflow-hidden bg-gray-50 h-52">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 truncate mb-1">{p.name}</h3>
                    <p className="text-rose-500 font-black text-xl mb-4">₹{p.price}</p>
                    <div className="flex gap-2">
                      <Link
                        to={`/product/${p._id}`}
                        className="flex-1 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold py-2 rounded-lg text-center transition-colors"
                      >
                        View
                      </Link>
                      <Link
                        to="/checkout"
                        state={{ product: p }}
                        className="flex-1 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold py-2 rounded-lg text-center transition-colors"
                      >
                        Buy Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── NEWSLETTER ─── */}
      <section className="py-14 bg-gray-900">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-white mb-3">Stay in the Loop</h2>
          <p className="text-gray-400 mb-8">Subscribe to get exclusive deals, new arrivals, and more.</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-rose-500 transition-colors"
            />
            <button className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}