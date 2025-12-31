import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import { mockProducts } from "../data/products";

const Home = () => {
  const [search, setSearch] = useState("");

  const filteredProducts = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.id.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: mockProducts.length,
    manufactured: mockProducts.filter((p) => p.status === "Manufactured")
      .length,
    shipped: mockProducts.filter((p) => p.status === "Shipped").length,
    delivered: mockProducts.filter((p) => p.status === "Delivered").length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Supply Chain Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Track products from manufacturer to consumer
        </p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="text-sm text-gray-600">Total Products</div>
          <div className="text-2xl font-bold mt-2">{stats.total}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600">Manufactured</div>
          <div className="text-2xl font-bold mt-2">{stats.manufactured}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600">In Transit</div>
          <div className="text-2xl font-bold mt-2">{stats.shipped}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600">Delivered</div>
          <div className="text-2xl font-bold mt-2">{stats.delivered}</div>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input max-w-md"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
