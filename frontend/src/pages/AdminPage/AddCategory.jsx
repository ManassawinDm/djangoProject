import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api'; // Import your API configuration for Axios
import { useDropzone } from 'react-dropzone';

function AddCategory() {
    const [category, setCategory] = useState({
        name: '',
        description: '',
        parent_category: '',
        images: [] // Store the selected image files here
    });

    const [selectedImages, setSelectedImages] = useState([]); // For preview
    const [parentCategories, setParentCategories] = useState([]); // Categories list
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const onDrop = (acceptedFiles) => {
        setCategory((prev) => ({
            ...prev,
            images: [...prev.images, ...acceptedFiles] // Store files directly
        }));

        const previews = acceptedFiles.map((file) => URL.createObjectURL(file));
        setSelectedImages((prev) => [...prev, ...previews]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false
    });

    const handleSave = async () => {
        let formData = new FormData();

        // Append text fields
        formData.append('name', category.name);
        formData.append('description', category.description);
        formData.append('parent_category', category.parent_category);

        // Append images (assuming single image upload)
        if (category.images.length > 0) {
            formData.append('image_url', category.images[0]); // Send the first image file
        }

        try {
            await api.post('/addcategory/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                maxBodyLength: Infinity
            });
            alert("Category added successfully!");
            navigate('/admin/manage-categories');
        } catch (error) {
            console.error("Failed to add category:", error);
            alert("Error adding category");
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get("/category/");
            setParentCategories(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-[#e60021] mb-5">เพิ่มหมวดหมู่ใหม่</h2>

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
                    name="parent_category"
                    value={category.parent_category}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                >

                    <option value="">เลือกหมวดหมู่หลัก</option>
                    <option value="1">Series</option>
                    <option value="2">MEGA</option>
                    <option value="3">TYPE</option>
                    <option value="4">ACCESSORY</option>

                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">รูปภาพ</label>
                <div
                    {...getRootProps()}
                    className="w-full p-6 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-600 cursor-pointer hover:bg-gray-50"
                >
                    <input {...getInputProps()} />
                    <p>Drag & drop or click to select images</p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                    {selectedImages.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt="Selected preview"
                            className="h-24 w-24 object-cover rounded-lg"
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between mt-6">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[#4caf50] text-white font-semibold rounded hover:bg-[#43a047]"
                >
                    บันทึก
                </button>
            </div>
        </div>
    );
}

export default AddCategory;
