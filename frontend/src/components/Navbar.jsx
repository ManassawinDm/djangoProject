import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN,REFRESH_TOKEN } from "../constants"
function Navbar() {
  const navigate = useNavigate();  // เรียกใช้ useNavigate เพื่อใช้งานในการเปลี่ยน path

  const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN);

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
          <img className="h-20 w-auto cursor-pointer" src="src/image/LOGO.webp" alt="Logo"
            onClick={() => navigate('/')} />
          <div className=" group">
            <div
              className="text-white font-semibold text-lg cursor-pointer duration-150 hover:text-slate-300 hover:scale-110 "
            >
              SERIES
            </div>


            <div className="absolute left-0 mt-2 w-screen bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-50">
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
                      <span className="text-sm font-medium text-gray-800">Item{i}</span>
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
            onClick={() => navigate('/login')}
          >
            LOGIN
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
