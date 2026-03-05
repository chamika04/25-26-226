import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  ChevronRight,
  X,
  Loader,
  Tent,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  Save,
  Info,
  AlertTriangle,
} from "lucide-react";

const Ward_A_NurseDailyInput = () => {
  const [selectedWard, setSelectedWard] = useState(null);
  const [showSurgeModal, setShowSurgeModal] = useState(false);

  // --- LATEST SURGE STATUS ---
  const [latestSurge, setLatestSurge] = useState({
    count: 0,
    lastUpdated: null,
    loading: true,
    error: null,
  });

  // Ward ID should match backend convention (use dash-separated form)
  const wardInfo = {
    id: "WARD-A",
    name: "Ward A (Male)",
    icon: Stethoscope,
    color: "#2563eb",
  };

  // --- Helper: safe JSON fetch ---
  const safeFetchJson = async (url, options) => {
    const res = await fetch(url, options);

    // try json first
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(json?.error || `Server error (${res.status})`);
      }
      return json;
    }

    // fallback to text
    const text = await res.text().catch(() => "");
    if (!res.ok) throw new Error(text || `Server error (${res.status})`);

    // attempt JSON parse if backend returns JSON as text
    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  };

  // --- 1) FETCH LATEST SURGE STATUS ---
  const fetchSurgeStatus = async () => {
    setLatestSurge((p) => ({ ...p, loading: true, error: null }));
    try {
      // ✅ Support both possible query styles
      // Some backends expect ward=WARD_A, others expect Ward_ID=WARD_A
      const url1 = `http://localhost:5001/api/get-history?type=SurgeUpdate&ward=${encodeURIComponent(
        wardInfo.id
      )}`;
      let data = null;

      try {
        data = await safeFetchJson(url1);
      } catch {
        const url2 = `http://localhost:5001/api/get-history?type=SurgeUpdate&Ward_ID=${encodeURIComponent(
          wardInfo.id
        )}`;
        data = await safeFetchJson(url2);
      }

      setLatestSurge({
        count: Number(data?.count ?? 0) || 0,
        lastUpdated: data?.lastUpdated ?? null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Failed to load surge status:", error);
      setLatestSurge({
        count: 0,
        lastUpdated: null,
        loading: false,
        error: error?.message || "Failed to load surge status",
      });
    }
  };

  useEffect(() => {
    fetchSurgeStatus();
    // optional refresh every 60s
    const id = setInterval(fetchSurgeStatus, 60000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- SAVE SURGE DATA ---
  const saveSurgeData = async ({ date, count }) => {
    const payload = {
      Date: date,
      Ward_ID: wardInfo.id,
      Ward_Name: wardInfo.name,
      Surge_Capacity_Available: Number(count) || 0,
      EventType: "SurgeUpdate",
    };

    const response = await safeFetchJson("http://localhost:5001/api/add-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // refresh from backend to guarantee correctness
    await fetchSurgeStatus();

    // optional toast
    if ((Number(count) || 0) > 0) {
      alert("✅ Surge Beds Updated Successfully!");
    } else {
      alert("✅ Surge Disabled (0 beds).");
    }

    return response;
  };

  return (
    <div
      style={{
        padding: 40,
        fontFamily: "Inter, sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: 40 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#0f172a",
            margin: 0,
          }}
        >
          Daily Census & Surge Entry
        </h1>
        <p style={{ color: "#64748b", marginTop: 8 }}>
          Input daily shift data and manage surge capacity.
        </p>
      </div>

      {/* CARDS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: 24,
        }}
      >
        {/* CARD 1: STANDARD CENSUS */}
        <div
          onClick={() => setSelectedWard(wardInfo)}
          style={{
            background: "white",
            borderRadius: 20,
            padding: 24,
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
            cursor: "pointer",
            transition: "transform 0.2s",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: wardInfo.color,
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 20,
            }}
          >
            <div style={{ background: `${wardInfo.color}15`, padding: 12, borderRadius: 12 }}>
              <Stethoscope size={28} color={wardInfo.color} />
            </div>
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
            {wardInfo.name}
          </h3>
          <p style={{ fontSize: 13, color: "#64748b" }}>Daily Admissions & Discharges</p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 24,
              fontSize: 12,
              fontWeight: 600,
              color: "#94a3b8",
            }}
          >
            <span>Census Entry</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, color: wardInfo.color }}>
              Open Form <ChevronRight size={14} />
            </span>
          </div>
        </div>

        {/* CARD 2: SURGE CAPACITY */}
        <div
          onClick={() => setShowSurgeModal(true)}
          style={{
            background: "white",
            borderRadius: 20,
            padding: 24,
            border: latestSurge.count > 0 ? "1px solid #f59e0b" : "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#f59e0b" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{ background: "#fffbeb", padding: 12, borderRadius: 12 }}>
              <Tent size={28} color="#f59e0b" />
            </div>

            <div style={{ textAlign: "right" }}>
              {latestSurge.loading ? (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 99,
                    background: "#f1f5f9",
                    color: "#64748b",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Loader className="animate-spin" size={12} /> Loading...
                </span>
              ) : latestSurge.error ? (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 99,
                    background: "#fef2f2",
                    color: "#dc2626",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <AlertTriangle size={12} /> Offline
                </span>
              ) : (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 99,
                    background: latestSurge.count > 0 ? "#fef3c7" : "#f1f5f9",
                    color: latestSurge.count > 0 ? "#d97706" : "#64748b",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {latestSurge.count > 0 ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                  {latestSurge.count > 0 ? `${latestSurge.count} Beds Active` : "Disabled"}
                </span>
              )}

              {latestSurge.lastUpdated && (
                <p style={{ margin: "4px 0 0", fontSize: 11, color: "#94a3b8" }}>
                  Updated: {latestSurge.lastUpdated}
                </p>
              )}
            </div>
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>Surge Capacity</h3>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Can you arrange extra surge beds?</p>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>
            <span>Update Status</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#f59e0b" }}>
              Open Form <ChevronRight size={14} />
            </span>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {selectedWard && <DailyInputModal ward={selectedWard} onClose={() => setSelectedWard(null)} />}

      {showSurgeModal && (
        <SurgeCapacityModal
          ward={wardInfo}
          currentCount={latestSurge.count}
          onSave={saveSurgeData}
          onClose={() => setShowSurgeModal(false)}
        />
      )}
    </div>
  );
};

// ==================================================
// SurgeCapacityModal
// ==================================================
const SurgeCapacityModal = ({ ward, currentCount, onSave, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [surgeCount, setSurgeCount] = useState(currentCount || 0);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const countValue = parseInt(surgeCount, 10) || 0;

    if (countValue === 0) {
      setShowConfirm(true);
      return;
    }
    await executeSave(countValue);
  };

  const executeSave = async (count) => {
    setLoading(true);
    try {
      await onSave({ date, count });
      setShowConfirm(false);
      onClose();
    } catch (err) {
      alert(`❌ Error saving surge: ${err?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 60,
      }}
    >
      <div
        style={{
          background: "white",
          width: "90%",
          maxWidth: 450,
          borderRadius: 24,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid #e2e8f0",
            background: "#fffbeb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#b45309", margin: 0 }}>Surge Beds</h2>
            <p style={{ margin: "4px 0 0", color: "#d97706", fontSize: 13 }}>{ward.name}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "white",
              border: "1px solid #fcd34d",
              borderRadius: 12,
              padding: 8,
              cursor: "pointer",
              color: "#b45309",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 32 }}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
              Date of Arrangement
            </label>
            <div style={{ position: "relative" }}>
              <Calendar size={16} style={{ position: "absolute", top: 12, left: 12, color: "#94a3b8" }} />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 10px 10px 40px",
                  borderRadius: 8,
                  border: "1px solid #cbd5e1",
                  outline: "none",
                  color: "#1e293b",
                  fontWeight: 500,
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
              How many extra beds can be arranged?
            </label>
            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>Set to 0 to disable surge capacity.</p>

            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#f8fafc", padding: 12, borderRadius: 12, border: "1px solid #e2e8f0" }}>
              <Tent size={24} color="#f59e0b" />
              <input
                type="number"
                min="0"
                value={surgeCount}
                onChange={(e) => setSurgeCount(e.target.value)}
                placeholder="0"
                style={{
                  flex: 1,
                  fontSize: 18,
                  fontWeight: 600,
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  color: "#0f172a",
                }}
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 12,
              border: "none",
              background: "#f59e0b",
              color: "white",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
            }}
          >
            {loading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
            {loading ? "Saving..." : "Update Capacity"}
          </button>
        </form>

        {showConfirm && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(2px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
            }}
          >
            <div
              style={{
                background: "white",
                padding: 24,
                borderRadius: 20,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                textAlign: "center",
                width: "85%",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  background: "#fee2e2",
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <AlertCircle size={24} color="#ef4444" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>
                Disable Surge?
              </h3>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24, lineHeight: 1.5 }}>
                Are you sure you don't have space for any surge beds? This will set capacity to 0.
              </p>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => setShowConfirm(false)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 10,
                    border: "1px solid #cbd5e1",
                    background: "white",
                    color: "#475569",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => executeSave(0)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 10,
                    border: "none",
                    background: "#ef4444",
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Yes, Disable It
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================================================
// DailyInputModal (kept same but fixed Ward_ID match)
// ==================================================
const DailyInputModal = ({ ward, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [fetchingCapacity, setFetchingCapacity] = useState(true);
  const [wardCapacity, setWardCapacity] = useState(0);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [shift, setShift] = useState("Morning (A)");

  const [data, setData] = useState({
    admissions: 0,
    discharges: 0,
    transfersOut: 0,
    deaths: 0,
    occupied: 0,
  });

  useEffect(() => {
    const getCapacity = async () => {
      try {
        setFetchingCapacity(true);
        const res = await fetch("http://localhost:5001/api/get-beds");
        if (!res.ok) throw new Error(`Beds API failed (${res.status})`);
        const allBeds = await res.json();

        const functionalBeds = allBeds.filter(
          (b) => String(b.ward_id) === String(ward.id) && String(b.status) === "Functional"
        );

        setWardCapacity(functionalBeds.length);
      } catch (e) {
        console.error("Capacity fetch error:", e);
        setWardCapacity(0);
      } finally {
        setFetchingCapacity(false);
      }
    };

    getCapacity();
  }, [ward.id]);

  const updateField = (field, value) => {
    const numValue = Math.max(0, Number(value) || 0);
    setData((prev) => ({ ...prev, [field]: numValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" });

      const payload = {
        Date: date,
        Shift_ID: shift,
        Ward_ID: ward.id,
        Ward_Name: ward.name,

        Admissions: data.admissions,
        Discharges: data.discharges,
        OccupiedBeds: data.occupied,
        BedCapacity: wardCapacity,

        transfersOut: data.transfersOut,
        deaths: data.deaths,

        Weather: "Sunny",
        SpecialEvent: "None",
        IsHoliday: "No",
        DayOfWeek: dayName,
        PublicTransportStatus: "Normal",
        OutbreakAlert: "No",
      };

      const res = await fetch("http://localhost:5001/api/add-record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = `Server error (${res.status})`;
        try {
          const j = await res.json();
          msg = j?.error || msg;
        } catch {}
        throw new Error(msg);
      }

      alert(`✅ ${ward.name} Data Saved Successfully!`);
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
      alert(`❌ ${error?.message || "Connection Failed. Check backend."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: "white",
          width: "90%",
          maxWidth: 600,
          borderRadius: 24,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "24px 32px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#f8fafc",
          }}
        >
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0 }}>
              {ward.name}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>Daily Data Entry</p>
              {!fetchingCapacity && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#0f172a",
                    background: "#e2e8f0",
                    padding: "2px 8px",
                    borderRadius: 99,
                  }}
                >
                  Capacity: {wardCapacity} Beds
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: 8,
              cursor: "pointer",
              color: "#64748b",
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 32 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <Calendar size={14} /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #cbd5e1", outline: "none", color: "#1e293b" }}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <Clock size={14} /> Shift
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #cbd5e1", outline: "none", background: "white", color: "#1e293b" }}
              >
                <option value="Morning (A)">Morning Shift</option>
                <option value="Evening (B)">Evening Shift</option>
                <option value="Night (C)">Night Shift</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <InputCard label="New Arrivals" value={data.admissions} onChange={(v) => updateField("admissions", v)} />
            <InputCard label="Discharges" value={data.discharges} onChange={(v) => updateField("discharges", v)} />
            <InputCard label="Transfers Out" value={data.transfersOut} onChange={(v) => updateField("transfersOut", v)} />
            <InputCard label="Deaths" value={data.deaths} onChange={(v) => updateField("deaths", v)} isDanger />

            <div style={{ gridColumn: "span 2" }}>
              <div style={{ background: "#ecfdf5", padding: 12, borderRadius: 12, border: "1px solid #d1fae5" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#059669", textTransform: "uppercase" }}>
                    Current Occupied Beds
                  </label>

                  {data.occupied > wardCapacity && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", display: "flex", alignItems: "center", gap: 4 }}>
                      <Info size={12} /> Over Capacity!
                    </span>
                  )}
                </div>

                <input
                  type="number"
                  min="0"
                  value={data.occupied}
                  onChange={(e) => updateField("occupied", e.target.value)}
                  style={{ width: "100%", fontSize: 20, fontWeight: 700, color: "#047857", background: "transparent", border: "none", outline: "none" }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1px solid #cbd5e1", background: "white", color: "#475569", fontWeight: 600, cursor: "pointer" }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || fetchingCapacity}
              style={{
                flex: 2,
                padding: "12px",
                borderRadius: 12,
                border: "none",
                background: "#0f172a",
                color: "white",
                fontWeight: 600,
                cursor: loading || fetchingCapacity ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
              {loading ? "Saving..." : "Submit Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputCard = ({ label, value, onChange, isDanger }) => (
  <div style={{ background: isDanger ? "#fef2f2" : "#f8fafc", padding: 12, borderRadius: 12, border: isDanger ? "1px solid #fee2e2" : "1px solid #e2e8f0" }}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: isDanger ? "#ef4444" : "#64748b", textTransform: "uppercase", marginBottom: 4 }}>
      {label}
    </label>
    <input
      type="number"
      min="0"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "100%", fontSize: 20, fontWeight: 700, color: "#0f172a", background: "transparent", border: "none", outline: "none" }}
    />
  </div>
);

export default Ward_A_NurseDailyInput;