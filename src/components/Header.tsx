import React from "react";
import { Heart, Activity, CalendarDays, MessageSquare, Award, Sparkles, User, Users, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isPremium: boolean;
  setShowPremiumModal: (show: boolean) => void;
}

export default function Header({ activeTab, setActiveTab, isPremium, setShowPremiumModal }: HeaderProps) {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navItems = [
    { id: "dashboard", label: t("nav.dashboard"), icon: Activity },
    { id: "analysis", label: t("nav.analysis"), icon: Heart },
    { id: "mealplan", label: t("nav.mealplan"), icon: CalendarDays },
    { id: "consultation", label: t("nav.consultation"), icon: MessageSquare },
    { id: "partners", label: t("nav.partners"), icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E2E8F0] px-4 sm:px-6 lg:px-10 shrink-0">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
            <div className="w-10 h-10 bg-[#064E3B] rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-sans text-2xl font-bold tracking-tight text-[#064E3B]">
                CEan's<span className="text-[#10B981]">Care</span>
              </h1>
              <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                {t("header.tagline")}
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Desktop */}
          <nav className="hidden lg:flex gap-8 items-center">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`text-sm pb-1 transition-all ${
                    isActive
                      ? "font-semibold text-[#064E3B] border-b-2 border-[#10B981]"
                      : "font-medium text-slate-500 hover:text-[#064E3B]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Language Switcher */}
          <div className="relative group">
            <button
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-[#064E3B] hover:border-[#064E3B] text-xs font-medium transition-all"
            >
              <Languages className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("language." + i18n.language.substring(0, 2))}</span>
            </button>
            <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
              {["fr", "en", "de", "es"].map((lng) => (
                <button
                  key={lng}
                  onClick={() => changeLanguage(lng)}
                  className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${
                    i18n.language.substring(0, 2) === lng
                      ? "bg-emerald-50 text-[#064E3B] font-bold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t("language." + lng)}
                </button>
              ))}
            </div>
          </div>

          {/* Premium Status & Subscription CTA & Profile */}
          <div className="flex items-center gap-4">
            {isPremium ? (
              <div className="hidden sm:flex items-center space-x-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-xs font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>{t("header.premiumBadge")}</span>
              </div>
            ) : (
              <button
                id="btn-subscribe-header"
                onClick={() => setShowPremiumModal(true)}
                className="flex items-center space-x-1 bg-[#064E3B] hover:bg-[#043427] text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>{t("header.subscribe")}</span>
              </button>
            )}

            {/* Profile Avatar Widget */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  {isPremium ? t("header.premiumMember") : t("header.standardMember")}
                </p>
                <p className="text-xs font-semibold text-slate-800">Camille Bbm</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#E2E8F0] border-2 border-white shadow-sm flex items-center justify-center text-[#064E3B] font-bold font-sans">
                C
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Mobile (Scroller) */}
        <div className="lg:hidden flex items-center space-x-2 overflow-x-auto py-3 -mx-4 px-4 scrollbar-none border-t border-slate-100">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-mobile-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#064E3B] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
