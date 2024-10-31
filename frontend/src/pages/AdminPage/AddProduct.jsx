import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'

function AddProduct() {
     const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',  // เก็บค่าของหมวดหมู่
        image_url: ''
    })
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setProduct((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSave = async () => {
        try {
            await api.post('/products', product)
            alert("Product added successfully!")
            navigate('/admin/manage-products')
        } catch (error) {
            console.error("Failed to add product:", error)
            alert("Error adding product")
        }
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-[#e60021] mb-5">เพิ่มสินค้าใหม่</h2>
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">ชื่อสินค้า</label>
                <input 
                    type="text" 
                    name="name" 
                    value={product.name} 
                    onChange={handleChange} 
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">รายละเอียด</label>
                <textarea 
                    name="description" 
                    value={product.description} 
                    onChange={handleChange} 
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">ราคา</label>
                <input 
                    type="number" 
                    name="price" 
                    value={product.price} 
                    onChange={handleChange} 
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">ของคงเหลือ</label>
                <input 
                    type="number" 
                    name="stock" 
                    value={product.stock} 
                    onChange={handleChange} 
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">หมวดหมู่</label>
                <select
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                >
                    <option value="">เลือกหมวดหมู่</option>
                    <option value="1">SERIES</option>
                    <option value="2">MEGA</option>
                    <option value="3">TYPE</option>
                    <option value="4">ACCESSORIES</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">รูปภาพ URL</label>
                <input 
                    type="text" 
                    name="image_url" 
                    value={product.image_url} 
                    onChange={handleChange} 
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="flex items-center justify-between">
                <button 
                    onClick={handleSave} 
                    className="px-4 py-2 bg-[#4caf50] text-white font-semibold rounded hover:bg-[#43a047]"
                >
                    บันทึก
                </button>
            </div>
        </div>
    )
}

export default AddProduct
