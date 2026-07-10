export interface User {
  id: string;
  name: string;
  email: string;
  role: "Farmer" | "Agriculture Officer" | "Admin";
  isVerified: boolean;
  createdAt: string;
  phone?: string;
  location?: string;
  farmSize?: number;
  primaryCrop?: string;
}

export interface Expense {
  id: string;
  userId: string;
  category: "Seeds" | "Labor" | "Machinery" | "Fuel" | "Fertilizer" | "Transport" | "Other";
  amount: number;
  date: string;
  description: string;
}

export interface CropInput {
  location: string;
  season: "Kharif" | "Rabi" | "Zaid" | "Whole Year";
  soilType: "Alluvial" | "Black" | "Red" | "Laterite" | "Sandy" | "Clayey" | "Loamy";
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temp: number;
  humidity: number;
  rainfall: number;
  area: number;
}

export interface CropRecommendation {
  bestCrop: string;
  expectedYield: string;
  profitEstimate: string;
  waterRequirement: string;
  fertilizerPlan: string;
  riskAnalysis: string;
  confidenceScore: number;
}

export interface CropRecRecord {
  id: string;
  userId: string;
  inputs: CropInput;
  recommendation: CropRecommendation;
  createdAt: string;
}

export interface DiseaseRecord {
  id: string;
  userId: string;
  crop: string;
  diseaseName: string;
  confidence: number;
  treatment: string;
  organic: string;
  prevention: string;
  imageUrl: string;
  createdAt: string;
}

export interface Scheme {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  benefits: string;
  link: string;
  bookmarkedBy: string[];
}

export interface MarketPrice {
  id: string;
  crop: string;
  market: string;
  price: number;
  prevPrice: number;
  change: number; // percentage change
  demand: "Very High" | "High" | "Stable" | "Moderate" | "Low" | "Surging";
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "weather" | "scheme" | "market" | "disease" | "system";
  isRead: boolean;
  createdAt: string;
}
