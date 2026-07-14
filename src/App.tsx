import React, { useState, useEffect, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { UserProfile, HealthAnalysisResult, MealPlanResult, HealthLog } from "./types";
import Header from "./components/Header";

// Lazy-loaded route components — they are split into separate chunks
const Dashboard = lazy(() => import("./components/Dashboard"));
const HealthAnalysis = lazy(() => import("./components/HealthAnalysis"));
const MealPlanner = lazy(() => import("./components/MealPlanner"));
const AIConsultation = lazy(() => import("./components/AIConsultation"));
const PartnersDirectory = lazy(() => import("./components/PartnersDirectory"));
const PremiumPricing = lazy(() => import("./components/PremiumPricing"));

const PageLoader = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#064E3B] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400 font-medium">{t("common.loading")}</span>
      </div>
    </div>
  );
};

// Backdated logs generator helper
const generateInitialLogs = (): HealthLog[] => {
  return [
    { id: "1", date: "2026-07-08", weight: 63.1, systolic: 118, diastolic: 76, heartRate: 72, waterIntake: 1500, sleep: 6.5, activityMinutes: 20 },
    { id: "2", date: "2026-07-09", weight: 62.8, systolic: 116, diastolic: 74, heartRate: 70, waterIntake: 1750, sleep: 7.0, activityMinutes: 30 },
    { id: "3", date: "2026-07-10", weight: 62.5, systolic: 115, diastolic: 75, heartRate: 69, waterIntake: 2000, sleep: 7.5, activityMinutes: 45 },
    { id: "4", date: "2026-07-11", weight: 62.2, systolic: 114, diastolic: 74, heartRate: 68, waterIntake: 2250, sleep: 8.0, activityMinutes: 30 },
    { id: "5", date: "2026-07-12", weight: 62.0, systolic: 115, diastolic: 75, heartRate: 68, waterIntake: 2500, sleep: 7.5, activityMinutes: 35 },
  ];
};

