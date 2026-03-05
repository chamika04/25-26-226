import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Calendar, 
  Clock, 
  Save, 
  ChevronRight, 
  X, 
  Loader, 
  Info
} from 'lucide-react';

const ETU_NurseDailyInput = () => {
  const [selectedWard, setSelectedWard] = useState(null); // Standard Census Modal

  // --- WARD CONFIGURATION (ETU ONLY) ---
  const wardInfo = { id: 'ETU', name: 'Emergency Treatment Unit', icon: Activity, color: '#ef4444' };

  // no surge fetching for ETU (ETU does not use surge beds)

  // ETU does not manage surge beds; no save helper

  return (
    <div style={{ padding: 40, fontFamily: 'Inter, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* --- HEADER --- */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: 0 }}>Daily Census & Surge Entry</h1>
        <p style={{ color: '#64748b', marginTop: 8 }}>Input daily shift data for ETU.</p>
      </div>

      {/* --- CARDS GRID --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        
        {/* CARD 1: STANDARD CENSUS (ETU) */}
        <div 
          onClick={() => setSelectedWard(wardInfo)}
          style={{ 
            background: 'white', 
            borderRadius: 20, 
            padding: 24, 
            border: '1px solid #e2e8f0', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', 
            cursor: 'pointer', 
            transition: 'transform 0.2s',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: wardInfo.color }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div style={{ background: `${wardInfo.color}15`, padding: 12, borderRadius: 12 }}>
              <Activity size={28} color={wardInfo.color} />
            </div>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{wardInfo.name}</h3>
          <p style={{ fontSize: 13, color: '#64748b' }}>Daily Admissions & Discharges</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
            <span>Census Entry</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: wardInfo.color }}>
              Open Form <ChevronRight size={14} />
            </span>
          </div>
        </div>

        {/* ETU does not support surge beds; surge UI removed */}

      </div>

      {/* --- MODAL 1: DAILY CENSUS INPUT --- */}
      {selectedWard && (
        <DailyInputModal ward={selectedWard} onClose={() => setSelectedWard(null)} />
      )}

      {/* no surge modal for ETU */}

    </div>
  );
};

// (Surge UI removed for ETU)

// ==============================================
// SUB-COMPONENT: DAILY INPUT MODAL (ORIGINAL)
// ==============================================
const DailyInputModal = ({ ward, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [fetchingCapacity, setFetchingCapacity] = useState(true);
  const [wardCapacity, setWardCapacity] = useState(0); 
  
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [shift, setShift] = useState('Morning (A)'); 
  
  const [data, setData] = useState({ 
    // keep legacy total but capture gender split for ETU
    admissions: 0, 
    admissions_male: 0,
    admissions_female: 0,
    discharges: 0, 
    transfersOut: 0, 
    deaths: 0,
    occupied: 0 
  });

  // --- FETCH CAPACITY ---
  useEffect(() => {
    const getCapacity = async () => {
      try {
        setFetchingCapacity(true);
        const response = await fetch('http://localhost:5001/api/get-beds');
        if (response.ok) {
          const allBeds = await response.json();
          // Filter specifically for the selected ward (ETU)
          const functionalBeds = allBeds.filter(b => b.ward_id === ward.id && b.status === 'Functional');
          setWardCapacity(functionalBeds.length);
        } else {
          console.error("Failed to fetch beds");
        }
      } catch (error) {
        console.error("Connection Error:", error);
      } finally {
        setFetchingCapacity(false);
      }
    };

    getCapacity();
  }, [ward.id]);

  const updateField = (field, value) => {
    const numValue = Math.max(0, Number(value) || 0);
    setData(prev => ({ ...prev, [field]: numValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
      const isETU = ward.id === 'ETU'; 

      const payload = {
        Date: date,
        Shift_ID: shift,
        Ward_ID: ward.id,
        Ward_Name: ward.name,
        
        // ETU-specific gender split + total
        ...(isETU ? {
          ETU_Admissions_Male: data.admissions_male,
          ETU_Admissions_Female: data.admissions_female,
          ETU_Admissions: (Number(data.admissions_male) || 0) + (Number(data.admissions_female) || 0),
          ETU_Discharges: data.discharges,
          ETU_OccupiedBeds: data.occupied,
        } : {
          Admissions: data.admissions,
          Discharges: data.discharges,
          OccupiedBeds: data.occupied,
        }),

        transfersOut: data.transfersOut,
        deaths: data.deaths,
        Weather: 'Sunny',
        SpecialEvent: 'None',
        IsHoliday: 'No',
        DayOfWeek: dayName,
        PublicTransportStatus: 'Normal',
        OutbreakAlert: 'No',

        ...(isETU ? { ETU_BedCapacity: wardCapacity } : { BedCapacity: wardCapacity })
      };

      const response = await fetch('http://localhost:5001/api/add-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(`✅ ${ward.name} Data Saved Successfully!`);
        onClose(); 
      } else {
        const err = await response.json();
        alert(`❌ Server Error: ${err.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`❌ Connection Failed. Check backend.`);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ background: 'white', width: '90%', maxWidth: 600, borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Modal Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>{ward.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Daily Data Entry</p>
              {!fetchingCapacity && (
                <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', background: '#e2e8f0', padding: '2px 8px', borderRadius: 99 }}>
                  Capacity: {wardCapacity} Beds
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 8, cursor: 'pointer', color: '#64748b' }}>
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} style={{ padding: 32 }}>
          
          {/* Date & Shift Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} /> Date
              </label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1px solid #cbd5e1', outline: 'none', color: '#1e293b' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={14} /> Shift
              </label>
              <select 
                value={shift} 
                onChange={(e) => setShift(e.target.value)} 
                style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1px solid #cbd5e1', outline: 'none', background: 'white', color: '#1e293b' }}
              >
                <option value="Morning (A)">Morning Shift</option>
                <option value="Evening (B)">Evening Shift</option>
                <option value="Night (C)">Night Shift</option>
              </select>
            </div>
          </div>

          {/* Inputs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {/* Row 1: split arrivals by gender for ETU */}
            <InputCard label="New Arrivals (Male)" value={data.admissions_male} onChange={(v) => updateField('admissions_male', v)} />
            <InputCard label="New Arrivals (Female)" value={data.admissions_female} onChange={(v) => updateField('admissions_female', v)} />
            <InputCard label="Discharges" value={data.discharges} onChange={(v) => updateField('discharges', v)} />
            <InputCard label="Transfers Out" value={data.transfersOut} onChange={(v) => updateField('transfersOut', v)} />
            
            {/* Row 2 */}
            <InputCard label="Deaths" value={data.deaths} onChange={(v) => updateField('deaths', v)} isDanger />
            
            {/* CURRENT OCCUPANCY INPUT */}
            <div style={{ gridColumn: 'span 2' }}>
                <div style={{ background: '#ecfdf5', padding: 12, borderRadius: 12, border: '1px solid #d1fae5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                        Current Occupied Beds
                      </label>
                      {/* Warning if Occupancy > Capacity */}
                      {data.occupied > wardCapacity && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Info size={12} /> Over Capacity!
                        </span>
                      )}
                    </div>
                    <input 
                      type="number" 
                      min="0"
                      value={data.occupied} 
                      onChange={(e) => updateField('occupied', e.target.value)} 
                      style={{ width: '100%', fontSize: 20, fontWeight: 700, color: '#047857', background: 'transparent', border: 'none', outline: 'none' }} 
                    />
                </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid #cbd5e1', background: 'white', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || fetchingCapacity}
              style={{ flex: 2, padding: '12px', borderRadius: 12, border: 'none', background: '#0f172a', color: 'white', fontWeight: 600, cursor: (loading || fetchingCapacity) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {loading ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
              {loading ? 'Saving...' : (fetchingCapacity ? 'Loading Data...' : 'Submit Record')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

// --- HELPER COMPONENT ---
const InputCard = ({ label, value, onChange, isDanger }) => (
  <div style={{ background: isDanger ? '#fef2f2' : '#f8fafc', padding: 12, borderRadius: 12, border: isDanger ? '1px solid #fee2e2' : '1px solid #e2e8f0' }}>
    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: isDanger ? '#ef4444' : '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>
      {label}
    </label>
    <input 
      type="number" 
      min="0"
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      style={{ width: '100%', fontSize: 20, fontWeight: 700, color: '#0f172a', background: 'transparent', border: 'none', outline: 'none' }} 
    />
  </div>
);

export default ETU_NurseDailyInput;