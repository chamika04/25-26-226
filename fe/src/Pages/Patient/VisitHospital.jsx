import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const VisitHospital = () => {
  const { state } = useLocation();

  const token = useMemo(() => {
    return Math.floor(1000 + Math.random() * 9000); // demo token
  }, []);

  if (!state) {
    return (
      <div className="min-h-screen p-10">
        <p>No appointment data found.</p>
        <Link className="text-blue-600 underline" to="/doctors">
          Go to Doctors
        </Link>
      </div>
    );
  }

  const { doctorName, date, slot, patientName, phone } = state;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-slate-100 px-4 pt-10 pb-14">
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h1 className="text-2xl font-extrabold text-green-700">
          Appointment Confirmed ✅
        </h1>

        <div className="mt-5 space-y-2 text-slate-700">
          <p>
            <b>Patient:</b> {patientName}
          </p>
          <p>
            <b>Phone:</b> {phone}
          </p>
          <p>
            <b>Doctor:</b> {doctorName}
          </p>
          <p>
            <b>Date:</b> {date}
          </p>
          <p>
            <b>Time:</b> {slot}
          </p>
          <p>
            <b>Token:</b> {token}
          </p>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-100 p-4 rounded-xl">
          <p className="font-semibold text-slate-900">Visit Hospital</p>
          <ul className="list-disc pl-5 text-sm mt-2 text-slate-700 space-y-1">
            <li>Arrive 15 minutes early.</li>
            <li>Go to OPD reception and show your token.</li>
            <li>Bring your NIC and any previous reports.</li>
          </ul>
        </div>

        <Link
          to="/doctors"
          className="block text-center mt-6 px-4 py-3 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition"
        >
          Back to Doctors
        </Link>
      </div>
    </div>
  );
};

export default VisitHospital;