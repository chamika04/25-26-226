import React, { useEffect, useState } from 'react';
import { getUserData } from '../../helper/helper';
import styles from '../../styles/Username.module.css';
import extend from '../../styles/Profile.module.css';
import Header from "../../components/Navbar";
import avatar from '../../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile_no: '',
  });
  const [changePassword, setChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: '',
  });
  const username = JSON.parse(localStorage.getItem('user'))?.username;

  useEffect(() => {
    if (username) {
      getUserData(username)
        .then(data => {
          setUser(data);
          setFormData({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            mobile_no: data.mobile_no || '',
          });
        })
        .catch(() => {
          toast.error("Failed to fetch user data");
        });
    }
  }, [username]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = e => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const toggleChangePassword = () => {
    setChangePassword(prev => !prev);
    setPasswords({ password: '', confirmPassword: '' }); // reset password fields when toggling
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Validate passwords if changing password
    if (changePassword) {
      if (!passwords.password.trim() || !passwords.confirmPassword.trim()) {
        toast.error("Please enter both password fields");
        return;
      }

      if (passwords.password !== passwords.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      // Optional: enforce minimum password strength here
    }
    // Prepare data to send and preserve the role
    const updateData = {
      ...formData,
      ...(changePassword ? { password: passwords.password } : {}),
      role: user.role  // Preserve role
    };

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8070/api/users/${username}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile updated successfully");
      // Optionally, refresh user data
      const updatedUser = await getUserData(username);
      setUser(updatedUser);
      setFormData({
        first_name: updatedUser.first_name || '',
        last_name: updatedUser.last_name || '',
        email: updatedUser.email || '',
        mobile_no: updatedUser.mobile_no || '',
      });
      setChangePassword(false);
      setPasswords({ password: '', confirmPassword: '' });
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update profile");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!user) {
    return <div className="text-xl text-center mt-10">Loading profile...</div>;
  }

return (
  <div
    className={styles.container}
    style={{
      backgroundImage: `url('https://images.pexels.com/photos/3140204/pexels-photo-3140204.jpeg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <Header />
    <Toaster position="top-center" />

    <div className="flex justify-center items-center min-h-[90vh] px-4">
      <form
        onSubmit={handleSubmit}
        className={`${styles.glass} ${extend.glass} relative w-full max-w-4xl`}
        style={{
          padding: '2em',
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
      >
        {/* Greeting and Avatar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Hello, {user?.first_name || user?.username} 👋</h1>
            <p className="text-white/80 text-sm mt-1">Welcome to your profile dashboard</p>
          </div>
          <img
            src={user?.profile || avatar}
            className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
            alt="avatar"
          />
        </div>

        {/* Editable Fields in Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-white">
          <div>
            <label className="block mb-1 font-semibold text-white" htmlFor="first_name">
              First Name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleInputChange}
              required
              className="w-full rounded px-3 py-2 text-black bg-gray-300 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-900"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="last_name">Last Name</label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleInputChange}
              className="w-full rounded px-3 py-2 text-black bg-gray-300 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-900"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full rounded px-3 py-2 text-black bg-gray-300 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-900"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="mobile_no">Mobile</label>
            <input
              id="mobile_no"
              name="mobile_no"
              type="tel"
              value={formData.mobile_no}
              onChange={handleInputChange}
              className="w-full rounded px-3 py-2 text-black bg-gray-300 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-900"
              required
            />
          </div>
        </div>

        {/* Change Password Toggle */}
        <div className="mt-8">
          <button
            type="button"
            onClick={toggleChangePassword}
            className="text-sm text-blue-300 hover:text-blue-500 underline"
          >
            {changePassword ? 'Cancel Change Password' : 'Change Password'}
          </button>

          {changePassword && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-semibold" htmlFor="password">New Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={passwords.password}
                  onChange={handlePasswordChange}
                  className="w-full rounded px-3 py-2 text-black bg-gray-300 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-900"
                  required={changePassword}
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold" htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded px-3 py-2 text-black bg-gray-300 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-900"
                  required={changePassword}
                />
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <button
            type="submit"
            className="bg-blue-900 hover:bg-blue-400 transition duration-200 text-white font-semibold px-6 py-2 rounded"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={logout}
            className="text-red-300 hover:text-red-800 font-semibold flex items-center gap-2"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        </div>
      </form>
    </div>
  </div>
);
}




{/* import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import convertToBase64 from '../../helper/convert';
import { getUserData, updateUser } from '../../helper/helper';
import styles from '../../styles/Username.module.css';
import extend from '../../styles/Profile.module.css';
import Header from "../general/header";
import avatar from '../../assets/profile.png';

export default function Profile() {
  const [file, setFile] = useState();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const username = JSON.parse(localStorage.getItem('user'))?.username?.toLowerCase();

  useEffect(() => {
  if (username) {
    getUserData(username)
      .then(data => {
        console.log("User data:", data); // debug
        setUser(data);
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to fetch user data");
      });
  }
}, [username]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      mobile_no: user?.mobile_no || '',
      password: '',
    },

    onSubmit: async (values) => {
      const updatedData = {
        ...values,
        profile: file || user?.profile || '',
      };

      try {
        await updateUser(username, updatedData);
        toast.success("Profile updated successfully!");
        setEditMode(false);
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        toast.error("Failed to update profile.");
        console.error(error);
      }
    }
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!user) return <div className="text-xl text-center mt-10">Loading profile...</div>;

  return (
    <div
          className={styles.container}
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg')`,
          }}
        >
      <Header />
      <Toaster position="top-center" />
      <div className="flex justify-center items-center min-h-[90vh]">
        <div
          className={`${styles.glass} ${extend.glass} relative`}
          style={{
            width: '100%',
            maxWidth: '800px',
            padding: '2em',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-white">My Profile</h2>
              <p className="text-sm text-white/80 mb-6">View or update your details</p>
            </div>

            <div className="absolute top-6 right-6">
              <label htmlFor="profile" className="cursor-pointer">
                <img
                  src={file || user?.profile || avatar}
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
                  alt="avatar"
                  title="Click to change"
                />
              </label>
              {editMode && (
                <input onChange={onUpload} type="file" id="profile" name="profile" hidden />
              )}
            </div>
          </div>

          {!editMode ? (
            <div className="text-white space-y-3 text-sm">
              <p><strong>First Name:</strong> {user.first_name}</p>
              <p><strong>Last Name:</strong> {user.last_name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Mobile:</strong> {user.mobile_no}</p>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-white text-sky-700 px-6 py-2 rounded-md text-sm font-semibold hover:bg-gray-100"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-6 text-sm text-white">
              <div>
                <label>First Name</label>
                <input
                  {...formik.getFieldProps('first_name')}
                  type="text"
                  className="w-full mt-1 rounded px-3 py-2 bg-white/90 text-gray-800 focus:outline-none"
                />
              </div>
              <div>
                <label>Last Name</label>
                <input
                  {...formik.getFieldProps('last_name')}
                  type="text"
                  className="w-full mt-1 rounded px-3 py-2 bg-white/90 text-gray-800 focus:outline-none"
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  {...formik.getFieldProps('email')}
                  type="email"
                  className="w-full mt-1 rounded px-3 py-2 bg-white/90 text-gray-800 focus:outline-none"
                />
              </div>
              <div>
                <label>Mobile</label>
                <input
                  {...formik.getFieldProps('mobile_no')}
                  type="text"
                  className="w-full mt-1 rounded px-3 py-2 bg-white/90 text-gray-800 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label>Address</label>
                <input
                  {...formik.getFieldProps('address')}
                  type="text"
                  className="w-full mt-1 rounded px-3 py-2 bg-white/90 text-gray-800 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label>New Password (Optional)</label>
                <input
                  {...formik.getFieldProps('password')}
                  type="password"
                  placeholder="•••••••• (leave blank to keep current)"
                  className="w-full mt-1 rounded px-3 py-2 bg-white/90 text-gray-800 focus:outline-none"
                />

              </div>

              <div className="col-span-2 flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-md text-sm"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="text-red-200 hover:text-red-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center text-white/80 text-sm">
            Come back later? <button onClick={logout} className="text-red-300 hover:text-red-500">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
*/}