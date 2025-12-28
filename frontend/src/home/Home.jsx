import React from 'react';
import { useNavigate } from 'react-router-dom';
import BedDashboard from '../components/Bed_demand_focasting/Bed_Dashboard';
import Layout from '../components/Bed_demand_focasting/Layout';

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

  return (
    <Layout>
        <div style={{
          fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff'
        }}>
          <main style={{
            maxWidth: 1400,
            margin: '0 auto',
            padding: '0 40px',
            flex: 1,
            width: '100%'
          }}>
        {/* Hero Section - Readded with updated styling */}
       

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ 
            marginBottom: 24, 
            fontSize: '1.75rem',
            color: '#0f172a',
            fontWeight: 600
          }}>
            What we do
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: 20,
            marginBottom: 32
          }}>
            <div style={{ 
              background: '#fff', 
              padding: 24, 
              borderRadius: 12, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              border: '1px solid #f1f5f9',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
            }}
            >
              <h3 style={{ 
                margin: '0 0 12px', 
                fontSize: '1.25rem',
                color: '#0f172a'
              }}>
                Demand Forecasting
              </h3>
              <p style={{ 
                margin: 0, 
                color: '#475569',
                lineHeight: 1.6
              }}>
                Short- and medium-term admissions forecasts per unit with 95% accuracy using advanced machine learning models.
              </p>
            </div>
            <div style={{ 
              background: '#fff', 
              padding: 24, 
              borderRadius: 12, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              border: '1px solid #f1f5f9',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
            }}
            >
              <h3 style={{ 
                margin: '0 0 12px', 
                fontSize: '1.25rem',
                color: '#0f172a'
              }}>
                Resource Optimization
              </h3>
              <p style={{ 
                margin: 0, 
                color: '#475569',
                lineHeight: 1.6
              }}>
                Auto-suggest optimal bed allocations and staffing adjustments based on predicted demand patterns.
              </p>
            </div>
            <div style={{ 
              background: '#fff', 
              padding: 24, 
              borderRadius: 12, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              border: '1px solid #f1f5f9',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
            }}
            >
              <h3 style={{ 
                margin: '0 0 12px', 
                fontSize: '1.25rem',
                color: '#0f172a'
              }}>
                Alerts & Planning
              </h3>
              <p style={{ 
                margin: 0, 
                color: '#475569',
                lineHeight: 1.6
              }}>
                Threshold-based alerts and scenario planning tools to proactively manage capacity constraints.
              </p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 40 }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 16,
            flexWrap: 'wrap',
            gap: 16
          }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: '1.75rem',
              color: '#0f172a',
              fontWeight: 600
            }}>
              Live preview — Bed Forecast
            </h2>
            <button
              onClick={() => navigate('/bed-dashboard')}
              style={{
                background: 'transparent',
                color: '#0ea5a4',
                border: '1px solid #0ea5a4',
                padding: '10px 20px',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f0f9f9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              View Full Dashboard →
            </button>
          </div>
          <div style={{ 
            background: '#ffffff', 
            borderRadius: 12, 
            padding: 20, 
            boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
            border: '1px solid #f1f5f9'
          }}>
            <BedDashboard />
          </div>
        </section>

        <section style={{ 
          marginBottom: 60, 
          padding: 32, 
          borderRadius: 12, 
          background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
          border: '1px solid #cbd5e1'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 24
          }}>
            <div>
              <h3 style={{ 
                margin: '0 0 12px', 
                fontSize: '1.5rem',
                color: '#0f172a',
                fontWeight: 600
              }}>
                Ready to reduce shortages and overprovisioning?
              </h3>
              <p style={{ 
                margin: 0, 
                color: '#475569',
                maxWidth: 600
              }}>
                Join leading hospitals that have reduced bed shortages by 40% and improved resource utilization by 35%.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <button
                onClick={() => navigate('/bed-dashboard')}
                style={{ 
                  background: '#0ea5a4', 
                  color: '#fff', 
                  padding: '14px 28px', 
                  borderRadius: 8, 
                  border: 'none', 
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '1rem',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#0d9488'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#0ea5a4'}
              >
                Open Bed Forecast
              </button>
              <button
                onClick={() => navigate('/register')}
                style={{ 
                  background: 'transparent', 
                  border: '1px solid #475569', 
                  padding: '14px 28px', 
                  borderRadius: 8, 
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: '#475569',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#475569';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#475569';
                }}
              >
                Request Demo
              </button>
            </div>
          </div>
        </section>
        </main>
      </div>
    </Layout>
  );
}