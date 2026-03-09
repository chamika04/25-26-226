import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookAppointment = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Coming from DocAvailability page
  const doctorId = state?.doctorId || "";
  const doctorName = state?.doctorName || "Selected Doctor";
  const date = state?.date || "";

  const [slot, setSlot] = useState("");
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");

  // Demo time slots (later you can fetch from backend)
  const slots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM"];

  const handleConfirm = () => {
    if (!date) return toast.error("Please select a date first.");
    if (!slot) return toast.error("Please select a time slot.");
    if (!patientName.trim()) return toast.error("Please enter patient name.");
    if (!phone.trim()) return toast.error("Please enter phone number.");

    toast.success("Appointment booked!", { autoClose: 1200 });

    navigate("/visitHospital", {
      state: { doctorId, doctorName, date, slot, patientName, phone },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 pt-10 pb-14">
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Book Appointment
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          {doctorName} {date ? `• ${date}` : ""}
        </p>

        {/* Slots */}
        <div className="mt-6">
          <p className="text-sm font-semibold text-slate-800 mb-2">
            Select Time Slot
          </p>
          <div className="flex flex-wrap gap-2">
            {slots.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSlot(s)}
                className={`px-3 py-2 rounded-xl border text-sm font-semibold transition ${
                  slot === s
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Patient Info */}
        <div className="mt-6 space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Patient Name
            </label>
            <input
              className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter patient name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Phone Number
            </label>
            <input
              className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
        </div>

        {/* Confirm */}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full mt-6 px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Confirm Appointment
        </button>
      </div>
    </div>
  );
};

export default BookAppointment;