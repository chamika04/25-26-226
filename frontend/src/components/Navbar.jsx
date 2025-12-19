import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBarsStaggered, FaXmark, FaCartShopping, FaUser } from "react-icons/fa6";

const Navbar = ({ size, setShow }) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isSticky, setSticky] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in (from localStorage or other method)
        const userToken = localStorage.getItem("token");  // This is how you store the login status
        if (userToken) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleAuthAction = () => {
        if (isLoggedIn) {
            // Logout user
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            navigate("/"); // Redirect to home after logout
        } else {
            navigate("/login"); // Navigate to login page
        }
    };

    return (
        <header className={`w-full fixed top-0 transition-all duration-500 ${isSticky ? "bg-white z-50" : "bg-black"}`}>
            <nav className='py-4 lg:px-24'>
                <div className='flex justify-between items-center'>
                    <Link to="/home" className='text-2xl font-bold text-blue-700 flex items-center gap-2'>
                        <img src="./img/logo.png" className="w-16 h-auto" alt="Logo" />
                    </Link>

                    <ul className='hidden md:flex space-x-12'>
                        <li><Link to="/" className='text-base font-bold text-orange-400 uppercase hover:text-orange-200'>Home</Link></li>
                        <li><Link to="/MyMeals" className='text-base font-bold text-orange-400 uppercase hover:text-orange-200'>Meal Plans</Link></li>
                        <li><Link to="/MyWorkout" className='text-base font-bold text-orange-400 uppercase hover:text-orange-200'>Workouts</Link></li>
                        <li><Link to="/ScheduleView" className='text-base font-bold text-orange-400 uppercase hover:text-orange-200'>Bookings</Link></li>
                        <li><Link to="/shop" className='text-base font-bold text-orange-400 uppercase hover:text-orange-200'>Shop</Link></li>
                        <li><Link to="/ContactUs" className='text-base font-bold text-orange-400 uppercase hover:text-orange-200'>Reviews</Link></li>
                    </ul>

                    <div className='flex items-center space-x-4'>
                        <Link to="/cart" className='text-2xl text-blue-500 hover:text-amber-500'>
                            <FaCartShopping />
                        </Link>
                        <span>{size}</span>

                        <Link to="/profile" className='text-2xl text-blue-500 hover:text-amber-500'>
                            <FaUser />
                        </Link>

                        {/* Login/Logout Button */}
                        <button 
                            className="btn btn-primary" 
                            style={{ 
                                backgroundColor: isLoggedIn ? '#dc3545' : '#007bff', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: '25px', 
                                padding: '10px 20px', 
                                textDecoration: 'none', 
                                transition: 'background-color 0.3s ease, color 0.3s ease' 
                            }} 
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = isLoggedIn ? '#c82333' : '#f59e0b';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = isLoggedIn ? '#dc3545' : '#007bff';
                                e.target.style.color = '#fff';
                            }}
                            onClick={handleAuthAction}
                        >
                            {isLoggedIn ? "Logout" : "Login"}
                        </button>
                    </div>

                    <div className='flex items-center lg:hidden'>
                        <button onClick={() => setMenuOpen(!isMenuOpen)} className='text-black focus:outline-none'>
                            {isMenuOpen ? <FaXmark className='h-5 w-5 text-black' /> : <FaBarsStaggered className='h-5 w-5 text-black' />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="space-y-4 px-4 mt-12 py-7 bg-blue-700 fixed top-0 right-0 left-0">
                        <Link to="/" className='block text-base text-white uppercase cursor-pointer'>Home</Link>
                        <Link to="/MyMeals" className='block text-base text-white uppercase cursor-pointer'>Meal Plans</Link>
                        <Link to="/MyWorkout" className='block text-base text-white uppercase cursor-pointer'>Workouts</Link>
                        <Link to="/ScheduleView" className='block text-base text-white uppercase cursor-pointer'>Bookings</Link>
                        <Link to="/shop" className='block text-base text-white uppercase cursor-pointer'>Shop</Link>
                        <Link to="/show_I" className='block text-base text-white uppercase cursor-pointer'>Reviews</Link>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
