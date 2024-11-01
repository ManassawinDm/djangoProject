import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../../api'

function EditProduct() {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const productId = queryParams.get('productId')
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        image_url: ''
    })
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        getProduct()
    }, [])

    const getProduct = async () => {
        try {
            const res = await api.post("/product/", { productId })
            setProduct(res.data)
            
            setLoading(false)
        } catch (err) {
            alert("Error fetching product: " + err.message)
            console.error(err)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setProduct((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSave = async () => {
        try {
            await api.put(`/products/${productId}`, product)
            alert("Product updated successfully!")
            navigate("/admin/manage-products")
        } catch (error) {
            console.error("Failed to update product:", error)
            alert("Error updating product")
        }
    }

    if (loading) return <p>กำลังโหลดข้อมูล...</p>

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-[#e60021] mb-5">แก้ไขสินค้า</h2>

            {product.image_url && (
                <div className="mb-4">
                    <img src={product.image_url} alt={product.name} className="w-full h-60 object-cover rounded" />
                </div>
            )}

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
                    <option value="1" selected={product.category === "1"}>SERIES</option>
                    <option value="2" selected={product.category === "2"}>MEGA</option>
                    <option value="3" selected={product.category === "3"}>TYPE</option>
                    <option value="4" selected={product.category === "4"}>ACCESSORIES</option>
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

export default EditProduct
