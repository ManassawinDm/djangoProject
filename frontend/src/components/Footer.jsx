import React from 'react';

export default function Footer() {
  return (
    <div className="bg-gradient-to-r from-red-500 to-red-700 text-white py-4 mt-1">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        <div className="text-sm">
          &copy; {new Date().getFullYear()} Your Company Name. All Rights Reserved.
        </div>
        <div className="space-x-4">
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:underline">Terms of Service</a>
          <a href="/contact" className="hover:underline">Contact Us</a>
        </div>
      </div>
    </div>
  );
}
