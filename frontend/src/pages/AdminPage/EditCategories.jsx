import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api';
import { useDropzone } from 'react-dropzone';

function EditCategories() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('CategoriesId'); 

    const [category, setCategory] = useState({
        name: '',
        description: '',
        category: '',
        image_url: ''
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getCategory();
    }, []);

    const getCategory = async () => {

        try {
            const res = await api.post('/category/', { categoryId });
            console.log(res.data)
            setCategory(res.data);
            setSelectedImage('http://127.0.0.1:8000' + res.data.image_url);
            setLoading(false);
        } catch (err) {
            alert('Error fetching category: ' + err.message);
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setCategory((prev) => ({
            ...prev,
            image_url: file
        }));

        const previewUrl = URL.createObjectURL(file);
        setSelectedImage(previewUrl);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false
    });

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('name', category.name);
        formData.append('description', category.description);
        formData.append('type', category.category);
    
        if (category.image_url instanceof File) {
            formData.append('image_url', category.image_url);
        } else {
            formData.append('image_url', category.image_url);
        }
    
        try {
            await api.put(`/addcategory/${categoryId}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Category updated successfully!');
            navigate('/admin/manage-categories');
        } catch (error) {
            console.error('Failed to update category:', error);
            alert('Error updating category');
        }
    };
    
    const handleDelete = async () => {
        const confirmed = window.confirm("คุณแน่ใจหรือว่าต้องการลบหมวดหมู่นี้?");
        if (!confirmed) return;
    
        try {
            await api.delete(`/addcategory/${categoryId}/`);
            alert('Category deleted successfully!');
            navigate('/admin/manage-categories');
        } catch (error) {
            console.error('Failed to delete category:', error);
            alert('Error deleting category');
        }
    };

    if (loading) return <p>กำลังโหลดข้อมูล...</p>;

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-[#e60021] mb-5">แก้ไขหมวดหมู่</h2>

            {selectedImage && (
                <div className="mb-4">
                    <img
                        src={selectedImage}
                        alt={category.name}
                        className="w-full h-60 object-cover rounded"
                    />
                </div>
            )}

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">ชื่อหมวดหมู่</label>
                <input
                    type="text"
                    name="name"
                    value={category.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">รายละเอียด</label>
                <textarea
                    name="description"
                    value={category.description}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">หมวดหมู่หลัก</label>
                <select
                    name="category"
                    value={category.category}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                >
                    <option value="">เลือกหมวดหมู่</option>
                    <option value="1" selected={category.category === "1"}>SERIES</option>
                    <option value="2" selected={category.category === "2"}>MEGA</option>
                    <option value="3" selected={category.category === "3"}>TYPE</option>
                    <option value="4" selected={category.category === "4"}>ACCESSORIES</option>
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
                    ลบหมวดหมู่
                </button>
            </div>
        </div>
    );
}

export default EditCategories;
