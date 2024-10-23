import React from 'react';
import { useLocation } from 'react-router-dom';

function ProductDetail() {
    // Use useLocation to get the current URL's query parameters
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const productId = queryParams.get('productId'); // Retrieve the 'productId' query parameter

    return (
        <div>
            <h1>Product Detail</h1>
            {productId ? (
                <div>
                    <img
                    src={`src/image/${productId}.jpg`} //เดี๋ยวเปลี่ยนเป็น product.image_url
                    alt={productId}
                    className="w-full h-auto object-cover mb-4 rounded-md"
                />
                    <p>Product ID: {productId}</p>
                </div>

            ) : (
                <p>No Product ID found</p>
            )}
        </div>
    );
}

export default ProductDetail;
