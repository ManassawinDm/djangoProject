import React, { useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import api from '../../api'
import { useNavigate } from 'react-router-dom'

function ManageCategories() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        getCategories()
    }, [])

    const handleCategoryClick = (categoryId) => {
        navigate(`/Categories?CategoriesId=${categoryId}`)
    }

    const getCategories = async () => {
        try {
            const res = await api.get("category/")
            setCategories(res.data)
        } catch (err) {
            console.error("Failed to load categories:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full p-6">
            <div className='flex justify-between items-center'>
                <h1 className="text-2xl font-bold text-[#e60021] mb-5">จัดการหมวดหมู่</h1>

                <button
                    className="bg-[#e60021] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#bf001a] transition-colors duration-200"
                    onClick={() => navigate('/admin/add-category')}
                >
                    เพิ่มหมวดหมู่
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">รูปหมวดหมู่</th>
                            <th className="text-left p-4 font-semibold text-gray-600">ชื่อหมวดหมู่</th>
                            <th className="text-left p-4 font-semibold text-gray-600">ยอดขาย</th>
                            <th className="p-4 font-semibold text-gray-600">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center p-6 text-gray-500">กำลังโหลดข้อมูล...</td>
                            </tr>
                        ) : categories.length > 0 ? (
                            categories.map((category) => (
                                <tr key={category.id} className="border-b hover:bg-gray-50" onClick={() => handleCategoryClick(category.id)}>
                                    <td className="p-4">
                                        <LazyLoadImage
                                            effect="blur"
                                            src={`http://127.0.0.1:8000${category.image_url}`}
                                            alt={category.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    </td>
                                    <td className="p-4">
                                        <button className="text-[#9f6f00] hover:underline">
                                            {category.name}
                                        </button>
                                    </td>
                                    <td className="p-4 text-gray-700">0</td> {/* Dummy sales data */}
                                    <td className="p-4">
                                        <button className="text-blue-600 hover:underline mr-2">แก้ไข</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center p-6 text-gray-500">ไม่พบหมวดหมู่ที่มีอยู่</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManageCategories
