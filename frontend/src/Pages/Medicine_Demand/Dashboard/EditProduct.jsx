import React from 'react'
import { useLoaderData, useParams } from 'react-router-dom'
import { Label, Select, Textarea } from 'flowbite-react'
import { useState } from 'react'
import axios from "axios";

import { Button, Checkbox, TextInput } from 'flowbite-react';

//toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProduct = () => {
  const { id } = useParams();

const { product: initialProduct}= useLoaderData();

console.log('Product:', initialProduct);

const productCategories=[
  "Clothing",
  "Protein",
  "Gym-Equipment"
]
const [SelectedCategories, setCategories]= useState(productCategories[0]);
const  handleCategories = (event) => {
  console.log(event.target.value);
  setCategories(event.target.value);
}


// handle updates
const handleUpdate = (event,id) =>{

  event.preventDefault();
  const form = event.target;

  const productName = form.productName.value;
  const imageUrl = form.imageUrl.value;
  const price = form.price.value;
  const quantity = form.quantity.value;
  const description = form.description.value;
  const productCategory = form.productCategory.value;
  const amount = form.amount.value;

  
  console.log('Product ID:', id);
  console.log('Update product object:', {id,productName, imageUrl, price, quantity, description, productCategory, amount});

const updateProductObj ={
  productName,
  imageUrl,
  price,
  quantity,
  description,
  productCategory,
  amount
}

 // console.log(productObj);
//updates book data
axios.put(`http://localhost:8070/product/update/${id}`, updateProductObj)
.then(response => {
  console.log(response.data);
  toast.info("Item successfully updated!");
  console.log('Product ID:', id);
})
.catch(error => {
  console.error('Error updating item:', error);
  toast.error("Error updating item. Please try again.");
});


} 
return (
    <div className='ml-10 px-4 my-12' style={{ backgroundColor: '#e5f2ff' }}>
      <h2 className='ml-10 mb-8 text-3xl font-bold'>Update Product data</h2>

      <form onSubmit={(event) => handleUpdate(event, id)}className="flex lg:w-[1180px] flex-col gap-4">
        


        {/* FIRST ROW    name and category*/} 
        <div className='flex gap-8'>

          {/* Product name */}
          <div className='lg:w-1/2' >
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
                  defaultValue={initialProduct?.productName}
                  required 
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
                  placeholder="URL" 
                  defaultValue={initialProduct?.imageUrl}
                  required 
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
                            type="text"
                            step="0.01"
                            placeholder="1000.00 " 
                            defaultValue={initialProduct?.price}
                            required pattern="\d+(\.\d{1,2})"
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
                            type="text"
                            placeholder="100" 
                            defaultValue={initialProduct?.quantity}
                            required pattern="\d+"
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
                  defaultValue={initialProduct?.description}
                  required rows={4}
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
              <Select id='inputState' name='productCategory' className='w-full rounded' value={SelectedCategories}
              onChange={handleCategories}>
                  {/* giving the options */}
                  {
                    productCategories.map((option)=> <option key={option} value={option}>{option}</option>)
                  }
              </Select>
          </div>


        </div>    
    
      <Button type="submit">Update Product</Button>
      
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

export default EditProduct