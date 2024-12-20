import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useLocation } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import Loading from "../components/Loading"
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
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

function ProductDetailInside() {
  const [quantity, setQuantity] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get('productId');
  const navigate = useNavigate();
  const token = localStorage.getItem(ACCESS_TOKEN);
  const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN);
  const [loading, setLoading] = useState(true)
  const decode = isLoggedIn ? decodeToken(token) : null;
  const { triggerLogoAnimation } = useLogo();
  const [animationClass, setAnimationClass] = useState('');
  // const decodedToken = isLoggedIn ? decodeToken(token) : null;

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

  const getProduct = async (productId) => { // Ensure productId is passed as an argument
    try {
      const res = await api.post("/product/", { productId }); // Wrap productId in an object
      const data = res.data; // Extract data from the response
      setProducts(data); // Set the state with the product data
      setLoading(false)
    } catch (err) {
      alert("Error fetching product: " + err.message); // Display a user-friendly error message
      console.error(err); // Log the error for debugging
    }
  };

  // Fetch product data when the component mounts or when productId changes
  useEffect(() => {
    if (productId) {
      getProduct(productId); // Call the function to get the product
    }
  }, [productId]);


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
    setQuantity((prevQuantity) => {
      if (prevQuantity < products.stock) {
        return prevQuantity + 1; // Increment the quantity
      }
      return prevQuantity
    }
    )
      ; // List Qty
  };

  const decrement = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const AddToCart = async (productId, quantity) => {

    try {
      const userId = decode.user_id.toString();
      const encodedUserId = encryptParam(userId);

      const res = await api.get('/cart/', {
        params: { user_id: encodedUserId },
      });

      const cartItems = res.data;


      const existingItem = cartItems.cart_items.find(item => item.product.id === productId);


      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        await api.put('/cart/', {
          quantity: newQuantity,
          product_id: productId,
          user_id: encodedUserId
        });
      } else {
        await api.post('/cart/', {
          user_id: encodedUserId,
          product_id: productId,
          quantity: quantity,
        });
      }
      triggerLogoAnimation();

    } catch (err) {
      console.error('Error adding to cart:', err);
    }

  };

  if (loading) return <Loading />;
  return (
    <div>
      <div className="bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section: Product Images */}
          <div className="flex flex-col">
            <LazyLoadImage
              effect="blur"
              className="w-full h-auto rounded-lg shadow-md z-10"

              src={`http://127.0.0.1:8000${products.image_url}`}
              
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
                    <LazyLoadImage
                      effect="blur"
                      key={index}
                      className="h-20 w-20 object-cover rounded-lg shadow-md cursor-pointer"
                      src={products.image_url}
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
            <h1 className="text-2xl font-bold mb-2">{products.name}</h1>
            <p className="text-xl text-red-500">฿{Number(products.price).toLocaleString()}</p>

            <div className="mt-4">
              <label htmlFor="quantity" className="block text-lg font-semibold">
                จำนวน:
              </label>
              <p className='text-gray-400'>มีสินค้า: {products.stock} ชิ้น</p>
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
                  onChange={(e) => setQuantity(e.target.value)} // Assuming you have a setQuantity function to handle changes
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
              onClick={isLoggedIn ? () => AddToCart(products.id, quantity) : () => navigate("/login")}

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
            <div className="mt-6 bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">รายละเอียดสินค้า</h2>
              <p className="mt-2 text-gray-600 leading-relaxed">{products.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailInside;
