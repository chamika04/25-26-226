import React from 'react';
import { Users, BedDouble, AlertTriangle, TrendingDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Layout from './Layout';

const BedDashboard = () => {
  const location = useLocation();

  return (
    <Layout>
      <div style={{ padding: 28, maxWidth: 1100, margin: '24px auto', color: '#0f172a' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 18 }}>Bed Management Dashboard</h1>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 22 }}>
          <StatCard icon={<BedDouble />} title="Total Beds" value="500" />
          <StatCard icon={<Users />} title="Current Occupancy" value="85%" />
          <StatCard icon={<TrendingDown />} title="Predicted Inflow (Today)" value="+42" />
          <StatCard icon={<AlertTriangle />} title="Critical Alerts" value="3" />
        </div>

        {/* Real-time Ward Occupancy */}
        <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 8px 24px rgba(2,6,23,0.06)', border: '1px solid #e6eef6' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Real-time Ward Occupancy</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <ProgressBar label="ICU Ward" percent={92} color="#ef4444" note="(Red)" />
            <ProgressBar label="General Ward" percent={78} color="#f59e0b" note="(Yellow)" />
            <ProgressBar label="Maternity Ward" percent={60} color="#10b981" note="(Green)" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Helper Components
const StatCard = ({ icon, title, value }) => (
  <div style={{ background: '#fff', padding: 18, borderRadius: 10, boxShadow: '0 6px 18px rgba(2,6,23,0.06)', display: 'flex', alignItems: 'center', gap: 14 }}>
    <div style={{ width: 52, height: 52, borderRadius: 10, background: 'linear-gradient(135deg,#eef2ff,#e9d5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
    <div>
      <p style={{ margin: 0, color: '#374151', fontSize: 13 }}>{title}</p>
      <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{value}</h3>
    </div>
  </div>
);

const ProgressBar = ({ label, percent, color, note }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
      <span style={{ fontWeight: 600, color: '#374151' }}>{label} <small style={{ color: '#6b7280' }}>{note || ''}</small></span>
      <span style={{ color: '#6b7280' }}>{percent}%</span>
    </div>
    <div style={{ width: '100%', background: '#eef2f7', borderRadius: 999, height: 14 }}>
      <div style={{ width: `${percent}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.5s ease' }} />
    </div>
  </div>
);

export default BedDashboard;