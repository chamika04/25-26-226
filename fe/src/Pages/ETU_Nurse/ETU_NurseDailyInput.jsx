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
  const [selectedWard, setSelectedWard] = useState(null);

  // --- WARD CONFIGURATION (ETU ONLY) ---
  const wardInfo = { id: 'ETU', name: 'Emergency Treatment Unit', icon: Activity, color: '#ef4444' };

  return (
    <div style={{ padding: 40, fontFamily: 'Inter, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* --- HEADER --- */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: 0 }}>Daily Census Entry</h1>
        <p style={{ color: '#64748b', marginTop: 8 }}>Input detailed daily shift data by gender for the ETU.</p>
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
          <p style={{ fontSize: 13, color: '#64748b' }}>Detailed Gender Admissions & Discharges</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
            <span>Census Entry</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: wardInfo.color }}>
              Open Form <ChevronRight size={14} />
            </span>
          </div>
        </div>

      </div>

      {/* --- MODAL 1: DAILY CENSUS INPUT --- */}
      {selectedWard && (
        <DailyInputModal ward={selectedWard} onClose={() => setSelectedWard(null)} />
      )}

    </div>
  );
};


// ==============================================
// SUB-COMPONENT: DAILY INPUT MODAL
// ==============================================
const DailyInputModal = ({ ward, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [fetchingCapacity, setFetchingCapacity] = useState(true);
  const [wardCapacity, setWardCapacity] = useState(0); 
  
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [shift, setShift] = useState('Morning (A)'); 
  
  const [data, setData] = useState({ 
    admissions_male: 0,
    admissions_female: 0,
    discharges_male: 0,
    discharges_female: 0,
    transfersOut_male: 0,
    transfersOut_female: 0,
    deaths_male: 0,
    deaths_female: 0,
    occupied_male: 0,
    occupied_female: 0
  });

  // --- FETCH CAPACITY ---
  useEffect(() => {
    const getCapacity = async () => {
      try {
        setFetchingCapacity(true);
        const response = await fetch('http://localhost:5001/api/get-beds');
        if (response.ok) {
          const allBeds = await response.json();
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

      // Calculate Totals dynamically so the AI models don't break
      const totalAdmissions = data.admissions_male + data.admissions_female;
      const totalDischarges = data.discharges_male + data.discharges_female;
      const totalTransfers = data.transfersOut_male + data.transfersOut_female;
      const totalDeaths = data.deaths_male + data.deaths_female;
      const totalOccupied = data.occupied_male + data.occupied_female;

      const payload = {
        Date: date,
        Shift_ID: shift,
        Ward_ID: ward.id,
        Ward_Name: ward.name,
        
        ...(isETU ? {
          ETU_Admissions_Male: data.admissions_male,
          ETU_Admissions_Female: data.admissions_female,
          ETU_Admissions: totalAdmissions, 
          
          ETU_Discharges_Male: data.discharges_male,
          ETU_Discharges_Female: data.discharges_female,
          ETU_Discharges: totalDischarges, 

          ETU_OccupiedBeds_Male: data.occupied_male,
          ETU_OccupiedBeds_Female: data.occupied_female,
          ETU_OccupiedBeds: totalOccupied, 
        } : {
          Admissions: totalAdmissions,
          Discharges: totalDischarges,
          OccupiedBeds: totalOccupied,
        }),

        transfersOut_Male: data.transfersOut_male,
        transfersOut_Female: data.transfersOut_female,
        transfersOut: totalTransfers,

        deaths_Male: data.deaths_male,
        deaths_Female: data.deaths_female,
        deaths: totalDeaths,

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

  const totalOccupiedPreview = data.occupied_male + data.occupied_female;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }}>
      {/* Increased max-width to 800px to perfectly accommodate the side-by-side grid */}
      <div style={{ background: 'white', width: '100%', maxWidth: 800, borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden' }}>
        
        {/* Modal Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>{ward.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Detailed Gender Split Entry</p>
              {!fetchingCapacity && (
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', background: '#e2e8f0', padding: '4px 10px', borderRadius: 99 }}>
                  Capacity: {wardCapacity} Beds
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 8, cursor: 'pointer', color: '#64748b' }}>
            <X size={24} />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div style={{ overflowY: 'auto', padding: 32 }}>
          <form onSubmit={handleSubmit}>
            
            {/* Date & Shift Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={14} /> Date
                </label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #cbd5e1', outline: 'none', color: '#1e293b' }} 
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={14} /> Shift
                </label>
                <select 
                  value={shift} 
                  onChange={(e) => setShift(e.target.value)} 
                  style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #cbd5e1', outline: 'none', background: 'white', color: '#1e293b' }}
                >
                  <option value="Morning (A)">Morning Shift</option>
                  <option value="Evening (B)">Evening Shift</option>
                  <option value="Night (C)">Night Shift</option>
                </select>
              </div>
            </div>

            {/* ✅ NEW: 2-Column Grid of Split Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              
              <SplitInputCard 
                title="New Arrivals" 
                maleValue={data.admissions_male} onMaleChange={(v) => updateField('admissions_male', v)}
                femaleValue={data.admissions_female} onFemaleChange={(v) => updateField('admissions_female', v)}
              />
              
              <SplitInputCard 
                title="Discharges" 
                maleValue={data.discharges_male} onMaleChange={(v) => updateField('discharges_male', v)}
                femaleValue={data.discharges_female} onFemaleChange={(v) => updateField('discharges_female', v)}
              />

              <SplitInputCard 
                title="Transfers Out" 
                maleValue={data.transfersOut_male} onMaleChange={(v) => updateField('transfersOut_male', v)}
                femaleValue={data.transfersOut_female} onFemaleChange={(v) => updateField('transfersOut_female', v)}
              />
              
              <SplitInputCard 
                title="Deaths" 
                theme="danger"
                maleValue={data.deaths_male} onMaleChange={(v) => updateField('deaths_male', v)}
                femaleValue={data.deaths_female} onFemaleChange={(v) => updateField('deaths_female', v)}
              />
            </div>

            {/* Occupied Beds - Full Width Span */}
            <div style={{ marginTop: 20 }}>
              <SplitInputCard 
                title="Current Occupied Beds (End of Shift)" 
                theme="success"
                maleValue={data.occupied_male} onMaleChange={(v) => updateField('occupied_male', v)}
                femaleValue={data.occupied_female} onFemaleChange={(v) => updateField('occupied_female', v)}
                rightElement={
                  totalOccupiedPreview > wardCapacity ? (
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 6, background: '#fee2e2', padding: '4px 12px', borderRadius: 99 }}>
                      <Info size={14} /> Over Capacity! ({totalOccupiedPreview} / {wardCapacity})
                    </span>
                  ) : null
                }
              />
            </div>

            {/* Footer Actions */}
            <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
              <button type="button" onClick={onClose} style={{ flex: 1, padding: '14px', borderRadius: 12, border: '1px solid #cbd5e1', background: 'white', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading || fetchingCapacity}
                style={{ flex: 2, padding: '14px', borderRadius: 12, border: 'none', background: '#0f172a', color: 'white', fontWeight: 700, cursor: (loading || fetchingCapacity) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                {loading ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
                {loading ? 'Saving to Database...' : (fetchingCapacity ? 'Loading Bed Capacity...' : 'Submit Final Shift Record')}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

// ==============================================
// ✅ NEW HELPER COMPONENT: UI MATCHING THE IMAGE
// ==============================================
const SplitInputCard = ({ title, maleValue, femaleValue, onMaleChange, onFemaleChange, theme = 'default', rightElement }) => {
  // Dynamic styling based on the context of the card
  const themes = {
    default: { bg: '#f8fafc', border: '#e2e8f0', title: '#0f172a', label: '#64748b', inputBorder: '#cbd5e1', inputText: '#0f172a' },
    danger:  { bg: '#fef2f2', border: '#fecaca', title: '#dc2626', label: '#ef4444', inputBorder: '#fca5a5', inputText: '#991b1b' },
    success: { bg: '#ecfdf5', border: '#a7f3d0', title: '#047857', label: '#059669', inputBorder: '#6ee7b7', inputText: '#064e3b' }
  };
  
  const t = themes[theme];

  return (
    <div style={{ background: t.bg, padding: 20, borderRadius: 16, border: `1px solid ${t.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: t.title, textTransform: 'uppercase' }}>
          {title}
        </label>
        {rightElement}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: t.label, marginBottom: 6, display: 'block' }}>MALE PATIENTS</label>
          <input 
            type="number" min="0" value={maleValue} onChange={(e) => onMaleChange(e.target.value)} 
            style={{ width: '100%', boxSizing: 'border-box', fontSize: 24, fontWeight: 800, color: t.inputText, background: 'white', border: `1px solid ${t.inputBorder}`, borderRadius: 10, padding: '10px 16px', outline: 'none' }} 
          />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: t.label, marginBottom: 6, display: 'block' }}>FEMALE PATIENTS</label>
          <input 
            type="number" min="0" value={femaleValue} onChange={(e) => onFemaleChange(e.target.value)} 
            style={{ width: '100%', boxSizing: 'border-box', fontSize: 24, fontWeight: 800, color: t.inputText, background: 'white', border: `1px solid ${t.inputBorder}`, borderRadius: 10, padding: '10px 16px', outline: 'none' }} 
          />
        </div>
      </div>
    </div>
  );
};

export default ETU_NurseDailyInput;