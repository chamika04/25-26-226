import React from 'react';

const container = {
  padding: '2rem',
  maxWidth: 960,
  margin: '2rem auto',
  background: '#fff',
  borderRadius: 10,
  boxShadow: '0 8px 24px rgba(6,38,58,0.06)'
};

const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' };
const title = { fontSize: '1.5rem', color: '#06263a', margin: 0 };
const backBtn = { background: '#60a5fa', color: '#06263a', padding: '0.5rem 0.9rem', borderRadius: 8, textDecoration: 'none', fontWeight: 700 };

export default function HospitalBed() {
  return (
    <main style={container}>
      <div style={header}>
        <h2 style={title}>Hospital Bed Forecasting</h2>
        <a href="#/" style={backBtn}>Back</a>
      </div>

      <p style={{ color: '#264653' }}>This page will contain bed forecasting tools, visualizations, and input forms. Placeholder demo below.</p>

      <section style={{ marginTop: 18, display: 'grid', gap: 12 }}>
        <div style={{ padding: 12, borderRadius: 8, background: '#f8fafc', border: '1px solid rgba(6,38,58,0.04)' }}>
          <strong>Quick Forecast</strong>
          <div style={{ marginTop: 8 }}>Estimated bed demand for next 7 days: <strong>avg 42 beds/day</strong></div>
        </div>

        <div style={{ padding: 12, borderRadius: 8, background: '#fff', border: '1px solid rgba(6,38,58,0.04)' }}>
          <strong>Upload Data</strong>
          <div style={{ marginTop: 8 }}>Upload historical admissions CSV to generate a forecast (integration placeholder).</div>
          <input type="file" style={{ marginTop: 8 }} />
        </div>
      </section>
    </main>
  );
}
