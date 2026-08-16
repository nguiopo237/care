import express from "express";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();

app.use(express.json());

// Initialize Gemini API
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Endpoint: Health Analysis
app.post("/api/analyze-health", async (req, res) => {
  try {
    const { profile } = req.body;
    if (!profile) {
      return res.status(400).json({ error: "Profil utilisateur requis." });
    }

    const { age, gender, height, weight, systolic, diastolic, heartRate, chronicConditions, symptoms, activeLevel, dietPreference } = profile;

    const prompt = `Agis en tant que médecin expert en médecine holistique, nutritionniste et conseiller en bien-être de l'application CEan'sCare.
Analyse les données de santé de l'utilisateur suivant :
- Âge : ${age} ans
- Genre : ${gender}
- Taille : ${height} cm
- Poids : ${weight} kg
- Tension artérielle : ${systolic}/${diastolic} mmHg
- Rythme cardiaque : ${heartRate} bpm
- Maladies chroniques / antécédents : ${chronicConditions || "Aucune déclarée"}
- Symptômes actuels : ${symptoms || "Aucun déclaré"}
- Niveau d'activité physique : ${activeLevel}
- Préférence alimentaire : ${dietPreference}

Génère une analyse médicale et de bien-être complète, bienveillante et approfondie. 
Fournis des explications sur ses constantes de santé (IMC, Tension, Rythme cardiaque), des recommandations concrètes et des solutions/options de traitement à la fois médicales, de médecine douce/naturelle et de mode de vie pour ses affections et symptômes décrits (y compris pour améliorer la gestion de ses éventuelles maladies chroniques).
Ajoute une clause de non-responsabilité médicale indiquant que cette analyse est un accompagnement intelligent et ne remplace pas une consultation médicale physique.

Tu DOIS retourner un objet JSON correspondant EXACTEMENT à cette structure :
{
  "bmi": number,
  "bmiCategory": "string (ex: Poids normal, Surpoids...)",
  "constantsAnalysis": {
    "bmiText": "string",
    "bloodPressureText": "string",
    "heartRateText": "string"
  },
  "generalAssessment": "string",
  "treatmentOptions": [
    {
      "category": "string (ex: Médecine conventionnelle, Phytothérapie, Nutrition, Mode de vie)",
      "title": "string",
      "description": "string",
      "scientificContext": "string"
    }
  ],
  "personalizedTips": [
    {
      "title": "string",
      "description": "string",
      "importance": "string (ex: Haute, Moyenne, Préventive)"
    }
  ],
  "dietaryFocus": "string",
  "disclaimer": "string"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bmi: { type: Type.NUMBER },
            bmiCategory: { type: Type.STRING },
            constantsAnalysis: {
              type: Type.OBJECT,
              properties: {
                bmiText: { type: Type.STRING },
                bloodPressureText: { type: Type.STRING },
                heartRateText: { type: Type.STRING },
              },
              required: ["bmiText", "bloodPressureText", "heartRateText"],
            },
            generalAssessment: { type: Type.STRING },
            treatmentOptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  scientificContext: { type: Type.STRING },
                },
                required: ["category", "title", "description", "scientificContext"],
              },
            },
            personalizedTips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  importance: { type: Type.STRING },
                },
                required: ["title", "description", "importance"],
              },
            },
            dietaryFocus: { type: Type.STRING },
            disclaimer: { type: Type.STRING },
          },
          required: [
            "bmi",
            "bmiCategory",
            "constantsAnalysis",
            "generalAssessment",
            "treatmentOptions",
            "personalizedTips",
            "dietaryFocus",
            "disclaimer",
          ],
        },
      },
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error in /api/analyze-health:", error);
    res.status(500).json({ error: error.message || "Erreur lors de l'analyse de santé." });
  }
});

// Endpoint: Personalized Meal Plan
app.post("/api/meal-plan", async (req, res) => {
  try {
    const { profile } = req.body;
    if (!profile) {
      return res.status(400).json({ error: "Profil utilisateur requis." });
    }

    const { age, gender, height, weight, activeLevel, dietPreference, chronicConditions } = profile;

    const prompt = `Génère un plan de repas hebdomadaire (7 jours) personnalisé et hautement nutritif pour l'utilisateur suivant :
- Âge : ${age} ans
- Genre : ${gender}
- Taille : ${height} cm
- Poids : ${weight} kg
- Activité : ${activeLevel}
- Préférence alimentaire : ${dietPreference}
- Pathologies : ${chronicConditions || "Aucune"}

Le plan doit être parfaitement équilibré pour optimiser son bien-être et soutenir sa santé cardiovasculaire et digestive.

Retourne un objet JSON structuré comme suit :
{
  "weeklySummary": "string (un résumé des bienfaits nutritionnels de ce plan)",
  "dailyTargetCalories": number,
  "macronutrientsRatio": {
    "carbs": "string (ex: 45%)",
    "proteins": "string (ex: 25%)",
    "fats": "string (ex: 30%)"
  },
  "days": [
    {
      "dayName": "string (ex: Lundi, Mardi...)",
      "breakfast": {
        "title": "string",
        "description": "string",
        "nutritionalValue": "string"
      },
      "lunch": {
        "title": "string",
        "description": "string",
        "nutritionalValue": "string"
      },
      "snack": {
        "title": "string",
        "description": "string",
        "nutritionalValue": "string"
      },
      "dinner": {
        "title": "string",
        "description": "string",
        "nutritionalValue": "string"
      }
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weeklySummary: { type: Type.STRING },
            dailyTargetCalories: { type: Type.INTEGER },
            macronutrientsRatio: {
              type: Type.OBJECT,
              properties: {
                carbs: { type: Type.STRING },
                proteins: { type: Type.STRING },
                fats: { type: Type.STRING },
              },
              required: ["carbs", "proteins", "fats"],
            },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayName: { type: Type.STRING },
                  breakfast: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      nutritionalValue: { type: Type.STRING },
                    },
                    required: ["title", "description", "nutritionalValue"],
                  },
                  lunch: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      nutritionalValue: { type: Type.STRING },
                    },
                    required: ["title", "description", "nutritionalValue"],
                  },
                  snack: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      nutritionalValue: { type: Type.STRING },
                    },
                    required: ["title", "description", "nutritionalValue"],
                  },
                  dinner: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      nutritionalValue: { type: Type.STRING },
                    },
                    required: ["title", "description", "nutritionalValue"],
                  },
                },
                required: ["dayName", "breakfast", "lunch", "snack", "dinner"],
              },
            },
          },
          required: ["weeklySummary", "dailyTargetCalories", "macronutrientsRatio", "days"],
        },
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error in /api/meal-plan:", error);
    res.status(500).json({ error: error.message || "Erreur lors de la génération du plan alimentaire." });
  }
});

