import React, { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { 
  Heart, 
  Activity, 
  ShieldAlert, 
  AlertTriangle, 
  Sparkles, 
  UserPlus, 
  Dna, 
  ChevronRight, 
  Leaf, 
  Stethoscope, 
  Utensils, 
  CheckCircle2, 
  Loader2 
} from "lucide-react";
import { UserProfile, HealthAnalysisResult } from "../types";

interface HealthAnalysisProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  analysisResult: HealthAnalysisResult | null;
  onRunAnalysis: () => Promise<void>;
  isAnalyzing: boolean;
}

export default function HealthAnalysis({ 
  profile, 
  onUpdateProfile, 
  analysisResult, 
  onRunAnalysis, 
  isAnalyzing 
}: HealthAnalysisProps) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [localProfile, setLocalProfile] = useState<UserProfile>({ ...profile });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(localProfile);
    setEditing(false);
  };

  const triggerAnalysis = async () => {
    // Run live Gemini analysis through Express backend
    await onRunAnalysis();
  };

  const getBmiBg = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("normal")) return "bg-teal-500";
    if (cat.includes("surpoids")) return "bg-amber-500";
    if (cat.includes("obésité")) return "bg-rose-500";
    return "bg-blue-500"; // maigreur
  };

  const getImportanceColor = (imp: string) => {
    const val = imp.toLowerCase();
    if (val.includes("haut") || val.includes("urg")) return "bg-red-50 text-red-700 border-red-100";
    if (val.includes("moy")) return "bg-amber-50 text-amber-700 border-amber-100";
    return "bg-teal-50 text-teal-700 border-teal-100";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Upper Layout: Profile Form & Diagnostic triggers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card Summary & Edit */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-sans font-bold text-lg text-[#0fb3a9]">{t("analysis.profileTitle")}</h3>
              <p className="text-slate-400 text-xs">{t("analysis.profileSubtitle")}</p>
            </div>
            {!editing && (
              <button
                id="btn-edit-profile"
                onClick={() => setEditing(true)}
                className="text-xs font-semibold text-[#0fb3a9] hover:text-[#0d9488] px-3 py-1.5 bg-[#0fb3a9]/10 hover:bg-[#0fb3a9]/15 rounded-lg transition-all"
              >
                {t("analysis.editButton")}
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("analysis.age")}</label>
                  <input
                    type="number"
                    value={localProfile.age}
                    onChange={(e) => setLocalProfile({ ...localProfile, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("analysis.gender")}</label>
                  <select
                    value={localProfile.gender}
                    onChange={(e) => setLocalProfile({ ...localProfile, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Femme">{t("analysis.genderF")}</option>
                    <option value="Homme">{t("analysis.genderM")}</option>
                    <option value="Autre">{t("analysis.genderO")}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("analysis.height")}</label>
                  <input
                    type="number"
                    value={localProfile.height}
                    onChange={(e) => setLocalProfile({ ...localProfile, height: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("analysis.weight")}</label>
                  <input
                    type="number"
                    value={localProfile.weight}
                    onChange={(e) => setLocalProfile({ ...localProfile, weight: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("analysis.systolic")}</label>
                  <input
                    type="number"
                    value={localProfile.systolic}
                    onChange={(e) => setLocalProfile({ ...localProfile, systolic: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("analysis.diastolic")}</label>
                  <input
                    type="number"
                    value={localProfile.diastolic}
                    onChange={(e) => setLocalProfile({ ...localProfile, diastolic: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("analysis.diet")}</label>
                <select
                  value={localProfile.dietPreference}
                  onChange={(e) => setLocalProfile({ ...localProfile, dietPreference: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Omnivore">{t("analysis.dietOmnivore")}</option>
                  <option value="Végétarien">{t("analysis.dietVegetarian")}</option>
                  <option value="Végétalien">{t("analysis.dietVegan")}</option>
                  <option value="Sans Gluten">{t("analysis.dietGlutenFree")}</option>
                  <option value="Kéto">{t("analysis.dietKeto")}</option>
                </select>
              </div>

              <div>                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("analysis.activity")}</label>
                <select
                  value={localProfile.activeLevel}
                  onChange={(e) => setLocalProfile({ ...localProfile, activeLevel: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Sédentaire">{t("analysis.activitySedentary")}</option>
                  <option value="Modéré">{t("analysis.activityModerate")}</option>
                  <option value="Très Actif">{t("analysis.activityActive")}</option>
                </select>
              </div>

              <div>                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("analysis.conditions")}</label>
                <input
                  type="text"
                  placeholder={t("analysis.conditionsPlaceholder")}
                  value={localProfile.chronicConditions}
                  onChange={(e) => setLocalProfile({ ...localProfile, chronicConditions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("analysis.symptoms")}</label>
                <textarea
                  rows={2}
                  placeholder={t("analysis.symptomsPlaceholder")}
                  value={localProfile.symptoms}
                  onChange={(e) => setLocalProfile({ ...localProfile, symptoms: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  id="btn-cancel-profile"
                  onClick={() => {
                    setLocalProfile({ ...profile });
                    setEditing(false);
                  }}
                  className="w-1/2 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  id="btn-save-profile"
                  className="w-1/2 py-2 bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] hover:from-[#0fb3a9] hover:to-[#0d9488] text-white font-semibold text-xs rounded-xl shadow-sm"
                >
                  {t("common.apply")}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 text-xs">{t("analysis.viewGenderAge")}</span>
                  <p className="font-semibold text-slate-800">{profile.gender}, {profile.age} {t("common.years")}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">{t("analysis.viewMeasurements")}</span>
                  <p className="font-semibold text-slate-800">{profile.height} cm, {profile.weight} kg</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 text-xs">{t("analysis.viewBP")}</span>
                  <p className="font-semibold text-slate-800">{profile.systolic}/{profile.diastolic} mmHg</p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">{t("analysis.viewDiet")}</span>
                  <p className="font-semibold text-slate-800">{profile.dietPreference}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 text-xs">{t("analysis.viewConditions")}</span>
                <p className="font-semibold text-slate-800 mt-0.5">{profile.chronicConditions || t("analysis.viewNoConditions")}</p>
              </div>

              <div className="pt-2">
                <span className="text-slate-400 text-xs">{t("analysis.viewSymptoms")}</span>
                <p className="font-medium text-slate-700 mt-0.5 italic">{profile.symptoms ? `"${profile.symptoms}"` : t("analysis.viewNoSymptoms")}</p>
              </div>

              <div className="pt-4">
                <button
                  id="btn-trigger-ai-analysis"
                  onClick={triggerAnalysis}
                  disabled={isAnalyzing}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] hover:from-[#0fb3a9] hover:to-[#0d9488] text-white py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t("analysis.analyzing")}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span>{t("analysis.launchAnalysis")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Informative Guidance & Bio-scanning simulation */}
        <div className="lg:col-span-2 flex flex-col justify-between space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <h3 className="font-sans font-bold text-lg text-[#0fb3a9] flex items-center space-x-2">
              <Dna className="w-5 h-5 text-[#14cec3]" />
              <span>{t("analysis.howItWorksTitle")}</span>
            </h3>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              <Trans i18nKey="analysis.howItWorksDesc" />
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700">{t("analysis.therapyOptions")}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{t("analysis.therapyDesc")}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700">{t("analysis.gentleMedicine")}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{t("analysis.gentleDesc")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Loader/Animation during analysis */}
          {isAnalyzing && (
            <div className="flex-1 bg-[#0fb3a9] text-white p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <Loader2 className="w-12 h-12 text-[#14cec3] animate-spin mx-auto mb-4" />
                <h4 className="font-sans font-bold text-lg text-teal-300">{t("analysis.analyzingTitle")}</h4>
                <div className="max-w-md mx-auto space-y-1 text-xs text-slate-300 mt-3 font-mono">
                  <p className="animate-pulse">{t("analysis.analyzingBMI")}</p>
                  <p className="animate-pulse delay-75">{t("analysis.analyzingBP")}</p>
                  <p className="animate-pulse delay-150">{t("analysis.analyzingPhyto")}</p>
                  <p className="animate-pulse delay-300">{t("analysis.analyzingTherapy")}</p>
                </div>
              </div>
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-teal-500/10 blur-2xl pointer-events-none rounded-full"></div>
            </div>
          )}

          {!isAnalyzing && !analysisResult && (
            <div className="flex-1 border-2 border-dashed border-slate-200 p-8 rounded-3xl flex flex-col items-center justify-center text-center text-slate-400">
              <ShieldAlert className="w-12 h-12 text-slate-300 mb-3" />
              <p className="font-sans font-semibold text-slate-500">{t("analysis.noReport")}</p>
              <p className="text-xs max-w-sm mt-1">{t("analysis.noReportDesc")}</p>
            </div>
          )}

          {!isAnalyzing && analysisResult && (
            <div className="bg-teal-50 border border-teal-100 p-5 rounded-3xl flex items-start space-x-3 text-teal-800 text-xs leading-relaxed">
              <AlertTriangle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase tracking-wider block text-[10px] text-teal-600 mb-1">{t("analysis.disclaimerTitle")}</span>
                {analysisResult.disclaimer}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lower Layout: Complete Diagnostic Results Display */}
      {!isAnalyzing && analysisResult && (
        <div className="space-y-8 animate-scale-up">
          
          {/* Constant Summary (BMI and Core metrics evaluation) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* BMI gauge */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">{t("analysis.bmiTitle")}</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-extrabold font-sans text-[#0fb3a9]">{analysisResult.bmi}</span>
                  <span className="text-xs text-slate-400 font-bold">{t("analysis.bmiUnit")}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50">
                <span className={`inline-block text-white text-xs font-bold px-3 py-1 rounded-full ${getBmiBg(analysisResult.bmiCategory)}`}>
                  {analysisResult.bmiCategory}
                </span>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{analysisResult.constantsAnalysis.bmiText}</p>
              </div>
            </div>

            {/* Blood Pressure evaluation */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] md:col-span-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">{t("analysis.vitalsTitle")}</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <h5 className="text-xs font-bold text-slate-600 flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>{t("analysis.bpLabel")}</span>
                    </h5>
                    <p className="text-xs text-slate-500 mt-1">{analysisResult.constantsAnalysis.bloodPressureText}</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-600 flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span>{t("analysis.hrLabel")}</span>
                    </h5>
                    <p className="text-xs text-slate-500 mt-1">{analysisResult.constantsAnalysis.heartRateText}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("analysis.globalSummary")}</span>
                <p className="text-sm font-medium text-slate-700 mt-1 leading-relaxed">{analysisResult.generalAssessment}</p>
              </div>
            </div>
          </div>

          {/* Treatment Options Grid - Incurable or Chronic wellness management */}
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-xl text-[#0fb3a9] flex items-center space-x-2">
              <Stethoscope className="w-5 h-5 text-[#0fb3a9]" />
              <span>{t("analysis.therapySectionTitle")}</span>
            </h3>
            <p className="text-slate-400 text-xs">
              {t("analysis.therapySectionDesc")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {analysisResult.treatmentOptions.map((opt, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <span className="inline-block bg-[#0fb3a9]/10 text-[#0fb3a9] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded mb-3">
                      {opt.category}
                    </span>
                    <h4 className="font-sans font-bold text-slate-800 text-base">{opt.title}</h4>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">{opt.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-50 text-xs text-slate-400 italic">
                    <strong>{t("analysis.scientificContext")}</strong> {opt.scientificContext}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personalized Tips & Dietary Focus */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Advice Tips */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
              <h4 className="font-sans font-bold text-[#0fb3a9] text-base">{t("analysis.tipsTitle")}</h4>
              <div className="space-y-4">
                {analysisResult.personalizedTips.map((tip, i) => (
                  <div key={i} className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="p-1.5 rounded-full bg-[#14cec3] text-white shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h5 className="text-sm font-bold text-slate-800">{tip.title}</h5>
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${getImportanceColor(tip.importance)}`}>
                          {t("analysis.priority", { level: tip.importance })}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dietary Focus */}
            <div className="bg-[#0fb3a9] text-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <Utensils className="w-8 h-8 text-teal-300 mb-4" />
                <h4 className="font-sans font-bold text-lg text-teal-300">{t("analysis.nutritionTitle")}</h4>
                <p className="text-teal-100/90 text-sm mt-3 leading-relaxed">
                  {analysisResult.dietaryFocus}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-teal-200 font-semibold flex items-center space-x-1 relative z-10">
                <span>{t("analysis.viewMenus")}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
              <div className="absolute -right-16 -bottom-16 w-44 h-44 rounded-full bg-teal-500/10 blur-2xl"></div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
