import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Video,
  CalendarDays,
  Phone,
  Home,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Clock,
  CheckCircle2,
  AlertTriangle,
  VideoOff,
  User,
} from "lucide-react";
import { Doctor, Appointment } from "../types";

const APPOINTMENTS_KEY = "ceans_appointments";

// Demo doctors directory (seeded) — merged with registered doctors
const DEMO_DOCTORS: Doctor[] = [
  {
    id: "demo-1",
    fullName: "Dr. Amina Diallo",
    specialty: "Médecine générale",
    email: "a.diallo@ceanscare.com",
    phone: "+33 6 12 34 56 78",
    licenseNumber: "RPPS-10000001",
    experienceYears: 12,
    bio: "Médecine générale et prévention cardiovasculaire.",
    verified: true,
    city: "Douala",
    hours: [
      { days: [1, 2, 3, 4, 5], open: "09:00", close: "18:00" },
      { days: [6], open: "09:00", close: "13:00" },
    ],
    registeredAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    fullName: "Dr. Marc Lefèvre",
    specialty: "Nutrition",
    email: "m.lefevre@ceanscare.com",
    phone: "+33 6 23 45 67 89",
    licenseNumber: "RPPS-10000002",
    experienceYears: 8,
    bio: "Nutrition clinique et micronutrition.",
    verified: true,
    city: "Paris",
    hours: [
      { days: [2, 3, 4, 5, 6], open: "09:30", close: "19:00" },
      { days: [0], open: "10:00", close: "13:00" },
    ],
    registeredAt: new Date().toISOString(),
  },
  {
    id: "demo-3",
    fullName: "Dr. Nadia Kouassi",
    specialty: "Phytothérapie",
    email: "n.kouassi@ceanscare.com",
    phone: "+225 07 89 12 34 56",
    licenseNumber: "RPPS-10000003",
    experienceYears: 15,
    bio: "Phytothérapie traditionnelle validée scientifiquement.",
    verified: true,
    city: "Abidjan",
    hours: [
      { days: [1, 2, 3, 4, 5], open: "08:00", close: "17:00" },
    ],
    registeredAt: new Date().toISOString(),
  },
];

const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

