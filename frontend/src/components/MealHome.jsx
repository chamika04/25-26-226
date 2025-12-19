import React from 'react';
import { Link } from "react-router-dom";

const MealHome = () => {
    return (
        <div className="flex flex-col items-center justify-center bg-black p-8 rounded-lg shadow-lg">
            
            {/* Nutrition Plans Card */}
            <div>
                
                {/* Content Section */}
                <div className="text-center ">
                    <h2 className="text-xl font-bold ">
                        <span className="text-orange-500 mb-2">Fuel Your Fitness with Expert Nutrition Plans</span>
                    </h2>
                </div>
                
                <img 
                    src="https://media.istockphoto.com/id/1457433817/photo/group-of-healthy-food-for-flexitarian-diet.jpg?s=612x612&w=0&k=20&c=v48RE0ZNWpMZOlSp13KdF1yFDmidorO2pZTu2Idmd3M=" 
                    alt="Healthy Food"
                    className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h2 className="text-center text-xl font-bold mb-2 text-white">Nutrition Plans</h2>
                <p className="text-center text-gray-400 mb-4">
                    Nourish Your Body, Elevate Your Performance
                </p>
                <div className="flex justify-center">
                    <Link to="/MyMeals" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-800 transition">
                        Let's Go
                    </Link>
                </div>
            </div>       
        </div>
    );
}

export default MealHome;