// Exquisite starting health report for Camille (28, 168cm, 62kg)
const getInitialAnalysis = (): HealthAnalysisResult => {
  return {
    bmi: 22.0,
    bmiCategory: "Poids normal",
    constantsAnalysis: {
      bmiText: "Votre Indice de Masse Corporelle (IMC) est de 22.0, ce qui correspond à une corpulence parfaitement équilibrée et un poids de forme optimal pour votre taille.",
      bloodPressureText: "Votre tension artérielle moyenne de 115/75 mmHg est considérée comme idéale et témoigne d'une excellente santé cardiovasculaire et artérielle.",
      heartRateText: "Votre rythme cardiaque de 68 bpm au repos est d'une grande stabilité, signe d'un muscle cardiaque tonique et d'un bon niveau d'endurance générale."
    },
    generalAssessment: "Votre bilan physiologique général montre une excellente vitalité de base. Vos paramètres fondamentaux (poids, tension, pouls) sont optimaux. Votre asthme léger est parfaitement compensé par votre capacité cardio-respiratoire générale. La digestion occasionnellement ralentie rapportée mérite des réajustements enzymatiques simples par l'alimentation saine.",
    treatmentOptions: [
      {
        category: "Médecine conventionnelle",
        title: "Suivi Asthmatologique & Broncho-protection",
        description: "Poursuivez l'utilisation de votre bronchodilatateur classique uniquement en cas de crise ou d'effort intense prévisible. Faites un test de spirométrie annuel chez votre médecin traitant.",
        scientificContext: "Garantit la sécurité respiratoire face aux variations allergiques saisonnières."
      },
      {
        category: "Phytothérapie & Aromathérapie",
        title: "Tisanes de Romarin & Huile Essentielle d'Estragon",
        description: "Consommez une infusion de romarin bio après le déjeuner pour stimuler la bile et accélérer la digestion. Pour l'asthme, massez une goutte d'huile essentielle d'estragon diluée dans de l'huile de jojoba sur le thorax lors d'oppressions nerveuses.",
        scientificContext: "Le romarin possède des flavonoïdes spasmolytiques digestifs. L'estragon agit comme un puissant antispasmodique neuromusculaire naturel."
      },
      {
        category: "Nutrition Fonctionnelle",
        title: "Suppression des Aliments Pro-inflammatoires",
        description: "Favorisez les acides gras oméga-3 (huile de colza, noix, petits poissons gras) qui calment l'inflammation des bronches. Réduisez les produits laitiers industriels le soir pour limiter le mucus respiratoire.",
        scientificContext: "Les oméga-3 sont des précurseurs des résolvines, limitant l'hyperréactivité bronchique."
      },
      {
        category: "Mode de vie",
        title: "Technique respiratoire de Buteyko & Cohérence Cardiaque",
        description: "Pratiquez 5 minutes de cohérence cardiaque (respiration rythmée 5s inspiration / 5s expiration) le matin pour stabiliser le système nerveux autonome et détendre les muscles respiratoires.",
        scientificContext: "Améliore l'oxygénation cellulaire globale et régule le tonus vagal digestif."
      }
    ],
    personalizedTips: [
      { title: "Boire de l'eau tiède le matin", description: "Un grand verre d'eau tiède purifiée au réveil réactive les intestins en douceur et régule l'acidité gastrique.", importance: "Haute" },
      { title: "Consommer du gingembre frais", description: "Intégrez du gingembre râpé dans vos plats ou tisanes pour dynamiser votre feu digestif et calmer d'éventuels maux de tête légers.", importance: "Moyenne" },
      { title: "Marche rapide en plein air", description: "Profitez de 20 minutes de marche quotidienne à l'air pur pour stimuler la ventilation alvéolaire de vos poumons.", importance: "Préventive" }
    ],
    dietaryFocus: "Accentuez l'apport en légumes cuits à la vapeur, épices digestives (curcuma, fenouil) et limitez le gluten raffiné pour accélérer le transit intestinal tout en éliminant les maux de tête.",
    disclaimer: "CEan'sCare est un assistant d'accompagnement bien-être intelligent. Les pistes thérapeutiques fournies le sont à titre informatif et d'hygiène de vie générale. Consultez toujours votre médecin traitant pour toute modification de traitement médical."
  };
};

