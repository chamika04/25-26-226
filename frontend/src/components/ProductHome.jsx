import React from 'react';
import { Link } from "react-router-dom";

const ProductHome = () => {
    return (
        <div className="flex flex-col items-center justify-center bg-black p-8 rounded-lg shadow-lg">
            
            {/* Product Card */}
            <div>
                
                {/* Content Section */}
                <div className="text-center ">
                    <h2 className="text-xl font-bold">
                        <span className="text-orange-500 -2">Get Expert Recommendations for Your Fitness Needs</span>
                    </h2>               
                </div>
                
                <img 
                    src="https://nypost.com/wp-content/uploads/sites/2/2022/09/amazonfit.jpg?quality=75&strip=all" 
                    alt="Fitness Gear"
                    className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h2 className="text-center text-xl font-bold mb-2 text-white">Products</h2>
                <p className="text-center text-gray-400 mb-4">
                    Elevate Your Performance with Premium Fitness Gear
                </p>
                <div className="flex justify-center">
                    <Link to="/shop" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-800 transition">
                        Let's Go
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ProductHome;
