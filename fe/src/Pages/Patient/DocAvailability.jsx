import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

const DoctorsAvailability = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [availabilityData, setAvailabilityData] = useState([]);

  const doctors = [
    "Dr. Samantha Perera",
    "Dr. Nuwan Jayasinghe",
    "Dr. Malith Fernando",
    "Dr. Kavindi Silva",
    "Dr. Malindri Weerasinghe",
    "Dr. Samanthi Madushani"
  ];

  const generateRandomAvailability = () => {
    return doctors.map((doctor) => ({
      name: doctor,
      percentage: Math.floor(Math.random() * 101)
    }));
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);

    if (!date) {
      setAvailabilityData([]);
      return;
    }

    const randomData = generateRandomAvailability();
    setAvailabilityData(randomData);

    toast.success(`Showing availability for ${date}`, { autoClose: 1500 });
  };

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
                className="block py-2 px-4 rounded bg-gray-700 text-lg"
              >
                Doctor Availability
              </Link>
            </li>
            <li>
              <Link
                to="/doctor/1"
                className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors text-lg"
              >
                Doctor Profile
              </Link>
            </li>
          </ul>
        </div>

        <Navbar />

        {/* Main Content */}
        <div className="ml-64 flex-1 pt-10 bg-gray-50 flex flex-col items-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Doctor Availability</h1>

          {/* Date Selector */}
          <div className="mb-6 w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Date
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Availability Grid */}
          {availabilityData.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {availabilityData.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center bg-white shadow-md rounded-lg p-4"
                >
                  <div className="relative flex items-center justify-center w-16 h-16 mb-2">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        className="text-gray-300"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="28"
                        cx="32"
                        cy="32"
                      />
                      <circle
                        className={`stroke-current ${
                          doc.percentage > 70
                            ? "text-green-500"
                            : doc.percentage > 40
                            ? "text-yellow-400"
                            : "text-red-500"
                        }`}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 28}
                        strokeDashoffset={
                          2 * Math.PI * 28 * (1 - doc.percentage / 100)
                        }
                        fill="transparent"
                        r="28"
                        cx="32"
                        cy="32"
                      />
                    </svg>
                    <span className="absolute text-sm font-semibold">
                      {doc.percentage}%
                    </span>
                  </div>

                  <p className="text-center font-medium">{doc.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorsAvailability;