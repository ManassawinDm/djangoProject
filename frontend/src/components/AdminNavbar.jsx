import React from 'react'
import { Link } from 'react-router-dom'

function AdminNavbar() {
  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between">
      <div className="text-white text-xl font-bold">
        <Link to="/admin/dashboard">Admin Dashboard</Link>
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
          <Link to="/admin/users" className="text-white hover:text-blue-400 font-medium">
            Manage Users
          </Link>
        </li>
        <li>
          <Link to="/admin/settings" className="text-white hover:text-blue-400 font-medium">
            Settings
          </Link>
        </li>
        <li>
          <Link to="/logout" className="text-white hover:text-red-400 font-medium">
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default AdminNavbar
