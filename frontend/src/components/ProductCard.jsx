import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';

const ProductCard = ({ headline, product, handleClick }) => {
  return (
    <div className='my-16 px-4 lg:px-24 bg-black' >
      <h2 className='text-4xl text-center font-bold text-black my-5'>{headline}</h2>
      <div className=''>
        <Swiper
          slidesPerView={4}
          spaceBetween={10}
          grabCursor={true}
          pagination={{ clickable: true }}
          className="mySwiper"
        >
          {product.map(product => (
            <SwiperSlide key={product._id}>
              <Link to="/shop">
                <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
                  <img src={product.imageUrl} alt={product.productName} style={{ maxWidth: '100%', height: 'auto' }} />
                  <a>
                    <h5 className="text-lg font-semibold tracking-tight text-black dark:text-white">
                      {product.productName}
                    </h5>
                    <p className=" text-sm text-gray-600">{product.description}</p>
                  </a>
                  <div className="mb-2 mt-1 flex items-center">
                    {/* Your rating icons */}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Rs {product.price}</span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ProductCard;
