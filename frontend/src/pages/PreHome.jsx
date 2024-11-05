import React, { useEffect, useRef, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import api from '../api';
import Loading from '../components/PreHomeLoading';
import { useNavigate } from 'react-router-dom';


function PreHome() {
    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [visibleCount, setVisibleCount] = useState(15);
    const observer = useRef();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getProduct();
    }, [])

    useEffect(() => {
        setVisibleProducts(products.slice(0, visibleCount));
    }, [products, visibleCount]);


    const lastProductRef = (node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setVisibleCount(prevCount => prevCount + 15);
            }
        });
        if (node) observer.current.observe(node);
    };

    const handleImageClick = (productID) => {
        navigate(`/product?productId=${productID}`);
    };



    const getProduct = async () => {
        try {
            const res = await api.get("/");
            const data = res.data;
            setProducts(data);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }
    if (loading) return <Loading />;
    return (
        <div className="w-full grid grid-cols-12 lg:grid-cols-7">
            <div className="grid col-start-2 col-end-12 lg:col-start-2 lg:col-end-7">
                <h1 className="flex justify-start lg:mt-10 mb-3  text-2xl text-[#e60021] font-bold font-sarabun"> สินค้าใหม่ </h1>
                <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-6">
                    {visibleProducts.map((product, index) => (
                        <li key={product.id} ref={visibleProducts.length === index + 1 ? lastProductRef : null} className="bg-white border border-gray-200 rounded-lg shadow-lg transition-shadow hover:shadow-xl overflow-hidden">
                            <button onClick={() => handleImageClick(product.id)} className="w-full bg-slate-100">
                                <LazyLoadImage
                                    effect="blur"
                                    src={`http://127.0.0.1:8000${product.image_url}`}

                                    // src={product.image
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                            </button>
                            <div className="p-5">
                                <p className="font-semibold text-lg mb-2 min-h-[3rem] line-clamp-2">
                                    {product.name}
                                </p>

                                <p className="text-[#d2001e] font-bold mb-4">฿{Number(product.price).toLocaleString()}</p>


                                <div className="flex  justify-center hidden lg:block">
                                    <button className="relative inline-flex items-center px-4 py-2 overflow-hidden font-medium bg-red-500 text-white rounded-lg transition duration-300 ease-in-out group hover:bg-red-600">
                                        <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-in-out -translate-x-full translate-y-full bg-red-600 rounded-xl group-hover:translate-x-0 group-hover:translate-y-0"></span>
                                        <svg
                                            className="w-5 h-5 me-2 z-10"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 576 512"
                                            fill="#ffffff"
                                        >
                                            <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                                        </svg>
                                        <span className="relative z-10">
                                            ชื้อสินค้า
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    )
}

export default PreHome