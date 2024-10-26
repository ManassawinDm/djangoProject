import React, { useEffect, useRef, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import api from '../api';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';


function PreHome() {
    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [visibleCount, setVisibleCount] = useState(15);
    const observer = useRef();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(()=> {
        getProduct();
    },[])

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
            <div className="w-full grid grid-cols-5">
                <div className="grid col-start-2 col-end-5">
                    <h1 className="flex justify-start mt-10 mb-3 font-sans text-2xl text-[#e60021] font-bold"> สินค้าใหม่ </h1>
                    <ul className="grid grid-cols-5 gap-6 ">
                        {visibleProducts.map((product, index) => (
                            <li key={product.id} ref={visibleProducts.length === index + 1 ? lastProductRef : null} className="text-left mb-16">
                                <button onClick={() => handleImageClick(product.id)}>
                                    <LazyLoadImage
                                        effect="blur"
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-auto object-cover mb-4 rounded-md"
                                    />
                                </button>
                                <strong className="block text-[#9f6f00] text-lg font-semibold">POP MART</strong>
                                <p className="font-semibold text-lg mb-5">
                                    {product.name.length > 20 ? `${product.name.slice(0, 20)}...` : product.name}
                                </p>
                                <p className="text-[#d2001e] font-bold">฿{product.price}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

  )
}

export default PreHome