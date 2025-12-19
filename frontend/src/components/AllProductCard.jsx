import React, { useEffect, useState } from "react";
import { Card } from 'flowbite-react';
import { Link } from "react-router-dom";
import axios from "axios"
import { Button } from "flowbite-react";
import ShowP4Shop from "../components/ShowP4Shop"
const AllProductCard = ({ product, handleClick }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const categories = [...new Set(product.map(item => item.productCategory))];
  const [searchQuery, setSearchQuery] = useState('');
  const [toggle, setToggle] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // State for managing popup visibility
  const [others, setOthers] = useState(); // State for managing popup visibility


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

//categorizing

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleShowAll = () => {
    setSelectedCategory(null); // Reset selected category to show all products
  };
  
//search function
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };


  const filteredProducts = product.filter(item => {

    // Filter by category
    if (selectedCategory && item.productCategory !== selectedCategory) {
      return false;
    }

    // Filter by search query
    if (searchQuery && !item.productName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });


  // Function to toggle popup visibility
  const togglePopup = (category) => {
    setToggle(category);
    setShowPopup(!showPopup);
  };

  return (
     <div>
      <div className='mt-28 px-14 lg:px-24 bg-black'>
        <div className="flex flex-wrap gap-2">
          <Button
            outline
            gradientDuoTone="greenToBlue"
            onClick={handleShowAll}
            active={!selectedCategory}
          >
            All Products
          </Button>
          {categories.map((category, index) => (
            <Button
              key={index}
              outline
              gradientDuoTone="greenToBlue"
              onClick={() => handleCategoryClick(category)}
              active={selectedCategory === category}
            >
              {category}
            </Button>
          ))}
          <div style={{ marginLeft: "auto" }}>
            <input
              type="search"
              name="search"
              id="search"
              placeholder='Search for your item'
              className='py-2 px-2 rounded-s-sm outline-none mr-2'
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <button
              className='bg-blue-700 px-6 py-2 text-white font-medium hover:bg-black
              transition-all ease-in duration-200'
            >
              Search
            </button>
          </div>
        </div>          
	          <button
            onClick={() => togglePopup("Overall")}
            className="bg-blue-700 px-6 py-2 text-white font-medium hover:bg-black
            transition-all ease-in duration-200"
          >
            See Overall Review Details
          </button>
        </div>
        {/* Popup for showing overall review details */}
        {showPopup && (
          <div className="popup bg-white bg-opacity-80 border border-gray-300 p-8 rounded-lg shadow-lg">
            <div className="popup_inner">
              <span className="close" onClick={togglePopup}>
                ×
              </span>
              <h2>{toggle} Review Details</h2>
              {/* Render ProductRating component inside popup */}
              {toggle && <ShowP4Shop category={toggle} />}
            </div>
          </div>
        )}
        <div className="grid gap-12 my-14 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-col-1">
          {filteredProducts.map(product => (
            <Card className="max-w-sm" key={product._id}>
              <Link to={`/product/${product._id}`}>
                <img src={product.imageUrl} alt={product.productName} />
                <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {product.productName}
                </h5>
                <h4>{product.description}</h4>
              </Link>
              <div className="mb-5 mt-2.5 flex items-center">
                {/* Star rating icons */}
              </div>
              <div className="mb-5 mt-2.5 flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Rs {product.price}
                </span>
                <button
                  onClick={() => handleClick(product)}
                  className="rounded-lg bg-cyan-700 px-3 py-1.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                >
                  Add to cart
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
  
  );
};
export default AllProductCard;
