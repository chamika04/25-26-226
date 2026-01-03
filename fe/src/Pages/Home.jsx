import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';
import mainbanner from '../assets/Main-Banner-1.png';
import MyFooter from '../components/MyFooter';

export default function Home() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    const exists = cart.some((item) => item._id === product._id);
    if (!exists) {
      setCart([...cart, product]);
    }
  };

  const goToPrescriptionForm = () => {
    navigate('/prescriptionform');
  };

  return (
    <div className="min-h-screen font-quicksand">
      {/* Navbar with cart length */}
      <Navbar size={cart.length} />

      {/* ===== HERO SECTION WITH IMAGE BACKGROUND ===== */}
      <div
        className="relative w-full flex items-center justify-center min-h-screen"
        style={{
          backgroundImage: `url(${mainbanner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Optional overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative flex w-full flex-col md:flex-row justify-between items-center gap-12 py-4 text-white px-4 lg:px-24">
          {/* LEFT TEXT SECTION */}
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-5xl font-ebgaramond leading-snug">
              Manage your health
            </h2>
            <h2 className="text-5xl font-ebgaramond leading-snug">
              with timely medication
            </h2>
            <span className="text-7xl font-bold text-blue-400">
              MediCare+
            </span>

            <p className="md:w-4/5 text-justify text-lg">
              Never run out of essential medicine again. Easily upload your prescription
              and purchase the drugs you need to better manage your health and wellbeing.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      
    </div>
  );
}
