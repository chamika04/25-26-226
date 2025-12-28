import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from './Layout';

const data = [
  { name: 'Mon', historical: 40, predicted: 40 },
  { name: 'Tue', historical: 35, predicted: 36 },
  { name: 'Wed', historical: 50, predicted: 48 },
  { name: 'Thu', historical: null, predicted: 65 }, // Future start
  { name: 'Fri', historical: null, predicted: 70 },
  { name: 'Sat', historical: null, predicted: 55 },
  { name: 'Sun', historical: null, predicted: 45 },
];

const Forecast = () => {
  return (
    <Layout>
      <div className="px-6 py-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Future Demand Forecast</h1>
          <div className="flex items-center space-x-3">
            <label className="text-sm text-slate-600 mr-2">Select Ward:</label>
            <select className="p-2 border rounded-md bg-white">
              <option>ICU</option>
              <option>General</option>
              <option>Maternity</option>
            </select>

            <label className="sr-only">Timeframe</label>
            <select className="p-2 border rounded-md bg-white">
              <option>Next 14 Days</option>
              <option>Next 7 Days</option>
              <option>Next 30 Days</option>
            </select>

            <label className="sr-only">Model</label>
            <select className="p-2 border rounded-md bg-white">
              <option>LSTM</option>
              <option>ARIMA</option>
              <option>XGBoost</option>
            </select>
          </div>
        </div>

        {/* Chart Card */}
        <div className="bg-white p-6 rounded-xl shadow border border-slate-200 mb-6" style={{ height: 420 }}>
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-700">Bed Demand Prediction</h3>
            <div className="text-sm text-slate-500">Historical vs Predicted</div>
          </div>
          <div style={{ width: '100%', height: 'calc(100% - 48px)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" align="left" />
                <Line type="monotone" dataKey="historical" stroke="#0ea5e9" strokeWidth={3} name="Historical Data" dot={false} />
                <Line type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={3} strokeDasharray="6 6" name="Predicted Demand" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Forecast Details Table */}
        <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <strong className="text-slate-700">Forecast Details</strong>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Predicted Demand</th>
                <th className="p-4">Lower Bound</th>
                <th className="p-4">Upper Bound</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr><td className="p-4">Tomorrow</td><td className="p-4">42</td><td className="p-4">38</td><td className="p-4">46</td></tr>
              <tr><td className="p-4">+2 Days</td><td className="p-4">45</td><td className="p-4">40</td><td className="p-4">51</td></tr>
              <tr><td className="p-4">+3 Days</td><td className="p-4">50</td><td className="p-4">44</td><td className="p-4">56</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Forecast;