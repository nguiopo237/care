import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Stethoscope,
  UserPlus,
  ShieldCheck,
  BadgeCheck,
  Users,
  CalendarDays,
  Phone,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  ClipboardList,
  Clock,
} from "lucide-react";
import { Doctor, Appointment } from "../types";
import {
  DAY_ORDER,
  WeeklyHours,
  capitalize,
  dayName,
  formatDays,
  formatTime,
  getOpenStatus,
  hoursToMap,
  mergeDays,
} from "../utils/hours";

const DOCTORS_KEY = "ceans_doctors";
const CURRENT_DOCTOR_KEY = "ceans_current_doctor";

const SPECIALTIES = [
  "Médecine générale",
  "Cardiologie",
  "Nutrition",
  "Phytothérapie",
  "Pédiatrie",
  "Dermatologie",
];

function loadDoctors(): Doctor[] {
  try {
    const raw = localStorage.getItem(DOCTORS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadAppointments(): Appointment[] {
  try {
    const raw = localStorage.getItem("ceans_appointments");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Default availability: weekdays 9h-18h, Saturday 9h-13h, Sunday closed
function defaultHours(): WeeklyHours {
  return {
    1: { open: "09:00", close: "18:00" },
    2: { open: "09:00", close: "18:00" },
    3: { open: "09:00", close: "18:00" },
    4: { open: "09:00", close: "18:00" },
    5: { open: "09:00", close: "18:00" },
    6: { open: "09:00", close: "13:00" },
  };
}

// Per-day editor (checkbox + open/close time pickers), localized day labels
function HoursEditor({
  value,
  onChange,
  locale,
  closedLabel,
}: {
  value: WeeklyHours;
  onChange: (v: WeeklyHours) => void;
  locale: string;
  closedLabel: string;
}) {
  const toggleDay = (day: number) => {
    const next = { ...value };
    if (next[day]) {
      delete next[day];
    } else {
      next[day] = { open: "09:00", close: "18:00" };
    }
    onChange(next);
  };
  const setTime = (day: number, field: "open" | "close", val: string) => {
    const cur = value[day] || { open: "09:00", close: "18:00" };
    onChange({ ...value, [day]: { ...cur, [field]: val } });
  };
  return (
    <div className="space-y-1.5">
      {DAY_ORDER.map((day) => {
        const enabled = !!value[day];
        return (
          <div
            key={day}
            className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-2.5 rounded-xl border transition-all ${
              enabled ? "bg-teal-50/60 border-teal-100" : "bg-slate-50 border-slate-100"
            }`}
          >
            <label className="flex items-center space-x-2.5 flex-1 min-w-0 cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => toggleDay(day)}
                className="w-4 h-4 accent-[#0fb3a9] shrink-0"
              />
              <span className={`text-xs font-semibold truncate ${enabled ? "text-slate-800" : "text-slate-400"}`}>
                {capitalize(dayName(locale, day))}
              </span>
            </label>
            {enabled ? (
              <div className="flex items-center gap-2 sm:shrink-0 pl-7 sm:pl-0">
                <input
                  type="time"
                  value={value[day].open}
                  onChange={(e) => setTime(day, "open", e.target.value)}
                  className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-medium focus:outline-none focus:ring-2 focus:ring-[#0fb3a9]"
                />
                <span className="text-slate-400 text-xs">–</span>
                <input
                  type="time"
                  value={value[day].close}
                  onChange={(e) => setTime(day, "close", e.target.value)}
                  className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-medium focus:outline-none focus:ring-2 focus:ring-[#0fb3a9]"
                />
              </div>
            ) : (
              <span className="text-[10px] text-slate-400 font-medium pl-7 sm:pl-0">{closedLabel}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function DoctorSpace() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.substring(0, 2);
  const [doctors, setDoctors] = useState<Doctor[]>(loadDoctors);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(() => {
    try {
      const raw = localStorage.getItem(CURRENT_DOCTOR_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [appointments, setAppointments] = useState<Appointment[]>(loadAppointments);

  // Registration form state
  const [fullName, setFullName] = useState("");
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [agreeVerification, setAgreeVerification] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Opening hours (registration form)
  const [hours, setHours] = useState<WeeklyHours>(defaultHours);

  // Opening hours (dashboard edit mode)
  const [editingHours, setEditingHours] = useState(false);
  const [hoursEdit, setHoursEdit] = useState<WeeklyHours>({});
  const [hoursSavedMsg, setHoursSavedMsg] = useState(false);

  useEffect(() => {
    localStorage.setItem(DOCTORS_KEY, JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    if (currentDoctor) {
      localStorage.setItem(CURRENT_DOCTOR_KEY, JSON.stringify(currentDoctor));
    } else {
      localStorage.removeItem(CURRENT_DOCTOR_KEY);
    }
  }, [currentDoctor]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !phone.trim() || !licenseNumber.trim() || !city.trim()) {
      setError(t("doctors.errorRequired"));
      return;
    }
    if (!agreeVerification) {
      setError(t("doctors.errorLicense"));
      return;
    }
    if (doctors.some((d) => d.email.toLowerCase() === email.trim().toLowerCase())) {
      setError(t("doctors.errorEmailExists"));
      return;
    }

    const newDoctor: Doctor = {
      id: Math.random().toString(36).substring(7),
      fullName: fullName.trim(),
      specialty,
      email: email.trim(),
      phone: phone.trim(),
      licenseNumber: licenseNumber.trim().toUpperCase(),
      experienceYears: parseInt(experienceYears) || 0,
      bio: bio.trim(),
      verified: true, // license submitted & validated in this demo flow
      city: city.trim(),
      hours: mergeDays(hours),
      registeredAt: new Date().toISOString(),
    };

    setDoctors((prev) => [...prev, newDoctor]);
    setCurrentDoctor(newDoctor);
    setSuccess(true);
  };

  const handleLogout = () => {
    setCurrentDoctor(null);
    setSuccess(false);
    setFullName("");
    setEmail("");
    setPhone("");
    setLicenseNumber("");
    setBio("");
    setCity("");
    setAgreeVerification(false);
    setHours(defaultHours());
    setEditingHours(false);
  };

  // Doctors only see appointments booked for them
  const myAppointments = currentDoctor
    ? appointments.filter((a) => a.doctorName === currentDoctor.fullName)
    : [];

  // Unique patients from appointments
  const myPatients = Array.from(
    new Map(myAppointments.map((a) => [a.patientName, a])).values()
  );

  // Opening hours (dashboard)
  const doctorHours = currentDoctor?.hours ?? [];
  const hoursStatus = getOpenStatus(doctorHours);

  const startEditHours = () => {
    setHoursEdit(hoursToMap(doctorHours));
    setHoursSavedMsg(false);
    setEditingHours(true);
  };
  const cancelEditHours = () => {
    setEditingHours(false);
    setHoursSavedMsg(false);
  };
  const saveHours = () => {
    if (currentDoctor) {
      setCurrentDoctor({ ...currentDoctor, hours: mergeDays(hoursEdit) });
    }
    setEditingHours(false);
    setHoursSavedMsg(true);
    setTimeout(() => setHoursSavedMsg(false), 3000);
  };

  // ------------------- NOT LOGGED IN : Registration -------------------
  if (!currentDoctor) {
    return (
      <div className="space-y-8 animate-fade-in">
        {/* Banner */}
        <div className="relative overflow-hidden bg-[#0fb3a9] rounded-3xl p-6 sm:p-8 text-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
          <div className="relative z-10 max-w-2xl">
            <span className="bg-[#14cec3]/20 text-[#14cec3] border border-[#14cec3]/30 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-opacity-80">
              {t("doctors.badge")}
            </span>
            <h2 className="font-sans text-3xl font-bold mt-4 leading-tight">{t("doctors.title")}</h2>
            <p className="text-teal-100/90 text-sm mt-2 leading-relaxed">{t("doctors.desc")}</p>
          </div>
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 blur-2xl rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Registration form */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] text-white shadow-sm">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-lg text-slate-800">{t("doctors.registerTitle")}</h3>
                <p className="text-xs text-slate-400">{t("doctors.registerSubtitle")}</p>
              </div>
            </div>

            {success && (
              <div className="mb-4 p-3 bg-teal-50 border border-teal-100 rounded-xl flex items-start space-x-2 text-teal-800 text-xs">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>{t("doctors.successRegistered")}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("doctors.fullName")}</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Dr. Amina Diallo"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0fb3a9]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("doctors.specialty")}</label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0fb3a9] cursor-pointer"
                  >
                    {SPECIALTIES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("doctors.email")}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dr.diallo@exemple.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0fb3a9]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("doctors.phone")}</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0fb3a9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("doctors.licenseNumber")}</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="RPPS-12345678"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0fb3a9] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("doctors.experienceYears")}</label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="10"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0fb3a9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("doctors.city")}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Douala, Yaoundé, Paris..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0fb3a9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("doctors.bio")}</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  placeholder={t("doctors.bioPlaceholder")}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0fb3a9] resize-none"
                />
              </div>

              {/* Opening hours */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("doctors.hoursTitle")}</label>
                <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">{t("doctors.hoursDesc")}</p>
                <HoursEditor value={hours} onChange={setHours} locale={locale} closedLabel={t("doctors.closed")} />
              </div>

              {/* License verification checkbox */}
              <label className="flex items-start space-x-2.5 p-3 bg-teal-50/60 border border-teal-100 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeVerification}
                  onChange={(e) => setAgreeVerification(e.target.checked)}
                  className="w-4 h-4 accent-[#0fb3a9] mt-0.5"
                />
                <span className="text-[11px] text-slate-600 leading-relaxed">
                  {t("doctors.licenseVerify")}
                </span>
              </label>

              {error && (
                <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] hover:from-[#0fb3a9] hover:to-[#0d9488] text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer"
              >
                {t("doctors.registerCta")}
              </button>
            </form>
          </div>

          {/* Why join side panel */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h4 className="font-sans font-bold text-base text-slate-800 mb-4 flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#14cec3]" />
                <span>{t("doctors.verificationTitle")}</span>
              </h4>
              <ul className="space-y-3">
                {[t("doctors.verify1"), t("doctors.verify2"), t("doctors.verify3")].map((item, i) => (
                  <li key={i} className="flex items-start space-x-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0fb3a9] text-white p-6 rounded-3xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-3">
                  <Stethoscope className="w-6 h-6 text-teal-200" />
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-200">{t("doctors.featuresTitle")}</span>
                </div>
                <ul className="space-y-2.5 text-xs text-teal-100/90">
                  <li className="flex items-center space-x-2"><Users className="w-4 h-4 shrink-0" /><span>{t("doctors.featurePatients")}</span></li>
                  <li className="flex items-center space-x-2"><CalendarDays className="w-4 h-4 shrink-0" /><span>{t("doctors.featureAppointments")}</span></li>
                  <li className="flex items-center space-x-2"><BadgeCheck className="w-4 h-4 shrink-0" /><span>{t("doctors.featureTrust")}</span></li>
                </ul>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 blur-2xl rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------- LOGGED IN : Doctor Dashboard -------------------
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header banner */}
      <div className="relative overflow-hidden bg-[#0fb3a9] rounded-3xl p-6 sm:p-8 text-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white font-bold text-xl shrink-0">
              {currentDoctor.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-sans text-2xl font-bold">{currentDoctor.fullName}</h2>
                <BadgeCheck className="w-5 h-5 text-teal-200" />
              </div>
              <p className="text-teal-100/90 text-sm">
                {currentDoctor.specialty} • {t("doctors.license")}: {currentDoctor.licenseNumber}
              </p>
              <p className="text-teal-200/80 text-xs mt-1 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{currentDoctor.city}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer self-start"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t("doctors.logout")}</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-teal-50 text-[#0fb3a9]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold font-sans text-[#0fb3a9]">{myPatients.length}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t("doctors.statPatients")}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-teal-50 text-[#0fb3a9]">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold font-sans text-[#0fb3a9]">
              {myAppointments.filter((a) => a.status === "upcoming").length}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t("doctors.statUpcoming")}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-teal-50 text-[#0fb3a9]">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold font-sans text-[#0fb3a9]">{myAppointments.length}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t("doctors.statTotal")}</p>
          </div>
        </div>
      </div>

      {/* Opening hours card */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="font-sans font-bold text-lg text-slate-800 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-[#14cec3]" />
            <span>{t("doctors.hoursTitle")}</span>
          </h3>
          {!editingHours && (
            <button
              onClick={startEditHours}
              className="text-xs font-semibold text-[#0fb3a9] hover:text-[#0d9488] px-3 py-1.5 bg-[#0fb3a9]/10 hover:bg-[#0fb3a9]/15 rounded-lg transition-all cursor-pointer"
            >
              {t("doctors.editHours")}
            </button>
          )}
        </div>

        {editingHours ? (
          <div className="space-y-4">
            <HoursEditor value={hoursEdit} onChange={setHoursEdit} locale={locale} closedLabel={t("doctors.closed")} />
            <div className="flex space-x-3 pt-2">
              <button
                onClick={cancelEditHours}
                className="w-1/2 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={saveHours}
                className="w-1/2 py-2.5 bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] hover:from-[#0fb3a9] hover:to-[#0d9488] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                {t("common.save")}
              </button>
            </div>
          </div>
        ) : (
          <div>
            {hoursSavedMsg && (
              <div className="mb-3 p-3 bg-teal-50 border border-teal-100 rounded-xl flex items-start space-x-2 text-teal-800 text-xs">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>{t("doctors.hoursSaved")}</span>
              </div>
            )}

            {doctorHours.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">{t("doctors.noHours")}</p>
            ) : (
              <>
                <div className="space-y-1">
                  {doctorHours.map((h, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-2.5 border-b border-slate-50 last:border-0"
                    >
                      <span className="text-sm font-semibold text-slate-700">{formatDays(locale, h.days)}</span>
                      <span className="text-sm text-slate-500 font-medium">
                        {formatTime(locale, h.open)} – {formatTime(locale, h.close)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center justify-end">
                  {hoursStatus.openNow ? (
                    <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-[10px] font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse inline-block"></span>
                      <span>{t("doctors.openNow")}</span>
                    </span>
                  ) : (
                    <span className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                      hoursStatus.openToday ? "bg-red-50 border-red-100 text-red-600" : "bg-slate-100 border-slate-200 text-slate-500"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full inline-block ${hoursStatus.openToday ? "bg-red-400" : "bg-slate-400"}`}></span>
                      <span>{hoursStatus.openToday ? t("doctors.closedNow") : t("doctors.closedToday")}</span>
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Patients list */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <h3 className="font-sans font-bold text-lg text-slate-800 mb-4 flex items-center space-x-2">
          <Users className="w-5 h-5 text-[#14cec3]" />
          <span>{t("doctors.patientsList")}</span>
        </h3>

        {myPatients.length === 0 ? (
          <p className="text-sm text-slate-400 py-6 text-center">{t("doctors.noPatients")}</p>
        ) : (
          <div className="space-y-3">
            {myPatients.map((p) => (
              <div key={p.patientName} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {p.patientName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{p.patientName}</p>
                    <p className="text-[11px] text-slate-400">
                      {p.doctorSpecialty} • {p.date} à {p.time}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase w-fit shrink-0 ${
                  p.status === "upcoming" ? "bg-teal-50 text-teal-700 border border-teal-100" : "bg-slate-100 text-slate-500"
                }`}>
                  {p.status === "upcoming" ? t("doctors.statusUpcoming") : p.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointments for this doctor */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <h3 className="font-sans font-bold text-lg text-slate-800 mb-4 flex items-center space-x-2">
          <CalendarDays className="w-5 h-5 text-[#14cec3]" />
          <span>{t("doctors.appointmentsTitle")}</span>
        </h3>

        {myAppointments.length === 0 ? (
          <p className="text-sm text-slate-400 py-6 text-center">{t("doctors.noAppointments")}</p>
        ) : (
          <div className="space-y-3">
            {myAppointments.map((a) => (
              <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-teal-50 text-[#0fb3a9] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{a.patientName}</p>
                    <p className="text-[11px] text-slate-400">
                      {a.date} à {a.time} • {a.type === "video" ? t("doctors.typeVideo") : t("doctors.typeHome")} • {a.reason}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase w-fit shrink-0 ${
                  a.status === "upcoming" ? "bg-teal-50 text-teal-700 border border-teal-100" : "bg-slate-100 text-slate-500"
                }`}>
                  {a.status === "upcoming" ? t("doctors.statusUpcoming") : a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
