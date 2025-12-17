import React, { useEffect, useState } from 'react'
import { API } from "../utils/api"; 
import { Link, useParams } from 'react-router-dom';

export default function Product() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      fetch(`${API}/api/getproduct`)
        .then(res => res.json())
        .then(allproducts => {
          const product = allproducts.find((p) => p._id === id);
          setProduct(product);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching product:", error);
          setLoading(false);
        });
    }, [id]); // Added dependency to prevent infinite re-fetching

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!product) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <Link 
              to="/" 
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Browse Products
            </Link>
          </div>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className="text-blue-500 hover:text-blue-600">
                Products
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-600 truncate">{product.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-10">
            {/* Product Image */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-md aspect-square overflow-hidden rounded-xl bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              
              {/* Image Gallery (if available) */}
              <div className="flex space-x-3 mt-6">
                <div className="w-20 h-20 rounded-lg border-2 border-blue-500 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Add more thumbnail images here if you have them */}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center mb-6">
                  <span className="text-4xl font-bold text-blue-600">
                    ₹{product.price}
                  </span>
                  <span className="ml-4 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    Free Shipping
                  </span>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Additional Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Product Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Product ID</p>
                      <p className="text-gray-700 font-medium">{product._id?.slice(-8)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="text-gray-700 font-medium">{product.category || "General"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">In Stock</p>
                      <p className="text-green-600 font-medium">Available</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Warranty</p>
                      <p className="text-gray-700 font-medium">1 Year</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Link 
                  to={`/buynow/${product._id}`}
                  className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-semibold py-4 px-6 rounded-xl text-center transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  Buy Now
                </Link>
                
                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                    Add to Wishlist
                  </button>
                  <button className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                    Add to Cart
                  </button>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center">
                    <span className="inline-flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      30-Day Return Policy • Secure Payment
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* You can add related products here */}
            <div className="text-center py-8">
              <p className="text-gray-500">More products coming soon!</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link 
            to="/"
            className="inline-flex items-center text-blue-500 hover:text-blue-600 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  )
}