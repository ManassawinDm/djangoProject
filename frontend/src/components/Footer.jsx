import React from 'react';

export default function Footer() {
  return (
    <div className="bg-gradient-to-r from-red-500 to-red-700 text-white py-4 ">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        <div className="text-sm">
          &copy; {new Date().getFullYear()} CS Art Toy. All Rights Reserved.
        </div>
        <div className="space-x-4">
          <a href="/privacy" className="duration-150 hover:text-slate-500">Privacy Policy</a>
          <a href="/terms" className="duration-150 hover:text-slate-500">Terms of Service</a>
          <a href="/contact" className="duration-150 hover:text-slate-500">Contact Us</a>
        </div>
      </div>
    </div>
  );
}
