// src/Pages/Patient/DocAvailability.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";

const DoctorsAvailability = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [availabilityData, setAvailabilityData] = useState([]);

  // ✅ for flow
  const navigate = useNavigate();
  const { state } = useLocation();
  const selectedDoctorId = state?.doctorId;
  const selectedDoctorName = state?.doctorName;

  const doctors = [
    { id: 1, name: "Dr. Samantha Perera" },
    { id: 2, name: "Dr. Nuwan Jayasinghe" },
    { id: 3, name: "Dr. Malith Fernando" },
    { id: 4, name: "Dr. Kavindi Silva" },
    { id: 5, name: "Dr. Malindri Weerasinghe" },
    { id: 6, name: "Dr. Samanthi Madushani" },
  ];

  const generateRandomAvailability = () => {
    const results = doctors.map((doctor) => ({
      doctor_id: doctor.id,
      name: doctor.name,
      percentage: Math.floor(Math.random() * 101),
    }));

    // ✅ if user came from Doctors page, move that doctor to top (UI only)
    if (selectedDoctorId) {
      return [...results].sort((a, b) => {
        const aMatch = a.doctor_id === selectedDoctorId ? 1 : 0;
        const bMatch = b.doctor_id === selectedDoctorId ? 1 : 0;
        return bMatch - aMatch;
      });
    }

    return results;
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);

    if (!date) {
      setAvailabilityData([]);
      return;
    }

    setAvailabilityData(generateRandomAvailability());
    toast.success(`Showing availability for ${date}`, { autoClose: 1500 });
  };

  // ✅ Book Appointment action
  const handleBookAppointment = () => {
    if (!selectedDate) {
      toast.error("Please select a date first.");
      return;
    }

    navigate("/bookAppointment", {
      state: {
        doctorId: selectedDoctorId || null,
        doctorName: selectedDoctorName || "Selected Doctor",
        date: selectedDate,
      },
    });
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-10 pb-14 bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 bg-white/80 backdrop-blur rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Doctor Availability
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Select a date to view availability percentages for doctors.
            </p>

            {/* ✅ show doctor chosen from Doctors page */}
            {selectedDoctorName && (
              <p className="text-sm text-blue-700 font-semibold mt-2">
                Selected Doctor: {selectedDoctorName}
              </p>
            )}
          </div>

          <div className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold">
            Patient View
          </div>
        </div>

        {/* Top Row: Date Card + Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Date Selector */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                Tip: Choose a date to load
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                Green = High
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                Yellow = Medium
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                Red = Low
              </span>
            </div>

            {/* ✅ Always visible button (disabled until date selected) */}
            <button
              type="button"
              onClick={handleBookAppointment}
              disabled={!selectedDate}
              className={`mt-5 w-full sm:w-auto px-5 py-3 rounded-xl font-semibold transition
                ${
                  selectedDate
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed"
                }`}
            >
              Book Appointment
            </button>
          </div>

          {/* Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <p className="text-sm font-semibold text-slate-900 mb-2">
              Quick guide
            </p>
            <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
              <li>Select a date to view doctor availability.</li>
              <li>Each card shows the availability %.</li>
              <li>Try another date if you see no results.</li>
            </ul>

            <div className="mt-5 border-t pt-4">
              <p className="text-xs text-slate-500">
                Availability is not confirmed; these are predictions.
              </p>
            </div>
          </div>
        </div>

        {/* Availability Grid */}
        {availabilityData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {availabilityData.map((doc, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center bg-white shadow-sm rounded-2xl p-5 border border-slate-200 hover:shadow-md transition ${
                  selectedDoctorId && doc.doctor_id === selectedDoctorId
                    ? "ring-2 ring-blue-300"
                    : ""
                }`}
              >
                <div className="relative flex items-center justify-center w-20 h-20 mb-3">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      strokeWidth="8"
                      stroke="#E5E7EB"
                      fill="transparent"
                      r="32"
                      cx="40"
                      cy="40"
                    />
                    <circle
                      strokeWidth="8"
                      strokeLinecap="round"
                      stroke={
                        doc.percentage > 70
                          ? "#22c55e"
                          : doc.percentage > 40
                          ? "#facc15"
                          : "#ef4444"
                      }
                      strokeDasharray={2 * Math.PI * 32}
                      strokeDashoffset={
                        2 * Math.PI * 32 * (1 - doc.percentage / 100)
                      }
                      fill="transparent"
                      r="32"
                      cx="40"
                      cy="40"
                    />
                  </svg>

                  <span className="absolute text-sm font-bold text-slate-800">
                    {doc.percentage}%
                  </span>
                </div>

                <p className="text-center font-semibold text-slate-800">
                  {doc.name}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Empty states */}
        {availabilityData.length === 0 && selectedDate && (
          <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-slate-700">
            <p className="font-semibold">No availability data found</p>
            <p className="text-sm text-slate-600 mt-1">
              Try selecting another date.
            </p>
          </div>
        )}

        {!selectedDate && (
          <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-slate-700">
            <p className="font-semibold">Select a date to begin</p>
            <p className="text-sm text-slate-600 mt-1">
              After selecting a date, availability cards will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsAvailability;