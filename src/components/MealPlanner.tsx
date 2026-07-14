import React, { useState } from "react";
import { 
  Sparkles, 
  Utensils, 
  Clock, 
  Flame, 
  TrendingUp, 
  Heart, 
  Search, 
  ChevronRight, 
  Printer, 
  Leaf, 
  Award,
  Loader2,
  CalendarDays
} from "lucide-react";
import { MealPlanResult, Recipe, UserProfile } from "../types";

interface MealPlannerProps {
  mealPlan: MealPlanResult | null;
  onGenerateMealPlan: () => Promise<void>;
  isGeneratingPlan: boolean;
  profile: UserProfile;
}

export default function MealPlanner({ 
  mealPlan, 
  onGenerateMealPlan, 
  isGeneratingPlan, 
  profile 
}: MealPlannerProps) {
  // Local state for interactive custom recipe creator
  const [recipeQuery, setRecipeQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isSearchingRecipes, setIsSearchingRecipes] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const handleSearchRecipes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeQuery.trim()) return;

    setIsSearchingRecipes(true);
    try {
      const response = await fetch("/api/generate-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: recipeQuery,
          dietPreference: profile.dietPreference 
        }),
      });
      const data = await response.json();
      if (data.recipes) {
        setRecipes(data.recipes);
      }
    } catch (err) {
      console.error("Error generating recipes:", err);
    } finally {
      setIsSearchingRecipes(false);
    }
  };

  const getMacronutrientWidth = (val: string) => {
    return val.replace("%", "%");
  };

  const currentDay = mealPlan?.days[activeDayIndex] || null;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Nutrition Plan Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Widget: Plan Metrics Summary & Generator */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-sans font-bold text-lg text-[#064E3B]">Plan Diététique Hebdomadaire</h3>
            <p className="text-slate-400 text-xs">Menu thérapeutique sur 7 jours</p>
          </div>

          {mealPlan ? (
            <div className="space-y-6">
              {/* Daily Target Calories */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-700 block uppercase">Objectif Calorique Journalier</span>
                  <span className="text-2xl font-bold font-sans text-[#064E3B] mt-1 block">
                    {mealPlan.dailyTargetCalories} <span className="text-xs font-medium">kcal/jour</span>
                  </span>
                </div>
                <div className="p-2.5 bg-[#064E3B] text-white rounded-xl">
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
              </div>

              {/* Macronutrient Allocation */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Répartition des Macronutriments</h4>
                
                {/* Glucides */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600 font-medium">
                    <span>Glucides Complexes</span>
                    <span className="font-bold">{mealPlan.macronutrientsRatio.carbs}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#10B981] rounded-full" 
                      style={{ width: getMacronutrientWidth(mealPlan.macronutrientsRatio.carbs) }}
                    ></div>
                  </div>
                </div>

                {/* Proteines */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600 font-medium">
                    <span>Protéines saines</span>
                    <span className="font-bold">{mealPlan.macronutrientsRatio.proteins}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: getMacronutrientWidth(mealPlan.macronutrientsRatio.proteins) }}
                    ></div>
                  </div>
                </div>

                {/* Lipides */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600 font-medium">
                    <span>Acides gras essentiels</span>
                    <span className="font-bold">{mealPlan.macronutrientsRatio.fats}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full" 
                      style={{ width: getMacronutrientWidth(mealPlan.macronutrientsRatio.fats) }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Regenerate Trigger */}
              <button
                id="btn-regenerate-meals"
                onClick={onGenerateMealPlan}
                disabled={isGeneratingPlan}
                className="w-full py-3 border border-[#064E3B] hover:bg-emerald-50 text-[#064E3B] font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                {isGeneratingPlan ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mise à jour en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Régénérer mon Menu IA</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <button
                id="btn-generate-meals-initial"
                onClick={onGenerateMealPlan}
                disabled={isGeneratingPlan}
                className="w-full py-3 bg-[#064E3B] hover:bg-[#043427] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                {isGeneratingPlan ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Création du plan en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>Générer mon Plan Alimentaire</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Widget: Daily Meal details and calendar */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          {mealPlan && (
            <div className="space-y-6">
              <div>
                <h4 className="font-sans font-bold text-[#064E3B] text-base">Plan de Repas Détaillé</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{mealPlan.weeklySummary}</p>
              </div>

              {/* Day selection row */}
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
                {mealPlan.days.map((day, i) => (
                  <button
                    key={i}
                    id={`btn-day-${i}`}
                    onClick={() => setActiveDayIndex(i)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      activeDayIndex === i
                        ? "bg-[#064E3B] text-white shadow-sm"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {day.dayName}
                  </button>
                ))}
              </div>

              {/* Selected Day meal items */}
              {currentDay && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Petit Dejeuner */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex space-x-3 items-start">
                    <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 text-sm font-semibold shrink-0">Mat</div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Petit Déjeuner</h5>
                      <h6 className="font-bold text-slate-700 text-sm mt-1">{currentDay.breakfast.title}</h6>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed">{currentDay.breakfast.description}</p>
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full mt-2.5 inline-block">
                        {currentDay.breakfast.nutritionalValue}
                      </span>
                    </div>
                  </div>

                  {/* Dejeuner */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex space-x-3 items-start">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-semibold shrink-0">Midi</div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Déjeuner</h5>
                      <h6 className="font-bold text-slate-700 text-sm mt-1">{currentDay.lunch.title}</h6>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed">{currentDay.lunch.description}</p>
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full mt-2.5 inline-block">
                        {currentDay.lunch.nutritionalValue}
                      </span>
                    </div>
                  </div>

                  {/* Collation */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex space-x-3 items-start">
                    <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 text-sm font-semibold shrink-0">Goût</div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Collation de Santé</h5>
                      <h6 className="font-bold text-slate-700 text-sm mt-1">{currentDay.snack.title}</h6>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed">{currentDay.snack.description}</p>
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full mt-2.5 inline-block">
                        {currentDay.snack.nutritionalValue}
                      </span>
                    </div>
                  </div>

                  {/* Diner */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex space-x-3 items-start">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 text-sm font-semibold shrink-0">Soir</div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Dîner Léger</h5>
                      <h6 className="font-bold text-slate-700 text-sm mt-1">{currentDay.dinner.title}</h6>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed">{currentDay.dinner.description}</p>
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full mt-2.5 inline-block">
                        {currentDay.dinner.nutritionalValue}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!mealPlan && (
            <div className="text-center py-12 text-slate-400">
              <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-display font-semibold text-slate-500">Plan nutritionnel en attente</p>
              <p className="text-xs max-w-sm mx-auto mt-1">Générez votre plan à gauche pour avoir un menu diététique premium conçu spécialement pour votre morphologie.</p>
            </div>
          )}
        </div>

      </div>

      {/* Wellness & Remedial Recipe Creator */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
        <div>
          <h3 className="font-sans font-bold text-lg text-[#064E3B] flex items-center space-x-2">
            <Leaf className="w-5 h-5 text-[#10B981] animate-spin-slow" />
            <span>Générateur de Recettes Curatives par IA</span>
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            Recherchez une maladie, un ingrédient de votre cuisine (ex: gingembre, curcuma) ou un objectif spécifique (ex: "anti-cholestérol", "renforcer l'immunité") pour créer 3 recettes sur mesure.
          </p>
        </div>

        {/* Recipe search input form */}
        <form onSubmit={handleSearchRecipes} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              required
              placeholder="ex: gingembre, miel pour la gorge irritée OU recette pour baisser la tension..."
              value={recipeQuery}
              onChange={(e) => setRecipeQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
            />
          </div>
          <button
            type="submit"
            id="btn-search-recipes"
            disabled={isSearchingRecipes}
            className="bg-[#064E3B] hover:bg-[#043427] text-white font-semibold text-xs px-6 rounded-2xl shadow-sm transition-all flex items-center space-x-1 shrink-0 cursor-pointer"
          >
            {isSearchingRecipes ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Création...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Créer</span>
              </>
            )}
          </button>
        </form>

        {/* Recipes Results List */}
        {isSearchingRecipes && (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <h5 className="font-semibold text-slate-700 text-sm">Génération de vos recettes de guérison...</h5>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Notre IA calibre les bons dosages d'herbes aromatiques et d'ingrédients bio pour votre bien-être.</p>
          </div>
        )}

        {!isSearchingRecipes && recipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {recipes.map((recipe, index) => (
              <div key={index} className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                      Phytorésolution
                    </span>
                    <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{recipe.prepTime}</span>
                    </div>
                  </div>

                  <h4 className="font-sans font-bold text-[#064E3B] text-base mt-2.5">{recipe.title}</h4>
                  
                  <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100/50 my-3 text-xs text-emerald-800">
                    <strong className="block text-[10px] font-extrabold uppercase text-emerald-700">Bienfaits thérapeutiques :</strong>
                    {recipe.healthBenefit}
                  </div>

                  {/* Ingredients bullet point list */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ingrédients nécessaires</span>
                    <ul className="list-disc pl-4 text-xs text-slate-600 space-y-0.5">
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Préparation</span>
                    <ol className="list-decimal pl-4 text-xs text-slate-600 space-y-1">
                      {recipe.instructions.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>Sûr & Naturel</span>
                  <span>{recipe.calories} kcal</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
