import { Link, Route, Routes, useLocation } from "react-router-dom";
import Products from "./components/Products";
import Product from "./components/Product";
import { useEffect, useState } from "react";
import Cart from "./components/Cart";
import BuyNow from "./components/BuyNow";
import Login from "./components/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import AddProducts from "./components/AddProducts";


function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    // Close mobile menu on route change
    setIsMenuOpen(false);
  }, [location]);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const totalCartItems = cart.reduce((total, item) => {
    const quantity = item.quantity || 1;
    return total + quantity;
  }, 0);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AkIRAMART💖 
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`font-medium transition-colors ${
                  location.pathname === "/" 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className={`font-medium transition-colors ${
                  location.pathname === "/products" 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Products
              </Link>
              <Link 
                to="/addproduct" 
                className={`font-medium transition-colors ${
                  location.pathname === "/addproduct" 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Add Product
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link 
                to="/cart" 
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </Link>

              {/* User Actions */}
              <div className="relative">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {user.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="ml-2 text-gray-700 font-medium">{user}</span>
                    </div>
                    <button
                      onClick={logout}
                      className="hidden md:inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="hidden md:inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Login
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-blue-600"
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4 px-4">
                <Link 
                  to="/" 
                  className={`font-medium py-2 ${
                    location.pathname === "/" 
                      ? "text-blue-600 bg-blue-50 rounded-lg px-4" 
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/products" 
                  className={`font-medium py-2 ${
                    location.pathname === "/products" 
                      ? "text-blue-600 bg-blue-50 rounded-lg px-4" 
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <Link 
                  to="/addproduct" 
                  className={`font-medium py-2 ${
                    location.pathname === "/addproduct" 
                      ? "text-blue-600 bg-blue-50 rounded-lg px-4" 
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Add Product
                </Link>
                <Link 
                  to="/cart" 
                  className={`font-medium py-2 ${
                    location.pathname === "/cart" 
                      ? "text-blue-600 bg-blue-50 rounded-lg px-4" 
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cart ({totalCartItems})
                </Link>
                {user ? (
                  <>
                    <div className="flex items-center py-2 px-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-gray font-medium text-sm">
                          {user.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="ml-3 text-gray-700 font-medium">{user}</span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="font-medium py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="font-medium py-3 bg-gradient-to-r from-gray-900 to-gray-900 text-gray rounded-lg text-center hover:from-blue-600 hover:to-blue-700 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full overflow-x-hidden">
        <div className="w-full max-w-full">
          <Routes>
            <Route path="/" element={<Products cart={cart} setCart={setCart} />} />
            <Route path="/products" element={<Products cart={cart} setCart={setCart} />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={
              <ProtectedRoute>
                <Cart cart={cart} setCart={setCart} />
              </ProtectedRoute>
            } />
            <Route path="/addproduct" element={
              <ProtectedRoute>
                <AddProducts />
              </ProtectedRoute>
            } />
            <Route path="/buynow/:id" element={
              <ProtectedRoute>
                <BuyNow />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />

          </Routes>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <span className="ml-3 text-2xl font-bold">AkiraMart</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
               Hi Your one-stop destination for all the shopping needs. Quality products,best price fast delivery, and exceptional customer service.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.279 16.736 5.018 15.622 5 12c.018-3.629.279-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.979 8.378 19 12c-.02 3.629-.281 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="text-gray-400 hover:text-white transition-colors">
                    Shopping Cart
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-6">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-400">123 Street, Mumbai, India</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-400">+91 1800-123-4567</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-400">support@akiramart.com</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-bold mb-6">Newsletter</h3>
              <p className="text-gray-400 mb-4">Subscribe to get updates on new products and offers.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-r-lg transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} AkiraMart. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Designed with ❤️ for the MERN Stack E-commerce Project
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
