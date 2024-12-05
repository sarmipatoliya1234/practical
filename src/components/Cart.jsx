import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      alert("Please log in to view your cart.");
      navigate("/login");
      return;
    }

    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("No user logged in.");
      navigate("/login");
      return;
    }

    const cart = JSON.parse(localStorage.getItem(`${userEmail}_cart`)) || [];
    setCartItems(cart);
    calculateTotal(cart);
  }, [navigate]);

  const calculateTotal = (cart) => {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const removeProduct = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    const userEmail = localStorage.getItem("userEmail");
    localStorage.setItem(`${userEmail}_cart`, JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const QuantityChange = (id, quantity) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
    );
    setCartItems(updatedCart);
    const userEmail = localStorage.getItem("userEmail");
    localStorage.setItem(`${userEmail}_cart`, JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const checkout = () => {
    alert(`Thank you for your purchase! Total: $${totalPrice.toFixed(2)}`);
    const userEmail = localStorage.getItem("userEmail");
    localStorage.removeItem(`${userEmail}_cart`);
    setCartItems([]);
    setTotalPrice(0);
    navigate("/products");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-4"
            >
              <div className="flex justify-center items-center gap-3">
                <img src={item.thumbnail} alt=""  className="w-20 h-20 border-2 border-black rounded-lg"/>
                <div className="flex gap-3">
                  <h3 className="font-bold">{item.title}</h3>
                  <p>${item.price}</p>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  className="border p-1 w-16 mr-2"
                  value={item.quantity}
                  onChange={(e) =>
                    QuantityChange(item.id, parseInt(e.target.value) || 1)
                  }
                />
                <button
                  onClick={() => removeProduct(item.id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="mt-4">
            <div className="font-bold text-lg">
              <p>Total: ${totalPrice.toFixed(2)}</p>{" "}
            </div>
            <button
              onClick={checkout}
              className="bg-blue-500 text-white p-2 rounded mt-4"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
