import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API } from "../utils/api"; 

export default function Products({ setCart, cart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ Read ?category=Sports from URL
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "All";

  const categories = ["All", "Electronics", "Fashion", "Home & Living", "Sports", "Books", "Beauty"];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/getproduct`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  useEffect(() => {
    const handleProductUpdate = () => fetchProducts();
    window.addEventListener('productAdded', handleProductUpdate);
    return () => window.removeEventListener('productAdded', handleProductUpdate);
  }, []);
  
  const addToCart = (item) => {
    setCart([...cart, item]);
  };
  
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    const user = localStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;

    if (!token) {
      alert("❌ You are not logged in! Please login first.");
      return;
    }
    
    try {
      const res = await fetch(`${API}/api/deleteProduct/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.ok || res.status === 200 || res.status === 204) {
        alert("✅ Product deleted successfully");
        setProducts(products.filter(p => p._id !== id)); 
      } else {
        const data = await res.json().catch(() => ({}));
        alert(`❌ Error deleting product: ${data.message || `Server returned ${res.status}`}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(`❌ Connection error: ${error.message}`);
    }
  };

  // ✅ Filter logic
  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  const handleCategoryClick = (cat) => {
    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">

      {/* ✅ Category Filter Pills */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 border-2 ${
              selectedCategory === cat
                ? "bg-rose-500 text-white border-rose-500 shadow-lg scale-105"
                : "bg-white text-gray-600 border-gray-200 hover:border-rose-400 hover:text-rose-500"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        {selectedCategory === "All" ? "All Products" : `${selectedCategory} Products`}
      </h2>
      <p className="text-center text-gray-400 mb-8">
        {loading ? "Loading..." : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} found`}
      </p>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          <p className="text-gray-500 text-lg mt-4">Loading products...</p>
        </div>

      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-600 text-xl font-semibold mb-2">
            No products in "{selectedCategory}"
          </p>
          <p className="text-gray-400 mb-6">
            Add products with this category or try another one.
          </p>
          <button
            onClick={() => handleCategoryClick("All")}
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-full font-semibold transition-colors"
          >
            Show All Products
          </button>
        </div>

      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(p => (
            <div 
              key={p._id} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <div className="overflow-hidden h-48 bg-gray-50">
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                {/* ✅ Category badge */}
                {p.category && (
                  <span className="inline-block text-xs font-semibold bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full mb-2">
                    {p.category}
                  </span>
                )}
                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{p.name}</h3>
                <p className="text-2xl font-bold text-black mb-4">₹{p.price}</p>
                
                <div className="flex flex-wrap gap-2">
                  <Link 
                    to={`/product/${p._id}`}
                    className="flex-1 min-w-[110px] bg-gray-900 hover:bg-gray-700 text-white font-medium py-2 px-3 rounded-lg text-center text-sm transition-colors"
                  >
                    View Details
                  </Link>
                  <Link 
                    to="/checkout"
                    state={{ product: p }}
                    className="flex-1 min-w-[110px] bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 px-3 rounded-lg text-center text-sm transition-colors"
                  >
                    Buy Now
                  </Link>
                  <button 
                    onClick={() => addToCart(p)}
                    className="flex-1 min-w-[110px] bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-lg text-sm transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => deleteProduct(p._id)}
                    className="flex-1 min-w-[110px] bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-lg text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="text-center mt-10">
        <button 
          onClick={fetchProducts}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-full transition-colors font-medium"
        >
          🔄 Refresh Products
        </button>
      </div>
    </div>
  );
}