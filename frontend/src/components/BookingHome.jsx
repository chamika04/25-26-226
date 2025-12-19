import React from 'react';
import { Link } from "react-router-dom";

const BookingHome = () => {
    return (
        <div className="flex flex-col items-center justify-center bg-black p-8 rounded-lg shadow-lg">
            
            {/* Booking Card */}
            <div>
                
                {/* Content Section */}
                <div className="text-center ">
                    <h2 className="text-xl font-bold ">
                        <span className="text-orange-500">Hassle-Free Booking System for Fitness Sessions</span>
                    </h2>
                </div>
                
                <img 
                    src="https://www.bookitlive.net/content/wp-content/uploads/2021/03/How-does-booking-system-work.jpg" 
                    alt="Booking System"
                    className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h2 className="text-xl font-bold mb-2 text-center text-white">Bookings</h2>
                <p className="text-gray-400 mb-4 text-center">
                    Seamless Reservations for Your Next Sweat Session
                </p>
                <div className="flex justify-center">
                    <Link to="/ScheduleView" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-800 transition">
                        Let's Go
                    </Link>
                </div>
            </div>

            

        </div>
    );
}

export default BookingHome;
