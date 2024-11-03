// OrderOverview.jsx
import React from "react";
import { Link } from "react-router-dom";
import picForNav from "../image/picForNav.jpg";

const OrderOverview = () => {
  const orders = [
    {
      id: "001",
      date: "2024-11-04",
      status: "ชำระแล้ว",
      totalAmount: 1500,
      items: [
        {
          id: "1",
          name: "Product A",
          price: 500,
          quantity: 1,
          image: picForNav,
        },
        {
          id: "2",
          name: "Product B",
          price: 1000,
          quantity: 1,
          image: picForNav,
        },
      ],
    },
    {
      id: "002",
      date: "2024-11-04",
      status: "รอชำระ",
      totalAmount: 1500,
      items: [
        {
          id: "1",
          name: "Product A",
          price: 500,
          quantity: 1,
          image: picForNav,
        },
        {
          id: "2",
          name: "Product B",
          price: 1000,
          quantity: 1,
          image: picForNav,
        },
      ],
    },
    {
      id: "003",
      date: "2024-11-04",
      status: "ไม่ชำระ",
      totalAmount: 1500,
      items: [
        {
          id: "1",
          name: "Product A",
          price: 500,
          quantity: 1,
          image: picForNav,
        },
        {
          id: "2",
          name: "Product B",
          price: 1000,
          quantity: 1,
          image: picForNav,
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        รายการคำสั่งซื้อของคุณ
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <Link
            to={`/order/${order.id}`}
            key={order.id}
            state={{ order }}
            className={`p-5 rounded-lg shadow-lg transition-shadow duration-300 
                      ${
                        order.status === "ชำระแล้ว"
                          ? "bg-green-100 hover:ring-2 hover:ring-green-500 focus:ring-2 focus:ring-green-500"
                          : order.status === "รอชำระ"
                          ? "bg-yellow-100 hover:ring-2 hover:ring-yellow-500 focus:ring-2 focus:ring-yellow-500"
                          : "bg-red-100 hover:ring-2 hover:ring-red-500 focus:ring-2 focus:ring-red-500"
                      }`}
          >
            <div className="flex flex-col">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  หมายเลขคำสั่งซื้อ: {order.id}
                </h2>
                <p className="text-sm text-gray-500">
                  วันที่สั่งซื้อ: {order.date}
                </p>
                <p
                  className={`text-sm font-medium ${
                    order.status === "ชำระแล้ว"
                      ? "text-green-500"
                      : order.status === "รอชำระ"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  สถานะ: {order.status}
                </p>
              </div>
              <p className="text-xl font-bold text-gray-800 mt-auto">
                ราคารวม: ฿{order.totalAmount}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrderOverview;
