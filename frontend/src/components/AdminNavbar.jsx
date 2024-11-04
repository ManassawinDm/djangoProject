import React from 'react'
import { Link } from 'react-router-dom'
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useNavigate } from 'react-router-dom';


function AdminNavbar() {
  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem('permission_user');
    // navigate('/login');
    window.location.href = '/login';
  };
  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between">
      <div className="text-white text-xl font-bold">
        <Link to="/admin/dashboard">CS Admin</Link>
      </div>
      <ul className="flex space-x-6">
        <li>
          <Link to="/admin/orders" className="text-white hover:text-blue-400 font-medium">
            Manage Orders
          </Link>
        </li>
        <li>
          <Link to="/admin/products" className="text-white hover:text-blue-400 font-medium">
            Manage Products
          </Link>
        </li>
        <li>
          <Link to="/manageCategories" className="text-white hover:text-blue-400 font-medium">
            Manage Categories
          </Link>
        </li>
        <li>
          <Link onClick={handleLogout}  className="text-white hover:text-red-400 font-medium">
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default AdminNavbar
