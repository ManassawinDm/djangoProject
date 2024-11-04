import React, { useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import api from '../../api'
import { useNavigate } from 'react-router-dom'

function ManageOrder() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        getOrders()
    }, [])

    const getOrders = async () => {
        try {
            const res = await api.get("/orders") // API endpoint for fetching orders
            setOrders(res.data)
        } catch (err) {
            console.error("Failed to load orders:", err)
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (orderID, newStatus) => {
        try {
            await api.put(`/orders/${orderID}/`, { status: newStatus }) // PATCH request to update order status
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderID ? { ...order, status: newStatus } : order
                )
            )
        } catch (err) {
            console.error("Failed to update order status:", err)
        }
    }

    return (
        <div className="w-full p-6">
            <div className='flex justify-between items-center'>
                <h1 className="text-2xl font-bold text-[#e60021] mb-5">จัดการคำสั่งซื้อ</h1>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                        
                            <th className="text-left p-4 font-semibold text-gray-600">ชื่อผู้สั่ง</th>
                            <th className="text-left p-4 font-semibold text-gray-600">จำนวน</th>
                            <th className="text-left p-4 font-semibold text-gray-600">ราคารวม</th>
                            <th className="text-left p-4 font-semibold text-gray-600">สถานะ</th>
                            <th className="p-4 font-semibold text-gray-600">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center p-6 text-gray-500">กำลังโหลดข้อมูล...</td>
                            </tr>
                        ) : orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">
                                        <button className="text-[#9f6f00] hover:underline">
                                            {order.customer_name}
                                        </button>
                                    </td>
                                    <td className="p-4 text-gray-700">{order.quantity}</td>
                                    <td className="p-4 text-[#d2001e] font-bold">฿{order.total_price}</td>
                                    <td className="p-4">
                                        <select
                                            defaultValue={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                        >
                                            <option value="PENDING">รอดำเนินงาน</option>
                                            <option value="PaymentCompleted">ชำระเงินเสร็จแล้ว</option>
                                            <option value="DELIVERED">จัดส่งแล้ว</option>
                                            <option value="CANCELLED">ยกเลิก</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            className="text-blue-500 hover:underline"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent handleOrderClick from firing
                                                navigate(`/admin/order-details/${order.id}`);
                                            }}
                                        >
                                            รายละเอียด
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center p-6 text-gray-500">ไม่พบคำสั่งซื้อที่มีอยู่</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManageOrder
