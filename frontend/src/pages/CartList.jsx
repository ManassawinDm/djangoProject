import React, { useEffect, useState } from 'react'
import Loading from "../components/Loading";
import api from '../api';
import { ACCESS_TOKEN } from '../constants';
import CryptoJS from 'crypto-js';
import { useLogo } from '../Context/CartContext';

function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}

function CartList() {
  // State for items cart
  const { logoAnimation } = useLogo();
  console.log(logoAnimation)
  const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN);
  const token = localStorage.getItem(ACCESS_TOKEN);
  const decode = isLoggedIn ? decodeToken(token) : null;
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const SECRET_KEY = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_SECRET_KEY.padEnd(32, ' '));
  const encryptParam = (param) => {
    if (!param) {
      throw new Error('Parameter is undefined or null');
    }
    const encrypted = CryptoJS.AES.encrypt(param, SECRET_KEY, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
    return encodeURIComponent(encrypted);
  };

  useEffect(() => {
    if (isLoggedIn) {
      getProduct();
    }
  }, [logoAnimation]);

  const getProduct = async () => {
    try {
      const userId = decode.user_id.toString();
      const encodedUserId = encryptParam(userId);

      const res = await api.get('/cartlist/', {
        params: { user_id: encodedUserId },
      });
      const data = res.data.cart_items.map(item => ({ ...item, selected: true }));
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleSelect = (id) => {
    setProducts(prevItems =>
      prevItems.map(item =>
        item.product.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const updateItemQuantity = (id, change) => {
    setProducts(prevItems =>
      prevItems.map(item =>
        item.product.id === id
          ? { ...item, quantity: Math.max(item.quantity + change, 1) }
          : item
      )
    );
  };

  const incrementQuantity = (id) => updateItemQuantity(id, 1);
  const decrementQuantity = (id) => updateItemQuantity(id, -1);

  const calculateTotals = () => {
    return products.reduce(
      (totals, item) => {
        if (item.selected) {
          totals.total += item.product.price * item.quantity;
          totals.quantity += item.quantity;
        }
        return totals;
      },
      { total: 0, quantity: 0 }
    );
  };

  const { total, quantity } = calculateTotals();

  if (loading) return <Loading />;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ตะกร้าของฉัน</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Section: Product List */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          {products.map((item) => (
            <div key={item.product.id} className="flex items-center mb-4 border-b pb-2">
              <input
                type="checkbox"
                className="mr-4"
                checked={item.selected}
                onChange={() => toggleSelect(item.product.id)}
              />
              <img
                src={item.product.image_url}
                alt={item.product.name}
                className="h-24 w-24 object-cover rounded-lg"
              />
              <div className="flex-grow ml-4">
                <h2 className="text-lg font-semibold">{item.product.name}</h2>
                <p className="text-gray-600">ราคา: ฿{item.product.price}</p>
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => decrementQuantity(item.product.id)}
                      className="border border-gray-300 rounded-full px-2"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => incrementQuantity(item.product.id)}
                      className="border border-gray-300 rounded-full px-2"
                    >
                      +
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.product.id)} className="text-red-600 hover:text-red-800">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5 fill-current">
                      <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                    </svg>
                  </button>


                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Section: Order Summary */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <p className="mx-2 my-3">จำนวน: {products.length} รายการ</p>
          <hr />
          <div className=" my-3 flex justify-between">
            <h2 className="flex justify-items-center text-lg font-semibold">
              ยอดรวม:
            </h2>
            <p className="text-3xl font-semibold">
              ฿{total}
              <span className="text-sm font-semibold"> THB</span>
            </p>
          </div>
          <div className=" my-3 flex justify-between">
            <h2 className="flex justify-items-center text-lg font-semibold">
              การจัดส่ง
            </h2>
            <p className="text-base font-serif">คำนวณในขั้นตอนถัดไป</p>
          </div>
          <button
            type="button"
            className="relative inline-flex justify-center font-semibold mt-6 w-full px-1.5 py-3 text-sm text-white bg-red-600 rounded-full hover:bg-red-800 focus:ring-4 focus:ring-red-300 transition duration-300"
          >
            <svg
              className="w-5 h-5 me-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              fill="currentColor"
            >
              <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
            </svg>
            ชำระเงิน
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartList;
