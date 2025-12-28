import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, Filter } from 'lucide-react';
import Layout from './Layout';

// Dummy Data for the Chart
const historicalData = [
  { month: 'Jan', ICU: 40, General: 24, Maternity: 18 },
  { month: 'Feb', ICU: 30, General: 13, Maternity: 22 },
  { month: 'Mar', ICU: 20, General: 48, Maternity: 25 },
  { month: 'Apr', ICU: 27, General: 39, Maternity: 20 },
  { month: 'May', ICU: 18, General: 48, Maternity: 21 },
  { month: 'Jun', ICU: 23, General: 38, Maternity: 25 },
  { month: 'Jul', ICU: 34, General: 43, Maternity: 21 },
];

const Trends = () => {
  return (
    <Layout>
      <div className="px-6 py-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Historical Occupancy Trends</h1>

          <div className="flex items-center space-x-3">
            <label className="text-sm text-slate-600 mr-2">Time Range:</label>
            <select className="p-2 border rounded-md bg-white">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
              <option>Last 3 Months</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end mb-4">
          <label className="text-sm text-slate-600 mr-2">Compare:</label>
          <select className="p-2 border rounded-md bg-white">
            <option>All Wards</option>
            <option>ICU vs General</option>
            <option>Maternity</option>
          </select>
        </div>

        {/* Chart Card */}
        <div className="bg-white p-6 rounded-xl shadow border border-slate-200 mb-6" style={{ height: 340 }}>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <h3 className="text-lg font-semibold text-slate-700">Historical Occupancy Trends</h3>
          </div>
          <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData} margin={{ top: 10, right: 24, left: 12, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6eef6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#475569' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569' }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 6px 18px rgba(2,6,23,0.06)' }} />
                <Legend verticalAlign="top" align="right" />
                <Line type="monotone" dataKey="ICU" stroke="#ef4444" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="General" stroke="#0ea5e9" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="Maternity" stroke="#10b981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Heatmap / Insights */}
        <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
          <h4 className="text-slate-700 font-semibold mb-3">Weekly Occupancy Heatmap</h4>
          <div style={{ height: 160, borderRadius: 8, background: 'linear-gradient(90deg,#fff,#f8fafc)' }}>
            {/* Placeholder: replace with actual heatmap component later */}
            <div style={{ padding: 10, color: '#64748b' }}>Heatmap visualization goes here.</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const InsightCard = ({ title, value, desc }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <h4 className="text-slate-500 text-sm font-medium uppercase tracking-wide mb-2">{title}</h4>
    <p className="text-2xl font-bold text-slate-800 mb-1">{value}</p>
    <p className="text-sm text-slate-400">{desc}</p>
  </div>
);

export default Trends;