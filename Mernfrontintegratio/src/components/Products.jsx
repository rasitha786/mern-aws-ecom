import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { API } from "../utils/api"; 

export default function Products({setCart,cart}) {
  const [products,setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/api/getproduct`)
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchProducts()
  }, [])
  
  // Listen for product updates
  useEffect(() => {
    const handleProductUpdate = () => {
      fetchProducts()
    }
    
    window.addEventListener('productAdded', handleProductUpdate)
    return () => window.removeEventListener('productAdded', handleProductUpdate)
  }, [])
  
  const addToCart = (item) => {
    setCart([...cart, item]);
  };
  
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;
    
    const res = await fetch(`https://mern-aws-ecom.vercel.app/api/deleteProduct/${id}`, {
      method: "DELETE",
    });
    
    if (res.status === 204) {
      alert("Product deleted successfully");
      setProducts(products.filter(p => p._id !== id)); 
    } else {
      alert("Error deleting product");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">All Products</h2>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 text-lg mt-4">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found.</p>
          <button 
            onClick={fetchProducts}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <div 
              key={p._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4">
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                  {p.name}
                </h3>
                <p className="text-2xl font-bold text-black mb-4">₹{p.price}</p>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <Link 
                    to={`/product/${p._id}`}
                    className="flex-1 min-w-[120px] bg-gray-900 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md text-center transition-colors duration-200"
                  >
                    View Details
                  </Link>
                  
                  <button 
                    onClick={() => addToCart(p)}
                    className="flex-1 min-w-[120px] bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    Add to Cart
                  </button>
                  
                  <button 
                    onClick={() => deleteProduct(p._id)}
                    className="flex-1 min-w-[120px] bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="text-center mt-8">
        <button 
          onClick={fetchProducts}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          🔄 Refresh Products
        </button>
      </div>
    </div>
  )
}
