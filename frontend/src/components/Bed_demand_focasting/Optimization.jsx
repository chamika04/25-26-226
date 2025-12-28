import React, { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import Layout from './Layout';

const Optimization = () => {
  const [beds, setBeds] = useState(5);
  const [ward, setWard] = useState('ICU');

  // Simple mock: each bed reduces risk by ~3% up to a cap
  const reduction = Math.min(50, Math.round(beds * 3));

  return (
    <Layout>
      <div className="px-6 py-8 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-slate-800">Resource Optimization Recommendations</h1>

        {/* Critical Alert Banner */}
        <div className="rounded-xl overflow-hidden border border-red-200 bg-red-50">
          <div className="p-4 flex items-start justify-between">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle color="#991b1b" />
              </div>
              <div>
                <div className="font-semibold text-red-800">CRITICAL ALERT: ICU Capacity at Risk in 48 Hours.</div>
                <div className="text-sm text-red-700 mt-1">Action: Convert 4 General Ward beds to ICU immediately.</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">Approve Transfer</button>
              <button className="bg-gray-200 text-slate-700 px-4 py-2 rounded">Ignore Alert</button>
            </div>
          </div>
        </div>

        {/* Suggestion cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
            <div className="flex items-start gap-3">
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                {/* icon placeholder */}👥
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Staffing Suggestion</h3>
                <p className="text-slate-600 mt-1">Increase night shift nursing staff in Emergency Ward for the weekend.</p>
                <div className="mt-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded">Acknowledge</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
            <div className="flex items-start gap-3">
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                {/* icon placeholder */}🛏️
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Bed Allocation</h3>
                <p className="text-slate-600 mt-1">Maternity Ward has 10 excess beds. Consider reallocating to General Ward.</p>
                <div className="mt-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded">Reallocate</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Simulation panel */}
        <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
          <h4 className="text-slate-800 font-semibold mb-3">Simulation</h4>
          <p className="text-slate-600 mb-4">Test your scenarios to see impact on predicted risk.</p>
          <div className="flex items-center gap-3">
            <div>
              <label className="text-sm text-slate-600 block">What if we add</label>
              <input type="number" value={beds} onChange={(e) => setBeds(Number(e.target.value))} className="mt-1 p-2 border rounded w-20" />
            </div>

            <div>
              <label className="text-sm text-slate-600 block">beds to</label>
              <select value={ward} onChange={(e) => setWard(e.target.value)} className="mt-1 p-2 border rounded">
                <option>ICU</option>
                <option>General</option>
                <option>Maternity</option>
              </select>
            </div>

            <div className="ml-2 text-sm text-slate-700">? → <span className="font-semibold text-green-600">Risk reduced by {reduction}%</span></div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Optimization;