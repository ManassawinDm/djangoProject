import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
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

function Navbar() {
  const { logoAnimation } = useLogo();
  const navigate = useNavigate();
  const token = localStorage.getItem(ACCESS_TOKEN);
  const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN);
  const decode = isLoggedIn ? decodeToken(token) : null;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(1);
  const [userInfo, setUserInfo] = useState({});
  const [cartInfo, setCartInfo] = useState({});
  const [Category, setCategory] = useState([]);



  useEffect(() => {
    getCategory();
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      GetDataUser();
      FechCart();
    }
  }, [isLoggedIn, logoAnimation])

  const handleNavigate = (url) => {
    setIsMobileMenuOpen(false); // Hide dropdown when navigating
    navigate(url); // Navigate to the new page
  };

  const CategoryData = Category.map((value) => ({
    id: value.id,
    name: value.name,
    description: value.description,
    image_url: value.image_url
  }));

  const GetDataUser = async () => {
    try {
      const res = await api.post("/userinfo/", { user_id: decode.user_id });
      const data = res.data;
      setUserInfo(data);
    } catch (err) {
      console.error(err);
    }
  };

  const FechCart = async () => {
    try {
      const res = await api.post("/cartinfo/", { user_id: decode.user_id });
      const data = res.data;
      // console.log(data)
      setCartInfo(data);
    } catch (err) {
      console.error(err);
    }
  };



  // Handle feature selection
  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    navigate('/login');
  };

  const getCategory = async () => {
    try {
      const res = await api.get("/category/");
      const data = res.data;
      setCategory(data);
      // setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="relative border-b-4 border-gray-300 bg-gradient-to-r from-red-500 to-red-700 p-4 shadow-lg relative">
      <div className="flex justify-between items-center max-w-7xl mx-auto ">
        {/* Logo */}
        <div className="flex items-center space-x-4 sm:space-x-8 ">
          {isLoggedIn ? (
            <img
              className="h-12 w-auto cursor-pointer sm:h-20"
              src="src/image/LOGO.webp"
              alt="Logo"
              onClick={() => navigate("/home")}
            />
          ) : (
            <img
              className="h-12 w-auto cursor-pointer sm:h-20"
              src="src/image/LOGO.webp"
              alt="Logo"
              onClick={() => navigate("/")}
            />
          )}

          {/* SERIES Dropdown */}
          <div className="hidden sm:block group ">
            <div className="text-white font-semibold text-sm sm:text-lg cursor-pointer duration-150 hover:text-slate-300 hover:scale-110">
              SERIES
            </div>
            <div className="absolute left-0 mt-2 w-screen bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-200 z-50">
              <ul className="grid grid-cols-4 gap-6 text-gray-700 px-24 py-4">
                {Category.map((i) =>
                  i.type == 1 ? (
                    <li
                      key={i}
                      className="hover:bg-gray-100 cursor-pointer text-center p-2 sm:p-4 rounded-lg transition duration-150 ease-in-out"
                      onClick={() => navigate(`/series?typeid=${i.id}`)}

                    >
                      <div className="flex flex-col items-center">

                        <img
                          src={i.image_url}
                          alt={i.name}
                          className="h-10 w-10 sm:h-16 sm:w-16 object-cover rounded-full mb-2 shadow-md"
                        />
                        <span className="text-xs sm:text-sm font-medium text-gray-800">
                          {i.name}
                        </span>
                      </div>
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          </div>

          <div className="hidden sm:block group ">
            <div className="text-white font-semibold text-sm sm:text-lg cursor-pointer duration-150 hover:text-slate-300 hover:scale-110">
              MEGA
            </div>
            <div className="absolute left-0 mt-2 w-screen bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-200 z-50">
              <ul className="grid grid-cols-4 gap-6 text-gray-700 px-24 py-4">
                {Category.map((i) =>
                  i.type == 2 ? (
                    <li
                      key={i}
                      className="hover:bg-gray-100 cursor-pointer text-center p-2 sm:p-4 rounded-lg transition duration-150 ease-in-out"
                      onClick={() => navigate(`/series?typeid=${i.id}`)}

                    >
                      <div className="flex flex-col items-center">

                        <img
                          src={i.image_url}
                          alt={i.name}
                          className="h-10 w-10 sm:h-16 sm:w-16 object-cover rounded-full mb-2 shadow-md"
                        />
                        <span className="text-xs sm:text-sm font-medium text-gray-800">
                          {i.name}
                        </span>
                      </div>
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          </div>
          <div className="hidden sm:block group ">
            <div className="text-white font-semibold text-sm sm:text-lg cursor-pointer duration-150 hover:text-slate-300 hover:scale-110">
              TYPE
            </div>
            <div className="absolute left-0 mt-2 w-screen bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-200 z-50">
              <ul className="grid grid-cols-4 gap-6 text-gray-700 px-24 py-4">
                {Category.map((i) =>
                  i.type == 3 ? (
                    <li
                      key={i}
                      className="hover:bg-gray-100 cursor-pointer text-center p-2 sm:p-4 rounded-lg transition duration-150 ease-in-out"
                      onClick={() => navigate(`/series?typeid=${i.id}`)}

                    >
                      <div className="flex flex-col items-center">

                        <img
                          src={i.image_url}
                          alt={i.name}
                          className="h-10 w-10 sm:h-16 sm:w-16 object-cover rounded-full mb-2 shadow-md"
                        />
                        <span className="text-xs sm:text-sm font-medium text-gray-800">
                          {i.name}
                        </span>
                      </div>
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          </div>
          <div className="hidden sm:block group ">
            <div className="text-white font-semibold text-sm sm:text-lg cursor-pointer duration-150 hover:text-slate-300 hover:scale-110">
              ACCESSORY
            </div>
            <div className="absolute left-0 mt-2 w-screen bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-200 z-50">
              <ul className="grid grid-cols-4 gap-6 text-gray-700 px-24 py-4">
                {Category.map((i) =>
                  i.type == 4 ? (
                    <li
                      key={i}
                      className="hover:bg-gray-100 cursor-pointer text-center p-2 sm:p-4 rounded-lg transition duration-150 ease-in-out"
                      onClick={() => navigate(`/series?typeid=${i.id}&typename=${i.name}`)}

                    >
                      <div className="flex flex-col items-center">

                        <img
                          src={i.image_url}
                          alt={i.name}
                          className="h-10 w-10 sm:h-16 sm:w-16 object-cover rounded-full mb-2 shadow-md"
                        />
                        <span className="text-xs sm:text-sm font-medium text-gray-800">
                          {i.name}
                        </span>
                      </div>
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="sm:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='border-t-2 border-red-600 sm:hidden absolute top-16 left-0 w-full h-screen bg-gradient-to-r from-red-500 to-red-700 shadow-lg z-50'>
            <div className="grid grid-cols-3  h-screen">

              {/* Feature List Section */}
              <div className="bg-slate-200 col-span-1  text-black">
                <ul className="">
                  <li
                    className={`py-4 pl-2  font-bold text-lg cursor-pointer ${selectedFeature === 1 ? "bg-gradient-to-r from-red-500 to-red-600 text-white" : ""
                      }`}
                    onClick={() => handleFeatureClick(1)}
                  >
                    SERIES
                  </li>

                  <li
                    className={`py-4 pl-2 font-bold text-lg cursor-pointer ${selectedFeature === 2 ? "bg-gradient-to-r from-red-500 to-red-600 text-white" : ""
                      }`}
                    onClick={() => handleFeatureClick(2)}
                  >
                    MEGA
                  </li>
                  <li
                    className={`py-4 pl-2 font-bold text-lg cursor-pointer ${selectedFeature === 3 ? "bg-gradient-to-r from-red-500 to-red-600 text-white" : ""
                      }`}
                    onClick={() => handleFeatureClick(3)}
                  >
                    TYPES
                  </li>
                  <li
                    className={`py-4 pl-2 font-bold text-lg cursor-pointer ${selectedFeature === 4 ? "bg-gradient-to-r from-red-500 to-red-600 text-white" : ""
                      }`}
                    onClick={() => handleFeatureClick(4)}
                  >
                    ACCESSORIES
                  </li>
                </ul>
              </div>

              {/* Detail Section */}
              <div className="bg-white col-span-2 p-4 flex flex-col text-white font-semibold text-lg relative overflow-y-auto">

                {selectedFeature && (
                  <ul className="">
                    {
                      Category.map((item) => 
                        item.type==selectedFeature ?(
                        
                        <li
                          key={item.id}
                          className=" text-gray-800 p-4 flex items-center space-x-4"
                          onClick={() => handleNavigate(`/series?typeid=${item.id}`)}
                        >
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-16 w-16 object-cover rounded-full shadow-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{item.name}</h3>
                          </div>
                        </li>

                      ):null
                    )
                    }
                  </ul>
                )}


              </div>

            </div>
          </div>
        )}



        {/* User Section */}
        {isLoggedIn && (
          <div className="flex items-center space-x-4 ml-auto mr-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 text-sm text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full hover:from-red-500 hover:to-red-800 focus:ring-4 focus:ring-red-300 shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
              </svg>
              <span className="font-semibold">{userInfo && userInfo.email ? userInfo.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : 'Username/Register'}</span>
            </button>
            <button
              type="button"
              className="relative inline-flex items-center px-1.5 py-1.5 text-sm text-white bg-[#c12222] rounded-full hover:bg-red-800 focus:ring-4 focus:ring-red-300 transition duration-300"
            >
              {logoAnimation ? (
                <svg
                  className="w-10 h-10 me-2 "
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  fill="currentColor"
                  onClick={() => navigate("/cartlist")}
                >
                  <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 me-2 "
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  fill="currentColor"
                  onClick={() => navigate("/cartlist")}
                >
                  <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                </svg>
              )}

              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2">
                {Array.isArray(cartInfo) ? cartInfo.length : 0}
              </div>
            </button>
          </div>

        )}



        {/* Login/Logout Button */}
        <div
          className="text-white font-semibold text-sm sm:text-lg cursor-pointer duration-150 hover:text-slate-300 hover:scale-110"
          onClick={isLoggedIn ? handleLogout : () => navigate("/login")}
        >
          {isLoggedIn ? "LOGOUT" : "LOGIN"}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
