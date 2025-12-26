import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

/* ---------------- MOCK FORECAST DATA ---------------- */

const forecastData = {
  Paracetamol: Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    demand: 120 + i * 2
  })),

  Amoxicillin: Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    demand: 80 + i * 1.5
  })),

  Insulin: Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    demand: 40 + i
  })),

  Saline: Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    demand: 150 + i * 3
  }))
};

const aiSuggestions = {
  Paracetamol: "Stock-out predicted in 7 days. Increase buffer stock by 20%.",
  Amoxicillin: "Seasonal infection trend detected. Consider early replenishment.",
  Insulin: "Stable demand observed. Maintain current stock levels.",
  Saline: "Possible accident surge impact. Emergency reserve recommended."
};

/* ---------------- COMPONENT ---------------- */

const ForecastingPage = () => {
  const [selectedMedicine, setSelectedMedicine] = useState("Paracetamol");

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Medicine Demand Forecasting
      </h1>

      {/* ================= MEDICINE SELECT ================= */}
      <div className="mb-6">
        <label className="font-semibold mr-4">Select Medicine:</label>
        <select
          className="border px-4 py-2 rounded"
          value={selectedMedicine}
          onChange={(e) => setSelectedMedicine(e.target.value)}
        >
          {Object.keys(forecastData).map((medicine) => (
            <option key={medicine}>{medicine}</option>
          ))}
        </select>
      </div>

      {/* ================= FORECAST CHART ================= */}
      <div className="bg-white shadow rounded p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          30-Day Demand Forecast – {selectedMedicine}
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastData[selectedMedicine]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" hide />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="demand"
              stroke="#2563EB"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= AI SUGGESTION ================= */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded mb-8">
        <h3 className="text-lg font-semibold text-blue-700 mb-2">
          AI Recommendation
        </h3>
        <p className="text-gray-700">{aiSuggestions[selectedMedicine]}</p>
      </div>

      {/* ================= ALERTS SECTION ================= */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600">
          Alerts & Warnings
        </h2>

        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Stock-out predicted in the next 7 days.</li>
          <li>Upcoming seasonal spike detected.</li>
          <li>Increase buffer stock by 20%.</li>
        </ul>
      </div>
    </div>
  );
};

export default ForecastingPage;
