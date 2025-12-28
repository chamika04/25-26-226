import React from 'react';
import { useNavigate } from 'react-router-dom';

const heroStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: '12px',
  maxWidth: 1100,
  margin: '0 auto',
  padding: '40px 20px',
};

export default function Home() {
  const navigate = useNavigate();

  const cards = [
    { title: 'Bed Forecasting', route: '/bed-dashboard', color: '#0ea5a4' },
    { title: 'Doctor Maintain', route: '/doctor-maintain', color: '#6366f1' },
    { title: 'Medicine Maintain', route: '/medicine-maintain', color: '#f59e0b' },
    { title: 'Illness Forecasting', route: '/illness-forecast', color: '#ef4444' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>

      <main style={{ flex: 1, maxWidth: 1200, margin: '0 auto', padding: '76px 20px 0', width: '100%', boxSizing: 'border-box' }}>
        <section style={{ marginBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#0f172a' }}>Welcome</h1>
          <p style={{ marginTop: 8, color: '#64748b' }}>Choose a module to continue</p>
        </section>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 760, minHeight: 420, background: '#f3f4f6', padding: 32, borderRadius: 8, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                {cards.map((c) => (
                  <button
                    key={c.title}
                    onClick={() => navigate(c.route)}
                    style={{
                      background: '#fff',
                      border: `1px solid ${c.color}33`,
                      padding: 18,
                      borderRadius: 10,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                      boxShadow: '0 6px 18px rgba(2,6,23,0.06)',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(2,6,23,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 6px 18px rgba(2,6,23,0.06)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>{c.title}</h3>
                      <div style={{ width: 10, height: 10, borderRadius: 6, background: c.color }} />
                    </div>
                    <p style={{ margin: 0, color: '#64748b', lineHeight: 1.4, fontSize: '0.95rem' }}>Open the {c.title} module to manage or view details.</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer is rendered globally in App.js; do not render here to avoid duplication */}
    </div>
  );
}