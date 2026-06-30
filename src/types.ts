export interface SkinScore {
  overall: number;
  hydration: number; // 0-100
  oilControl: number; // 0-100
  barrier: number; // 0-100
  clarity: number; // 0-100
  texture: number; // 0-100
}

export interface RoutineStep {
  step: number;
  category: string; // e.g., Cleanser, Toner, Serum, Moisturizer, Sunscreen, Treatment
  name: string; // descriptive step name
  purpose: string;
  instructions: string;
  activeIngredients: string[];
  timeOfDay: 'morning' | 'evening' | 'both';
}

export interface RecommendedProduct {
  brand: string;
  name: string;
  category: string;
  tier: 'Budget' | 'Mid-range' | 'Premium';
  reason: string;
  activeIngredients: string[];
  confidenceScore: number;
  expectedTimeline: string;
}

export interface SkinScan {
  id: string;
  date: string;
  imageUrl: string;
  isValid: boolean;
  validationError?: string;
  score: SkinScore;
  skinType: 'Oily' | 'Dry' | 'Combination' | 'Sensitive' | 'Normal';
  concerns: string[];
  analysis: {
    redness: string;
    pores: string;
    wrinkles: string;
    oiliness: string;
    dryness: string;
    acne: string;
    pigmentation: string;
  };
  routine: {
    morning: RoutineStep[];
    evening: RoutineStep[];
  };
  recommendations: RecommendedProduct[];
}

export interface CabinetItem {
  id: string;
  brand: string;
  name: string;
  category: string;
  ingredients: string; // comma-separated or raw text
  activeIngredients: string[];
  useInMorning: boolean;
  useInEvening: boolean;
  addedAt: string;
}

export interface Ingredient {
  inciName: string;
  commonName: string;
  benefits: string[];
  sideEffects: string[];
  pregnancySafety: 'Safe' | 'Avoid' | 'Consult Doctor';
  skinTypes: string[];
  concerns: string[];
  layeringRules: {
    combineWith: string[];
    avoidWith: string[];
    explanation: string;
  };
  usageFrequency: string;
  dayNight: 'Day' | 'Night' | 'Both';
  phRange?: string;
}

export interface Product {
  id: string;
  brand: string;
  name: string;
  category: string;
  ingredients: string[];
  activeIngredients: string[];
  price: string;
  rating: number;
  image: string;
  recommendedFor: string[];
  concerns: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  email: string;
  age: number;
  location: string;
  climate: 'Temperate' | 'Dry/Cold' | 'Warm/Humid';
  skinType: 'Oily' | 'Dry' | 'Combination' | 'Sensitive' | 'Normal';
  concerns: string[];
  geminiApiKey: string;
  openuvApiKey: string;
}

