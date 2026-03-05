import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  AlertTriangle, 
  BellRing, 
  ArrowRight, 
  Loader, 
  BedDouble, 
  CheckCircle2, 
  Clock,
  Tent,
  ArrowDownCircle 
} from 'lucide-react';
import { Calendar } from 'lucide-react';

const Ward_B_NurseDashboard = () => {
  // --- STATE MANAGEMENT ---
  const [wardData, setWardData] = useState({
    capacity: 0,   
    occupancy: 0, 
    available: 0   
  });

  const [surgeCount, setSurgeCount] = useState(0); 
  const [incomingWardCount, setIncomingWardCount] = useState(0); // Regular beds
  const [incomingSurgeCount, setIncomingSurgeCount] = useState(0); // Surge area beds
  const [loadingAI, setLoadingAI] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [lastTs, setLastTs] = useState(null);
  const [predTargetDate, setPredTargetDate] = useState(null);
  const [predTargetShift, setPredTargetShift] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);
  const [approvalState, setApprovalState] = useState(null);
  // Modal state for editing approvals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ suggested_number: null, approved: false, reason: '' });
  // reject modal removed (handled by ETU approvals)

  // --- MOCK ALERTS ---
  const alerts = {
    weather: { condition: "Heavy Rain", impact: "High risk of road accidents & slip/fall cases." },
    outbreak: { disease: "Seasonal Flu", status: "Moderate", note: "Respiratory ward admissions rising by 15%." }
  };

  // --- 1. FETCH WARD REAL-TIME STATUS (WARD B) ---
  useEffect(() => {
    const fetchWardStatus = async () => {
      try {
        setLoadingStats(true);
        // Fetch standard bed metrics
        const responseStats = await fetch('http://localhost:5001/api/ward-status/WARD-B');
        if (responseStats.ok) {
          const data = await responseStats.json();
          setWardData({ 
            capacity: data.capacity, 
            available: data.available, 
            occupancy: data.occupied 
          });
        }
        
        // Fetch Surge Bed count specifically for Ward B
        const responseSurge = await fetch('http://localhost:5001/api/get-history?type=SurgeUpdate&ward=WARD-B');
        if (responseSurge.ok) {
            const surgeData = await responseSurge.json();
            setSurgeCount(surgeData.count || 0);
        }
      } catch (error) {
        console.error("Failed to fetch ward stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchWardStatus();
  }, []);

  // --- 2. FETCH AI OPTIMIZATION PLAN (WARD + SURGE BREAKDOWN) ---
  useEffect(() => {
    const fetchAIPlan = async (force = false) => {
      try {
        setLoadingAI(true);
        const url = `http://localhost:5001/predict${force ? '?force=1' : ''}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data && data.response_ts) {
            if (data.response_ts === lastTs) {
              setLoadingAI(false);
              return;
            }
            setLastTs(data.response_ts);
          }
          setPredTargetDate(data.target_date || null);
          setPredTargetShift(data.target_shift || null);
          // Prefer gender-aware optimization payload, fall back to older keys
          try {
            if (data.optimization_plan_gender && data.optimization_plan_gender.female) {
              const femalePlan = data.optimization_plan_gender.female;
              setIncomingWardCount(femalePlan.female_ward ?? 0);
              setIncomingSurgeCount(femalePlan.female_ward_surge ?? 0);
            } else if (data.action_plan_transfers || data.action_plan_surge_breakdown) {
              setIncomingWardCount((data.action_plan_transfers && (data.action_plan_transfers.ward_b ?? data.action_plan_transfers.wardB)) || 0);
              setIncomingSurgeCount((data.action_plan_surge_breakdown && (data.action_plan_surge_breakdown.ward_b ?? data.action_plan_surge_breakdown.wardB)) || 0);
            } else if (typeof data.predicted_arrivals_female !== 'undefined') {
              setIncomingWardCount(Number(data.predicted_arrivals_female) || 0);
              setIncomingSurgeCount(0);
            }
          } catch (e) {
            console.error('Failed to parse AI plan for female ward', e);
          }
        }
      } catch (err) {
        console.error("Failed to fetch AI Plan", err);
      } finally {
        setLoadingAI(false);
      }
    };
    fetchAIPlan();
  }, []);

  useEffect(() => {
    const fetchApproval = async () => {
      if (!predTargetDate || !predTargetShift) return;
      try {
        const q = `http://localhost:5001/api/etu/approvals?target_date=${predTargetDate}&target_shift=${encodeURIComponent(predTargetShift)}`;
        const res = await fetch(q);
        if (!res.ok) return;
        const data = await res.json();
        let per = data.per_ward && data.per_ward['WARD-B'];
        // If per exists but summary says exists=false, treat as not set and fall back to raw rows
        if (per && per.exists) {
          setApprovalState({ status: per.approved ? 'accepted' : 'rejected', suggested_number: per.suggested_number ?? null, reason: per.reason ?? null });
        } else {
          const raw = data.raw || [];
          const found = raw.find((r) => (r.ward_id || r.ward) === 'WARD-B');
          if (found) {
            setApprovalState({ status: found.approved ? 'accepted' : 'rejected', suggested_number: found.suggested_number ?? null, reason: found.reason ?? null });
          } else {
            setApprovalState({ status: 'pending', suggested_number: null, reason: null });
          }
        }
      } catch (e) {
        console.error('fetch approval error', e);
      }
    };
    fetchApproval();
  }, [predTargetDate, predTargetShift]);

  const totalIncoming = incomingWardCount + incomingSurgeCount;
  const totalCapacityWithSurge = wardData.available + surgeCount;
  const isCritical = totalIncoming > totalCapacityWithSurge;
  const occupancyRate = wardData.capacity > 0 ? Math.round((wardData.occupancy / wardData.capacity) * 100) : 0;

  // --- STYLES ---
  const styles = {
    container: { padding: '40px', maxWidth: '1280px', margin: '0 auto', fontFamily: "'Inter', sans-serif", color: '#1e293b', background: '#f8fafc', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '40px' },
    title: { fontSize: '36px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px' },
    card: { background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9', marginBottom: '24px', overflow: 'hidden' },
    notificationCard: { background: totalIncoming > 0 ? 'linear-gradient(135deg, #fff7ed 0%, #fff 100%)' : 'white', borderLeft: totalIncoming > 0 ? '6px solid #f97316' : '6px solid #10b981' },
    actionBtn: { padding: '14px 24px', borderRadius: '12px', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    statGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '24px' },
    statBox: { background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' },
    statValue: { fontSize: '32px', fontWeight: '800', color: '#0f172a', marginTop: '8px' },
    statLabel: { fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }
  };

  const formatPlanLabel = (dateStr, shiftStr) => {
    if (!dateStr && !shiftStr) return '—';
    let parts = [];
    try {
      if (dateStr) {
        const d = new Date(dateStr);
        const month = d.toLocaleString(undefined, { month: 'short' });
        const day = d.toLocaleString(undefined, { day: '2-digit' });
        parts.push(`${month} ${day}`);
      }
    } catch (e) {
      if (dateStr) parts.push(dateStr);
    }
    if (shiftStr) parts.push(shiftStr);
    return parts.join(' - ');
  };

  const postApproval = async (payload) => {
    try {
      const res = await fetch('http://localhost:5001/api/etu/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed');
      setActionMsg({ ok: true, text: j.message || 'Saved' });
      setTimeout(() => setActionMsg(null), 3000);
      if (payload && payload.target_date && payload.target_shift) {
        setApprovalState({ status: payload.approved ? 'accepted' : 'rejected', suggested_number: payload.suggested_number ?? null, reason: payload.reason ?? null });
      }
      return true;
    } catch (err) {
      console.error(err);
      setActionMsg({ ok: false, text: err.message || 'Failed' });
      setTimeout(() => setActionMsg(null), 4000);
      return false;
    }
  };

  const handleAccept = async () => {
    if (!predTargetDate || !predTargetShift) {
      setActionMsg({ ok: false, text: 'No prediction loaded yet' });
      setTimeout(() => setActionMsg(null), 3000);
      return;
    }
    const suggested = totalIncoming;
    const payload = {
      ward_id: 'WARD-B',
      target_date: predTargetDate,
      target_shift: predTargetShift,
      approved: true,
      suggested_number: suggested,
      reason: 'Accepted by ward',
      nurse_id: 'ward_b_user'
    };
    await postApproval(payload);
  };

  // handleDefer removed

  // reject handlers removed

  const handleEdit = async () => {
    if (!predTargetDate || !predTargetShift) {
      setActionMsg({ ok: false, text: 'No prediction loaded yet' });
      setTimeout(() => setActionMsg(null), 3000);
      return;
    }
    const currentSuggested = approvalState?.suggested_number ?? totalIncoming;
    setEditForm({ suggested_number: currentSuggested, approved: !!(approvalState && approvalState.status === 'accepted'), reason: approvalState?.reason ?? '' });
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    // prepare payload from editForm and post
    const suggested = editForm.suggested_number !== '' && editForm.suggested_number !== null && editForm.suggested_number !== undefined
      ? Number(editForm.suggested_number)
      : null;
    // If ward explicitly suggests 0, treat as rejection
    const approvedFlag = (suggested === 0) ? false : !!editForm.approved;
    const reasonText = editForm.reason || (approvedFlag ? 'Accepted by ward (edited)' : 'Rejected by ward');
    const payload = {
      ward_id: 'WARD-B',
      target_date: predTargetDate,
      target_shift: predTargetShift,
      approved: approvedFlag,
      suggested_number: suggested,
      reason: reasonText,
      nurse_id: 'ward_b_user'
    };
    const ok = await postApproval(payload);
    if (ok) setEditModalOpen(false);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Female Ward Command Center</h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>Surgical Ward Allocation Monitoring</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: '#ffffff', border: '1px solid #dbeafe', boxShadow: '0 1px 2px rgba(16,24,40,0.03)' }}>
              <Calendar size={16} color="#1e40af" />
              <span style={{ color: '#0f172a', fontWeight: 600, fontSize: 14 }}>{formatPlanLabel(predTargetDate, predTargetShift)}</span>
            </div>
          </div>
        </div>
        {editModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
            <div style={{ width: 420, background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <h3 style={{ marginTop: 0 }}>Edit Approval — Female Ward</h3>
              <label style={{ display: 'block', marginBottom: 8, color: '#374151' }}>Suggested number</label>
              <input type="number" value={editForm.suggested_number ?? ''} onChange={(e) => setEditForm({ ...editForm, suggested_number: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb', marginBottom: 12 }} />
              <label style={{ display: 'block', marginBottom: 8, color: '#374151' }}>Approved</label>
              <select value={String(editForm.approved)} onChange={(e) => setEditForm({ ...editForm, approved: e.target.value === 'true' })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb', marginBottom: 12 }}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <label style={{ display: 'block', marginBottom: 8, color: '#374151' }}>Reason</label>
              <input type="text" value={editForm.reason} onChange={(e) => setEditForm({ ...editForm, reason: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb', marginBottom: 12 }} />
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => setEditModalOpen(false)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', background: 'white' }}>Cancel</button>
                <button onClick={handleEditSave} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#0f172a', color: 'white' }}>Save</button>
              </div>
            </div>
          </div>
        )}
        {/* Reject modal removed */}
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Occupancy</p>
          <span style={{ fontSize: '24px', fontWeight: '800', color: occupancyRate > 90 ? '#ef4444' : '#0f172a' }}>{loadingStats ? '...' : `${occupancyRate}%`}</span>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        <div style={{ gridColumn: 'span 8' }}>
          
          {/* AI NOTIFICATION (WARD + SURGE BREAKDOWN) */}
          <div style={{ ...styles.card, ...styles.notificationCard }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BellRing size={22} color={totalIncoming > 0 ? '#ea580c' : '#10b981'} />
              {totalIncoming > 0 ? "Admission Plan: Active Transfers" : "Status: No Pending Admissions"}
            </h2>

            {loadingAI ? (
              <div style={{ padding: '40px', textAlign: 'center' }}><Loader className="animate-spin" size={32} /></div>
            ) : totalIncoming > 0 ? (
              <div style={{ marginTop: '24px', display: 'flex', gap: '24px', background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #fed7aa' }}>
                <div style={{ textAlign: 'center', paddingRight: '24px', borderRight: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#9a3412', textTransform: 'uppercase' }}>Total Inbound</p>
                  <p style={{ fontSize: '48px', fontWeight: '800', color: '#ea580c' }}>{totalIncoming}</p>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                      <p style={{ fontSize: '11px', fontWeight: '700', color: '#16a34a' }}>SURGICAL BEDS</p>
                      <p style={{ fontSize: '24px', fontWeight: '800', color: '#166534' }}>{incomingWardCount}</p>
                    </div>
                    <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '12px', border: '1px solid #fef3c7' }}>
                      <p style={{ fontSize: '11px', fontWeight: '700', color: '#d97706' }}>SURGE AREA</p>
                      <p style={{ fontSize: '24px', fontWeight: '800', color: '#9a3412' }}>{incomingSurgeCount}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
                    The optimization plan allocates <strong>{incomingWardCount} standard beds</strong> and <strong>{incomingSurgeCount} surge area beds</strong> in Female Ward for incoming patients.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
                      {(() => {
                        const suggestedNum = approvalState?.suggested_number ?? null;
                        const isRejected = (suggestedNum === 0) || (approvalState && approvalState.status === 'rejected');
                        if (approvalState && approvalState.status === 'accepted') {
                          return (
                            <>
                              <button disabled style={{ ...styles.actionBtn, background: '#065f46', color: 'white', flex: 1 }}>
                                {`Accepted (${approvalState.suggested_number ?? totalIncoming})`}
                              </button>
                              <button onClick={handleEdit} style={{ ...styles.actionBtn, background: 'white', border: '1px solid #cbd5e1', color: '#0f172a' }}>Edit</button>
                            </>
                          );
                        }
                        if (isRejected) {
                          return (
                            <>
                              <button disabled style={{ ...styles.actionBtn, background: '#7f1d1d', color: 'white', flex: 1 }}>
                                {`Rejected (${suggestedNum ?? 0})`}
                              </button>
                              <button onClick={handleEdit} style={{ ...styles.actionBtn, background: 'white', border: '1px solid #cbd5e1', color: '#0f172a' }}>Edit</button>
                            </>
                          );
                        }
                        return (
                          <>
                            <button onClick={handleAccept} disabled={isCritical} style={{ ...styles.actionBtn, background: isCritical ? '#94a3b8' : '#0f172a', color: 'white', flex: 1 }}>
                              {isCritical ? 'Limit Reached' : 'Accept All Arrivals'} <ArrowRight size={18} />
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px', color: '#15803d' }}>
                <CheckCircle2 size={32} style={{ margin: '0 auto 12px' }} />
                <p>Female Ward is currently optimized. No transfers required.</p>
              </div>
            )}
          </div>
          {actionMsg && (
            <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: actionMsg.ok ? '#ecfdf5' : '#fff1f2', color: actionMsg.ok ? '#065f46' : '#9f1239' }}>{actionMsg.text}</div>
          )}

          {/* STATS OVERVIEW */}
          <div style={styles.card}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Ward Capacity Status</h3>
            <div style={styles.statGrid}>
              <div style={styles.statBox}>
                <span style={styles.statLabel}>Standard Capacity</span>
                <p style={styles.statValue}>{wardData.capacity}</p>
              </div>
              <div style={styles.statBox}>
                <span style={{ ...styles.statLabel, color: '#10b981' }}>Standard Available</span>
                <p style={{ ...styles.statValue, color: '#10b981' }}>{wardData.available}</p>
              </div>
              <div style={{ ...styles.statBox, background: surgeCount > 0 ? '#fffbeb' : '#f8fafc', border: surgeCount > 0 ? '1px solid #f59e0b' : '1px solid #e2e8f0' }}>
                <span style={{ ...styles.statLabel, color: '#d97706' }}>Active Surge</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ ...styles.statValue, color: '#d97706' }}>{surgeCount}</p>
                  <Tent size={24} color={surgeCount > 0 ? '#f59e0b' : '#94a3b8'} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ gridColumn: 'span 4' }}>
          <div style={styles.card}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '20px' }}>Risk Factors</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#eff6ff', padding: '20px', borderRadius: '16px', border: '1px solid #dbeafe' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <CloudRain size={20} color="#3b82f6" />
                  <span style={{ fontWeight: '800', color: '#1e40af' }}>{alerts.weather.condition}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#334155' }}>{alerts.weather.impact}</p>
              </div>
              <div style={{ background: '#fef2f2', padding: '20px', borderRadius: '16px', border: '1px solid #fee2e2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <AlertTriangle size={20} color="#ef4444" />
                  <span style={{ fontWeight: '800', color: '#991b1b' }}>{alerts.outbreak.disease}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#7f1d1d' }}>{alerts.outbreak.note}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ward_B_NurseDashboard;