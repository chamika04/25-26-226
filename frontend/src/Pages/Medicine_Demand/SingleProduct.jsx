import React from 'react'
import { useLoaderData } from 'react-router-dom'
import Navbar from '../../components/Navbar';
import { useState } from 'react';
import Allproducts from './Allproducts';



//toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SingleProduct = ({handleClick}) => {
    const {_id,productName,description,price,imageUrl}=useLoaderData();
    const [quantity, setQuantity] = React.useState(1);


    const [show,setShow] = useState(true);
    const [cart,setCart]=useState([]);
    const [warning,setWarning] = useState(false);



    // const handleQuantityChange = (e) => {
    //   const newQuantity = parseInt(e.target.value);
    //   setQuantity(newQuantity >= 1 ? newQuantity : 1);
    // };
  
    // const handleAddToCartClick = () => {
    //   onAddToCart(quantity);
    // };
  

  return (
    <> 
      
<div className='mt-28 px-4 lg:px-2 '>
      <div className='flex'>
      <div className='w-1/3'>
        <img src ={imageUrl} alt="" className='h-96'/>
      </div>
      <div className='w-2/3'>
        <h2 className="text-lg font-bold mb-2">{productName}</h2>
        <p className="text-gray-600 mb-2">{description}</p>
        <p className="text-gray-600 mb-2">RS {price} /=</p>
      
        <div className="cart-plus-minus">
        {/* <button
          className="dec btn bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
          disabled={quantity === 1}
          onClick={() => setQuantity(quantity - 1)}
        >
          -
        </button>
        <input
          type="text"
          name="quantity"
          className="input-text qty text w-10 h-8 bg-gray-200 border-none text-center font-bold text-gray-600"
          value={quantity}
          onChange={handleQuantityChange}
        />
        <button
          className="inc btn bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
          onClick={() => setQuantity(quantity + 1)}
        >
          +
        </button> */}
        <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
        onClick={handleClick}
      >
        Add to Cart
      </button>

      </div>
{/* cart */}

    </div>
    </div>
 </div>
 {
          warning && <></>
          
        }
 <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"         
          />     
        

 </>
  )
}

export default SingleProduct