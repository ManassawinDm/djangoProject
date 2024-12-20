import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api';
import { useDropzone } from 'react-dropzone';

function EditProduct() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const productId = queryParams.get('productId');

    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        image_url: ''
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [Category, setCategory] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]); // For preview

    const navigate = useNavigate();

    useEffect(() => {
        getProduct();
        getCategory();
    }, []);
    const getCategory = async () => {
        try {
            const res = await api.get("/category/");
            setCategory(res.data);
        } catch (err) {
            console.log(err);
        }
    };
    const getProduct = async () => {
        try {
            const res = await api.post('/product/', { productId });
            setProduct(res.data);
            setSelectedImage('http://127.0.0.1:8000'+res.data.image_url);
            setLoading(false);
        } catch (err) {
            alert('Error fetching product: ' + err.message);
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const onDrop = (acceptedFiles) => {
        console.log('Accepted files:', acceptedFiles); // ตรวจสอบว่ามีไฟล์หรือไม่
        const previews = acceptedFiles.map((file) => URL.createObjectURL(file));
        setSelectedImages((prev) => [...prev, ...previews]);
        setProduct((prev) => ({
            ...prev,
            image_url: acceptedFiles[0] // ตรวจสอบว่าถูกต้องหรือไม่
        }));
    };
    

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false
    });

    const handleSave = async () => {
        let formData = new FormData();
        
        // Append text fields
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('stock', product.stock);
        formData.append('category', product.category);


        if (product.image_url instanceof File) {
            formData.append('image_url', product.image_url);
        } else {
            formData.append('image_url', product.image_url);
        }

        try {
            await api.put(`/addproducts/${productId}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Product updated successfully!');
            navigate('/admin/manage-products');
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: 'Error updating product', error,
              });
            // alert('Error updating product');
        }
    };
    

    const handleDelete = async () => {
        const confirmed = window.confirm("คุณแน่ใจหรือว่าต้องการลบสินค้านี้?");
        if (!confirmed) return;

        try {
            await api.delete(`/addproducts/${productId}/`);
            alert('Product deleted successfully!');
            navigate('/admin/manage-products');
        } catch (error) {
            console.error('Failed to delete product:', error);
            alert('Error deleting product');
        }
    };

    if (loading) return <p>กำลังโหลดข้อมูล...</p>;

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-[#e60021] mb-5">แก้ไขสินค้า</h2>

            {selectedImage && (
                <div className="mb-4">
                    <img
                        src={selectedImage}
                        alt={product.name}
                        className="w-full h-60 object-cover rounded"
                    />
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
                    {Category.map((item) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">รูปภาพ</label>
                <div
                    {...getRootProps()}
                    className="w-full p-6 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-600 cursor-pointer hover:bg-gray-50"
                >
                    <input {...getInputProps()} />
                    <p>Drag & drop or click to select an image</p>
                </div>
            </div>

            <div className="flex items-center justify-between mt-6">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[#4caf50] text-white font-semibold rounded hover:bg-[#43a047]"
                >
                    บันทึก
                </button>
                <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600"
                >
                    ลบสินค้า
                </button>
            </div>
        </div>
    );
}

export default EditProduct;
