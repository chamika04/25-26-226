import React from 'react';
import Card from '../home/Card';

const Banner = () => {
  return (
    <div 
      className="h-screen bg-cover bg-center bg-no-repeat text-white flex justify-center items-center"
      style={{ backgroundImage: "url('https://cdn.pixabay.com/photo/2017/01/09/11/30/dumbbell-1966247_1280.jpg')" }}
    >
      <div className="flex flex-col justify-center items-center text-center space-y-8">
        <h2 className="text-5xl font-bold leading-snug">
          Buy from one place! 
          <span className="text-orange-900"> For the best price</span>
        </h2>
        <p className="md:w-4/5 text-gray-300">
          "Discover your fitness essentials here. From gear to apparel, we've got you covered. 
          Elevate your gym sessions with our curated collection."
        </p>
      </div>
    </div>
  );
};

export default Banner;
