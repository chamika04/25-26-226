import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import avatar from '../../assets/profile.png';
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "../../store/store";
import { verifyPassword } from "../../helper/helper";

const LoginPage = () => {
  const navigate = useNavigate();
  const setUsername = useAuthStore((state) => state.setUsername);

  const validate = (values) => {
    const errors = {};
    if (!values.username) errors.username = "Username is required";
    if (!values.password) errors.password = "Password is required";
    return errors;
  };

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setUsername(values.username);
      localStorage.setItem("User", JSON.stringify({ username: values.username }));

      const loginPromise = verifyPassword({
        username: values.username,
        password: values.password,
      });

      toast.promise(loginPromise, {
        loading: "Checking...",
        success: <b>Login Successfully!</b>,
        error: <b>Username or Password Incorrect!</b>,
      });

      loginPromise.then((res) => {
        const { token, user } = res;
        const role = user.role?.toLowerCase();
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        if (role === "admin") navigate("/admin/dashboard");
        else if (role === "pharmacist") navigate("/medicine/dashboard");
        else navigate("/");
      });
    },
  });

  return (
    <div className="min-h-screen flex bg-blue-50">
      {/* LEFT FORM PANEL */}
      <div className="w-full md:w-1/2 flex items-center justify-center relative p-8">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 bg-white shadow-md p-3 rounded-full hover:bg-blue-100 transition"
        >
          <HiArrowLeft className="text-blue-700 text-xl" />
        </button>

        {/* LOGIN FORM CARD */}
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
            Hospital Staff Login
          </h2>

          <form className="grid gap-4" onSubmit={formik.handleSubmit}>
            <input
              {...formik.getFieldProps("username")}
              type="text"
              placeholder="Username"
              className="col-span-2 input"
            />
            {formik.errors.username && (
              <p className="text-red-600 text-sm">{formik.errors.username}</p>
            )}

            <input
              {...formik.getFieldProps("password")}
              type="password"
              placeholder="Password"
              className="col-span-2 input"
            />
            {formik.errors.password && (
              <p className="text-red-600 text-sm">{formik.errors.password}</p>
            )}

            <button
              type="submit"
              className="col-span-2 mt-4 bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              Login to System
            </button>
          </form>

          <div className="text-center py-3 text-sm text-gray-500">
            <span>
              Not a Member?{" "}
              <Link className="text-blue-800" to="/registerForm">
                Register Now
              </Link>
            </span>
            <br />
            <span>
              Forgot Password?{" "}
              <Link className="text-blue-800" to="/recovery">
                Recover Now
              </Link>
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT DECORATIVE PANEL */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-300 to-blue-500 relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="z-10 text-white p-16 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg leading-relaxed opacity-90">
            Access your hospital management dashboard securely. Only authorized hospital staff can login.
          </p>
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
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default LoginPage;
