import React, { useState } from "react";
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
    if (cat.includes("normal")) return "bg-emerald-500";
    if (cat.includes("surpoids")) return "bg-amber-500";
    if (cat.includes("obésité")) return "bg-rose-500";
    return "bg-blue-500"; // maigreur
  };

  const getImportanceColor = (imp: string) => {
    const val = imp.toLowerCase();
    if (val.includes("haut") || val.includes("urg")) return "bg-red-50 text-red-700 border-red-100";
    if (val.includes("moy")) return "bg-amber-50 text-amber-700 border-amber-100";
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Upper Layout: Profile Form & Diagnostic triggers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card Summary & Edit */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-sans font-bold text-lg text-[#064E3B]">Profil de Santé</h3>
              <p className="text-slate-400 text-xs">Vos paramètres physiques</p>
            </div>
            {!editing && (
              <button
                id="btn-edit-profile"
                onClick={() => setEditing(true)}
                className="text-xs font-semibold text-[#064E3B] hover:text-[#043427] px-3 py-1.5 bg-[#064E3B]/10 hover:bg-[#064E3B]/15 rounded-lg transition-all"
              >
                Modifier
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Âge</label>
                  <input
                    type="number"
                    value={localProfile.age}
                    onChange={(e) => setLocalProfile({ ...localProfile, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Genre</label>
                  <select
                    value={localProfile.gender}
                    onChange={(e) => setLocalProfile({ ...localProfile, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Femme">Femme</option>
                    <option value="Homme">Homme</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Taille (cm)</label>
                  <input
                    type="number"
                    value={localProfile.height}
                    onChange={(e) => setLocalProfile({ ...localProfile, height: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Poids (kg)</label>
                  <input
                    type="number"
                    value={localProfile.weight}
                    onChange={(e) => setLocalProfile({ ...localProfile, weight: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tension Max (Sys)</label>
                  <input
                    type="number"
                    value={localProfile.systolic}
                    onChange={(e) => setLocalProfile({ ...localProfile, systolic: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tension Min (Dia)</label>
                  <input
                    type="number"
                    value={localProfile.diastolic}
                    onChange={(e) => setLocalProfile({ ...localProfile, diastolic: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Préférence Alimentaire</label>
                <select
                  value={localProfile.dietPreference}
                  onChange={(e) => setLocalProfile({ ...localProfile, dietPreference: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Omnivore">Omnivore</option>
                  <option value="Végétarien">Végétarien</option>
                  <option value="Végétalien">Végétalien</option>
                  <option value="Sans Gluten">Sans Gluten</option>
                  <option value="Kéto">Régime Kéto</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Activité Physique</label>
                <select
                  value={localProfile.activeLevel}
                  onChange={(e) => setLocalProfile({ ...localProfile, activeLevel: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Sédentaire">Sédentaire</option>
                  <option value="Modéré">Activité modérée (marche, yoga)</option>
                  <option value="Très Actif">Activité intense (sport régulier)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Maladies / Antécédents</label>
                <input
                  type="text"
                  placeholder="ex: Tension élevée, Asthme..."
                  value={localProfile.chronicConditions}
                  onChange={(e) => setLocalProfile({ ...localProfile, chronicConditions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Symptômes actuels</label>
                <textarea
                  rows={2}
                  placeholder="ex: Fatigue chronique, maux de gorge..."
                  value={localProfile.symptoms}
                  onChange={(e) => setLocalProfile({ ...localProfile, symptoms: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  Annuler
                </button>
                <button
                  type="submit"
                  id="btn-save-profile"
                  className="w-1/2 py-2 bg-[#064E3B] hover:bg-[#043427] text-white font-semibold text-xs rounded-xl shadow-sm"
                >
                  Appliquer
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 text-xs">Genre / Âge</span>
                  <p className="font-semibold text-slate-800">{profile.gender}, {profile.age} ans</p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">Mensurations</span>
                  <p className="font-semibold text-slate-800">{profile.height} cm, {profile.weight} kg</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 text-xs">Tension de base</span>
                  <p className="font-semibold text-slate-800">{profile.systolic}/{profile.diastolic} mmHg</p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">Alimentation</span>
                  <p className="font-semibold text-slate-800">{profile.dietPreference}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 text-xs">Pathologies déclarées</span>
                <p className="font-semibold text-slate-800 mt-0.5">{profile.chronicConditions || "Aucune maladie déclarée"}</p>
              </div>

              <div className="pt-2">
                <span className="text-slate-400 text-xs">Symptômes décrits</span>
                <p className="font-medium text-slate-700 mt-0.5 italic">{profile.symptoms ? `"${profile.symptoms}"` : "Aucun symptôme actuel"}</p>
              </div>

              <div className="pt-4">
                <button
                  id="btn-trigger-ai-analysis"
                  onClick={triggerAnalysis}
                  disabled={isAnalyzing}
                  className="w-full flex items-center justify-center space-x-2 bg-[#064E3B] hover:bg-[#043427] text-white py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyse IA en cours...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span>Lancer l'Analyse Médicale IA</span>
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
            <h3 className="font-sans font-bold text-lg text-[#064E3B] flex items-center space-x-2">
              <Dna className="w-5 h-5 text-[#10B981]" />
              <span>Comment fonctionne l'analyse CEan'sCare ?</span>
            </h3>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              CEan'sCare combine la puissance du modèle de pointe de Google, <strong>Gemini 3.5 Flash</strong>, avec l'expertise combinée de la physiologie humaine, de la nutrition clinique et de la phytothérapie (médecine par les plantes).
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Options Thérapeutiques</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Alternatives allopathiques, homéopathiques et phytothérapeutiques</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Médecine Douce</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Recettes de tisanes, plantes adaptogènes et régulation métabolique</p>
                </div>
              </div>
            </div>
          </div>

          {/* Loader/Animation during analysis */}
          {isAnalyzing && (
            <div className="flex-1 bg-[#064E3B] text-white p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <Loader2 className="w-12 h-12 text-[#10B981] animate-spin mx-auto mb-4" />
                <h4 className="font-sans font-bold text-lg text-emerald-300">Séquençage des données physiologiques...</h4>
                <div className="max-w-md mx-auto space-y-1 text-xs text-slate-300 mt-3 font-mono">
                  <p className="animate-pulse">▶ Calcul de l'Indice de Masse Corporelle (IMC)... OK</p>
                  <p className="animate-pulse delay-75">▶ Analyse systolique / diastolique... OK</p>
                  <p className="animate-pulse delay-150">▶ Corrélation avec la base de phytothérapie... EN COURS</p>
                  <p className="animate-pulse delay-300">▶ Structuration des options thérapeutiques personnalisées... EN COURS</p>
                </div>
              </div>
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-500/10 blur-2xl pointer-events-none rounded-full"></div>
            </div>
          )}

          {!isAnalyzing && !analysisResult && (
            <div className="flex-1 border-2 border-dashed border-slate-200 p-8 rounded-3xl flex flex-col items-center justify-center text-center text-slate-400">
              <ShieldAlert className="w-12 h-12 text-slate-300 mb-3" />
              <p className="font-sans font-semibold text-slate-500">Aucun rapport d'analyse actif</p>
              <p className="text-xs max-w-sm mt-1">
                Remplissez vos paramètres à gauche et cliquez sur le bouton pour générer votre bilan de santé personnalisé par IA.
              </p>
            </div>
          )}

          {!isAnalyzing && analysisResult && (
            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl flex items-start space-x-3 text-emerald-800 text-xs leading-relaxed">
              <AlertTriangle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase tracking-wider block text-[10px] text-emerald-600 mb-1">Clause de non-responsabilité médicale</span>
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
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Indice de Masse Corporelle (IMC)</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-extrabold font-sans text-[#064E3B]">{analysisResult.bmi}</span>
                  <span className="text-xs text-slate-400 font-bold">kg/m²</span>
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
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Bilan des Constantes Vitales</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <h5 className="text-xs font-bold text-slate-600 flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>Tension Artérielle</span>
                    </h5>
                    <p className="text-xs text-slate-500 mt-1">{analysisResult.constantsAnalysis.bloodPressureText}</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-600 flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span>Rythme Cardiaque</span>
                    </h5>
                    <p className="text-xs text-slate-500 mt-1">{analysisResult.constantsAnalysis.heartRateText}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Synthèse Globale</span>
                <p className="text-sm font-medium text-slate-700 mt-1 leading-relaxed">{analysisResult.generalAssessment}</p>
              </div>
            </div>
          </div>

          {/* Treatment Options Grid - Incurable or Chronic wellness management */}
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-xl text-[#064E3B] flex items-center space-x-2">
              <Stethoscope className="w-5 h-5 text-[#064E3B]" />
              <span>Options Thérapeutiques & Pistes de Traitement</span>
            </h3>
            <p className="text-slate-400 text-xs">
              Découvrez des approches intégratives unissant médecine moderne et savoirs thérapeutiques naturels pour soutenir l'auto-guérison de votre organisme.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {analysisResult.treatmentOptions.map((opt, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <span className="inline-block bg-[#064E3B]/10 text-[#064E3B] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded mb-3">
                      {opt.category}
                    </span>
                    <h4 className="font-sans font-bold text-slate-800 text-base">{opt.title}</h4>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">{opt.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-50 text-xs text-slate-400 italic">
                    <strong>Contexte scientifique :</strong> {opt.scientificContext}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personalized Tips & Dietary Focus */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Advice Tips */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
              <h4 className="font-sans font-bold text-[#064E3B] text-base">Conseils Pratiques Personnalisés</h4>
              <div className="space-y-4">
                {analysisResult.personalizedTips.map((tip, i) => (
                  <div key={i} className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="p-1.5 rounded-full bg-[#10B981] text-white shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h5 className="text-sm font-bold text-slate-800">{tip.title}</h5>
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${getImportanceColor(tip.importance)}`}>
                          Priorité {tip.importance}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dietary Focus */}
            <div className="bg-[#064E3B] text-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <Utensils className="w-8 h-8 text-emerald-300 mb-4" />
                <h4 className="font-sans font-bold text-lg text-emerald-300">Ajustements Nutritionnels</h4>
                <p className="text-emerald-100/90 text-sm mt-3 leading-relaxed">
                  {analysisResult.dietaryFocus}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-emerald-200 font-semibold flex items-center space-x-1 relative z-10">
                <span>Consulter vos menus suggérés</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
              <div className="absolute -right-16 -bottom-16 w-44 h-44 rounded-full bg-emerald-500/10 blur-2xl"></div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
