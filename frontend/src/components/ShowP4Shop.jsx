import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import ProductRating from "../Review/User_Side/ProductRating";

export default function A_product() {
  const [others, setOthers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false); // State for managing popup visibility
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    function getOthers() {
      axios
        .get("http://localhost:8070/Product_review/")
        .then((res) => {
          setOthers(res.data);
        })
        .catch((err) => {
          alert(err.message);
        });
    }

    getOthers();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredOthers = others.filter((product) =>
    product.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to toggle popup visibility
  const togglePopup = (category) => {
    setSelectedCategory(category);
    setShowPopup(!showPopup);
  };

  return (
    <>
    
      <div className="flex">
            <div className="m-10">
              <h3 className="text-3xl font-bold mb-8 bg-gray-200 p-4 rounded-md text-center">Reviews - Products</h3>
              <div className="flex justify-center mb-5">
                <Link
                  to="/Review_products"
                  className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded inline-block"
                >
                  Write a Review
                </Link>{" "}
                <button
                  onClick={() => togglePopup("Overall")} // Add onClick event to toggle popup visibility
                  className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded inline-block ml-4"
                >
                  See Overall Review Details
                </button>
              </div>

              <div className="relative mx-auto font-bold flex justify-center mt-6 mb-4">
                <input
                  type="text"
                  placeholder="Search by product type..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="border-2 border-[#a07628] bg-[#f9f9e9] h-11 w-[500px] pl-5 pr-16 rounded-[14px] text-[13pt] focus:outline-none"
                />
              </div>

              {/* Popup for showing overall review details */}
              {showPopup && (
                <div className="popup bg-white bg-opacity-80 border border-gray-300 p-8 rounded-lg shadow-lg">
                  <div className="popup_inner">
                    <span className="close" onClick={togglePopup}>×</span>
                    <h2>  {selectedCategory} Review Details for</h2>
                    {/* Render ProductRating component inside popup */}
                    {selectedCategory && <ProductRating category={selectedCategory} />}
                  </div>
                </div>
              )}

              <div>
                <br></br>
              </div>

              {filteredOthers.map((product, index) => (
                <div key={product._id} className="mb-5">
                  <div className="bg-blue-200 p-4 rounded">
                    <div className="mb-2">
                      <strong>Product Type:</strong> {product.type}
                    </div>
                    <div className="mb-2">
                      <strong>Description:</strong> {product.description}
                    </div>
                    <div className="mb-2">
                      <strong>Rating:</strong> {product.stars}
                    </div>
                    <div className="mb-2">
                      <strong>Rating Percentage:</strong> {product.percent}
                    </div>
                  </div>
                  <hr />
                </div>
              ))}

              
            </div>
          
      </div>
    </>
  );
}
