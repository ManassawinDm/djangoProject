// OrderOverview.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import picForNav from "../image/picForNav.jpg";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import Loading from "../components/Loading";
import CryptoJS from 'crypto-js';

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


const OrderOverview = () => {

  const token = localStorage.getItem(ACCESS_TOKEN);
  const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN);
  const decode = isLoggedIn ? decodeToken(token) : null;
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState([]);

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
    getOrder();
}, [])

  const getOrder = async () => {
    const userId = decode.user_id.toString();
    const encodedUserId = encryptParam(userId);
    try {
      const res = await api.get('/fetch-order/', {
        params: { user_id: encodedUserId },
      });
        const data = res.data.orders;
        setOrder(data);
        setLoading(false);
    } catch (err) {
        console.log(err);
    }
}

  if (loading) return <Loading />;
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        รายการคำสั่งซื้อของคุณ
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {order.map((order) => (
          <Link
            to={`/checkout/${order.id}`}
            key={order.id}
            className={`p-5 rounded-lg shadow-lg transition-shadow duration-300 ${
              order.status === "Shipped" ||
              order.status === "จัดส่งแล้ว"
                ? "bg-green-100 hover:bg-green-100 hover:ring-2 hover:ring-green-500 focus:ring-2 focus:ring-green-500"
                : order.status === "Pending" || order.status === "รอดำเนินงาน"
                ? "bg-yellow-100 hover:bg-yellow-100 hover:ring-2 hover:ring-yellow-500 focus:ring-2 focus:ring-yellow-500"
                : order.status === "Cancelled"
                ? "bg-red-100 hover:bg-red-100 hover:ring-2 hover:ring-red-500 focus:ring-2 focus:ring-red-500"
                : "bg-white"
            }`}
          >
            <div className="flex flex-col">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  หมายเลขคำสั่งซื้อ: {order.id}
                </h2>
                <p className="text-sm text-gray-500">
                  วันที่สั่งซื้อ: {order.created_at}
                </p>
                <p
                  className={`text-sm font-medium ${
                    order.status === "Pending" || order.status === "Pending"
                      ? "text-yellow-500"
                      : order.status === "ชำระเงินเสร็จแล้ว" ||
                        order.status === "จัดส่งแล้ว"
                      ? "text-green-500"
                      : order.status === "Cancelled"
                      ? "text-red-500"
                      : "text-black"
                  }`}
                >
                  สถานะ: {order.status}
                </p>
              </div>
              <p className="text-xl font-bold text-gray-800 mt-auto">
                ราคารวม: ฿{order.total_price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrderOverview;
