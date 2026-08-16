export interface UserProfile {
  age: number;
  gender: string;
  height: number;
  weight: number;
  systolic: number; // blood pressure
  diastolic: number; // blood pressure
  heartRate: number; // heart rate (bpm)
  chronicConditions: string;
  symptoms: string;
  activeLevel: "Sédentaire" | "Modéré" | "Très Actif";
  dietPreference: "Omnivore" | "Végétarien" | "Végétalien" | "Sans Gluten" | "Kéto";
}

export interface ConstantsAnalysis {
  bmiText: string;
  bloodPressureText: string;
  heartRateText: string;
}

export interface TreatmentOption {
  category: string;
  title: string;
  description: string;
  scientificContext: string;
}

export interface PersonalizedTip {
  title: string;
  description: string;
  importance: "Haute" | "Moyenne" | "Préventive" | string;
}

export interface HealthAnalysisResult {
  bmi: number;
  bmiCategory: string;
  constantsAnalysis: ConstantsAnalysis;
  generalAssessment: string;
  treatmentOptions: TreatmentOption[];
  personalizedTips: PersonalizedTip[];
  dietaryFocus: string;
  disclaimer: string;
}

export interface MealDetail {
  title: string;
  description: string;
  nutritionalValue: string;
}

export interface DailyPlan {
  dayName: string;
  breakfast: MealDetail;
  lunch: MealDetail;
  snack: MealDetail;
  dinner: MealDetail;
}

export interface MealPlanResult {
  weeklySummary: string;
  dailyTargetCalories: number;
  macronutrientsRatio: {
    carbs: string;
    proteins: string;
    fats: string;
  };
  days: DailyPlan[];
}

export interface Recipe {
  title: string;
  prepTime: string;
  cookTime: string;
  calories: number;
  healthBenefit: string;
  ingredients: string[];
  instructions: string[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export interface HealthLog {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number;
  systolic: number;
  diastolic: number;
  heartRate: number;
  waterIntake: number; // in ml
  sleep: number; // in hours
  activityMinutes: number;
}

export interface Doctor {
  id: string;
  fullName: string;
  specialty: string;
  email: string;
  phone: string;
  licenseNumber: string;
  experienceYears: number;
  bio: string;
  verified: boolean;
  city: string;
  registeredAt: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorPhone: string;
  patientName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: "video" | "home";
  reason: string;
  status: "upcoming" | "completed" | "cancelled";
  createdAt: string;
}
