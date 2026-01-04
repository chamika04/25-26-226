import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { AlertTriangle, Activity, Pill, BedDouble } from "lucide-react";
import styles from "./ETU_HeadGraphs.module.css";

// ----- Sample Data (Replace later with API data) -----
const accidentSurgeData = [
  { time: "08:00", Cases: 6, Threshold: 10 },
  { time: "10:00", Cases: 9, Threshold: 10 },
  { time: "12:00", Cases: 14, Threshold: 10 }, // surge
  { time: "14:00", Cases: 11, Threshold: 10 },
  { time: "16:00", Cases: 8, Threshold: 10 },
  { time: "18:00", Cases: 13, Threshold: 10 }, // surge
  { time: "20:00", Cases: 7, Threshold: 10 },
];

const medicineDemandData = [
  { day: "Mon", Demand: 120, Stock: 180, Reorder: 100 },
  { day: "Tue", Demand: 150, Stock: 165, Reorder: 100 },
  { day: "Wed", Demand: 190, Stock: 140, Reorder: 100 },
  { day: "Thu", Demand: 210, Stock: 120, Reorder: 100 },
  { day: "Fri", Demand: 240, Stock: 95, Reorder: 100 }, // below reorder
  { day: "Sat", Demand: 170, Stock: 90, Reorder: 100 },
  { day: "Sun", Demand: 140, Stock: 85, Reorder: 100 },
];

const bedOccupancyData = [
  { day: "Mon", Occupied: 268, Capacity: 320 },
  { day: "Tue", Occupied: 275, Capacity: 320 },
  { day: "Wed", Occupied: 289, Capacity: 320 },
  { day: "Thu", Occupied: 300, Capacity: 320 },
  { day: "Fri", Occupied: 309, Capacity: 320 },
  { day: "Sat", Occupied: 315, Capacity: 320 }, // near full
  { day: "Sun", Occupied: 306, Capacity: 320 },
];

const GRAPH_OPTIONS = [
  { value: "accident", label: "Accident Surge Detection", icon: <Activity size={18} /> },
  { value: "medicine", label: "Medicine Forecast Demand", icon: <Pill size={18} /> },
  { value: "beds", label: "Bed Occupancy Trend", icon: <BedDouble size={18} /> },
];

