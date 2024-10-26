import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN,REFRESH_TOKEN } from "../constants"

function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1]; 
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); 
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload); 
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}

function Navbar() {
  const navigate = useNavigate();  // เรียกใช้ useNavigate เพื่อใช้งานในการเปลี่ยน path
  const token = localStorage.getItem(ACCESS_TOKEN);
  const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN);
  const decodedToken = isLoggedIn ? decodeToken(token) : null;
  console.log(decodedToken)

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    navigate('/login');  
  };

  return (
    <div className=" relative border-b-4 border-gray-300 bg-gradient-to-r from-red-500 to-red-700 p-4 shadow-lg ">
      <div className="flex justify-between items-center max-w-7xl mx-auto ">
        {/* Left Section: Logo and Series */}
        <div className="flex items-center space-x-8">
          <img
            className="h-20 w-auto cursor-pointer"
            src="src/image/LOGO.webp"
            alt="Logo"
            onClick={() => navigate("/")}
          />
          <div className=" group">
            <div className="text-white font-semibold text-lg cursor-pointer duration-150 hover:text-slate-300 hover:scale-110 ">
              SERIES
            </div>

            <div className="absolute left-0 mt-2 w-screen bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-200 z-50">
              <ul className="grid grid-cols-4 gap-6 text-gray-700 px-24 py-4">
                {[...Array(15).keys()].map((i) => (
                  <li
                    key={i}
                    className="hover:bg-gray-100 cursor-pointer text-center p-4 rounded-lg transition duration-150 ease-in-out"
                    onClick={() => navigate(`/series${i}`)}
                  >
                    <div className="flex flex-col items-center">
                      <img
                        src="src/image/picForNav.jpg"
                        alt={`Item ${i}`}
                        className="h-16 w-16 object-cover rounded-full mb-2 shadow-md"
                      />
                      <span className="text-sm font-medium text-gray-800">
                        Item{i}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* เพิ่ม Feature Buttons พร้อมระยะห่าง */}
          <div className="flex space-x-6">
            <div
              className="text-white font-semibold text-lg cursor-pointer duration-150 hover:text-slate-300 hover:scale-110"
              onClick={() => navigate("/feature1")}
            >
              Feature1
            </div>
            <div
              className="text-white font-semibold text-lg cursor-pointer duration-150 hover:text-slate-300 hover:scale-110"
              onClick={() => navigate("/feature2")}
            >
              Feature2
            </div>
            <div
              className="text-white font-semibold text-lg cursor-pointer duration-150 hover:text-slate-300 hover:scale-110"
              onClick={() => navigate("/feature3")}
            >
              Feature3
            </div>
          </div>
        </div>

        {isLoggedIn &&(
          <div className="flex items-center space-x-4 ml-auto mr-3">
          <button
            type="button"
            className="relative inline-flex items-center px-4 py-2 text-sm text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full hover:from-red-500 hover:to-red-800 focus:ring-4 focus:ring-red-300 shadow-lg transition duration-300 transform hover:scale-105"
          >
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              fill="currentColor"
            >
              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
            </svg>
            <span className="font-semibold">Username/Register</span>
          </button>
          <button
            type="button"
            className="relative inline-flex items-center px-1.5 py-1.5 text-sm text-white bg-[#c12222] rounded-full hover:bg-red-800 focus:ring-4 focus:ring-red-300 transition duration-300"
          >
            <svg
              className="w-5 h-5 me-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              fill="currentColor"
            >
              <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
            </svg>

            <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2">
              0
            </div>
          </button>
        </div>
        )}

        {/* Right Section: Login */}
        {isLoggedIn ? (
          <div
            className="text-white font-semibold text-lg cursor-pointer duration-150 hover:text-slate-300 hover:scale-110"
            onClick={handleLogout}
          >
            LOGOUT
          </div>
        ) : (
          <div
            className="text-white font-semibold text-lg cursor-pointer duration-150 hover:text-slate-300 hover:scale-110"
            onClick={() => navigate("/login")}
          >
            LOGIN
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
