import React from "react";
import { FaPills, FaExclamationTriangle, FaClipboardList, FaCalendarCheck } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="w-full min-h-screen bg-blue-100 p-6 mt-20">

      {/* Title */}
      <h1 className="text-3xl font-bold text-hospitalBlue mb-6">
        Hospital Medicine Management Dashboard
      </h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Categories */}
        <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-blue-500">
          <div className="flex items-center space-x-4">
            <FaPills className="text-blue-600 text-3xl" />
            <div>
              <p className="text-gray-600 font-semibold">Total Categories</p>
              <h3 className="text-2xl font-bold">18</h3>
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-red-500">
          <div className="flex items-center space-x-4">
            <FaExclamationTriangle className="text-red-600 text-3xl" />
            <div>
              <p className="text-gray-600 font-semibold">Low Stock Items</p>
              <h3 className="text-2xl font-bold">5</h3>
            </div>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-yellow-500">
          <div className="flex items-center space-x-4">
            <FaClipboardList className="text-yellow-500 text-3xl" />
            <div>
              <p className="text-gray-600 font-semibold">Expiring Soon</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
          </div>
        </div>

        {/* Today’s Prescriptions */}
        <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-green-500">
          <div className="flex items-center space-x-4">
            <FaCalendarCheck className="text-green-600 text-3xl" />
            <div>
              <p className="text-gray-600 font-semibold">Prescriptions Today</p>
              <h3 className="text-2xl font-bold">42</h3>
            </div>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">

        {/* Forecasted Demand Chart Placeholder */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-3">Forecasted Demand</h2>
          <div className="h-56 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            Chart Placeholder
          </div>
        </div>

        {/* Accident Surge Chart Placeholder */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-3">Accident Surge Detection</h2>
          <div className="h-56 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            Line Graph Placeholder
          </div>
        </div>

        {/* Daily Medicine Usage Chart Placeholder */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-3">Daily Medicine Usage</h2>
          <div className="h-56 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            Bar Chart Placeholder
          </div>
        </div>

      </div>

      {/* Alerts Panel */}
      <div className="bg-white shadow-md rounded-xl p-6 mt-10">
        <h2 className="text-xl font-semibold mb-4">Alerts</h2>

        <ul className="space-y-3">
          <li className="bg-red-100 text-red-700 p-3 rounded-lg border border-red-300">
            ⚠ Paracetamol stock will run out in <strong>7 days</strong>.
          </li>

          <li className="bg-yellow-100 text-yellow-800 p-3 rounded-lg border border-yellow-300">
            ⚠ Possible accident surge due to <strong>heavy rain</strong> today.
          </li>

          <li className="bg-blue-100 text-blue-800 p-3 rounded-lg border border-blue-300">
            ℹ 4 medicines are close to their expiry date.
          </li>
        </ul>
      </div>

    </div>
  );
};

export default Dashboard;
