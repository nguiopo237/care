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
} from "lucide-react";
import { Doctor, Appointment } from "../types";

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

export default function DoctorSpace() {
  const { t } = useTranslation();
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
  };

  // Doctors only see appointments booked for them
  const myAppointments = currentDoctor
    ? appointments.filter((a) => a.doctorName === currentDoctor.fullName)
    : [];

  // Unique patients from appointments
  const myPatients = Array.from(
    new Map(myAppointments.map((a) => [a.patientName, a])).values()
  );

  // ------------------- NOT LOGGED IN : Registration -------------------
  if (!currentDoctor) {
    return (
      <div className="space-y-8 animate-fade-in">
        {/* Banner */}
        <div className="relative overflow-hidden bg-[#0fb3a9] rounded-3xl p-8 text-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
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
      <div className="relative overflow-hidden bg-[#0fb3a9] rounded-3xl p-8 text-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
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
              <div key={p.patientName} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {p.patientName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{p.patientName}</p>
                    <p className="text-[11px] text-slate-400">
                      {p.doctorSpecialty} • {p.date} à {p.time}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
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
              <div key={a.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-teal-50 text-[#0fb3a9]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{a.patientName}</p>
                    <p className="text-[11px] text-slate-400">
                      {a.date} à {a.time} • {a.type === "video" ? t("doctors.typeVideo") : t("doctors.typeHome")} • {a.reason}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
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
