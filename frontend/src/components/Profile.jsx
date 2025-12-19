import React, { useState } from 'react';
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { profileValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import useFetch from '../hooks/fetch.hook';
import { updateUser } from '../helper/helper';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Username.module.css';
import extend from '../styles/Profile.module.css';

export default function Profile() {
  const [file, setFile] = useState();
  const [{ isLoading, apiData, serverError }] = useFetch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address: apiData?.address || '',
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || apiData?.profile || '' });
      let updatePromise = updateUser(values);

      toast.promise(updatePromise, {
        loading: 'Updating...',
        success: <b>Update Successfully...!</b>,
        error: <b>Could not Update!</b>,
      });
    },
  });

  /** Formik doesn't support file upload, so we need this handler */
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  // Logout handler function
  function userLogout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
  if (serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url('https://cdn.pixabay.com/photo/2017/01/09/11/30/dumbbell-1966247_1280.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex justify-center items-center h-screen">
        <div
          className={`${styles.glass} ${extend.glass}`}
          style={{ width: '40%', height: '80%', paddingTop: '2em', paddingBottom: '1em' }}
        >
          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold">Profile</h4>
            <span className="py-3 text-lg w-3/4 text-center text-gray-500">
              You can update the details.
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-3">
              <label htmlFor="profile">
                <img
                  src={apiData?.profile || file || avatar}
                  className={`${styles.profile_img} ${extend.profile_img}`}
                  alt="avatar"
                  style={{ width: '80px', height: '80px' }}
                />
              </label>
              <input onChange={onUpload} type="file" id="profile" name="profile" />
            </div>

            <div className="textbox flex flex-col items-center gap-4">
              <div className="name flex w-3/4 gap-6">
                <input
                  {...formik.getFieldProps('firstName')}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="First Name"
                  style={{ fontSize: '14px', padding: '8px' }}
                />
                <input
                  {...formik.getFieldProps('lastName')}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="Last Name"
                  style={{ fontSize: '14px', padding: '8px' }}
                />
              </div>

              <div className="name flex w-3/4 gap-6">
                <input
                  {...formik.getFieldProps('mobile')}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="Mobile No."
                  style={{ fontSize: '14px', padding: '8px' }}
                />
                <input
                  {...formik.getFieldProps('email')}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="Email*"
                  style={{ fontSize: '14px', padding: '8px' }}
                />
              </div>

              <input
                {...formik.getFieldProps('address')}
                className={`${styles.textbox} ${extend.textbox}`}
                type="text"
                placeholder="Address"
                style={{ fontSize: '14px', padding: '8px' }}
              />

              <button className={styles.btn} type="submit" style={{ padding: '8px 16px', fontSize: '14px' }}>
                Update
              </button>
            </div>

            <div className="text-center py-3">
              <span className="text-gray-500 text-sm">
                Come back later?{' '}
                <button onClick={userLogout} className="text-red-500">
                  Logout
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
