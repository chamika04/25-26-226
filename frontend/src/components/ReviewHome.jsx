import React from 'react';
import { Link } from "react-router-dom";

const ReviewHome = () => {
    return (
        <div className="flex flex-col items-center justify-center bg-black p-8 rounded-lg shadow-lg">
            
            {/* Reviews & Ratings Card */}
            <div>
                
                {/* Content Section */}
                <div className="text-center">
                    <h2 className="text-xl font-bold">
                        <span className="text-orange-500">Discover Triumphs, Real Stories That Ignite Your Fitness Journey!</span>
                    </h2>
                </div>
                
                <img 
                    src="https://blog.thegiftcardcafe.com/wp-content/uploads/2021/07/amazon-review-tool.png" 
                    alt="Reviews & Ratings"
                    className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h2 className=" text-center text-xl font-bold mb-2 text-white">Reviews & Ratings</h2>
                <p className="text-center text-gray-400 mb-4">
                    Share Your Feedback
                </p>
                <div className="flex justify-center">
                    <Link to="/contactUs" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-800 transition">
                        Let's Go
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ReviewHome;
