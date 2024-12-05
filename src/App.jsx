import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ProductList from './components/ProductList';
import CartPage from './components/Cart';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState('false');

  useEffect(() => {
    const loggedIn = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(loggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated('false');
    window.location.href = '/login';
  };
  

  return (
    <Router>
      <div>
        <nav className="p-4 bg-gray-200">
          <a href="/products" className="mr-4">Products</a>
          <a href="/cart" className="mr-4">Cart</a>
          {!isAuthenticated && <a href="/register" className="mr-4">Register</a>}
          {isAuthenticated && (
            <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
              Logout
            </button>
          )}
        </nav>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/products"
            element={
              isAuthenticated ? <ProductList /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/cart"
            element={
              isAuthenticated ? <CartPage /> : <Navigate to="/login" />
            }
          />
          <Route path="/" element={<Navigate to="/products" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
