import React, { useState } from "react";

function ProductDetailInside() {
  const [quantity, setQuantity] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const thumbnails = [...Array(8)].map((_, index) => `src/image/picForNav.jpg`); //Image list

  const nextThumbnail = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % thumbnails.length); //Image list next
  };

  const prevThumbnail = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + thumbnails.length) % thumbnails.length //Image list prev
    );
  };

  const increment = () => {
    setQuantity((prevQuantity) => prevQuantity + 1); // List Qty
  };

  const decrement = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 0));
  };
  return (
    <div>
      <div className="bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section: Product Images */}
          <div className="flex flex-col">
            <img
              className="w-full h-auto rounded-lg shadow-md"
              src="src/image/picForNav.jpg"
              alt="Product"
            />
            <div className="flex justify-center mt-4">
              {/* Arrow prev img */}
              <button
                onClick={prevThumbnail}
                className="px-2 border border-gray-300 rounded-full hover:bg-gray-200"
              >
                ←
              </button>

              {/* Show Img */}
              <div className="flex space-x-2 overflow-hidden">
                {thumbnails.slice(currentIndex, currentIndex + 3).map(
                  (
                    src,
                    index // แสดง 3 ภาพย่อ
                  ) => (
                    <img
                      key={index}
                      className="h-20 w-20 object-cover rounded-lg shadow-md cursor-pointer"
                      src={src}
                      alt={`Thumbnail ${currentIndex + index}`}
                    />
                  )
                )}
              </div>

              {/* Arrow next img */}
              <button
                onClick={nextThumbnail}
                className="px-2 border border-gray-300 rounded-full hover:bg-gray-200"
              >
                →
              </button>
            </div>
          </div>

          {/* Right Section: Product Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-2">Product</h1>
            <p className="text-xl text-red-500">฿380.00</p>

            <div className="mt-4">
              <label htmlFor="size" className="block text-lg font-semibold">
                ขนาด:
              </label>
              <select
                id="size"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option>คลิกเลือกขนาด</option>
                <option>ขนาด 8-12 เซนติเมตร</option>
              </select>
            </div>

            <div className="mt-4">
              <label htmlFor="quantity" className="block text-lg font-semibold">
                จำนวน:
              </label>
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={decrement}
                  className="border border-gray-300 rounded-full px-2  text-lg font-semibold"
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  readOnly
                  className="block w-16 text-center p-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={increment}
                  className="border border-gray-300 rounded-full px-2 text-lg font-semibold"
                >
                  +
                </button>
              </div>
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
              เพิ่มลงในตะกร้า
            </button>

            {/* Additional Details */}
            <div className="mt-4">
              <h2 className="text-lg font-semibold">รายละเอียดสินค้า</h2>
              <p className="mt-2">ที่มา: POP MART</p>
              <p>วัสดุ: PVC/ABS/Hardware/Magnet</p>
              <p>เหมาะสำหรับอายุ 8-12 ปี</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailInside;
