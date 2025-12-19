import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/helper';
import Navbar from '../components/Navbar';
import { ReactTyped } from 'react-typed';
import styles from '../styles/Username.module.css';

export default function Register() {
  const navigate = useNavigate();
  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
      role: 'user',
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || '' });
      let registerPromise = registerUser(values);
      registerPromise.then(() => navigate('/login'));
    },
  });

  /** Handler for file upload */
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url('https://cdn.pixabay.com/photo/2017/01/09/11/30/dumbbell-1966247_1280.jpg')` }} // Background image
    >
      <Navbar />

      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex justify-center items-center h-screen mt-10 mb-4"> {/* Added margin-top & reduced margin-bottom */}
        <div
          className={styles.glass}
          style={{ width: '30%', height: '75%', paddingTop: '2em', paddingBottom: '1em' }} // Reduced bottom padding
        >
          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold">Register</h4>
            <span className="py-3 text-lg w-3/4 text-center text-gray-500">
              Happy to join you!
            </span>
            <ReactTyped
              className="text-2xl font-bold text-red-500"
              strings={['WORKOUT', 'EXERCISE', 'GETFIT', 'EATHEALTHY']}
              typeSpeed={120}
              backSpeed={140}
              loop
            />
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-3">
              <label htmlFor="profile">
                <img
                  src={file || avatar}
                  className={styles.profile_img}
                  alt="avatar"
                  style={{ width: '80px', height: '80px' }}
                />
              </label>
              <input onChange={onUpload} type="file" id="profile" name="profile" />
            </div>

            <div className="textbox flex flex-col items-center gap-4">
              <input
                {...formik.getFieldProps('email')}
                className={styles.textbox}
                type="text"
                placeholder="Email*"
                style={{ fontSize: '14px', padding: '8px' }}
              />
              <input
                {...formik.getFieldProps('username')}
                className={styles.textbox}
                type="text"
                placeholder="Username*"
                style={{ fontSize: '14px', padding: '8px' }}
              />
              <input
                {...formik.getFieldProps('password')}
                className={styles.textbox}
                type="password"
                placeholder="Password*"
                style={{ fontSize: '14px', padding: '8px' }}
              />
              <button
                className={styles.btn}
                type="submit"
                style={{ padding: '8px 16px', fontSize: '14px' }}
              >
                Register
              </button>
            </div>

            <div className="text-center py-3">
              <span className="text-gray-500 text-sm">
                Already Registered? <Link className="text-red-500" to="/login">Login Now</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
