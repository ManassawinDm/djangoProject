// OrderDetails.jsx
import React from "react";
import { useLocation } from "react-router-dom";

const OrderDetails = () => {
  const location = useLocation();
  const { order } = location.state;

  if (!order) {
    return <p className="text-center text-red-600">ไม่พบคำสั่งซื้อที่เลือก</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        รายละเอียดคำสั่งซื้อ
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            หมายเลขคำสั่งซื้อ: {order.id}
          </h2>
          <p className="text-sm text-gray-500 mb-1">
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

        <h2 className="text-2xl font-bold text-gray-700 mb-4">รายการสินค้า</h2>
        <div className="space-y-6">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    จำนวน: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-500">
                    ราคาต่อชิ้น: ฿{item.price}
                  </p>
                </div>
              </div>
              <p className="text-lg font-bold text-gray-800">
                ฿{item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-right">
          <p className="text-xl font-bold text-gray-800">
            ราคารวมทั้งหมด: ฿{order.totalAmount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
