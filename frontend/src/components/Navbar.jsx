import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FaBarsStaggered, 
    FaXmark 
} from "react-icons/fa6";

import { 
    FaUserMd, 
    FaHospitalUser,
    FaPills
} from "react-icons/fa";


const Navbar = ({ size, setShow }) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const userToken = localStorage.getItem("token");
        if (userToken) setIsLoggedIn(true);
    }, []);

    const handleAuthAction = () => {
        if (isLoggedIn) {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            navigate("/");
        } else {
            navigate("/login");
        }
    };

    return (
        <header className="w-full fixed top-0 bg-white shadow-md z-50">
            <nav className="px-6 lg:px-20 py-4">
                <div className="flex justify-between items-center">

                    {/* LOGO */}
                    <Link 
                        to="/home" 
                        className="text-2xl font-bold text-blue-700 flex items-center gap-3"
                    >
                        <img src="./img/logo.png" className="w-12 h-auto" alt="Logo" />
                        <span className="hidden md:block">HospitalCare</span>
                    </Link>

                    {/* MENU ITEMS (Desktop) */}
                    <ul className="hidden md:flex space-x-10">
                        <li>
                            <Link 
                                to="/" 
                                className="text-base font-medium text-gray-700 hover:text-blue-600 transition"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/bed" 
                                className="text-base font-medium text-gray-700 hover:text-blue-600 transition"
                            >
                                Bed Occupancy
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/doctor" 
                                className="text-base font-medium text-gray-700 hover:text-blue-600 transition"
                            >
                                Doctor Availability
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/medicine" 
                                className="text-base font-medium text-gray-700 hover:text-blue-600 transition"
                            >
                                Medicine
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/illness" 
                                className="text-base font-medium text-gray-700 hover:text-blue-600 transition"
                            >
                                Illness Records
                            </Link>
                        </li>
                    </ul>

                    {/* RIGHT SIDE ICONS */}
                    <div className="flex items-center space-x-6">

                        <Link 
                            to="/profile" 
                            className="text-2xl text-blue-700 hover:text-blue-500 transition"
                        >
                            <FaHospitalUser />
                        </Link>

                        {/* LOGIN BUTTON */}
                        <button 
                            onClick={handleAuthAction}
                            className={`px-5 py-2 rounded-full text-white font-medium transition
                                ${isLoggedIn ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"}
                            `}
                        >
                            {isLoggedIn ? "Logout" : "Login"}
                        </button>

                        {/* MOBILE MENU ICON */}
                        <button 
                            onClick={() => setMenuOpen(!isMenuOpen)} 
                            className="md:hidden text-blue-700"
                        >
                            {isMenuOpen ? <FaXmark size={22} /> : <FaBarsStaggered size={22} />}
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU */}
                {isMenuOpen && (
                    <div className="md:hidden bg-blue-50 mt-4 py-6 px-6 rounded-lg shadow">
                        <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600">Home</Link>
                        <Link to="/bed" className="block py-2 text-gray-700 hover:text-blue-600">Bed Occupancy</Link>
                        <Link to="/doctor" className="block py-2 text-gray-700 hover:text-blue-600">Doctor Availability</Link>
                        <Link to="/medicine" className="block py-2 text-gray-700 hover:text-blue-600">Medicine</Link>
                        <Link to="/illness" className="block py-2 text-gray-700 hover:text-blue-600">Illness Records</Link>
                        <Link to="/profile" className="block py-2 text-gray-700 hover:text-blue-600">Profile</Link>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
