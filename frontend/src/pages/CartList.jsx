import React, { useState } from "react";

function CartList() {
  // State for items cart
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Labubu",
      price: 6790,
      quantity: 1,
      image: "src/image/picForNav.jpg",
    },
    {
      id: 2,
      name: "Labubu",
      price: 6790,
      quantity: 1,
      image: "src/image/picForNav.jpg",
    },
  ]);

  // update qty of prod
  const updateItemQuantity = (id, change) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + change, 1) } // ปรับจำนวนให้ไม่ต่ำกว่า 1
          : item
      )
    );
  };

  // increment qty of prod
  const incrementQuantity = (id) => {
    updateItemQuantity(id, 1); // เพิ่มจำนวน 1
  };

  //  decrement qty of prod
  const decrementQuantity = (id) => {
    updateItemQuantity(id, -1); // ลดจำนวน 1
  };

  // ฟังก์ชันคำนวณยอดรวมและจำนวนรายการทั้งหมด
  const calculateTotals = () => {
    return items.reduce(
      (totals, item) => {
        totals.total += item.price * item.quantity; // คำนวณยอดรวม
        totals.quantity += item.quantity; // คำนวณจำนวนสินค้า
        return totals; // ส่งกลับค่า totals
      },
      { total: 0, quantity: 0 } // ค่าเริ่มต้น
    );
  };

  // ใช้ calculateTotals ในการดึงยอดรวมและจำนวนรายการ
  const { total, quantity } = calculateTotals();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ตะกร้าของฉัน</h1>
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        {/* Address Header */}
        <div className="flex items-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            className="h-6 w-6 text-white"
          >
            <path d="M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z" />
          </svg>
          <h2 className="text-lg font-semibold ml-2">ที่อยู่ในการจัดส่ง</h2>
        </div>

        {/* Address Details */}
        <p className="text-sm">คน (+66) เบอร์</p>
        <p className="text-sm">
          บ้านเก่ง คอนโด ยู เรสซิเดนท์ มาดามซี่ ชั้น27 บ้านเลขที่873/226 อาคาร B
          ชั้น, แยกมาบยี่, เขตบางซื่อ, จังหวัด กรุงเทพฯ, 10800
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Section: Product List */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          {items.map((item) => (
            <div key={item.id} className="flex items-center mb-4 border-b pb-2">
              <input type="checkbox" className="mr-4" />
              <img
                src={item.image}
                alt={item.name}
                className="h-24 w-24 object-cover rounded-lg"
              />
              <div className="flex-grow ml-4">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">ราคา: ฿{item.price}</p>
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => decrementQuantity(item.id)}
                      className="border border-gray-300 rounded-full px-2"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => incrementQuantity(item.id)}
                      className="border border-gray-300 rounded-full px-2"
                    >
                      +
                    </button>
                  </div>
                  <a href="">ลบ</a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Section: Order Summary */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <p className="mx-2 my-3">จำนวน: {quantity} รายการ</p>
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
