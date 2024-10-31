import React from 'react'

function AdminFooter() {
  return (
    <footer className="bg-gray-800 p-4 text-center text-white">
      <div className="text-sm">
        &copy; {new Date().getFullYear()} E-Commerce Admin Dashboard. All rights reserved.
      </div>
      <div className="mt-2 space-x-4">
        <a href="/admin/help" className="hover:text-blue-400">
          Help
        </a>
        <a href="/admin/privacy-policy" className="hover:text-blue-400">
          Privacy Policy
        </a>
        <a href="/admin/contact" className="hover:text-blue-400">
          Contact Support
        </a>
      </div>
    </footer>
  )
}

export default AdminFooter
