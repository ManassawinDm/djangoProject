import React from 'react';
import { FaBox, FaUsers, FaDollarSign, FaShoppingCart } from 'react-icons/fa';

function AdminHome() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow-lg p-4 rounded-lg flex items-center">
          <FaDollarSign className="text-green-500 text-4xl" />
          <div className="ml-4">
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-lg font-semibold">$22,130</p>
          </div>
        </div>
        
        <div className="bg-white shadow-lg p-4 rounded-lg flex items-center">
          <FaShoppingCart className="text-blue-500 text-4xl" />
          <div className="ml-4">
            <p className="text-sm text-gray-500">Orders</p>
            <p className="text-lg font-semibold">12</p>
          </div>
        </div>
        
        <div className="bg-white shadow-lg p-4 rounded-lg flex items-center">
          <FaUsers className="text-purple-500 text-4xl" />
          <div className="ml-4">
            <p className="text-sm text-gray-500">Users</p>
            <p className="text-lg font-semibold">15</p>
          </div>
        </div>
        
        <div className="bg-white shadow-lg p-4 rounded-lg flex items-center">
          <FaBox className="text-yellow-500 text-4xl" />
          <div className="ml-4">
            <p className="text-sm text-gray-500">Inventory</p>
            <p className="text-lg font-semibold">435 items</p>
          </div>
        </div>
      </div>
      
      {/* Recent Activity and Navigation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            <li className="flex justify-between text-gray-600">
              <span>Order #12345</span>
              <span className="text-green-500">Completed</span>
            </li>
            <li className="flex justify-between text-gray-600">
              <span>User Registration: john_doe</span>
              <span className="text-blue-500">New User</span>
            </li>
            <li className="flex justify-between text-gray-600">
              <span>Product: Wireless Headphones</span>
              <span className="text-yellow-500">Low Stock</span>
            </li>
          </ul>
        </div>
        
        {/* Quick Navigation */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-green-100 text-green-700 p-4 rounded-lg font-medium hover:bg-green-200">
              Manage Products
            </button>
            <button className="bg-blue-100 text-blue-700 p-4 rounded-lg font-medium hover:bg-blue-200">
              View Orders
            </button>
            <button className="bg-purple-100 text-purple-700 p-4 rounded-lg font-medium hover:bg-purple-200">
              User Management
            </button>
            <button className="bg-yellow-100 text-yellow-700 p-4 rounded-lg font-medium hover:bg-yellow-200">
              Inventory Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
