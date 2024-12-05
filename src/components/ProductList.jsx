import React, { useEffect, useState } from "react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
        setFilteredProducts(data.products);
      });
  }, []);

  useEffect(() => {
    let updatedProducts = products.filter(
      (product) =>
        product.title.toLowerCase().includes(search.toLowerCase()) &&
        (categoryFilter ? product.category === categoryFilter : true)
    );
    if (sortOrder === "asc") {
      updatedProducts = updatedProducts.sort((a, b) => a.price - b.price);
    } else {
      updatedProducts = updatedProducts.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(updatedProducts);
  }, [search, sortOrder, categoryFilter, products]);

  const handleAddToCart = (product) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      alert('Please log in to add products to your cart.');
      return;
    }
  
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert('Please log in to add products to your cart.');
      return;
    }
  
    const cart = JSON.parse(localStorage.getItem(`${userEmail}_cart`)) || [];
  
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      product.quantity = 1;
      cart.push(product);
    }
  
    localStorage.setItem(`${userEmail}_cart`, JSON.stringify(cart));
  };
  
  

  return (
    <div className="p-6 container">
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search products"
          className="p-2 border rounded mr-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded mr-2"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="beauty">Beauty</option>
        </select>
        <select
          className="p-2 border rounded"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredProducts
          .slice((currentPage - 1) * 5, currentPage * 5)
          .map((product) => (
            <div key={product.id} className="border p-4 rounded shadow">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-48 object-cover mb-4"
              />
              <h3 className="font-bold">{product.title}</h3>
              <p>{product.category}</p>
              <p>${product.price}</p>
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-blue-500 text-white p-2 rounded mt-2"
              >
                Add to Cart
              </button>
              <button
                onClick={() => (window.location.href = "/cart")}
                className="bg-green-500 text-white p-2 rounded mt-2 ml-2"
              >
                View Cart
              </button>
            </div>
          ))}
      </div>
      {filteredProducts.length > 0 ? (
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="bg-gray-500 text-white p-2 rounded"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="bg-gray-500 text-white p-2 rounded"
          >
            Next
          </button>
        </div>
      ) : 'No Matched Item found.'}
    </div>
  );
};

export default ProductList;
