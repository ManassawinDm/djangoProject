import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { useDropzone } from 'react-dropzone';

function AddProduct() {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        images: []
    });

    const [selectedImages, setSelectedImages] = useState([]);
    const [Category, setCategory] = useState([]);

    const navigate = useNavigate();
    
    useEffect(() => {
        getCategory();
    }, []);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const onDrop = (acceptedFiles) => {
        const promises = acceptedFiles.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result); // This is the base64 string
                reader.onerror = reject;
                reader.readAsDataURL(file); // Read file as base64
            });
        });

        Promise.all(promises)
            .then((base64Images) => {
                setProduct((prev) => ({
                    ...prev,
                    images: [...prev.images, ...base64Images]
                }));
                
                // Show previews
                setSelectedImages((prev) => [
                    ...prev,
                    ...base64Images
                ]);
            })
            .catch((error) => {
                console.error("Failed to read files:", error);
                alert("Error reading files");
            });
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false
    });

    const handleSave = async () => {
        const payload = { 
            
            ...product,
            image_url: selectedImages[0] // สมมุติว่าคุณต้องการส่ง URL ของรูปภาพที่ถูกสร้างขึ้น
        };
    
        try {
            await api.post('/addproducts', payload);
            alert("Product added successfully!");
            navigate('/admin/manage-products');
        } catch (error) {
            console.error("Failed to add product:", error);
            alert("Error adding product");
        }
    };
    

    const getCategory = async () => {
        try {
            const res = await api.get("/category/");
            const data = res.data;
            setCategory(data);
        } catch (err) {
            console.log(err);
        }
    };

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

export default AddProduct;
