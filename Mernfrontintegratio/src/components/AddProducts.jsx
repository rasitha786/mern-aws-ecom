import React, { useState } from 'react'
import { API } from "../utils/api"; 

export default function AddProducts() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState("")
  const [category, setCategory] = useState("electronics")
  const [stock, setStock] = useState("")
  const [brand, setBrand] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    
    if (!name.trim()) newErrors.name = "Product name is required"
    if (!description.trim()) newErrors.description = "Description is required"
    if (!price || parseFloat(price) <= 0) newErrors.price = "Valid price is required"
    if (!image.trim()) newErrors.image = "Image URL is required"
    if (!stock || parseInt(stock) < 0) newErrors.stock = "Valid stock quantity is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setSuccess(false)
    
    const productData = {
      name,
      description,
      price: parseFloat(price),
      image,
      category,
      stock: parseInt(stock),
      brand: brand || "Generic"
    }
    
    console.log("Sending product data:", productData)
    console.log("API URL:", `${API}/api/postProduct`)
    
    try {
      const res = await fetch(`${API}/api/postProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(productData)
      })
      
      console.log("Response status:", res.status)
      console.log("Response ok:", res.ok)
      
      let data
      try {
        data = await res.json()
        console.log("Response data:", data)
      } catch (jsonError) {
        console.log("Failed to parse JSON response")
        data = { message: "Invalid response format" }
      }
      
      if (res.ok || res.status === 201) {
        setSuccess(true)
        alert("✅ Product added successfully!")
        
        // Trigger product list refresh
        window.dispatchEvent(new Event('productAdded'))
        
        // Reset form
        setName("")
        setDescription("")
        setPrice("")
        setImage("")
        setCategory("electronics")
        setStock("")
        setBrand("")
        setErrors({})
        
        setTimeout(() => setSuccess(false), 5000)
      } else {
        console.error("Server error response:", data)
        alert(`❌ Failed to add product: ${data.message || `Server returned ${res.status}`}`)
      }
    } catch (error) {
      console.error("Network/Connection error:", error)
      alert(`❌ Connection error: ${error.message}. Make sure your backend server is running on http://localhost:5000`)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    "electronics",
    "clothing",
    "home",
    "books",
    "beauty",
    "sports",
    "toys",
    "food",
    "other"
  ]

  const resetForm = () => {
    setName("")
    setDescription("")
    setPrice("")
    setImage("")
    setCategory("electronics")
    setStock("")
    setBrand("")
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Add New Product
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Fill in the details below to add a new product to your store. All fields are required unless marked optional.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-green-800">Product Added Successfully!</h3>
                <p className="text-green-700">Your product has been added to the store inventory.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter product name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-700 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="4"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Describe your product in detail"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-700">{errors.description}</p>
                    )}
                  </div>

                  {/* Price and Stock */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Price (₹) *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-700">₹</span>
                        </div>
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          min="0"
                          step="0.01"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 ${
                            errors.price ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="0.00"
                        />
                      </div>
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-700">{errors.price}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        min="0"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 ${
                          errors.stock ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter quantity"
                      />
                      {errors.stock && (
                        <p className="mt-1 text-sm text-red-700">{errors.stock}</p>
                      )}
                    </div>
                  </div>

                  {/* Category and Brand */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat} className="text-gray-900">
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Brand (Optional)
                      </label>
                      <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
                        placeholder="Brand name"
                      />
                    </div>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Image URL *
                    </label>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 ${
                        errors.image ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="https://example.com/image.jpg"
                    />
                    {errors.image && (
                      <p className="mt-1 text-sm text-red-700">{errors.image}</p>
                    )}
                    {image && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-900 mb-2">Image Preview:</p>
                        <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                          <img 
                            src={image} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23e5e7eb"><rect width="100" height="100"/><text x="50%" y="50%" font-family="Arial" font-size="12" fill="%239ca3af" text-anchor="middle" dy=".3em">Invalid URL</text></svg>'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding Product...
                        </span>
                      ) : (
                        "Add Product"
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-4 px-6 rounded-lg transition-colors duration-200"
                    >
                      Reset Form
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Guidelines Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                <svg className="w-5 h-5 inline-block mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Product Guidelines
              </h3>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-700 text-xs font-bold">1</span>
                  </div>
                  <span className="ml-3 text-sm text-gray-800">
                    Use descriptive and accurate product names
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-700 text-xs font-bold">2</span>
                  </div>
                  <span className="ml-3 text-sm text-gray-800">
                    Provide high-quality images with clear backgrounds
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-700 text-xs font-bold">3</span>
                  </div>
                  <span className="ml-3 text-sm text-gray-800">
                    Set competitive prices based on market research
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-700 text-xs font-bold">4</span>
                  </div>
                  <span className="ml-3 text-sm text-gray-800">
                    Write detailed descriptions highlighting key features
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-700 text-xs font-bold">5</span>
                  </div>
                  <span className="ml-3 text-sm text-gray-800">
                    Ensure accurate stock counts to avoid overselling
                  </span>
                </li>
              </ul>

              {/* Preview Card */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-4">Live Preview</h4>
                <div className="bg-gray-100 rounded-lg p-4">
                  {name || image ? (
                    <div>
                      {image && (
                        <img 
                          src={image} 
                          alt="Preview" 
                          className="w-full h-40 object-cover rounded-md mb-3"
                        />
                      )}
                      <h5 className="font-medium text-gray-900 truncate">{name || "Product Name"}</h5>
                      <p className="text-sm text-gray-800 line-clamp-2 mt-1">
                        {description || "Product description will appear here"}
                      </p>
                      {price && (
                        <p className="text-lg font-bold text-blue-700 mt-2">₹{price}</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-600 text-sm">Fill the form to see preview</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Tips */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Quick Tip
                  </h4>
                  <p className="text-sm text-yellow-900">
                    Use high-quality, original images and detailed descriptions to increase conversion rates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}