// Endpoint: AI-powered Recipe Generator
app.post("/api/generate-recipes", async (req, res) => {
  try {
    const { query, dietPreference } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Requête d'ingrédients ou d'objectif de santé requis." });
    }

    const prompt = `Crée 3 recettes de cuisine saines, délicieuses et adaptées aux objectifs ou ingrédients suivants : "${query}".
Préférence alimentaire de base : ${dietPreference || "Omnivore"}.

Chaque recette doit être conçue pour booster le bien-être général, avec des ingrédients naturels et une explication claire de ses bienfaits thérapeutiques.

Retourne un objet JSON structuré comme suit :
{
  "recipes": [
    {
      "title": "string",
      "prepTime": "string (ex: 20 min)",
      "cookTime": "string (ex: 15 min)",
      "calories": number,
      "healthBenefit": "string (ex: Riche en antioxydants, régule le cholestérol)",
      "ingredients": ["string"],
      "instructions": ["string"]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  prepTime: { type: Type.STRING },
                  cookTime: { type: Type.STRING },
                  calories: { type: Type.INTEGER },
                  healthBenefit: { type: Type.STRING },
                  ingredients: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  instructions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["title", "prepTime", "cookTime", "calories", "healthBenefit", "ingredients", "instructions"],
              },
            },
          },
          required: ["recipes"],
        },
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error in /api/generate-recipes:", error);
    res.status(500).json({ error: error.message || "Erreur lors de la génération des recettes." });
  }
});

// Endpoint: Interactive Chat Consultation
app.post("/api/chat-consultation", async (req, res) => {
  try {
    const { messages, profile } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Historique de chat requis." });
    }

    const userProfileText = profile
      ? `PROFIL DE L'UTILISATEUR:
- Âge : ${profile.age} ans, Genre : ${profile.gender}
- Maladies déclarées : ${profile.chronicConditions || "Aucune"}
- Préférence alimentaire : ${profile.dietPreference}`
      : "Aucun profil enregistré pour l'instant.";

    // Use Gemini chats standard history
    const geminiMessages = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    // Insert system instruction & history
    const systemInstruction = `Tu es l'assistant de santé IA expert de CEan'sCare. Tu réponds aux préoccupations des utilisateurs avec beaucoup d'empathie, de rigueur scientifique et d'expertise pratique.
Tu donnes des conseils précieux sur le bien-être, l'alimentation, l'importance des plantes médicinales (phytothérapie) et l'hygiène de vie, ainsi que des pistes thérapeutiques claires pour les symptômes décrits, tout en insistant gentiment sur le suivi médical classique pour la sécurité de l'utilisateur.
Sois direct, chaleureux, utilise le français, structure tes réponses avec des puces élégantes, du gras pour la lisibilité et un style haut de gamme.
${userProfileText}`;

    // Create chat on server side
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
      },
      history: geminiMessages.slice(0, -1),
    });

    const lastMessageText = messages[messages.length - 1].text;
    const response = await chat.sendMessage({ message: lastMessageText });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Error in /api/chat-consultation:", error);
    res.status(500).json({ error: error.message || "Erreur lors de la consultation." });
  }
});

export default app;