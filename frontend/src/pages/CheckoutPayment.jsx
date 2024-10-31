import React, { useState } from "react";

function AddressModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [postcode, setPostcode] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      name,
      contactName,
      phone,
      province,
      district,
      subDistrict,
      postcode,
      addressDetail,
      isDefault,
    });
    onClose(); // Close modal after submission
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-sans">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">เพิ่มที่อยู่ใหม่</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="ชื่อจริง"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              <input
                type="text"
                placeholder="นามสกุล"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              <div className="flex items-center">
                <span className="mr-2">+66</span>
                <input
                  type="text"
                  placeholder="โทรศัพท์"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
              <input
                type="text"
                placeholder="จังหวัด"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              <input
                type="text"
                placeholder="เขต"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              <input
                type="text"
                placeholder="ตำบล"
                value={subDistrict}
                onChange={(e) => setSubDistrict(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              <input
                type="text"
                placeholder="รหัสไปรษณีย์"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              <input
                type="text"
                placeholder="ที่อยู่"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={() => setIsDefault(!isDefault)}
                  className="mr-2"
                />
                <label>ตั้งเป็นที่อยู่เริ่มต้น</label>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-black rounded-md px-4 py-2 mr-2"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="bg-red-600 text-white rounded-md px-4 py-2"
              >
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}

function PaymentModal({ isOpen, onClose }) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle payment form submission logic here
    console.log({
      cardNumber,
      cardName,
      expiryDate,
      cvv,
      isDefault,
    });
    onClose(); // Close modal after submission
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">ข้อมูลการชำระเงิน</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="หมายเลขบัตรเครดิต"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              <input
                type="text"
                placeholder="ชื่อบนบัตร"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="วันหมดอายุ (MM/YY)"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={() => setIsDefault(!isDefault)}
                  className="mr-2"
                />
                <label>ตั้งเป็นวิธีการชำระเงินเริ่มต้น</label>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-black rounded-md px-4 py-2 mr-2"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="bg-red-600 text-white rounded-md px-4 py-2"
              >
                ชำระเงิน
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}

function Checkout() {
  const [address, setAddress] = useState("");
  const [coupon, setCoupon] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalPaymentOpen, setModalPaymentOpen] = useState(false);

  const totalAmount = 6790; // Example total amount
  const itemCount = 1; // Example item count
  const itemsPurchased = [
    {
      id: 1,
      name: "Lightyear: Space Ranger Alpha Buzz",
      price: 6790,
      quantity: 1,
      image: "src/image/picForNav.jpg",
    },
  ];
  const handleAddressSubmit = (newAddress) => {
    setAddress(newAddress); // Update the address state with the new address
  };

  return (
    <div className="container mx-auto p-4">
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
          <h2 className="text-lg font-semibold ml-2">
            ที่อยู่ในการจัดส่งปัจจุบัน
          </h2>
        </div>

        {/* Address Details */}
        <p className="text-sm">คน (+66) เบอร์</p>
        <p className="text-sm">
          บ้านเก่ง คอนโด ยู เรสซิเดนท์ มาดามซี่ ชั้น27 บ้านเลขที่873/226 อาคาร B
          ชั้น, แยกมาบยี่, เขตบางซื่อ, จังหวัด กรุงเทพฯ, 10800
        </p>
      </div>
      {/* Address Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddressSubmit}
      />
      {/* Payment Modal */}
      <PaymentModal
        isOpen={isModalPaymentOpen}
        onClose={() => setModalPaymentOpen(false)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Section: Delivery Address and Coupon */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">ที่อยู่จัดส่ง:</h2>

          <label
            for="10"
            class="inline-block w-full text-sm font-medium transition-all duration-200 ease-in-out group-focus-within:text-red-400"
          >
            กรุณากรอกที่อยู่เพื่อจัดส่งสินค้า
          </label>

          <div class="relative flex items-center">
            <input
              id="10"
              type="text"
              value={address}
              placeholder="เพิ่มที่อยู่ใหม่"
              class=" h-10 w-full rounded-md border border-gray-300 bg-gray-50 pl-4 pr-20 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:border-black  focus:drop-shadow-lg"
            />
            <button
              onClick={() => setModalOpen(true)}
              class="absolute right-2 h-8 w-20 rounded-md bg-red-600 text-xs font-semibold text-white transition-all duration-200 ease-in-out group-focus-within:bg-red-400 group-focus-within:hover:bg-red-200"
            >
              เพิ่มที่อยู่ใหม่
            </button>
          </div>
          <h2 className="text-lg font-semibold mb-2">คูปอง:</h2>
          <div class="relative flex items-center">
            <input
              id="10"
              type="text"
              placeholder="กรอกคูปอง"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              class=" h-10 w-full rounded-md border border-gray-300 bg-gray-50 pl-4 pr-20 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:border-black  focus:drop-shadow-lg"
            />
            <button
              onClick={() => setModalOpen(true)}
              class="absolute right-2 h-8 w-20 rounded-md bg-black text-xs font-semibold text-white transition-all duration-200 ease-in-out group-focus-within:bg-red-400 group-focus-within:hover:bg-red-200"
            >
              ใช้
            </button>
          </div>
        </div>

        {/* Right Section: Order Summary */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">ยอดรวม</h2>
          <div className="flex justify-between mt-2">
            <p className="text-gray-700">จำนวน: {itemCount} รายการ</p>
          </div>
          <hr className="my-2" />
          <h3 className="text-lg font-semibold">รายการสินค้า:</h3>
          {itemsPurchased.map((item) => (
            <div key={item.id} className="flex justify-between mt-2">
              <div className="flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 object-cover rounded-lg mr-2"
                />
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-gray-600">ราคา: ฿{item.price}</p>
                  <p className="text-gray-600">จำนวน: {item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
          <hr className="my-2" />
          <h3 className="text-lg font-semibold">ยอดรวม({itemCount})</h3>
          <p className="text-3xl font-semibold">฿{totalAmount}.00 THB</p>
          <button onClick={() => setModalPaymentOpen(true)} className="bg-red-600 text-white rounded-full px-4 py-2 hover:bg-red-700 mt-4 w-full">
            ชำระเงิน
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
