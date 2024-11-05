import React, { useEffect, useState } from "react";
import api from "../api";
import Loading from "../components/Loading";
import { useParams } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, PaymentRequestButtonElement } from "@stripe/react-stripe-js";

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

function AddressModal({ isOpen, onClose }) {
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [postcode, setPostcode] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN);
  const token = localStorage.getItem(ACCESS_TOKEN);
  const decode = isLoggedIn ? decodeToken(token) : null;


  const handleSubmit = async(e) => {
    e.preventDefault();
    const addressData = {
      phone,
      province,
      district,
      subDistrict,
      postcode,
      addressDetail,    
    };

    try {
      const userId = decode.user_id.toString();
      const response = await api.post("/address/", {
          user_id: userId,
          ...addressData,
      });
      console.log(response.data);
      onClose(); 
  } catch (error) {
      console.error("Error saving address:", error);
  }
  };


  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-sans">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">เพิ่มที่อยู่ใหม่</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
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
    <></>
  );
}

function Checkout() {
  const [address, setAddress] = useState("");
  const [coupon, setCoupon] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams();
  const [DataOrder, setDataOrder] = useState([]);
  const [DataOrderItem, setDataOrderItem] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN);
  const token = localStorage.getItem(ACCESS_TOKEN);
  const decode = isLoggedIn ? decodeToken(token) : null;

  const urlParams = new URLSearchParams(window.location.search);
  const isSuccess = urlParams.get('success');

  if (isSuccess === 'true') {
    Swal.fire({
        icon: 'success',
        title: 'ชำระเงินสำเร็จ!',
        text: 'ขอบคุณสำหรับการสั่งซื้อของคุณ!',
        confirmButtonText: 'ตกลง'
    }).then(async () => {
        try {
            const response = await api.put('/status/', { order_id: DataOrder.order.id });
            
            if (response.status === 200) {
                console.log('สถานะอัปเดตสำเร็จ:', response.data);
                window.history.replaceState(null, '', window.location.pathname);
                
                // Navigate to the checkout page after successfully updating the status
                navigate("/checkout/");
            } else {
                console.error('การอัปเดตสถานะล้มเหลว:', response.data);
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ:", error);
        }
    });
}



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
  const SECRET_KEY = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_SECRET_KEY.padEnd(32, ' '));
  
  const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  const handleClick = async () => {
    try {
        const response = await api.post('/create-checkout-session/', { item: DataOrderItem ,order:DataOrder.order.id});
        if (response.data.url) {
            window.location.href = response.data.url;  // Redirect to Stripe checkout
        }
    } catch (error) {
        console.error("Error creating Stripe checkout session:", error);
    }
};

const handleCancel = async () => {
  try {
    await api.put('/cancel-order/', { order: DataOrder.order.id });
  } catch (error) {
    console.error("Error canceling the order:", error);
  }
};

const confirmCancel = () => {
  Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: "คุณต้องการยกเลิกคำสั่งซื้อหรือไม่",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'ใช่, ยกเลิกเลย!',
    cancelButtonText: 'ไม่, เก็บไว้'
  }).then((result) => {
    if (result.isConfirmed) {
      handleCancel().then(() => { // Wait for handleCancel to complete
        Swal.fire(
          'ยกเลิกสำเร็จ!',
          'คำสั่งซื้อของคุณถูกยกเลิกเรียบร้อยแล้ว',
          'success'
        ).then(() => {
          navigate("/checkout/"); // Navigate after success alert is confirmed
        });
      });
    }
  });
};




  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // เริ่มต้นการโหลดข้อมูล
        setLoading(true);

        // เรียก API ทั้งสาม
        await Promise.all([FetchOrder(), FetchOrderItem(), FetchAddress()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // ตั้งค่า loading เป็น false เมื่อการดึงข้อมูลเสร็จสิ้น
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  

  const handleAddressSubmit = (newAddress) => {
    setAddress(newAddress); // Update the address state with the new address
  };
  const FetchOrder = async () => {
    try {
        const res = await api.get(`/checkout/order/${orderId}/`);
        const data = res.data
        setDataOrder(data);
    } catch (err) {
        console.error("Error fetching order:", err);
    } 
}

  const FetchOrderItem = async () => {
    try {
        const res = await api.get(`/checkout/orderitem/${orderId}/`);
        setDataOrderItem(res.data);
    } catch (err) {
        console.error("Error fetching order items:", err);
    }
  }

  const FetchAddress = async()=>{
    const userId = decode.user_id.toString();
    const encodedUserId = encryptParam(userId);
    try {
      const res = await api.get('/addressInfo/', {
        params: { user_id: encodedUserId },
      });
      setAddressData(res.data);
  } catch (err) {
      console.error("Error fetching order items:", err);
  }
  }

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto p-4">
      {addressData && addressData.address ? (
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
            {addressData.address.detail}
          </h2>
        </div>

        {/* Address Details */}
        <p className="text-sm">{DataOrder.order.customer_name} (+66) {addressData.address.phone_number}</p>
        <p className="text-sm">
          บ้านเลขที่ {addressData.address.detail}   อำเภอ{addressData.address.district}  ตำบล  {addressData.address.subdistrict}
          จังหวัด  {addressData.address.province}   {addressData.address.postal_code}
        </p>
      </div>
      ) : (
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
          <h2 className="text-xl font-semibold ml-2 text-red-500">
            กรุณากรอกที่อยู่เพื่อจัดส่งสินค้า
          </h2>
        </div>
      </div>
      )}
      {/* Address Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddressSubmit}
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
        </div>

        {/* Right Section: Order Summary */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-ปส font-semibold">ออเดอร์ที่ {DataOrder.order.id}</h2>
          <div className="flex justify-between mt-2">
            <p className="text-gray-700">จำนวน: {DataOrderItem.items.length} รายการ</p>
          </div>
          <hr className="my-2" />
          <h3 className="text-lg font-semibold">รายการสินค้า:</h3>
          {Array.isArray(DataOrderItem.items) && DataOrderItem.items.map((item) => (
            <div key={item.product_id} className="flex justify-between mt-2">
              <div className="flex items-center">
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className="h-16 w-16 object-cover rounded-lg mr-2"
                />
                <div>
                  <p className="text-sm font-semibold">{item.product_name}</p>
                  <p className="text-gray-600">ราคา: ฿{item.price}</p>
                  <p className="text-gray-600">จำนวน: {item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
          <hr className="my-2" />
          <h3 className="text-lg font-semibold">ยอดรวม({DataOrderItem.items.length})</h3>
          <p className="text-3xl font-semibold">฿{DataOrder.order.total_price} THB</p>
          <button 
            onClick={() => handleClick()} 
            className="bg-red-600 text-white rounded-full px-4 py-2 hover:bg-red-700 mt-4 w-full"
            disabled={!addressData || !addressData.address} // Disable the button if addressData or addressData.address is not available
          >
            ชำระเงิน
      </button>
      <button 
          onClick={() => confirmCancel()} 
          className="bg-white text-red-600 border border-red-600 rounded-full px-4 py-2 hover:bg-red-600 hover:text-white transition duration-200 mt-4 w-full"
      >
          ยกเลิก
      </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
