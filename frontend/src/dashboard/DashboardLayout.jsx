import React from 'react';
export default function DashboardLayout({ children }) {
  return (
    <div>
      <header className="p-4 bg-gray-800 text-white">Admin Dashboard</header>
      <main>{children}</main>
    </div>
  );
}