const ETU_HeadGraphs = () => {
  const [selectedGraph, setSelectedGraph] = useState("beds");

  const current = useMemo(() => {
    if (selectedGraph === "accident") {
      const maxCases = Math.max(...accidentSurgeData.map((d) => d.Cases));
      const isSurge = maxCases > 10;
      return {
        title: "Accident Surge Detection",
        subtitle: "Hourly accident admissions & surge threshold",
        icon: <Activity size={20} />,
        data: accidentSurgeData,
        insight: isSurge
          ? "Surge risk detected today. Keep emergency beds & staff ready."
          : "No significant surge detected. Monitor traffic/weather updates.",
        chart: (
          <LineChart data={accidentSurgeData} margin={{ top: 10, right: 24, left: 12, bottom: 6 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbeafe" />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#0f172a", fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#0f172a", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                boxShadow: "0 12px 30px rgba(2,6,23,0.10)",
              }}
            />
            <Legend verticalAlign="top" align="right" />
            <ReferenceLine y={10} stroke="#f97316" strokeDasharray="6 6" label={{ value: "Surge Threshold", fill: "#9a3412", fontSize: 12 }} />
            <Line type="monotone" dataKey="Cases" stroke="#ef4444" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 7 }} name="Accident Cases" />
          </LineChart>
        ),
      };
    }

    if (selectedGraph === "medicine") {
      const lowStockPoint = medicineDemandData.find((d) => d.Stock < d.Reorder);
      return {
        title: "Medicine Forecast Demand",
        subtitle: "Demand vs projected stock and reorder level",
        icon: <Pill size={20} />,
        data: medicineDemandData,
        insight: lowStockPoint
          ? `Stock drops below reorder level around ${lowStockPoint.day}. Prepare procurement early.`
          : "Stock stays above reorder level for the selected period.",
        chart: (
          <LineChart data={medicineDemandData} margin={{ top: 10, right: 24, left: 12, bottom: 6 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbeafe" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#0f172a", fontSize: 12 }} dy={10} interval={0} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#0f172a", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                boxShadow: "0 12px 30px rgba(2,6,23,0.10)",
              }}
            />
            <Legend verticalAlign="top" align="right" />
            <Line type="monotone" dataKey="Demand" stroke="#2563eb" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 7 }} name="Forecast Demand" />
            <Line type="monotone" dataKey="Stock" stroke="#16a34a" strokeWidth={3} dot={false} name="Projected Stock" />
            <Line type="monotone" dataKey="Reorder" stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 6" dot={false} name="Reorder Level" />
          </LineChart>
        ),
      };
    }

    // beds (default)
    const maxOcc = Math.max(...bedOccupancyData.map((d) => d.Occupied));
    const nearFull = maxOcc >= 310;
    return {
      title: "Bed Occupancy Trend",
      subtitle: "Occupied beds vs safe capacity",
      icon: <BedDouble size={20} />,
      data: bedOccupancyData,
      insight: nearFull
        ? "Occupancy is near full capacity. Consider early discharges & overflow allocation."
        : "Occupancy is within manageable range. Continue standard operations.",
      chart: (
        <LineChart data={bedOccupancyData} margin={{ top: 10, right: 24, left: 12, bottom: 6 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbeafe" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#0f172a", fontSize: 12 }} dy={10} interval={0} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#0f172a", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              boxShadow: "0 12px 30px rgba(2,6,23,0.10)",
            }}
          />
          <Legend verticalAlign="top" align="right" />
          <ReferenceLine y={320} stroke="#0ea5e9" strokeDasharray="6 6" label={{ value: "Capacity", fill: "#075985", fontSize: 12 }} />
          <Line type="monotone" dataKey="Occupied" stroke="#7c3aed" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 7 }} name="Occupied Beds" />
          <Line type="monotone" dataKey="Capacity" stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 6" dot={false} name="Safe Capacity" />
        </LineChart>
      ),
    };
  }, [selectedGraph]);

  return (
    <div className={styles.page}>
      {/* Header strip */}
      <div className={styles.topBanner}>
        <div className={styles.bannerLeft}>
          <div className={styles.badge}>
            {current.icon}
            <span>ETU Head • Analytics</span>
          </div>
          <h1 className={styles.pageTitle}>ETU Graphs & Trends</h1>
          <p className={styles.pageSubtitle}>
            Monitor bed capacity, accident surge risk, and medicine demand in one place.
          </p>
        </div>

        <div className={styles.bannerRight}>
          <label className={styles.label} htmlFor="graph-select">Select Graph</label>
          <select
            id="graph-select"
            className={styles.select}
            value={selectedGraph}
            onChange={(e) => setSelectedGraph(e.target.value)}
          >
            {GRAPH_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>{current.title}</h2>
            <p className={styles.cardSubtitle}>{current.subtitle}</p>
          </div>

          <div className={styles.chip}>
            <span className={styles.chipDot}></span>
            Live Preview (Sample Data)
          </div>
        </div>

        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height="100%">
            {current.chart}
          </ResponsiveContainer>
        </div>

        <div className={styles.insightBox}>
          <AlertTriangle size={18} className={styles.alertIcon} />
          <p>
            <strong>Recommendation:</strong> {current.insight}
          </p>
        </div>
      </div>

      {/* Quick switch tiles */}
      <div className={styles.tiles}>
        {GRAPH_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSelectedGraph(opt.value)}
            className={`${styles.tile} ${selectedGraph === opt.value ? styles.tileActive : ""}`}
          >
            <span className={styles.tileIcon}>{opt.icon}</span>
            <span className={styles.tileText}>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ETU_HeadGraphs;
