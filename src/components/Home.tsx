import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dna,
  Globe,
  WifiOff,
  ClipboardList,
  Sparkles,
  Video,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface HomeProps {
  onNavigate: (tab: string) => void;
  onOpenPremium: () => void;
}

export default function Home({ onNavigate, onOpenPremium }: HomeProps) {
  const { t } = useTranslation();

  const stats = [
    { value: t("home.stat1Value"), label: t("home.stat1Label") },
    { value: t("home.stat2Value"), label: t("home.stat2Label") },
    { value: t("home.stat3Value"), label: t("home.stat3Label") },
    { value: t("home.stat4Value"), label: t("home.stat4Label") },
  ];

  const innovations = [
    {
      icon: Dna,
      premium: true,
      title: t("home.innovation1Title"),
      desc: t("home.innovation1Desc"),
      highlights: [
        t("home.innovation1Highlight1"),
        t("home.innovation1Highlight2"),
        t("home.innovation1Highlight3"),
      ],
    },
    {
      icon: Globe,
      premium: false,
      title: t("home.innovation2Title"),
      desc: t("home.innovation2Desc"),
      highlights: [
        t("home.innovation2Highlight1"),
        t("home.innovation2Highlight2"),
        t("home.innovation2Highlight3"),
      ],
    },
    {
      icon: WifiOff,
      premium: false,
      title: t("home.innovation3Title"),
      desc: t("home.innovation3Desc"),
      highlights: [
        t("home.innovation3Highlight1"),
        t("home.innovation3Highlight2"),
        t("home.innovation3Highlight3"),
      ],
    },
  ];

  const steps = [
    { icon: ClipboardList, title: t("home.step1Title"), desc: t("home.step1Desc") },
    { icon: Sparkles, title: t("home.step2Title"), desc: t("home.step2Desc") },
    { icon: Video, title: t("home.step3Title"), desc: t("home.step3Desc") },
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#0fb3a9] rounded-3xl p-6 sm:p-10 lg:p-14 text-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block bg-[#14cec3]/20 text-[#14cec3] border border-[#14cec3]/30 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-opacity-80">
            {t("home.heroBadge")}
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold mt-5 leading-tight">
            {t("home.heroTitle")}
          </h1>
          <p className="text-teal-100/90 text-sm sm:text-base mt-4 leading-relaxed max-w-2xl">
            {t("home.heroDesc")}
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <button
              onClick={() => onNavigate("dashboard")}
              className="flex items-center space-x-2 bg-white text-[#0fb3a9] hover:bg-slate-100 font-bold text-sm px-6 py-3.5 rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>{t("home.ctaStart")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#innovations"
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm px-6 py-3.5 rounded-xl border border-white/25 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>{t("home.ctaDiscover")}</span>
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
          {stats.map((s, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/10 border border-white/15">
              <p className="font-sans text-xl sm:text-2xl font-extrabold text-white">{s.value}</p>
              <p className="text-[10px] sm:text-xs text-teal-100/80 font-semibold mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Decorative circles */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/5 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute -right-6 -top-16 w-64 h-64 bg-teal-400/10 blur-3xl rounded-full pointer-events-none"></div>
      </section>

      {/* ================= INNOVATIONS ================= */}
      <section id="innovations" className="space-y-8 scroll-mt-28">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block bg-[#0fb3a9]/10 text-[#0fb3a9] px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
            {t("home.heroBadge")}
          </span>
          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-slate-800 mt-4">
            {t("home.innovationsTitle")}
          </h2>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">{t("home.innovationsDesc")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {innovations.map((inn, i) => (
            <div
              key={i}
              className={`bg-white border border-slate-100 p-6 sm:p-7 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col hover:shadow-md transition-all ${
                inn.premium ? "border-[#14cec3]/30" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] text-white shadow-sm">
                  <inn.icon className="w-6 h-6" />
                </div>
                {inn.premium && (
                  <span className="flex items-center space-x-1 bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{t("home.premiumOnly")}</span>
                  </span>
                )}
              </div>
              <h3 className="font-sans font-bold text-slate-800 text-lg mt-5 leading-snug">{inn.title}</h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">{inn.desc}</p>
              <ul className="mt-5 space-y-2.5 pt-4 border-t border-slate-50">
                {inn.highlights.map((h, j) => (
                  <li key={j} className="flex items-start space-x-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-slate-800">{t("home.howTitle")}</h2>
          <p className="text-slate-500 text-sm mt-2">{t("home.howDesc")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0fb3a9] text-white flex items-center justify-center font-sans font-bold text-lg shrink-0">
                  {i + 1}
                </div>
                <div className="p-2.5 rounded-xl bg-teal-50 text-[#0fb3a9]">
                  <step.icon className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-sans font-bold text-slate-800 text-base mt-4">{step.title}</h3>
              <p className="text-slate-500 text-xs mt-2 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] rounded-3xl p-8 sm:p-12 text-white text-center">
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="font-sans text-2xl sm:text-3xl font-bold">{t("home.ctaTitle")}</h2>
          <p className="text-teal-100/90 text-sm mt-3 leading-relaxed">{t("home.ctaDesc")}</p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              onClick={() => onNavigate("dashboard")}
              className="flex items-center space-x-2 bg-white text-[#0fb3a9] hover:bg-slate-100 font-bold text-sm px-6 py-3.5 rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>{t("home.ctaStart2")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenPremium}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 py-3.5 rounded-xl border border-white/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>{t("home.ctaPremium")}</span>
            </button>
          </div>
        </div>
        <div className="absolute -left-16 -bottom-16 w-72 h-72 bg-white/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute -right-10 -top-10 w-56 h-56 bg-white/5 blur-3xl rounded-full pointer-events-none"></div>
      </section>
    </div>
  );
}
