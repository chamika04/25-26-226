import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { usernameValidate } from '../helper/validate'
import { useAuthStore } from '../store/store'
import Navbar from '../components/Navbar';
import {ReactTyped} from 'react-typed';

import styles from '../styles/Username.module.css';

export default function Username() {

  const navigate = useNavigate();
  const setUsername = useAuthStore(state => state.setUsername);

  const formik = useFormik({
    initialValues : {
      username : ''
    },
    validate : usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
      setUsername(values.username);
      navigate('/password')
    }
  })



  
  return ( 
    <div className={styles.container} style={{ backgroundImage: `url('https://cdn.pixabay.com/photo/2021/01/04/06/20/man-5886571_1280.jpg')` }}> {/* Set background image here */}

    <Navbar/>

    <br></br>
    <br></br>

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
      <div 
        className={styles.glass} 
        style={{ width: "25%", height: "70%", paddingTop: '2em', paddingBottom: '2em' }}
      >
        <div className="title flex flex-col items-center">
          <h4 className='text-4xl font-bold'>Hello Again!</h4> {/* Reduced text size */}
          <span className='py-3 text-lg w-3/4 text-center text-gray-500'>
            Explore More by connecting with us.
          </span>
          <ReactTyped
            className='text-2xl font-bold text-orange-700' 
            strings={['WORKOUT','EXERCISE','GETFIT','HEALTHY']}
            typeSpeed={120}
            backSpeed={140}
            loop
          /> 
        </div>

        <form className='py-1' onSubmit={formik.handleSubmit}>
          <div className='profile flex justify-center py-3'>
            <img src={avatar} className={styles.profile_img} alt="avatar" style={{ width: '80px', height: '80px' }} /> {/* Reduced size */}
          </div>

          <div className="textbox flex flex-col items-center gap-4">
            <input 
              {...formik.getFieldProps('username')} 
              className={styles.textbox} 
              type="text" 
              placeholder='Username' 
              style={{ fontSize: '14px', padding: '8px' }} // Reduced font size and padding
            />
            <button className={styles.btn} type='submit' style={{ padding: '8px 16px', fontSize: '14px' }}>
              Let's Go
            </button> {/* Reduced button size */}
          </div>

          <div className="text-center py-3">
            <span className='text-gray-500 text-sm'>Not a Member? 
              <Link className='text-orange-700' to="/register"> Register Now</Link>
            </span> {/* Reduced text size */}
          </div>
        </form>
      </div>
    </div>

    </div>
  )
}