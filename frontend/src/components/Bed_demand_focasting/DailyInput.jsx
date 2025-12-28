import React, { useState } from 'react';
import Layout from './Layout';

const WARDS = [
  'ICU Ward',
  'General Ward',
  'Maternity Ward',
  'Emergency Ward'
];

const DailyInput = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [rows, setRows] = useState(() => WARDS.map(() => ({ admissions: 0, discharges: 0, transfersIn: 0, transfersOut: 0 })));

  const updateCell = (index, field, value) => {
    const next = rows.slice();
    next[index] = { ...next[index], [field]: Number(value || 0) };
    setRows(next);
  };

  const totals = rows.reduce((acc, r) => {
    acc.admissions += Number(r.admissions || 0);
    acc.discharges += Number(r.discharges || 0);
    acc.transfersIn += Number(r.transfersIn || 0);
    acc.transfersOut += Number(r.transfersOut || 0);
    return acc;
  }, { admissions: 0, discharges: 0, transfersIn: 0, transfersOut: 0 });

  const handleClear = () => {
    setRows(WARDS.map(() => ({ admissions: 0, discharges: 0, transfersIn: 0, transfersOut: 0 })));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with real save logic
    console.log('Submitting daily census', { date, rows });
    alert('Data submitted (see console).');
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Daily Patient Census Entry</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="mb-4 flex items-center gap-4">
            <label className="text-sm text-slate-600">Date:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-2 border rounded-md" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-4">Ward Name</th>
                  <th className="p-4">New Admissions</th>
                  <th className="p-4">Discharges</th>
                  <th className="p-4">Transfers In</th>
                  <th className="p-4">Transfers Out</th>
                </tr>
              </thead>
              <tbody>
                {WARDS.map((ward, i) => (
                  <tr key={ward} className="border-b">
                    <td className="p-4 align-top">{ward}</td>
                    <td className="p-4"><input type="number" value={rows[i].admissions} onChange={(e) => updateCell(i, 'admissions', e.target.value)} className="w-28 p-2 border rounded" /></td>
                    <td className="p-4"><input type="number" value={rows[i].discharges} onChange={(e) => updateCell(i, 'discharges', e.target.value)} className="w-28 p-2 border rounded" /></td>
                    <td className="p-4"><input type="number" value={rows[i].transfersIn} onChange={(e) => updateCell(i, 'transfersIn', e.target.value)} className="w-28 p-2 border rounded" /></td>
                    <td className="p-4"><input type="number" value={rows[i].transfersOut} onChange={(e) => updateCell(i, 'transfersOut', e.target.value)} className="w-28 p-2 border rounded" /></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="p-4 font-semibold">Totals</td>
                  <td className="p-4 font-semibold">{totals.admissions}</td>
                  <td className="p-4 font-semibold">{totals.discharges}</td>
                  <td className="p-4 font-semibold">{totals.transfersIn}</td>
                  <td className="p-4 font-semibold">{totals.transfersOut}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-end gap-4">
            <button type="button" onClick={handleClear} className="px-4 py-3 rounded bg-gray-300 text-slate-700">Clear Form</button>
            <button type="submit" className="px-8 py-3 rounded bg-blue-600 text-white font-semibold">Submit Data</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default DailyInput;