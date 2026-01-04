import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function DoctorProfile() {
  const { id } = useParams();

  // Preview doctor data
  const doctor = {
    name: "Dr. Samadhi Wijethunga",
    specialization: "Cardiology",
    photo: "https://cdn-icons-png.flaticon.com/512/387/387561.png"
  };

  // Weekly availability (preview)
  const weeklySchedule = [
    { day: "Monday", availability: 87 },
    { day: "Tuesday", availability: 61 },
    { day: "Wednesday", availability: 40 },
    { day: "Thursday", availability: 75 },
    { day: "Friday", availability: 83 },
    { day: "Saturday", availability: 50 },
    { day: "Sunday", availability: 20 },
  ];

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white p-6 fixed h-full shadow-lg">
          <h2 className="text-2xl font-bold mb-20">Doctor Panel</h2>
          <ul className="space-y-4">
            <li>
              <Link
                to="/doctor-availability"
                className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors text-lg"
              >
                Doctor Availability
              </Link>
            </li>
            <li>
              <Link
                to={`/doctor/${id}`}
                className="block py-2 px-4 rounded bg-gray-700 text-lg"
              >
                Doctor Profile
              </Link>
            </li>
          </ul>
        </div>

        <Navbar />

        {/* Main Content */}
        <div className="ml-64 flex-1">
          <div
            className="bg-cover bg-center bg-no-repeat bg-fixed w-full min-h-screen"
            style={{
              backgroundImage:
                "url('https://wallpapercave.com/wp/wp4655609.jpg')",
            }}
          >
            <div className="bg-black bg-opacity-50 w-full min-h-screen">
              <div className="container mx-auto px-6 py-12">
                <div className="pt-20"></div>

                {/* Doctor Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-10 flex items-center">
                  <img
                    src={doctor.photo}
                    alt="Doctor"
                    className="w-28 h-28 rounded-full mr-6"
                  />
                  <div>
                    <h1 className="text-3xl font-bold">{doctor.name}</h1>
                    <p className="text-gray-600 text-lg">
                      {doctor.specialization}
                    </p>
                  </div>
                </div>

                {/* Weekly Schedule */}
                <div className="bg-gray-200 rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">
                    Weekly Availability
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {weeklySchedule.map((day, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg text-center text-white ${
                          day.availability >= 80
                            ? "bg-green-500"
                            : day.availability >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        <h3 className="text-xl font-semibold">{day.day}</h3>
                        <p className="text-lg">{day.availability}% Available</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Book Appointment */}
                <div className="text-center mt-10">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg">
                    Book Appointment
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}