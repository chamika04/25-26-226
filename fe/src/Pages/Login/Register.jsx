import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const RegisterRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    role: "",
    username: "",
    address: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8070/api/HospitalUsers/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        email: formData.email,
        role: formData.role.toLowerCase(),
        username: formData.username,
        address: formData.address,
        password: formData.password
      });

      toast.success("User registered successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-blue-50">
      <Toaster position="top-center" reverseOrder={false} />

      {/* LEFT DECORATIVE PANEL */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-300 to-blue-500 relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="z-10 text-white p-16 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">Hospital Staff Registration</h1>
          <p className="text-lg leading-relaxed opacity-90">
            Secure access for authorized hospital staff only.
          </p>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="w-full md:w-1/2 flex items-center justify-center relative">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/login")}
          className="absolute top-6 left-6 bg-white shadow-md p-3 rounded-full hover:bg-blue-100 transition"
        >
          <HiArrowLeft className="text-blue-700 text-xl" />
        </button>

        {/* FORM CARD */}
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
            Register
          </h2>

          <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
            {/* First Name */}
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="input"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            {/* Last Name */}
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="input"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            {/* Mobile */}
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              className="input"
              value={formData.mobile}
              onChange={handleChange}
              required
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="input"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Role */}
            <select
              name="role"
              className="input"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="chief_pharmacist">Chief Pharmacist</option>
              <option value="store_manager">Store Manager</option>
              <option value="ward_nurse">Ward Nurse</option>
              <option value="admin">Admin</option>
            </select>

            {/* Preferred Username */}
            <input
              type="text"
              name="username"
              placeholder="Preferred Username"
              className="col-span-2 input"
              value={formData.username}
              onChange={handleChange}
              required
            />

            {/* Address */}
            <textarea
              name="address"
              placeholder="Address"
              rows="2"
              className="col-span-2 input resize-none"
              value={formData.address}
              onChange={handleChange}
              required
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Create Password"
              className="input"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {/* Confirm Password */}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            {/* SUBMIT */}
            <button
              type="submit"
              className="col-span-2 mt-4 bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              Register
            </button>
          </form>
        </div>
      </div>

      {/* INPUT STYLES */}
      <style>
        {`
          .input {
            border: 1px solid #cbd5e1;
            padding: 12px;
            border-radius: 10px;
            outline: none;
            transition: 0.2s;
          }
          .input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
          }
        `}
      </style>
    </div>
  );
};

export default RegisterRequest;