// Exquisite starting 7-day meal plan
const getInitialMealPlan = (): MealPlanResult => {
  return {
    weeklySummary: "Un plan de repas anti-inflammatoire et digeste riche en antioxydants, herbes aromatiques et protéines légères pour optimiser la digestion de Camille et soutenir son tonus pulmonaire.",
    dailyTargetCalories: 1850,
    macronutrientsRatio: { carbs: "45%", proteins: "25%", fats: "30%" },
    days: [
      {
        dayName: "Lundi",
        breakfast: { title: "Porridge d'avoine au lait d'amande", description: "Garni de graines de chia, de myrtilles bio fraîches et d'une pincée de cannelle thérapeutique.", nutritionalValue: "420 kcal | Fibres et antioxydants" },
        lunch: { title: "Salade de quinoa et avocat", description: "Mélange de quinoa cuit, cubes d'avocat, concombre, pousses d'épinards, arrosé d'huile d'olive de première pression à froid.", nutritionalValue: "550 kcal | Bons lipides oméga-9" },
        snack: { title: "Infusion de gingembre et amandes", description: "Une poignée d'amandes brutes bio accompagnée d'une tisane de gingembre frais au citron.", nutritionalValue: "180 kcal | Magnésium et énergie" },
        dinner: { title: "Filet de cabillaud à la vapeur et courgettes", description: "Filet de poisson blanc parfumé à l'aneth, courgettes et carottes vapeur, filet d'huile de colza.", nutritionalValue: "380 kcal | Protéines légères et digestes" }
      },
      {
        dayName: "Mardi",
        breakfast: { title: "Smoothie vert détoxifiant", description: "Épinards frais, banane mûre, protéines de chanvre bio, lait d'avoine sans gluten et purée d'amande.", nutritionalValue: "390 kcal | Chlorophylle revitalisante" },
        lunch: { title: "Poulet grillé au thym et patates douces", description: "Blanc de poulet fermier rôti, écrasé de patate douce à la coriandre et brocolis rôtis.", nutritionalValue: "580 kcal | Bêta-carotène et protéines musculaires" },
        snack: { title: "Compote de pommes maison sans sucre", description: "Compote tiède saupoudrée de cardamome digestive.", nutritionalValue: "110 kcal | Pectine pour la flore intestinale" },
        dinner: { title: "Velouté de potimarron au lait de coco", description: "Soupe onctueuse parfumée au curcuma anti-inflammatoire, servie avec des graines de courge grillées.", nutritionalValue: "340 kcal | Souper léger favorisant le sommeil" }
      },
      {
        dayName: "Mercredi",
        breakfast: { title: "Pain au levain & Purée d'avocat", description: "Deux tranches de pain d'épeautre biologique au levain naturel, avocat écrasé et graines de sésame noir.", nutritionalValue: "440 kcal | Énergie de longue durée" },
        lunch: { title: "Pavé de saumon sauvage et riz noir", description: "Saumon grillé unilatéral, riz vénéré et asperges vertes sautées à l'huile de coco.", nutritionalValue: "610 kcal | Acides gras oméga-3 essentiels" },
        snack: { title: "Yaourt de coco et graines de lin", description: "Yaourt végétal de coco bio parsemé de graines de lin fraîchement moulues.", nutritionalValue: "150 kcal | Prébiotiques et fibres" },
        dinner: { title: "Poêlée de tofu bio et légumes croquants", description: "Tofu mariné au tamari et gingembre, sauté de poivrons, carottes et champignons shiitaké.", nutritionalValue: "360 kcal | Protéines végétales légères" }
      },
      {
        dayName: "Jeudi",
        breakfast: { title: "Œufs pochés et épinards sautés", description: "Deux œufs bio Label Rouge, lit de jeunes pousses d'épinards flétries à l'ail.", nutritionalValue: "380 kcal | Choline pour le cerveau" },
        lunch: { title: "Sardines à l'huile et salade de lentilles", description: "Sardines entières (riches en calcium et oméga-3) servies sur lit de lentilles vertes du Puy tièdes.", nutritionalValue: "520 kcal | Fer assimilable et oligo-éléments" },
        snack: { title: "Noix de Grenoble et thé vert Matcha", description: "Quelques cerneaux de noix fraîche de saison avec un bol de matcha antioxydant.", nutritionalValue: "170 kcal | Polyphénols protecteurs" },
        dinner: { title: "Mijoté de légumes d'antan", description: "Panais, navets boules d'or et céleri rave mijotés au bouillon d'herbes aromatiques digestives.", nutritionalValue: "310 kcal | Index glycémique bas" }
      },
      {
        dayName: "Vendredi",
        breakfast: { title: "Pudding de chia au lait de cajou", description: "Graines de chia gonflées au lait de cajou bio maison, purée de framboises sans sucre.", nutritionalValue: "410 kcal | Fibres solubles de haute qualité" },
        lunch: { title: "Wok de dinde bio au curcuma", description: "Émincé de dinde fermière, petits légumes colorés revenus au wok et quinoa vapeur.", nutritionalValue: "540 kcal | Protéines maigres et antioxydants" },
        snack: { title: "Quartiers de pomme verte & Beurre de cacahuète", description: "Une pomme bio coupée en quartiers à tremper dans une cuillère de beurre de cacahuète pur.", nutritionalValue: "190 kcal | Énergie saine coupe-faim" },
        dinner: { title: "Omelette fine aux herbes du jardin", description: "Omelette de trois œufs aux herbes fraîches (persil, ciboulette, estragon) et salade de mesclun.", nutritionalValue: "350 kcal | Sommeil réparateur assuré" }
      },
      {
        dayName: "Samedi",
        breakfast: { title: "Crêpes légères de sarrasin", description: "Crêpe de sarrasin garnie d'un œuf miroir et de champignons de Paris sautés.", nutritionalValue: "430 kcal | Sans gluten et rassasiant" },
        lunch: { title: "Salade océane", description: "Mélange de poulpe ou crevettes sauvages, pamplemousse, avocat, salade frisée, vinaigrette au citron.", nutritionalValue: "490 kcal | Iode et minéraux marins" },
        snack: { title: "Infusion de camomille et mûres", description: "Infusion calmante de camomille matricaire avec un petit ramequin de mûres sauvages.", nutritionalValue: "90 kcal | Calme respiratoire et circulatoire" },
        dinner: { title: "Dahl de lentilles corail au gingembre", description: "Mijoté de lentilles corail parfumées au cumin, ail, gingembre et tomates concassées.", nutritionalValue: "390 kcal | Équilibre acido-basique optimal" }
      },
      {
        dayName: "Dimanche",
        breakfast: { title: "Petit déjeuner vitalité", description: "Assiette d'avocat, une tranche de saumon fumé sauvage, tomates cerises et herbes aromatiques.", nutritionalValue: "460 kcal | Protéines et graisses saines de haute volée" },
        lunch: { title: "Rôti de veau de lait aux herbes", description: "Tranche de rôti de veau bio, écrasé de carottes au cumin et haricots verts frais à l'ail.", nutritionalValue: "560 kcal | Riche en acides aminés bio-disponibles" },
        snack: { title: "Banane mûre parsemée de graines de sésame", description: "Banane riche en potassium combinée au sésame reminéralisant.", nutritionalValue: "160 kcal | Sérotonine naturelle" },
        dinner: { title: "Bouillon de poule réconfortant", description: "Véritable bouillon de poule mijoté longuement (Bone Broth) avec fines lamelles de légumes.", nutritionalValue: "290 kcal | Collagène cicatrisant pour l'intestin" }
      }
    ]
  };
};

