import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../utils/api"; 
export default function BuyNow() {
  const { id } = useParams();
  const [product,setProduct]=useState(null);
     useEffect(()=>{
       fetch(`${API}/api/getproduct`)
       .then(res=>res.json())
       .then(allproducts=>{
         const product=allproducts.find((p)=>p._id===id);
         setProduct(product);
       })
     })
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-xl text-gray-600">Product not found</p>
    </div>
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-green-800 mb-4">Buy Now</h2>
          <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">{product.name}</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Price</p>
              <p className="text-3xl font-bold text-green-600">₹{product.price}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-semibold text-green-600 flex items-center">
                <span className="mr-2">✅</span> Order has been placed
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Thank you for your purchase! Your order has been successfully placed and will be processed shortly.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Continue Shopping
          </button>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Order Confirmed
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Secure Payment
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Fast Delivery
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}