import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  BedDouble,
  Clock,
  Activity,
  AlertTriangle,
  CloudRain,
  Sun,
  ArrowRight,
  Loader,
} from "lucide-react";

const ETU_HeadDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastTs, setLastTs] = useState(null);

  // --- SAFE FETCH REAL DATA FROM PYTHON BACKEND ---
  useEffect(() => {
    const load = async (force = false) => {
      try {
        setLoading(true);
        const url = `http://localhost:5001/predict${force ? '?force=1' : ''}`;
        const res = await fetch(url);

        // handle HTTP errors safely
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Server error (${res.status})`);
        }

        // handle non-JSON responses safely
        const text = await res.text();
        let jsonData = null;
        try {
          jsonData = JSON.parse(text);
        } catch (e) {
          throw new Error("Backend returned non-JSON response");
        }

        // Only update if response_ts changed
        if (jsonData && jsonData.response_ts) {
          if (jsonData.response_ts === lastTs) {
            setLoading(false);
            return;
          }
          setLastTs(jsonData.response_ts);
        }
        console.log("Dashboard Data Received:", jsonData);
        setData(jsonData);
      } catch (err) {
        console.error("Error connecting to AI:", err);
        setData({ error: err.message || "Cannot connect to backend" });
      } finally {
        setLoading(false);
      }
    };

    load();

    // OPTIONAL: refresh every 60 seconds
    const id = setInterval(() => load(false), 60000);
    return () => clearInterval(id);
  }, []);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <Loader className="animate-spin" size={40} color="#2563eb" />
        <p style={{ color: "#64748b", fontWeight: 500 }}>
          Loading Live Operations...
        </p>
      </div>
    );

  if (!data || data.error)
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          color: "#ef4444",
          background: "#fef2f2",
          borderRadius: 12,
          margin: 20,
        }}
      >
        <AlertTriangle
          size={48}
          style={{ margin: "0 auto 16px", display: "block" }}
        />
        <h2>⚠️ Dashboard Cannot Connect</h2>
        <p>{data?.error || "Please check if backend is running on port 5001."}</p>
      </div>
    );

  // -----------------------------
  // Support BOTH response formats:
  // Old: predicted_arrivals only
  // New: predicted_arrivals_male/female + (optional) predicted_arrivals total
  // -----------------------------
  const current_occupancy = data.current_occupancy ?? 0;
  const total_capacity = data.total_capacity ?? 0;
  const occupancy_percentage = data.occupancy_percentage ?? 0;

  const predicted_total =
    data.predicted_arrivals ??
    ((data.predicted_arrivals_male ?? 0) + (data.predicted_arrivals_female ?? 0));

  const predicted_male = data.predicted_arrivals_male ?? null;
  const predicted_female = data.predicted_arrivals_female ?? null;

  const system_status = data.system_status ?? "UNKNOWN";
  const primary_driver = data.primary_driver ?? "Standard Load";
  const forecast_table_rows = data.forecast_table_rows ?? [];

  // Extract Prediction Target (Date & Shift)
  const predictionTarget =
    forecast_table_rows && forecast_table_rows.length > 0
      ? forecast_table_rows[0].period
      : "Next Shift";

  // Determine Colors based on status
  const isCritical = system_status === "CRITICAL" || occupancy_percentage > 85;
  const occupancyColor = isCritical
    ? "#ef4444"
    : occupancy_percentage > 60
    ? "#f59e0b"
    : "#10b981";

  // Dynamic Icon for Driver (Rain vs Sun)
  const DriverIcon = primary_driver.includes("Rain") ? CloudRain : Sun;

  // Banner Styles
  const bannerBase = {
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 20,
    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
    transition: "all 0.3s ease",
  };

  const bannerStyle = isCritical
    ? {
        ...bannerBase,
        background: "linear-gradient(135deg, #fff1f2 0%, #fee2e2 100%)",
        border: "1px solid #fecaca",
      }
    : {
        ...bannerBase,
        background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
        border: "1px solid #bfdbfe",
      };

  return (
    <div
      style={{
        padding: 28,
        maxWidth: 1200,
        margin: "0 auto",
        color: "#0f172a",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* --- HEADER --- */}
      <div
        style={{
          marginBottom: 32,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              margin: 0,
              color: "#1e293b",
            }}
          >
            ETU Operations Dashboard
          </h1>
          <p style={{ color: "#64748b", marginTop: 6, fontWeight: 500 }}>
            Emergency Treatment Unit • Real-time Status
          </p>
        </div>

        {/* System Status Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            fontWeight: 700,
            color: occupancyColor,
            background: "#fff",
            padding: "8px 16px",
            borderRadius: 99,
            border: `1px solid ${occupancyColor}33`,
            boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: occupancyColor,
              boxShadow: `0 0 0 3px ${occupancyColor}33`,
            }}
          ></div>
          SYSTEM STATUS: {system_status}
        </div>
      </div>

      {/* --- AI PREDICTION ALERT BANNER --- */}
      <div style={bannerStyle}>
        {/* Left */}
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <div
            style={{
              background: "#fff",
              width: 64,
              height: 64,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: isCritical
                ? "0 8px 16px -4px rgba(239,68,68,0.15)"
                : "0 8px 16px -4px rgba(59, 130, 246, 0.15)",
            }}
          >
            <DriverIcon size={32} color={isCritical ? occupancyColor : "#2563eb"} />
          </div>

          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: isCritical ? "#991b1b" : "#1e40af",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              AI Forecast • {data.timeframe_label || "Next Shift"}
            </div>

            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: isCritical ? "#7f1d1d" : "#1e3a8a",
                lineHeight: 1.2,
              }}
            >
              Expect {predicted_total} Patients
            </div>

            {/* Male/Female split if available */}
            {(predicted_male !== null || predicted_female !== null) && (
              <div
                style={{
                  marginTop: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  color: isCritical ? "#b91c1c" : "#2563eb",
                }}
              >
                Male: {predicted_male ?? "—"} &nbsp;|&nbsp; Female:{" "}
                {predicted_female ?? "—"}
              </div>
            )}

            <div
              style={{
                fontSize: 14,
                color: isCritical ? "#b91c1c" : "#3b82f6",
                marginTop: 6,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Clock size={14} /> Predicting for: <strong>{predictionTarget}</strong>
            </div>
          </div>
        </div>

        {/* Right */}
        <div>
          <Link to="/ETU_Head/dashboard/optimization" style={{ textDecoration: "none" }}>
            <button
              style={{
                background: isCritical ? "#dc2626" : "#2563eb",
                color: "#fff",
                border: "none",
                padding: "14px 28px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: isCritical
                  ? "0 4px 12px rgba(220, 38, 38, 0.3)"
                  : "0 4px 12px rgba(37, 99, 235, 0.3)",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              View Optimization Plan <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </Link>
        </div>
      </div>

      {/* --- KPI CARDS --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 24,
          marginBottom: 32,
        }}
      >
        <StatCard
          icon={<BedDouble size={24} color="#3b82f6" />}
          title="Total Capacity"
          value={`${total_capacity} Beds`}
          sub="Based on Functional Inventory"
          bgIcon="#eff6ff"
        />

        <StatCard
          icon={<Users size={24} color={occupancyColor} />}
          title="Current Occupancy"
          value={`${current_occupancy} / ${total_capacity} Beds Full`}
          sub={`${occupancy_percentage}% Full`}
          bgIcon={isCritical ? "#fef2f2" : "#f0fdf4"}
        />

        <StatCard
          icon={<Activity size={24} color={occupancyColor} />}
          title="Next Shift Load"
          value={`Predicted: ${predicted_total} Arrivals`}
          sub={system_status}
          bgIcon={isCritical ? "#fef2f2" : "#f0fdf4"}
        />

        {/* Optional male/female KPI cards */}
        {(predicted_male !== null || predicted_female !== null) && (
          <>
            <StatCard
              icon={<Users size={24} color="#2563eb" />}
              title="Male Arrivals"
              value={`${predicted_male ?? 0}`}
              sub="Gender split forecast"
              bgIcon="#eff6ff"
            />
            <StatCard
              icon={<Users size={24} color="#db2777" />}
              title="Female Arrivals"
              value={`${predicted_female ?? 0}`}
              sub="Gender split forecast"
              bgIcon="#fdf2f8"
            />
          </>
        )}
      </div>

      {/* --- LIVE UNIT SATURATION GAUGE --- */}
      <div
        style={{
          background: "#fff",
          padding: 32,
          borderRadius: 20,
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 24,
            alignItems: "flex-end",
          }}
        >
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#1e293b" }}>
              Live Unit Saturation
            </h2>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>
              Overall pressure on the Emergency Unit
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: occupancyColor, lineHeight: 1 }}>
              {occupancy_percentage}%
            </span>
            <span
              style={{
                fontSize: 13,
                color: "#94a3b8",
                display: "block",
                fontWeight: 600,
                marginTop: 4,
              }}
            >
              CAPACITY USED
            </span>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            height: 28,
            background: "#f1f5f9",
            borderRadius: 999,
            marginBottom: 16,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: "60%", height: "100%", width: 2, background: "rgba(255,255,255,0.7)", zIndex: 10 }} />
          <div style={{ position: "absolute", left: "85%", height: "100%", width: 2, background: "rgba(255,255,255,0.7)", zIndex: 10 }} />

          <div
            style={{
              width: `${Math.min(100, occupancy_percentage)}%`,
              height: "100%",
              background: "linear-gradient(90deg, #10b981 0%, #f59e0b 60%, #ef4444 100%)",
              borderRadius: 999,
              transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#94a3b8",
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <span>0% (Empty)</span>
          <span style={{ transform: "translateX(-15%)" }}>60% (Busy)</span>
          <span style={{ transform: "translateX(10%)" }}>85% (Critical)</span>
          <span>100% (Full)</span>
        </div>

        {isCritical && (
          <div
            style={{
              marginTop: 28,
              background: "#fef2f2",
              borderLeft: "4px solid #ef4444",
              borderRadius: 8,
              padding: 16,
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: 8,
                borderRadius: "50%",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                marginTop: 2,
              }}
            >
              <AlertTriangle size={20} color="#dc2626" />
            </div>
            <div>
              <h4 style={{ margin: 0, color: "#991b1b", fontSize: 15, fontWeight: 700 }}>
                Immediate Action Required
              </h4>
              <p style={{ margin: "4px 0 0 0", color: "#7f1d1d", fontSize: 13, lineHeight: 1.5 }}>
                Unit is critical. <strong>{predicted_total} more patients</strong> expected. Click{" "}
                <strong>"View Optimization Plan"</strong> above to execute surge protocols immediately.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* --- INVENTORY ALERTS --- */}
      <div
        style={{
          marginTop: 32,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: 20,
        }}
      >
        <AlertCard
          color="#c2410c"
          bg="#fff7ed"
          border="#fed7aa"
          title="⚠ Low stock of IV fluids may affect admissions."
          desc="Review inventory and prioritise restocking for critical consumables."
          link="/ETU_Head/dashboard/medandequip"
        />
        <AlertCard
          color="#b91c1c"
          bg="#fef2f2"
          border="#fecaca"
          title="⚠ Oxygen cylinder availability is low."
          desc="Monitor ICU and ETU demand closely. Open supply dashboard to allocate."
          link="/ETU_Head/dashboard/medandequip"
        />
      </div>
    </div>
  );
};

// --- Helper Components ---
const StatCard = ({ icon, title, value, sub, bgIcon }) => {
  return (
    <div
      style={{
        background: "#fff",
        padding: 24,
        borderRadius: 16,
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
        border: "1px solid #f1f5f9",
        display: "flex",
        alignItems: "flex-start",
        gap: 20,
        transition: "transform 0.2s",
      }}
    >
      <div
        style={{
          minWidth: 56,
          height: 56,
          borderRadius: 12,
          background: bgIcon,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            margin: 0,
            color: "#64748b",
            fontSize: 13,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {title}
        </p>
        <h3 style={{ margin: "4px 0", fontSize: 24, fontWeight: 700, color: "#0f172a" }}>
          {value}
        </h3>
        {sub && <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>{sub}</p>}
      </div>
    </div>
  );
};

const AlertCard = ({ color, bg, border, title, desc, link }) => (
  <Link to={link} style={{ textDecoration: "none" }}>
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        padding: 20,
        borderRadius: 12,
        color: color,
        boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
        transition: "transform 0.2s",
        cursor: "pointer",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, opacity: 0.9 }}>{desc}</div>
    </div>
  </Link>
);

export default ETU_HeadDashboard;