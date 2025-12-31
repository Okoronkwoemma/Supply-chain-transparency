import React, { useState } from "react";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    manufacturer: "",
    price: "",
    category: "Electronics",
  });

  const categories = [
    "Electronics",
    "Clothing",
    "Food",
    "Pharmaceuticals",
    "Other",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      "Product registered successfully!\nThis would connect to blockchain in production."
    );
    setForm({ name: "", manufacturer: "", price: "", category: "Electronics" });
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Register Product</h1>
        <p className="text-gray-600 mt-2">
          Add a new product to the blockchain
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Manufacturer *
            </label>
            <input
              type="text"
              value={form.manufacturer}
              onChange={(e) =>
                setForm({ ...form, manufacturer: e.target.value })
              }
              className="input"
              placeholder="Manufacturer name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (USD) *
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="input"
              placeholder="0.00"
              required
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              This product will be registered on the blockchain. Transaction
              will be permanent and transparent.
            </p>
          </div>

          <button type="submit" className="w-full btn btn-primary">
            Register on Blockchain
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
