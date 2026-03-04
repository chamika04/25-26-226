import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Users, 
  FileText, 
  AlertCircle,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const defaultDate = new Date().toISOString().slice(0, 10);

function formatDate(d) {
  if (!d) return "-";
  try {
    const dt = new Date(d);
    return dt.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
  } catch (e) {
    return String(d);
  }
}

function formatPlanLabel(dateStr, shiftStr) {
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
}

export default function ETU_NurseApprovals() {
  const navigate = useNavigate();
  const [targetDate, setTargetDate] = useState(defaultDate);
  const [targetShift, setTargetShift] = useState("Morning (A)");
  const [summary, setSummary] = useState(null);
  const [transferLogs, setTransferLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5001/api/etu/approvals?target_date=${targetDate}&target_shift=${encodeURIComponent(targetShift)}`);
      setSummary(res.data);
    } catch (err) {
      console.error("fetchSummary error", err?.message || err);
      setError("Failed to load approvals");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransferLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5001/api/transfer-count?target_date=${targetDate}&target_shift=${encodeURIComponent(targetShift)}`);
      setTransferLogs(res.data?.rows || []);
    } catch (err) {
      console.error("fetchTransferLogs error", err?.message || err);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchTransferLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate, targetShift]);

  // Build per-ward status from the TransferCount audit logs (single source of truth).
  // If no logs are available for the selected shift/date, fall back to the summary.per_ward
  // only as a compatibility measure.
  const perWardRows = () => {
    const wards = ["GEN", "WARD-A", "WARD-B"];

    // If we have transfer logs for this shift/date, use them to determine latest per-ward status
    if (Array.isArray(transferLogs) && transferLogs.length > 0) {
      return wards.map((w) => {
        // normalize field names (some rows may use `ward` or `ward_id`)
        const rows = transferLogs.filter((t) => ((t.ward_id || t.ward) || '').toString().toUpperCase() === w);
        if (rows.length === 0) {
          return { ward_id: w, approved: false, suggested_number: null, reason: null, nurse_id: null, updated_at: null };
        }
        // pick the most recent entry by submitted_at / updated_at
        rows.sort((a, b) => {
          const ta = new Date(a.submitted_at || a.updated_at || a.submittedAt || 0).getTime();
          const tb = new Date(b.submitted_at || b.updated_at || b.submittedAt || 0).getTime();
          return tb - ta;
        });
        const r = rows[0];
        // treat suggested_number === 0 as rejection (explicit can't accept)
        const suggestedVal = r.suggested_number;
        const suggestedNum = suggestedVal !== null && suggestedVal !== undefined ? Number(suggestedVal) : null;
        const approvedFlag = !!r.approved && suggestedNum !== 0;
        const rejectedFlag = (!approvedFlag) && (suggestedNum === 0 || r.approved === false);
        return {
          ward_id: w,
          approved: approvedFlag,
          rejected: rejectedFlag,
          suggested_number: suggestedNum,
          reason: r.reason ?? null,
          nurse_id: r.nurse_id ?? null,
          updated_at: r.submitted_at || r.updated_at || r.submittedAt || null,
        };
      });
    }

    // Fallback: use the summary.per_ward (older behavior)
    if (summary && summary.per_ward) {
      return ["GEN", "WARD-A", "WARD-B"].map((w) => {
        const v = summary.per_ward[w] || {};
        return {
          ward_id: w,
          approved: !!v.approved,
          suggested_number: v.suggested_number ?? null,
          reason: v.reason ?? null,
          nurse_id: v.nurse_id ?? null,
          updated_at: v.updated_at ?? null,
        };
      });
    }

    // Default empty rows
    return ["GEN", "WARD-A", "WARD-B"].map((w) => ({ ward_id: w, approved: false, suggested_number: null, reason: null, nurse_id: null, updated_at: null }));
  };

  // Filter to show only meaningful DB rows
  const displayedTransferLogs = (transferLogs || []).filter(t => Boolean(t && (t.ward_id || t.nurse_id || t.reason || (t.suggested_number !== null && t.suggested_number !== undefined))));
  // Show all wards (including those with no response) so ETU sees pending counts correctly
  const displayedPerWards = perWardRows();
  // For visual cards we exclude pending wards (count them above but don't render as cards)
  const displayedPerWardsForCards = displayedPerWards.filter(w => w.approved || w.rejected);

  // Calculate high-level stats
  const totalApproved = displayedPerWards.filter(w => w.approved).length;
  const totalRejected = displayedPerWards.filter(w => w.rejected).length;
  const totalPending = displayedPerWards.filter(w => !w.approved && !w.rejected).length;
  const pendingWardNames = displayedPerWards.filter(w => !w.approved && !w.rejected).map(w => w.ward_id);

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
      
      {/* --- HEADER & CONTROLS --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Ward Approvals</h1>
          <p className="text-slate-500 font-medium mt-1">Review transfer requests and track audit logs</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 rounded-lg font-bold border border-blue-100">
            <Calendar size={18} />
            <span>{formatPlanLabel(targetDate, targetShift)}</span>
          </div>
          
          <input 
            type="date" 
            value={targetDate} 
            onChange={(e) => setTargetDate(e.target.value)} 
            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
          />
          
          <select 
            value={targetShift} 
            onChange={(e) => setTargetShift(e.target.value)} 
            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option>Morning (A)</option>
            <option>Evening (B)</option>
            <option>Night (C)</option>
          </select>
          
          <button 
            onClick={() => { fetchSummary(); fetchTransferLogs(); }} 
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            <RefreshCw size={16} className={loading || logsLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 font-medium">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* --- QUICK SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-1">Approved Wards</p>
            <h3 className="text-4xl font-black text-slate-900">{totalApproved}</h3>
          </div>
          <div className="p-4 bg-emerald-50 rounded-full text-emerald-600"><CheckCircle2 size={32} /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-red-600 uppercase tracking-wider mb-1">Rejected Wards</p>
            <h3 className="text-4xl font-black text-slate-900">{totalRejected}</h3>
          </div>
          <div className="p-4 bg-red-50 rounded-full text-red-600"><XCircle size={32} /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-1">Pending Wards</p>
            <h3 className="text-4xl font-black text-slate-900">{totalPending}</h3>
            {pendingWardNames.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {pendingWardNames.map((n) => (
                  <span key={n} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-800 rounded-full text-sm font-semibold border border-amber-100">{n}</span>
                ))}
              </div>
            )}
          </div>
          <div className="p-4 bg-amber-50 rounded-full text-amber-600"><Clock size={32} /></div>
        </div>
      </div>

      {/* --- WARD APPROVAL CARDS --- */}
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        Ward Transfer Status
      </h3>
      
      {displayedPerWardsForCards.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 shadow-sm mb-8">
          <CheckCircle2 size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-lg font-semibold text-slate-700">No Approvals Needed</p>
          <p>There are no suggested ward transfers for this shift.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {displayedPerWardsForCards.map((r) => (
            <div 
              key={r.ward_id} 
              className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all ${r.approved ? 'border-emerald-100 bg-emerald-50/30' : 'border-amber-100 bg-amber-50/30'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-black text-slate-800 uppercase tracking-wide">{r.ward_id}</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-1 uppercase">Suggested Transfer</p>
                  <p className="text-4xl font-black text-slate-900 mt-1">{r.suggested_number ?? '0'}</p>
                </div>
                
                {r.approved ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-bold border border-emerald-200">
                    <CheckCircle2 size={16} /> Approved
                  </span>
                ) : r.rejected ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-800 rounded-lg text-sm font-bold border border-red-200">
                    <XCircle size={16} /> Rejected
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-bold border border-amber-200">
                    <Clock size={16} /> Pending
                  </span>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200/60 mt-4">
                <p className="text-sm text-slate-600 italic mb-3">"{r.reason ?? 'No remarks provided'}"</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase">Nurse ID</p>
                    <p className="text-sm font-bold text-slate-700">{r.nurse_id ?? 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-400 uppercase">Updated</p>
                    <p className="text-sm font-bold text-slate-700">{r.updated_at ? formatDate(r.updated_at) : '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- TRANSFER AUDIT LOGS TABLE --- */}
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <FileText className="text-slate-400" /> Transfer Audit Logs
      </h3>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {logsLoading ? (
          <div className="p-8 text-center text-slate-500 font-medium animate-pulse">Loading logs...</div>
        ) : displayedTransferLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="text-lg font-semibold text-slate-700">No Logs Found</p>
            <p>No transfer activity recorded for this shift.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ward</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patients</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nurse ID</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedTransferLogs.map((t, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 uppercase">{t.ward_id}</td>
                    <td className="p-4">
                      {(t.suggested_number === 0 || t.approved === false) ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded font-bold text-xs">
                          <XCircle size={14} /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded font-bold text-xs">
                          <CheckCircle2 size={14} /> Approved
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{t.suggested_number ?? '—'}</td>
                    <td className="p-4 text-sm font-medium text-slate-600">{t.nurse_id ?? '—'}</td>
                    <td className="p-4 text-sm text-slate-500">{formatDate(t.submitted_at)}</td>
                    <td className="p-4 text-sm text-slate-600 max-w-xs truncate" title={t.reason}>
                      {t.reason ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}