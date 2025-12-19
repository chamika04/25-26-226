import React from 'react';
import { Link } from "react-router-dom";

const WorkoutHome = () => {
    return (
        <div className="flex flex-col items-center justify-center bg-black p-8 rounded-lg shadow-lg">
            
            {/* Workout Plans Card */}
            <div >            
                {/* Content Section */}
                <div className="text-center ">
                    <h2 className="text-xl font-bold ">
                        <span className="text-orange-500">Access On-Demand Workouts Anytime, Anywhere</span>
                    </h2>
                </div>

                <img 
                    src="https://www.pixelstalk.net/wp-content/uploads/images6/GYM-Fitness-Wallpaper-HD.jpg" 
                    alt="Workout Plans"
                    className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h2 className=" text-center text-xl font-bold mb-2 text-white">Workout Plans</h2>
                <p className=" text-center text-gray-400 mb-4">
                    Transformative Fitness Experiences Tailored to You
                </p>
                <div className="flex justify-center">
                    <Link to="/MyWorkout" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-800 transition">
                        Let's Go
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default WorkoutHome;
