import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import Loading from "./Loading";

function Form({ route, method }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const name = method === 'login' ? 'Login' : 'Register';

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const payload = method === 'register' ? { username, email, password, confirmpassword } : { username, password };
      const res = await api.post(route, payload);
      if (method === 'login') {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate('/home');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 to-red-700">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-center mb-6">{name}</h1>
        <input
          className="form-input w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        {method === 'register' && (
          <input
            className="form-input w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        )}
        <input
          className="form-input w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {method === 'register' && (
          <input
            className="form-input w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            type="password"
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
            placeholder="ConfirmPassword"
            required
          />
        )}
        {loading ? (
          <button
          className="form-submit w-full bg-red-300 text-white p-2 rounded hover:bg-red-600 transition-colors"
          type="submit"
        >
          Loading
        </button>
        ) : (
          <button
          className="form-submit w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
          type="submit"
        >
          {name}
        </button>
        )}
        
        {method === 'register' ? (
          <span>
            <p
              className="text-blue-500 cursor-pointer hover:underline mt-4 text-center" 
              onClick={() => navigate('/login')}
            >
              มีบัญชีผู้ใช้อยู่แล้ว
            </p>
          </span>
        ) : (

            <span>
              <p
                className="text-blue-500 cursor-pointer hover:underline mt-4 text-center"
                onClick={() => navigate('/register')}
              >
                ยังไม่มีบัญชีผู้ใช้งาน
              </p>
            </span>
        )}
      </form>
    </div>
  );
}

export default Form;
