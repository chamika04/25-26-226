import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard';
import axios from "axios"
const BestProducts = ({handleClick}) => {
    const [product, setProduct]=useState([]);
  

    useEffect( () => {
      axios.get("http://localhost:8070/product/")
      .then((response) => {
        // Assuming the data you want to slice is in response.data
        const slicedData = response.data.slice(0, 5);
        setProduct(slicedData);
      })
      .catch((err) => {
        alert(err.message);
      });
    },[])
  return(
    <div>
       <ProductCard product={product} headline="Let's Shop" handleClick={handleClick} key={product._id}/>
    </div>
  )
}

export default BestProducts