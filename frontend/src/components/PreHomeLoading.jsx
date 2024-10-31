import React, { useEffect, useRef, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useNavigate } from 'react-router-dom';

function PreHome() {
    const [loading, setLoading] = useState(true); // ตั้งค่า loading เริ่มต้นเป็น true



    // สร้าง Skeleton UI
    const renderSkeleton = () => (
        <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: 15 }).map((_, index) => (
                <li key={index} className="animate-pulse">
                    <div className="bg-gray-300 h-48 mb-4 rounded-md"></div>
                    <div className="bg-gray-300 h-6 w-24 mb-2 rounded"></div>
                    <div className="bg-gray-300 h-6 w-36 mb-4 rounded"></div>
                    <div className="bg-gray-300 h-6 w-20 rounded"></div>
                </li>
            ))}
        </ul>
    );

    return (
        <div className="w-full grid grid-cols-5">
            <div className="grid col-start-2 col-end-5">
                <h1 className="flex justify-start mt-10 mb-3 text-2xl text-[#e60021] font-bold  ">
                    สินค้าใหม่
                </h1>
                {loading && (
                    renderSkeleton() // แสดง Skeleton ระหว่างโหลด
                ) }
            </div>
        </div>
    );
}

export default PreHome;
