import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  TrendingUp, 
  Plus, 
  Droplet, 
  Moon, 
  Flame, 
  Heart, 
  Scale, 
  Activity, 
  Clock, 
  CheckCircle,
  Calendar,
  AlertCircle
} from "lucide-react";
import { HealthLog, UserProfile } from "../types";

interface DashboardProps {
  logs: HealthLog[];
  onAddLog: (log: Omit<HealthLog, "id">) => void;
  profile: UserProfile;
}

export default function Dashboard({ logs, onAddLog, profile }: DashboardProps) {
  const { t } = useTranslation();
  // Local state for logging form
  const [showLogModal, setShowLogModal] = useState(false);
  const [formData, setFormData] = useState({
    weight: profile.weight,
    systolic: profile.systolic,
    diastolic: profile.diastolic,
    heartRate: profile.heartRate,
    waterIntake: 1250,
    sleep: 7.5,
    activityMinutes: 30,
    date: new Date().toISOString().split("T")[0],
  });

  // Current stats (taken from last log or profile)
  const lastLog = logs[logs.length - 1];
  const currentWeight = lastLog ? lastLog.weight : profile.weight;
  const currentSystolic = lastLog ? lastLog.systolic : profile.systolic;
  const currentDiastolic = lastLog ? lastLog.diastolic : profile.diastolic;
  const currentHeartRate = lastLog ? lastLog.heartRate : profile.heartRate;
  const currentWater = lastLog ? lastLog.waterIntake : 1500;
  const currentSleep = lastLog ? lastLog.sleep : 7.0;
  const currentActivity = lastLog ? lastLog.activityMinutes : 20;

  // Quick hydration shortcut
  const handleQuickHydrate = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const todayLogIndex = logs.findIndex(l => l.date === todayStr);
    
    if (todayLogIndex !== -1) {
      const todayLog = logs[todayLogIndex];
      const updatedLogs = [...logs];
      updatedLogs[todayLogIndex] = {
        ...todayLog,
        waterIntake: todayLog.waterIntake + 250
      };
      // For this prototype, we'll trigger log update by saving it to local storage and updating state via onAddLog or direct
      onAddLog({
        date: todayStr,
        weight: todayLog.weight,
        systolic: todayLog.systolic,
        diastolic: todayLog.diastolic,
        heartRate: todayLog.heartRate,
        waterIntake: todayLog.waterIntake + 250,
        sleep: todayLog.sleep,
        activityMinutes: todayLog.activityMinutes
      });
    } else {
      onAddLog({
        date: todayStr,
        weight: currentWeight,
        systolic: currentSystolic,
        diastolic: currentDiastolic,
        heartRate: currentHeartRate,
        waterIntake: 1750, // default today start + 250
        sleep: currentSleep,
        activityMinutes: currentActivity
      });
    }
  };

  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLog({
      date: formData.date,
      weight: Number(formData.weight),
      systolic: Number(formData.systolic),
      diastolic: Number(formData.diastolic),
      heartRate: Number(formData.heartRate),
      waterIntake: Number(formData.waterIntake),
      sleep: Number(formData.sleep),
      activityMinutes: Number(formData.activityMinutes),
    });
    setShowLogModal(false);
  };

  // Helper for generating custom SVG charts
  const renderSVGChart = (
    data: number[], 
    labels: string[], 
    colorClass: string, 
    strokeColor: string, 
    fillColor: string, 
    title: string,
    unit: string
  ) => {
    const width = 500;
    const height = 150;
    const padding = 25;
    
    if (data.length === 0) return <div className="text-slate-400 text-sm py-4">{t("common.noData")}</div>;
    
    const maxVal = Math.max(...data) * 1.1;
    const minVal = Math.min(...data) * 0.9 > 0 ? Math.min(...data) * 0.9 : 0;
    const valRange = maxVal - minVal || 10;

    const points = data.map((val, index) => {
      const x = padding + (index * (width - padding * 2)) / (data.length - 1 || 1);
      const y = height - padding - ((val - minVal) * (height - padding * 2)) / valRange;
      return { x, y, val, label: labels[index] };
    });

    const pathD = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");

    const areaD = points.length > 0 
      ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
      : "";

    return (
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden">
        <h4 className="text-sm font-bold text-[#0fb3a9] uppercase tracking-wider mb-2">{title}</h4>
        <div className="relative w-full h-[150px]">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fillColor} stopOpacity="0.4" />
                <stop offset="100%" stopColor={fillColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            
            {/* Grid Lines */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1" />
            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#f1f5f9" strokeWidth="1" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e2e8f0" strokeWidth="1" />

            {/* Area under the line */}
            {areaD && <path d={areaD} fill={`url(#gradient-${title.replace(/\s+/g, '')})`} />}
            
            {/* Line */}
            {pathD && <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
            
            {/* Points & Tooltips */}
            {points.map((p, i) => (
              <g key={i} className="group cursor-pointer">
                <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke={strokeColor} strokeWidth="3" />
                <circle cx={p.x} cy={p.y} r="8" fill={strokeColor} opacity="0" className="hover:opacity-30 transition-all" />
                {/* Value tooltip displayed above point */}
                <text 
                  x={p.x} 
                  y={p.y - 12} 
                  textAnchor="middle" 
                  className="font-mono text-[10px] font-bold fill-slate-700 bg-white"
                >
                  {p.val}
                </text>
                {/* Date labels on bottom */}
                <text 
                  x={p.x} 
                  y={height - 5} 
                  textAnchor="middle" 
                  className="text-[9px] fill-slate-400 font-medium"
                >
                  {p.label.substring(5)} {/* MM-DD */}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  };

  // Extract variables for trends
  const trendLabels = logs.map(l => l.date);
  const weightTrend = logs.map(l => l.weight);
  const systolicTrend = logs.map(l => l.systolic);
  const heartRateTrend = logs.map(l => l.heartRate);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Intro Hero banner */}
      <div className="relative overflow-hidden bg-[#0fb3a9] rounded-3xl p-6 sm:p-8 text-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-[#14cec3]/20 text-[#14cec3] border border-[#14cec3]/30 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-opacity-80">
            {t("dashboard.heroBadge")}
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold mt-4 leading-tight">
            {t("dashboard.heroTitle", { name: "Camille" })}
          </h2>
          <p className="text-teal-100/90 text-sm mt-2.5 leading-relaxed">
            {t("dashboard.heroDesc")}
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              id="btn-add-log-trigger"
              onClick={() => setShowLogModal(true)}
              className="flex items-center space-x-2 bg-white text-[#0fb3a9] hover:bg-slate-100 font-bold text-sm px-5 py-3 rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>{t("dashboard.logButton")}</span>
            </button>
            <button
              id="btn-quick-water"
              onClick={handleQuickHydrate}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/15 text-white font-medium text-sm px-5 py-3 rounded-xl border border-white/20 transition-all"
            >
              <Droplet className="w-4 h-4 text-blue-300" />
              <span>{t("dashboard.quickWater")}</span>
            </button>
          </div>
        </div>
        
        {/* Background decorative circles */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
        <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Poids */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("dashboard.weight")}</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold font-sans text-[#0fb3a9]">{currentWeight}</span>
              <span className="text-xs text-slate-400 font-medium">{t("dashboard.weightUnit")}</span>
            </div>                <p className="text-[10px] text-slate-400 mt-1">{t("dashboard.weightTarget")}</p>
          </div>
        </div>

        {/* Tension Artérielle */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("dashboard.bloodPressure")}</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline space-x-0.5">
              <span className="text-xl font-bold font-sans text-[#0fb3a9]">{currentSystolic}</span>
              <span className="text-sm text-slate-400">/</span>
              <span className="text-xl font-bold font-sans text-[#0fb3a9]">{currentDiastolic}</span>
              <span className="text-[10px] text-slate-400 ml-1">{t("dashboard.bloodPressureUnit")}</span>
            </div>
            <p className="text-[10px] text-teal-600 font-medium mt-1">{t("dashboard.bloodPressureNormal")}</p>
          </div>
        </div>

        {/* Rythme Cardiaque */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("dashboard.heartRate")}</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold font-sans text-[#0fb3a9]">{currentHeartRate}</span>
              <span className="text-xs text-slate-400 font-medium">{t("dashboard.heartRateUnit")}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">{t("dashboard.heartRateRest")}</p>
          </div>
        </div>

        {/* Eau */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("dashboard.water")}</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold font-sans text-[#0fb3a9]">{(currentWater / 1000).toFixed(2)}</span>
              <span className="text-xs text-slate-400 font-medium">{t("dashboard.waterUnit")}</span>
            </div>
            <p className="text-[10px] text-blue-500 font-semibold mt-1">{t("dashboard.waterTarget")}</p>
          </div>
        </div>

        {/* Sommeil */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("dashboard.sleep")}</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Moon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold font-sans text-[#0fb3a9]">{currentSleep}</span>
              <span className="text-xs text-slate-400 font-medium">{t("dashboard.sleepUnit")}</span>
            </div>
            <p className="text-[10px] text-indigo-500 font-medium mt-1">{t("dashboard.sleepQuality")}</p>
          </div>
        </div>

        {/* Activité Sportive */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("dashboard.activity")}</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold font-sans text-[#0fb3a9]">{currentActivity}</span>
              <span className="text-xs text-slate-400 font-medium">{t("dashboard.activityUnit")}</span>
            </div>
            <p className="text-[10px] text-amber-600 font-medium mt-1">{t("dashboard.activityTarget")}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">          {renderSVGChart(weightTrend, trendLabels, "teal", "#14cec3", "#14cec3", t("dashboard.weightChart"), "kg")}
        {renderSVGChart(systolicTrend, trendLabels, "blue", "#3b82f6", "#3b82f6", t("dashboard.bpChart"), "mmHg")}
      </div>

      {/* Wellness Insight Panel & Mini Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Custom CEan'sCare Health Quote/Tip */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-start space-x-4">
          <div className="p-3.5 rounded-2xl bg-[#0fb3a9] text-white shadow-sm shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-[#0fb3a9] text-lg">{t("dashboard.tipTitle")}</h3>
            <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">{t("dashboard.tipDesc")}</p>
            <div className="flex items-center space-x-2 mt-4 text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 w-fit">
              <CheckCircle className="w-3.5 h-3.5 text-[#14cec3]" />
              <span>{t("dashboard.tipBadge")}</span>
            </div>
          </div>
        </div>

        {/* Quick Check list checklist */}
        <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <h4 className="font-sans font-bold text-[#0fb3a9] text-base mb-3">{t("dashboard.routineTitle")}</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-slate-600">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0fb3a9] rounded" />
                <span className="line-through text-slate-400">{t("dashboard.routineMorningBP")}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-600">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0fb3a9] rounded" />
                <span className="line-through text-slate-400">{t("dashboard.routineSleep")}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-600">
                <input type="checkbox" className="w-4 h-4 accent-[#0fb3a9] rounded" />
                <span>{t("dashboard.routineWater")}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-600">
                <input type="checkbox" className="w-4 h-4 accent-[#0fb3a9] rounded" />
                <span>{t("dashboard.routineWalk")}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
            <span>{t("dashboard.routineProgress", { percent: 50 })}</span>
            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-[#14cec3] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog: Add Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex overflow-y-auto p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg m-auto overflow-hidden animate-scale-up border border-slate-100">
            <div className="bg-[#0fb3a9] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-sans font-bold text-xl">{t("dashboard.logModalTitle")}</h3>
                <p className="text-teal-100/80 text-xs mt-1">{t("dashboard.logModalDesc")}</p>
              </div>
              <button 
                id="btn-close-log-modal"
                onClick={() => setShowLogModal(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitLog} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t("dashboard.logWeight")}</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t("dashboard.logHeartRate")}</label>
                  <input
                    type="number"
                    required
                    value={formData.heartRate}
                    onChange={(e) => setFormData({ ...formData, heartRate: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t("dashboard.logSystolic")}</label>
                  <input
                    type="number"
                    required
                    value={formData.systolic}
                    onChange={(e) => setFormData({ ...formData, systolic: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t("dashboard.logDiastolic")}</label>
                  <input
                    type="number"
                    required
                    value={formData.diastolic}
                    onChange={(e) => setFormData({ ...formData, diastolic: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">{t("dashboard.logWater")}</label>
                  <input
                    type="number"
                    required
                    value={formData.waterIntake}
                    onChange={(e) => setFormData({ ...formData, waterIntake: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">{t("dashboard.logSleep")}</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formData.sleep}
                    onChange={(e) => setFormData({ ...formData, sleep: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">{t("dashboard.logActivity")}</label>
                  <input
                    type="number"
                    required
                    value={formData.activityMinutes}
                    onChange={(e) => setFormData({ ...formData, activityMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t("dashboard.logDate")}</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  id="btn-cancel-log"
                  onClick={() => setShowLogModal(false)}
                  className="w-1/2 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  id="btn-save-log"
                  className="w-1/2 py-3 bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] hover:from-[#0fb3a9] hover:to-[#0d9488] text-white font-bold text-sm rounded-xl transition-all"
                >
                  {t("common.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