function loadAppointments(): Appointment[] {
  try {
    const raw = localStorage.getItem(APPOINTMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function Teleconsultation() {
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    try {
      const raw = localStorage.getItem("ceans_doctors");
      const registered: Doctor[] = raw ? JSON.parse(raw) : [];
      return [...DEMO_DOCTORS, ...registered.filter((d) => !DEMO_DOCTORS.some((dd) => dd.id === d.id))];
    } catch {
      return DEMO_DOCTORS;
    }
  });
  const [appointments, setAppointments] = useState<Appointment[]>(loadAppointments);

  // Booking form state
  const [selectedDoctor, setSelectedDoctor] = useState<string>(DEMO_DOCTORS[0].id);
  const [patientName, setPatientName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(TIME_SLOTS[0]);
  const [consultType, setConsultType] = useState<"video" | "home">("video");
  const [reason, setReason] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Active call state
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  }, [appointments]);

  // Call timer
  useEffect(() => {
    if (activeAppointment) {
      timerRef.current = setInterval(() => {
        setCallSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeAppointment]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((tr) => tr.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCameraOn(true);
    } catch {
      setCameraError(t("teleconsultation.cameraError"));
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
  };

  const toggleCamera = () => {
    if (cameraOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");
    setBookingSuccess(false);

    if (!patientName.trim()) {
      setBookingError(t("teleconsultation.errorPatientName"));
      return;
    }
    if (!date) {
      setBookingError(t("teleconsultation.errorDate"));
      return;
    }

    const doctor = doctors.find((d) => d.id === selectedDoctor);
    if (!doctor) return;

    const appointment: Appointment = {
      id: Math.random().toString(36).substring(7),
      doctorName: doctor.fullName,
      doctorSpecialty: doctor.specialty,
      doctorPhone: doctor.phone,
      patientName: patientName.trim(),
      date,
      time,
      type: consultType,
      reason: reason.trim() || t("teleconsultation.reasonDefault"),
      status: "upcoming",
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [...prev, appointment]);
    setBookingSuccess(true);
    setPatientName("");
    setReason("");
  };

  const joinCall = (appointment: Appointment) => {
    setActiveAppointment(appointment);
    setCallSeconds(0);
    setCameraOn(false);
    setMicOn(false);
    setCameraError("");
    // auto-try camera (may fail silently until user clicks)
    startCamera();
  };

  const endCall = () => {
    stopCamera();
    setActiveAppointment(null);
    setCallSeconds(0);
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const todayStr = new Date().toISOString().split("T")[0];

  // ------------------- IN CALL -------------------
  if (activeAppointment) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          {/* Call header */}
          <div className="bg-[#0fb3a9] px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center font-bold">
                {activeAppointment.doctorName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-sm">{activeAppointment.doctorName}</p>
                <p className="text-[11px] text-teal-100/90 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(callSeconds)}</span>
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-300/30 text-[10px] font-bold uppercase flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block"></span>
              <span>{t("teleconsultation.live")}</span>
            </span>
          </div>

          {/* Video area */}
          <div className="bg-slate-950 p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[320px]">
            {/* Doctor video (simulated) */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#14cec3] to-[#0fb3a9] flex items-center justify-center min-h-[220px]">
              <div className="text-center text-white">
                <div className="mx-auto w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-3xl font-bold mb-3">
                  {activeAppointment.doctorName.charAt(0)}
                </div>
                <p className="font-bold">{activeAppointment.doctorName}</p>
                <p className="text-xs text-teal-100/90">{activeAppointment.doctorSpecialty}</p>
                <p className="text-[10px] text-teal-200/70 mt-2 flex items-center justify-center space-x-1">
                  <VideoOff className="w-3 h-3" />
                  <span>{t("teleconsultation.doctorSimulated")}</span>
                </p>
              </div>
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/30 text-white text-[9px] font-bold uppercase flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block"></span>
                <span>{activeAppointment.doctorName.split(" ")[0]}</span>
              </span>
            </div>

            {/* Patient camera preview */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center min-h-[220px]">
              {cameraOn ? (
                <video ref={videoRef} muted playsInline className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-slate-400">
                  <div className="mx-auto w-20 h-20 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center mb-3">
                    <User className="w-10 h-10" />
                  </div>
                  <p className="text-xs font-semibold">{t("teleconsultation.cameraOff")}</p>
                  <button
                    onClick={startCamera}
                    className="mt-3 px-4 py-2 bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    {t("teleconsultation.enableCamera")}
                  </button>
                </div>
              )}
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/30 text-white text-[9px] font-bold uppercase">
                {t("teleconsultation.you")}
              </span>
              {cameraError && (
                <div className="absolute bottom-3 left-3 right-3 p-2 bg-red-500/90 text-white text-[10px] rounded-lg flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Call controls */}
          <div className="px-6 py-5 bg-white flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={toggleCamera}
              className={`p-4 rounded-full transition-all cursor-pointer ${
                cameraOn ? "bg-[#0fb3a9] text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
              title={t("teleconsultation.toggleCamera")}
            >
              {cameraOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-4 rounded-full transition-all cursor-pointer ${
                micOn ? "bg-[#0fb3a9] text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
              title={t("teleconsultation.toggleMic")}
            >
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <button
              onClick={endCall}
              className="px-8 py-3.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all cursor-pointer flex items-center space-x-2"
            >
              <PhoneOff className="w-4 h-4" />
              <span>{t("teleconsultation.endCall")}</span>
            </button>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 text-center max-w-lg mx-auto leading-relaxed">
          {t("teleconsultation.callDisclaimer")}
        </p>
      </div>
    );
  }

  // ------------------- BOOKING VIEW -------------------
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner */}
      <div className="relative overflow-hidden bg-[#0fb3a9] rounded-3xl p-6 sm:p-8 text-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-[#14cec3]/20 text-[#14cec3] border border-[#14cec3]/30 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-opacity-80">
            {t("teleconsultation.badge")}
          </span>
          <h2 className="font-sans text-3xl font-bold mt-4 leading-tight">{t("teleconsultation.title")}</h2>
          <p className="text-teal-100/90 text-sm mt-2 leading-relaxed">{t("teleconsultation.desc")}</p>
        </div>
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 blur-2xl rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Booking form */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] text-white shadow-sm">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-lg text-slate-800">{t("teleconsultation.bookTitle")}</h3>
              <p className="text-xs text-slate-400">{t("teleconsultation.bookSubtitle")}</p>
            </div>
          </div>

          {bookingSuccess && (
            <div className="mb-4 p-3 bg-teal-50 border border-teal-100 rounded-xl flex items-start space-x-2 text-teal-800 text-xs">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>{t("teleconsultation.bookingSuccess")}</span>
            </div>
          )}

          <form onSubmit={handleBook} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("teleconsultation.doctor")}</label>
              <div className="space-y-2">
                {doctors.map((doc) => (
                  <label
                    key={doc.id}
                    className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedDoctor === doc.id
                        ? "border-[#0fb3a9] bg-teal-50/60"
                        : "border-slate-100 hover:border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {doc.fullName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{doc.fullName}</p>
                        <p className="text-[10px] text-slate-400 truncate">{doc.specialty} • {doc.city}</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="doctor"
                      checked={selectedDoctor === doc.id}
                      onChange={() => setSelectedDoctor(doc.id)}
                      className="accent-[#0fb3a9] shrink-0"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("teleconsultation.patientName")}</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder={t("teleconsultation.patientNamePlaceholder")}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0fb3a9]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("teleconsultation.date")}</label>
                <input
                  type="date"
                  min={todayStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0fb3a9]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("teleconsultation.time")}</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0fb3a9] cursor-pointer"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("teleconsultation.type")}</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setConsultType("video")}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    consultType === "video"
                      ? "bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] text-white border-transparent"
                      : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>{t("teleconsultation.typeVideo")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConsultType("home")}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    consultType === "home"
                      ? "bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] text-white border-transparent"
                      : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>{t("teleconsultation.typeHome")}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("teleconsultation.reason")}</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                placeholder={t("teleconsultation.reasonPlaceholder")}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0fb3a9] resize-none"
              />
            </div>

            {bookingError && (
              <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{bookingError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] hover:from-[#0fb3a9] hover:to-[#0d9488] text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer"
            >
              {t("teleconsultation.bookCta")}
            </button>
          </form>
        </div>

        {/* Upcoming appointments */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <h3 className="font-sans font-bold text-lg text-slate-800 mb-4 flex items-center space-x-2">
              <CalendarDays className="w-5 h-5 text-[#14cec3]" />
              <span>{t("teleconsultation.upcomingTitle")}</span>
            </h3>

            {appointments.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">{t("teleconsultation.noAppointments")}</p>
            ) : (
              <div className="space-y-3">
                {appointments.map((a) => (
                  <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="p-2.5 rounded-xl bg-teal-50 text-[#0fb3a9] shrink-0">
                        {a.type === "video" ? <Video className="w-4 h-4" /> : <Home className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{a.doctorName}</p>
                        <p className="text-[11px] text-slate-400">
                          {a.doctorSpecialty} • {a.date} à {a.time}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">{a.patientName} — {a.reason}</p>
                      </div>
                    </div>
                    {a.status === "upcoming" && a.type === "video" ? (
                      <button
                        onClick={() => joinCall(a)}
                        className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] hover:from-[#0fb3a9] hover:to-[#0d9488] text-white text-xs font-bold rounded-xl cursor-pointer w-full sm:w-auto shrink-0"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{t("teleconsultation.joinCall")}</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 text-[10px] font-bold uppercase w-fit shrink-0">
                        {a.status === "upcoming" ? t("teleconsultation.planned") : a.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* How it works */}
          <div className="bg-[#0fb3a9] text-white p-6 rounded-3xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-3">
                <Phone className="w-5 h-5 text-teal-200" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-200">{t("teleconsultation.howTitle")}</span>
              </div>
              <ul className="space-y-2.5 text-xs text-teal-100/90">
                <li className="flex items-start space-x-2"><span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-[10px] font-bold shrink-0">1</span><span>{t("teleconsultation.step1")}</span></li>
                <li className="flex items-start space-x-2"><span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-[10px] font-bold shrink-0">2</span><span>{t("teleconsultation.step2")}</span></li>
                <li className="flex items-start space-x-2"><span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-[10px] font-bold shrink-0">3</span><span>{t("teleconsultation.step3")}</span></li>
              </ul>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 blur-2xl rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-slate-400 text-center max-w-lg mx-auto leading-relaxed">
        {t("teleconsultation.disclaimer")}
      </p>
    </div>
  );
}