export default function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    const saved = localStorage.getItem("ceans_premium_status");
    return saved === "true";
  });
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);

  // User Profile State
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("ceans_user_profile");
    if (saved) return JSON.parse(saved);
    return {
      age: 28,
      gender: "Femme",
      height: 168,
      weight: 62.0,
      systolic: 115,
      diastolic: 75,
      heartRate: 68,
      chronicConditions: "Asthme léger, digestion parfois ralentie",
      symptoms: "Fatigue passagère le soir, maux de tête légers",
      activeLevel: "Modéré",
      dietPreference: "Omnivore",
    };
  });

  // Health Daily Logs State (reloaded from local storage or pre-populated)
  const [logs, setLogs] = useState<HealthLog[]>(() => {
    const saved = localStorage.getItem("ceans_health_logs");
    if (saved) return JSON.parse(saved);
    return generateInitialLogs();
  });

  // Health Analysis Report State
  const [analysisResult, setAnalysisResult] = useState<HealthAnalysisResult | null>(() => {
    const saved = localStorage.getItem("ceans_analysis_result");
    if (saved) return JSON.parse(saved);
    return getInitialAnalysis();
  });

  // Weekly Meal Plan State
  const [mealPlan, setMealPlan] = useState<MealPlanResult | null>(() => {
    const saved = localStorage.getItem("ceans_meal_plan");
    if (saved) return JSON.parse(saved);
    return getInitialMealPlan();
  });

  // Loading States
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("ceans_user_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("ceans_health_logs", JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem("ceans_analysis_result", JSON.stringify(analysisResult));
  }, [analysisResult]);

  useEffect(() => {
    localStorage.setItem("ceans_meal_plan", JSON.stringify(mealPlan));
  }, [mealPlan]);

  useEffect(() => {
    localStorage.setItem("ceans_premium_status", String(isPremium));
  }, [isPremium]);

  // Action: Add new Daily Health Log
  const handleAddLog = (newLog: Omit<HealthLog, "id">) => {
    const logItem: HealthLog = {
      ...newLog,
      id: Math.random().toString(36).substring(7),
    };
    
    // Check if a log for this specific date already exists to overwrite it, otherwise append
    const existingIndex = logs.findIndex((l) => l.date === logItem.date);
    let updatedLogs = [...logs];
    if (existingIndex !== -1) {
      updatedLogs[existingIndex] = { ...updatedLogs[existingIndex], ...newLog };
    } else {
      updatedLogs.push(logItem);
      // Keep logs ordered chronologically by date
      updatedLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    setLogs(updatedLogs);

    // Update current profile weight / bp / heart rate based on last entry
    const latest = updatedLogs[updatedLogs.length - 1];
    setProfile((prev) => ({
      ...prev,
      weight: latest.weight,
      systolic: latest.systolic,
      diastolic: latest.diastolic,
      heartRate: latest.heartRate,
    }));
  };

  // Action: Run Live Server-side AI Health Bilan
  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      const data = await response.json();
      if (data && !data.error) {
        setAnalysisResult(data);
      } else {
        console.error("API error during analysis:", data.error);
      }
    } catch (error) {
      console.error("Failed to run health analysis:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Action: Run Live Server-side AI Meal Plan generation
  const handleGenerateMealPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const response = await fetch("/api/meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      const data = await response.json();
      if (data && !data.error) {
        setMealPlan(data);
      } else {
        console.error("API error during meal planning:", data.error);
      }
    } catch (error) {
      console.error("Failed to generate meal plan:", error);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleActivatePremium = () => {
    setIsPremium(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F9F9] flex flex-col justify-between">
      
      {/* Dynamic Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isPremium={isPremium} 
        setShowPremiumModal={setShowPremiumModal} 
      />

      {/* Primary tab views content container */}


      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<PageLoader />}>
          {activeTab === "dashboard" && (
            <Dashboard 
              logs={logs} 
              onAddLog={handleAddLog}
              profile={profile} 
            />
          )}

          {activeTab === "analysis" && (
            <HealthAnalysis
              profile={profile}
              onUpdateProfile={setProfile}
              analysisResult={analysisResult}
              onRunAnalysis={handleRunAnalysis}
              isAnalyzing={isAnalyzing}
            />
          )}

          {activeTab === "mealplan" && (
            <MealPlanner
              mealPlan={mealPlan}
              onGenerateMealPlan={handleGenerateMealPlan}
              isGeneratingPlan={isGeneratingPlan}
              profile={profile}
            />
          )}

          {activeTab === "consultation" && (
            <AIConsultation
              profile={profile}
            />
          )}

          {activeTab === "partners" && (
            <PartnersDirectory />
          )}
        </Suspense>
      </main>

      {/* Premium Membership checkout modal (lazy) */}
      {showPremiumModal && (
        <Suspense fallback={null}>
          <PremiumPricing 
            onActivatePremium={handleActivatePremium} 
            onClose={() => setShowPremiumModal(false)} 
          />
        </Suspense>
      )}

      {/* Humble modern system footer */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{t("footer.rights")}</span>
          <div className="flex space-x-4">
            <span className="cursor-pointer hover:text-slate-600">{t("footer.privacy")}</span>
            <span>•</span>
            <span className="cursor-pointer hover:text-slate-600">{t("footer.terms")}</span>
            <span>•</span>
            <span className="cursor-pointer hover:text-slate-600" onClick={() => setShowPremiumModal(true)}>
              {t("footer.premium")}
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
