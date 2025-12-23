import { Label, Select, Textarea } from 'flowbite-react'
import React, { useState } from 'react'
import axios from "axios";

//toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Button, Checkbox, TextInput } from 'flowbite-react';

const FormTry = () => {
  

const productCategories=[
  "Clothing",
  "Protein",
  "Gym-Equipment"
]
const [productCategory, setCategories]= useState("");
const [productName, setName]= useState("");
const [imageUrl, setImg]= useState("");
const [price, setPrice]= useState("");
const [quantity, setQuantity]= useState("");
const [amount, setAmount]= useState(1);
const [description, setDescription]= useState("");

const  handleCategories = (event) => {
  console.log('Selected category:', event.target.value);
  //console.log(event.target.value);
  setCategories(event.target.value);
}


// handle submissions
const handleSubmit = (event) =>{
  event.preventDefault();

const productObj ={
  productName,
  imageUrl,
  price,
  quantity,
  amount,
  description,
  productCategory
}
    axios.post("http://localhost:8070/product/add", productObj)
    .then(() => {
      alert("Product added!");
      window.location.reload(); 
    })
    .catch((err) => {
      alert(err);
    });

} 
return (
    <div className='ml-10 px-4 my-12'  style={{ backgroundColor: '#e5f2ff' }}>
      <h2 className='ml-10 mb-8 text-3xl font-bold'>Upload Product</h2>

      <form method="post" onSubmit={handleSubmit} className="flex lg:w-[1180px] flex-col gap-4">
        
        {/* FIRST ROW    name and category*/} 
        
        <div className='flex gap-8'>

          {/* Product name */}
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
                <Label
                  htmlFor="productName" 
                  value="Product Name:" 
                />
            </div>
                  <TextInput 
                  id="productName" 
                  name='productName'
                  type="text"
                  placeholder="Product Name" 
                  required 
                  onChange={(event)=>{
                    setName(event.target.value);
                  }}
              />
          </div>
          {/* imageUrl */}
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
                <Label
                  htmlFor="imageUrl" 
                  value="imageUrl" 
                />
            </div>
                  <TextInput 
                  id="imageUrl" 
                  name='imageUrl'
                  type="text"
                  required  pattern="https?://.+"
                  title="Please enter a valid URL (e.g., https://example.com)"
                  onChange={(event)=>{
                    setImg(event.target.value);
                  }}
              />
          </div>
        </div>  

          {/* SECOND ROW    price ,quantity and amount*/}
       <div className='flex gap-8'>
                 
                 {/* Product Price */}
                    <div className='lg:w-2/4'>
                      <div className="mb-2 block">
                          <Label
                            htmlFor="price" 
                            value="price :" 
                          />
                      </div>
                            <TextInput 
                            id="price" 
                            name='price'
                            type="float"
                            placeholder="1000.00 "  
                            step="0.01"
                            required pattern="\d+(\.\d{1,2})"
                            onChange={(event)=>{
                              setPrice(event.target.value);
                            }}
                        />
                    </div>
      
                    {/* quantity */}
                    <div className='lg:w-1/4'>
                      <div className="mb-2 block">
                          <Label
                            htmlFor="quantity" 
                            value="quantity :" 
                          />
                      </div>
                            <TextInput 
                            id="quantity" 
                            name='quantity'
                            type="number"
                            placeholder="100" 
                            required pattern="\d+"
                            onChange={(event)=>{
                              setQuantity(event.target.value);
                            }}
                        />
                    </div>
      
                    {/* amount */}
                    <div className='lg:w-1/4'>
                      <div className="mb-2 block">
                          <Label
                            htmlFor="amount" 
                            value="amount :" 
                          />
                      </div>
                            <TextInput 
                            id="amount" 
                            name='amount'
                            type="number"
                            defaultValue={1} 
                            readOnly={true}
                            onChange={(event)=>{
                              setAmount(event.target.value);
                            }}
                        />
                    </div>
             </div> 
      
      
              {/* THIRD ROW    description and category*/}
              <div className='flex gap-8'>
      
                {/* Product description */}
                <div className='lg:w-1/2'>
                  <div className="mb-2 block">
                      <Label
                        htmlFor="description" 
                        value="Product description:" 
                      />
                  </div>
                        <Textarea 
                        id="description" 
                        name='description'
                        type="text"
                        placeholder="Leave a description..." 
                        required rows={4}
                        onChange={(event)=>{
                          setDescription(event.target.value);
                        }}
                    />
      
                </div>
                {/* Category */}
                <div className='lg:w-1/2'>
                <div className="mb-2 block">
                      <Label
                        htmlFor="inputState" 
                        value="Product category:" 
                      />
                  </div>
                    <Select id='inputState' name='productCategory' className='w-full rounded' value={productCategory}
                    onChange={handleCategories}>
                        {/* giving the options */}
                        {
                          productCategories.map((option)=> <option key={option} value={option}> {option} </option>)
                        }
                    </Select>
      
                    
                </div>
      
      
              </div>    
                
            <Button type="submit">Submit</Button>
      

      
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
    </form>
    
    </div>
  )

}
export default FormTry
