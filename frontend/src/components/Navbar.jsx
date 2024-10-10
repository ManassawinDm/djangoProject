import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();  // เรียกใช้ useNavigate เพื่อใช้งานในการเปลี่ยน path

  return (
    <div className="border-b-4 border-gray-300 bg-gradient-to-r from-red-500 to-red-700 p-4 shadow-lg ">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Left Section: Logo and Series */}
        <div className="flex items-center space-x-8">
          <img className="h-20 w-auto cursor-pointer" src="src/image/LOGO.webp" alt="Logo"
            onClick={() => navigate('/')} />
          <div className="relative group">
            <div
              className="text-white font-semibold text-lg cursor-pointer duration-150 hover:text-slate-300 hover:scale-110 "
            >
              SERIES
            </div>

            {/* Dropdown menu */}
            <div className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-50">
              <ul className="text-gray-700">
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => navigate('/series1')}
                >
                  Series 1
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => navigate('/series2')}
                >
                  Series 2
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => navigate('/series3')}
                >
                  Series 3
                </li>
              </ul>
            </div>
          </div>

          {/* เพิ่ม Feature Buttons พร้อมระยะห่าง */}
          <div className="flex space-x-6">
            <div
              className="text-white font-semibold text-lg cursor-pointer duration-150 hover:text-slate-300 hover:scale-110"
              onClick={() => navigate('/feature1')}
            >
              Feature1
            </div>
            <div
              className="text-white font-semibold text-lg cursor-pointer duration-150 hover:text-slate-300 hover:scale-110"
              onClick={() => navigate('/feature2')}
            >
              Feature2
            </div>
            <div
              className="text-white font-semibold text-lg cursor-pointer duration-150 hover:text-slate-300 hover:scale-110"
              onClick={() => navigate('/feature3')}
            >
              Feature3
            </div>
          </div>
        </div>

        {/* Right Section: Login */}
        <div
          className="text-white font-semibold text-lg cursor-pointer duration-150 hover:text-slate-300 hover:scale-110"
          onClick={() => navigate('/login')}
        >
          LOGIN
        </div>
      </div>
    </div>
  );
}

export default Navbar;
