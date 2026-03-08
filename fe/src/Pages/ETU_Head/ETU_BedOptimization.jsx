import React, { useEffect, useState } from "react";
import {
  Calendar,
  Activity,
  Bed,
  AlertTriangle,
  CheckCircle,
  Truck,
  Users,
  LayoutDashboard,
  Tent,
  LogOut,
} from "lucide-react";

const ETU_BedOptimization = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastTs, setLastTs] = useState(null);
  const [etuStatus, setEtuStatus] = useState(null);

  // --- FETCH DATA ---
  const fetchOptimization = async (force = false) => {
    try {
      setLoading(true);
      const url = `http://localhost:5001/predict${force ? '?force=1' : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Server connection failed");
      const result = await response.json();
      // Only update UI when backend signals new prediction via response_ts
      if (result && result.response_ts) {
        if (result.response_ts === lastTs) {
          setLoading(false);
          return;
        }
        setLastTs(result.response_ts);
      }
      setData(result);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchEtuStatus = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/ward-status/ETU');
      if (!res.ok) throw new Error('Failed to fetch ETU status');
      const json = await res.json();
      setEtuStatus(json);
    } catch (e) {
      console.debug('ETU status fetch failed', e);
    }
  };

  useEffect(() => {
    fetchOptimization();
    fetchEtuStatus();

    // OPTIONAL: auto-refresh every 60 seconds
    const id = setInterval(() => {
      fetchOptimization(false);
      fetchEtuStatus();
    }, 60000);
    return () => clearInterval(id);
  }, []);

  // --- LOADING / ERROR STATES ---
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-slate-500">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-slate-700">
          Optimizing Bed Allocation...
        </h2>
        <p>Analyzing patient inflow and ward capacity using Ensemble AI.</p>
      </div>
    );

  if (error || !data)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-red-500 bg-red-50 m-8 rounded-2xl border border-red-100">
        <AlertTriangle size={64} className="mb-4 text-red-500 opacity-80" />
        <h2 className="text-2xl font-bold">Optimization Engine Offline</h2>
        <button
          onClick={() => fetchOptimization(true)}
          className="mt-6 px-8 py-3 bg-red-600 text-white rounded-xl font-semibold shadow-lg hover:bg-red-700 transition"
        >
          Retry Connection
        </button>
      </div>
    );

  // --- DATA PREP (NEW BACKEND FORMAT) ---
  const forecastPeriod = data.forecast_table_rows?.[0]?.period || "Upcoming Shift";

  // Backend has shipped a couple of plan shapes during development:
  // 1) { optimization_plan_gender: { male: {...}, female: {...}, solver_status } }
  // 2) { optimization_plan_flexible: { male_ward, female_ward, male_ward_surge, female_ward_surge, external, solver_status } }
  // Normalize both to a predictable `plan.male` / `plan.female` shape.
  const rawPlan = data.optimization_plan_gender || data.optimization_plan_flexible || data.optimization_plan || {};

  const normalizePlan = (raw) => {
    if (!raw) return { male: {}, female: {}, solver_status: "OK" };
    // Already in gendered shape
    if (raw.male || raw.female) {
      return {
        male: raw.male || {},
        female: raw.female || {},
        solver_status: raw.solver_status || raw.solver || "OK",
      };
    }

    // Flexible flat shape -> convert to gendered
    return {
      male: {
        male_ward: raw.male_ward || raw.male || 0,
        male_ward_surge: raw.male_ward_surge || 0,
        external: raw.external || 0,
      },
      female: {
        female_ward: raw.female_ward || raw.female || 0,
        female_ward_surge: raw.female_ward_surge || 0,
        external: 0,
      },
      solver_status: raw.solver_status || raw.solver || "OK",
    };
  };

  const plan = normalizePlan(rawPlan);
  const male = plan.male || {};
  const female = plan.female || {};
  const solverStatus = rawPlan?.solver_status || plan?.solver_status || "OK";

  const predictedTotal = data.predicted_arrivals ?? 0;
  const predictedMale = data.predicted_arrivals_male ?? 0;
  const predictedFemale = data.predicted_arrivals_female ?? 0;

  const totalTransfers = (male.male_ward || 0) + (female.female_ward || 0);

  const totalSurge = (male.male_ward_surge || 0) + (female.female_ward_surge || 0);

  const totalExternal = (male.external || 0) + (female.external || 0);

  const surgeBreakdown = {
    male_ward: male.male_ward_surge || 0,
    female_ward: female.female_ward_surge || 0,
  };

  const isCritical = data.system_status === "CRITICAL";
  const statusColor = isCritical
    ? "text-red-600 bg-red-50 border-red-200"
    : "text-emerald-600 bg-emerald-50 border-emerald-200";

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
      {/* --- TOP HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Command Center
          </h1>

          <div className="flex items-center gap-3 mt-3">
            <span className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 shadow-sm">
              <Calendar size={16} className="text-blue-500" /> {forecastPeriod}
            </span>

            <span
              className={`px-4 py-1.5 rounded-lg text-sm font-bold border uppercase tracking-wider shadow-sm flex items-center gap-2 ${statusColor}`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  isCritical ? "bg-red-500" : "bg-emerald-500"
                } animate-pulse`}
              />
              {data.system_status}
            </span>

            {/* Solver status removed to simplify header */}
          </div>
        </div>

        {/* --- RIGHT SIDE: Shows Model & Confidence --- */}
        <div className="text-right hidden md:flex gap-6 items-center">
          <div className="text-right">
            <p className="text-sm text-slate-400 font-medium uppercase tracking-wide mb-1">
              AI Engine
            </p>
            <p className="text-sm font-bold text-blue-700 bg-blue-100 border border-blue-200 px-3 py-1 rounded-lg">
              {data.model_used || "Ensemble (TFT + LSTM)"}
            </p>
          </div>
          <div className="text-right border-l border-slate-200 pl-6">
            <p className="text-sm text-slate-400 font-medium uppercase tracking-wide">
              Confidence
            </p>
            <p className="text-3xl font-black text-slate-700">
              {data.confidence_score || "—"}
            </p>
          </div>
        </div>
      </header>

      {/* --- KEY METRICS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Card 1: Incoming Load */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users size={80} />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
            Predicted Arrivals
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-blue-600">
              {predictedTotal}
            </span>
            <span className="text-lg text-slate-500 font-medium">Patients</span>
          </div>

          <div className="mt-2 text-sm text-slate-600 font-semibold">
            Male: {predictedMale} &nbsp;|&nbsp; Female: {predictedFemale}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800 font-medium flex items-center gap-2">
            <Activity size={16} />
            Driver: {data.primary_driver || "—"}
          </div>
        </div>

        

        {/* Card 2: Current Status */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
            Current Saturation
          </p>
          <div className="flex items-end justify-between mb-2">
            <span
              className={`text-5xl font-black ${
                isCritical ? "text-red-500" : "text-slate-700"
              }`}
            >
              {data.occupancy_percentage ?? 0}%
            </span>
            <span className="text-slate-400 font-medium mb-1">
              {data.current_occupancy ?? 0} / {data.total_capacity ?? 0} Beds
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isCritical ? "bg-red-500" : "bg-emerald-500"
              }`}
              style={{
                width: `${Math.min(data.occupancy_percentage ?? 0, 100)}%`,
              }}
            ></div>
          </div>
          <div className="mt-3 text-sm text-slate-600 font-semibold">
            ETU Occupied: {etuStatus?.occupied ?? data.current_occupancy ?? 0} / {etuStatus?.capacity ?? data.total_capacity ?? 0}
            <div className="mt-1">Male: {etuStatus?.male_occupied ?? data.current_etu_male ?? 0} &nbsp;|&nbsp; Female: {etuStatus?.female_occupied ?? data.current_etu_female ?? 0}</div>
          </div>
        </div>

        {/* Card 3: Summary Action */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 text-white flex flex-col justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
              Primary Strategy
            </p>
            <h3 className="text-2xl font-bold leading-snug">
              {totalTransfers > 0
                ? `Move ${totalTransfers} Patients to Gender Wards`
                : "No Transfers Needed"}
            </h3>
          </div>
          <div className="flex items-center gap-3 mt-4 text-emerald-400 font-medium bg-white/10 p-3 rounded-lg backdrop-blur-sm">
            <CheckCircle size={18} />
            {data.recommendation_text || "—"}
          </div>
        </div>
      </div>

      {/* --- DETAILED OPTIMIZATION STRATEGY --- */}
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <LayoutDashboard className="text-slate-400" /> Capacity Creation Strategy
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* STEP 1: TRANSFERS (MALE/FEMALE ONLY) */}
        <div
          className={`rounded-2xl p-6 border-2 relative ${
            totalTransfers > 0
              ? "bg-white border-blue-100 shadow-md"
              : "bg-slate-50 border-slate-200 border-dashed opacity-70"
          }`}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider inline-block mb-2">
                Step 1
              </div>
              <h4 className="text-lg font-bold text-slate-800">Transfer Out</h4>
              <p className="text-sm text-slate-500">
                Move stable patients to Gender Wards
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
              <LogOut size={24} />
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-sm font-medium text-slate-600">
                To Male Ward
              </span>
              <span className="text-lg font-bold text-slate-800">
                {male.male_ward || 0}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-sm font-medium text-slate-600">
                To Female Ward
              </span>
              <span className="text-lg font-bold text-slate-800">
                {female.female_ward || 0}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-sm font-bold text-slate-400 uppercase">
              Total Moves
            </span>
            <span className="text-3xl font-black text-blue-600">
              {totalTransfers}
            </span>
          </div>
        </div>

        {/* STEP 2: SURGE (GENDER-SAFE) */}
        <div
          className={`rounded-2xl p-6 border-2 relative ${
            totalSurge > 0
              ? "bg-orange-50 border-orange-200 shadow-md"
              : "bg-slate-50 border-slate-200 border-dashed opacity-60"
          }`}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded uppercase tracking-wider inline-block mb-2">
                Step 2
              </div>
              <h4 className="text-lg font-bold text-slate-800">
                Surge Capacity
              </h4>
              <p className="text-sm text-slate-500">
                Activate gender-restricted surge beds
              </p>
            </div>
            <div
              className={`p-3 rounded-xl ${
                totalSurge > 0
                  ? "bg-orange-200 text-orange-700"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              <Tent size={24} />
            </div>
          </div>

          {/* Surge Breakdown */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm p-2 bg-white/60 rounded border border-orange-100">
              <span className="text-slate-600">Male Ward Surge</span>
              <span className="font-bold text-orange-700">{surgeBreakdown.male_ward}</span>
            </div>

            <div className="flex justify-between text-sm p-2 bg-white/60 rounded border border-orange-100">
              <span className="text-slate-600">Female Ward Surge</span>
              <span className="font-bold text-orange-700">{surgeBreakdown.female_ward}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-orange-200/50 flex justify-between items-center">
            <span className="text-sm font-bold text-slate-400 uppercase">
              Total Surge
            </span>
            <span
              className={`text-4xl font-black ${
                totalSurge > 0 ? "text-orange-500" : "text-slate-300"
              }`}
            >
              {totalSurge}
            </span>
          </div>
        </div>

        {/* STEP 3: EXTERNAL */}
        <div
          className={`rounded-2xl p-6 border-2 relative ${
            totalExternal > 0
              ? "bg-red-50 border-red-200 shadow-md"
              : "bg-slate-50 border-slate-200 border-dashed opacity-60"
          }`}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded uppercase tracking-wider inline-block mb-2">
                Step 3
              </div>
              <h4 className="text-lg font-bold text-slate-800">
                External Transfer
              </h4>
              <p className="text-sm text-slate-500">
                Send to other hospitals (last resort)
              </p>
            </div>
            <div
              className={`p-3 rounded-xl ${
                totalExternal > 0
                  ? "bg-red-200 text-red-700"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              <Truck size={24} />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center h-40">
            <span
              className={`text-6xl font-black ${
                totalExternal > 0 ? "text-red-500" : "text-slate-300"
              }`}
            >
              {totalExternal}
            </span>
            <span className="text-sm font-bold text-slate-400 uppercase mt-2">
              Ambulance Transfers
            </span>
          </div>
        </div>
      </div>

      {/* --- FOOTER BUTTON --- */}
      <div className="mt-10 flex justify-end">
        <button className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
          <CheckCircle size={24} />
          Approve & Execute Plan
        </button>
      </div>
    </div>
  );
};

export default ETU_BedOptimization;