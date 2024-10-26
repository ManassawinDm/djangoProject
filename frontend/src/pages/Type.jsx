import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

function Type() {
    const [products, setProducts] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const typeId = queryParams.get('typeid'); // Retrieve the 'typeid' query parameter
    const typename = queryParams.get('typename'); // Retrieve the 'typeid' query parameter

    const navigate = useNavigate();

    const getProduct = async (typeId) => {
        console.log(typeId)
        try {
            const res = await api.post("/type/", { typeId }); // Wrap typeId in an object
            const data = res.data; // Extract data from the response
            setProducts(data); // Set the state with the product data
        } catch (err) {
            alert("Error fetching product: " + err.message); // Display a user-friendly error message
            console.error(err); // Log the error for debugging
        }
    };

    // Fetch product data when the component mounts or when typeId changes
    useEffect(() => {
        if (typeId) {
            getProduct(typeId); // Call the function to get the product
        }
    }, [typeId]);

    const handleImageClick = (productID) => {
        navigate(`/product?productId=${productID}`);
    };

    return (
        <div className="container mx-auto px-36 ">
            <h1 className="mt-10 mb-3 font-sans text-4xl text-[#e60021] font-bold text-center">{typename}</h1>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.length > 0 ? (
                    products.map((product) => (
                        <li key={product.id} className="text-left mb-16">
                            <button
                                onClick={() => handleImageClick(product.id)}
                                className="block w-full h-full"
                                aria-label={`View details of ${product.name}`}
                            >
                                <LazyLoadImage
                                    effect="blur"
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-48 object-cover mb-4 rounded-md"
                                />
                            </button>
                            <strong className="block text-[#9f6f00] text-lg font-semibold">POP MART</strong>
                            <p className="font-semibold text-lg mb-2">
                                {product.name.length > 20 ? `${product.name.slice(0, 20)}...` : product.name}
                            </p>
                            <p className="text-[#d2001e] font-bold">฿{product.price}</p>
                        </li>
                    ))
                ) : (
                    <p className="text-center text-gray-600">No products found for this type.</p>
                )}
            </ul>
        </div>
    );
}

export default Type;
