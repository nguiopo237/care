import React from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck, FileText, Lock, X, Info } from "lucide-react";

interface LegalModalProps {
  mode: "privacy" | "terms";
  onClose: () => void;
}

interface LegalSection {
  title: string;
  body: string;
}

export default function LegalModal({ mode, onClose }: LegalModalProps) {
  const { t } = useTranslation();
  const isPrivacy = mode === "privacy";
  const sections = t(`legal.${isPrivacy ? "privacySections" : "termsSections"}`, { returnObjects: true }) as LegalSection[];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex overflow-y-auto p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl m-auto overflow-hidden border border-slate-100 animate-scale-up">
        {/* Header */}
        <div className="bg-[#0fb3a9] p-6 text-white relative flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              {isPrivacy ? (
                <ShieldCheck className="w-6 h-6 text-teal-300" />
              ) : (
                <FileText className="w-6 h-6 text-teal-300" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-sans font-bold text-lg leading-tight truncate">
                {isPrivacy ? t("legal.privacyTitle") : t("legal.termsTitle")}
              </h3>
              <p className="text-teal-200/90 text-[11px] mt-0.5">{t("legal.updated")}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition cursor-pointer shrink-0"
            aria-label={t("common.close")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="flex items-start space-x-2 p-3 bg-teal-50 border border-teal-100 rounded-xl text-teal-800 text-xs">
            <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{t("legal.note")}</span>
          </div>

          {sections.map((section, i) => (
            <div key={i}>
              <h4 className="font-sans font-bold text-slate-800 text-sm mb-1.5">{section.title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center space-x-1.5 text-[9px] text-slate-400">
            <Lock className="w-3.5 h-3.5 text-[#0fb3a9]" />
            <span>{t("legal.title")} — CEan'sCare</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] hover:from-[#0fb3a9] hover:to-[#0d9488] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
