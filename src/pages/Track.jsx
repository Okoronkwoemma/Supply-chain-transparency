import React, { useState } from "react";
import { mockProducts } from "../data/products";

const Track = () => {
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    const foundProduct = mockProducts.find((p) => p.id === productId);
    setProduct(foundProduct || null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Track Product</h1>
        <p className="text-gray-600 mt-2">
          Enter product ID to view its journey
        </p>
      </div>

      <div className="card mb-8">
        <form onSubmit={handleTrack} className="flex gap-4">
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="input flex-grow"
            placeholder="Enter Product ID (e.g., PRD-001)"
          />
          <button type="submit" className="btn btn-primary whitespace-nowrap">
            Track Product
          </button>
        </form>
      </div>

      {product ? (
        <div className="card">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">{product.name}</h2>
            <div className="flex justify-between text-sm text-gray-600">
              <span>ID: {product.id}</span>
              <span>Manufacturer: {product.manufacturer}</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-4">Product Journey</h3>
            <div className="space-y-4">
              {product.history.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <span className="text-sm font-bold text-blue-600">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium">{step.status}</div>
                    <div className="text-sm text-gray-600">
                      {step.timestamp}
                    </div>
                    <div className="text-sm text-gray-500">{step.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm">
              <div className="font-medium mb-1">Blockchain Info</div>
              <div className="font-mono text-xs break-all">
                Transaction Hash: {product.transactionHash}
              </div>
            </div>
          </div>
        </div>
      ) : productId ? (
        <div className="text-center py-12">
          <p className="text-gray-600">
            Product not found. Please check the ID.
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">Enter a product ID to start tracking</p>
        </div>
      )}
    </div>
  );
};

export default Track;
