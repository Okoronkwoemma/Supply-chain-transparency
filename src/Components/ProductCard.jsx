import React from "react";

const ProductCard = ({ product }) => {
  const statusColors = {
    Manufactured: "bg-blue-100 text-blue-800",
    Shipped: "bg-yellow-100 text-yellow-800",
    Delivered: "bg-green-100 text-green-800",
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg">{product.name}</h3>
          <p className="text-sm text-gray-600">ID: {product.id}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[product.status]
          }`}
        >
          {product.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Manufacturer</span>
          <span className="font-medium">{product.manufacturer}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Location</span>
          <span className="font-medium">{product.location}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Last Updated</span>
          <span className="font-medium">{product.lastUpdated}</span>
        </div>
      </div>

      <button className="w-full btn btn-secondary mt-2">View Details</button>
    </div>
  );
};

export default ProductCard;
