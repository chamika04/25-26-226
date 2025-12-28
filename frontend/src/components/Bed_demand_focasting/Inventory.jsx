import React, { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal } from 'lucide-react';
import Layout from './Layout';

const Inventory = () => {
  // Dummy Data
  const [beds] = useState([
    { id: 'BED-1001', ward: 'ICU', type: 'Ventilator', status: 'Occupied' },
    { id: 'BED-1002', ward: 'ICU', type: 'Standard', status: 'Available' },
    { id: 'BED-2045', ward: 'General', type: 'Standard', status: 'Maintenance' },
    { id: 'BED-2046', ward: 'General', type: 'Standard', status: 'Occupied' },
    { id: 'BED-3012', ward: 'Maternity', type: 'Electric', status: 'Available' },
    { id: 'BED-1003', ward: 'ICU', type: 'Ventilator', status: 'Occupied' },
  ]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Bed Inventory Management</h1>
            <p className="text-slate-500 text-sm">Track real-time status of all physical assets.</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 shadow-sm transition-colors">
            <Plus size={20} />
            <span>Add New Bed</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by Bed ID..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            <select className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 bg-white">
              <option>All Wards</option>
              <option>ICU</option>
              <option>General</option>
            </select>
            <select className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 bg-white">
              <option>All Statuses</option>
              <option>Available</option>
              <option>Occupied</option>
              <option>Maintenance</option>
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-600">Bed ID</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Ward Location</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Bed Type</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {beds.map((bed, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{bed.id}</td>
                  <td className="p-4 text-slate-600">{bed.ward}</td>
                  <td className="p-4 text-slate-600">{bed.type}</td>
                  <td className="p-4">
                    <StatusBadge status={bed.status} />
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-slate-100">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
            <span>Showing 6 of 500 beds</span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50">Previous</button>
              <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Helper Component for Status Colors
const StatusBadge = ({ status }) => {
  const styles = {
    Available: "bg-emerald-100 text-emerald-700",
    Occupied: "bg-red-100 text-red-700",
    Maintenance: "bg-yellow-100 text-yellow-700"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
};

export default Inventory;