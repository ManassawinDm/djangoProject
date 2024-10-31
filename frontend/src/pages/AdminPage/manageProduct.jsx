import React, { useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import api from '../../api'
import { useNavigate } from 'react-router-dom'

function ManageProduct() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        getProduct()
    }, [])

    const handleProductClick = (productID) => {
        navigate(`/product?productId=${productID}`)
    }

    const getProduct = async () => {
        try {
            const res = await api.get("/")
            setProducts(res.data)
        } catch (err) {
            console.error("Failed to load products:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full p-6">
            <div>
            <h1 className="text-2xl font-bold text-[#e60021] mb-5">จัดการสินค้า</h1>
            <button>เพิ่มสินค้า</button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">รูปสินค้า</th>
                            <th className="text-left p-4 font-semibold text-gray-600">ชื่อสินค้า</th>
                            <th className="text-left p-4 font-semibold text-gray-600">ราคา</th>
                            <th className="text-left p-4 font-semibold text-gray-600">ของคงเหลือ</th>
                            <th className="text-left p-4 font-semibold text-gray-600">ยอดขาย</th>
                            <th className="p-4 font-semibold text-gray-600">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center p-6 text-gray-500">กำลังโหลดข้อมูล...</td>
                            </tr>
                        ) : products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id} className="border-b hover:bg-gray-50" onClick={() => handleProductClick(product.id)}>
                                    <td className="p-4">
                                        <LazyLoadImage
                                            effect="blur"
                                            src={`../${product.image_url}` || '/placeholder.jpg'}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    </td>
                                    <td className="p-4">
                                        <button 
                                            
                                            className="text-[#9f6f00] hover:underline"
                                        >
                                            {product.name}
                                        </button>
                                    </td>
                                    <td className="p-4 text-[#d2001e] font-bold">฿{product.price}</td>
                                    <td className="p-4 text-gray-700">{product.stock || 'N/A'}</td>
                                    <td className="p-4 text-gray-700">0</td> {/* Dummy sales data */}
                                    <td className="p-4">
                                        <button className="text-blue-600 hover:underline mr-2">แก้ไข</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center p-6 text-gray-500">ไม่พบสินค้าที่มีอยู่</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManageProduct
