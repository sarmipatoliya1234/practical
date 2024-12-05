import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const userLogin = (e) => {
    e.preventDefault();
  
    const users = JSON.parse(localStorage.getItem('users')) || [];
  
    const user = users.find(
      (user) => user.email === email && user.password === password
    );
  
    if (user) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      setIsAuthenticated(true);
      navigate('/products');
    } else {
      alert('Invalid email or password!');
    }
  };
  

  return (
    <div className="p-6">
      <form onSubmit={userLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block mb-4 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block mb-4 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
