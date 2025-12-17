import React, { useState } from 'react';
import { API } from '../utils/api';

export default function TestConnection() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Testing connection...');
    
    try {
      const response = await fetch(`${API}/api/getproduct`);
      if (response.ok) {
        const data = await response.json();
        setStatus(`✅ Backend connected! Found ${data.length} products`);
      } else {
        setStatus(`❌ Backend responded with status: ${response.status}`);
      }
    } catch (error) {
      setStatus(`❌ Connection failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAddProduct = async () => {
    setLoading(true);
    setStatus('Testing add product...');
    
    const testProduct = {
      name: 'Test Product',
      description: 'This is a test product',
      price: 99.99,
      image: 'https://via.placeholder.com/300',
      category: 'electronics',
      stock: 10,
      brand: 'Test Brand'
    };

    try {
      const response = await fetch(`${API}/api/postProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testProduct)
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(`✅ Product added successfully! ID: ${data._id}`);
      } else {
        const errorData = await response.json();
        setStatus(`❌ Failed to add product: ${errorData.message || response.status}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Backend Connection Test</h2>
      
      <div className="space-y-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        <button
          onClick={testAddProduct}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Add Product'}
        </button>
      </div>
      
      {status && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
          {status}
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Backend URL: {API}</p>
        <p>Make sure your backend server is running on port 5000</p>
      </div>
    </div>
  );
}