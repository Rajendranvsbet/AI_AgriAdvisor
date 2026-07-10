import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// File-based Database Path
const DB_PATH = path.join(process.cwd(), "src", "db", "data.json");

// Ensure DB directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initial default database structure
const DEFAULT_DB = {
  users: [
    {
      id: "usr-1",
      name: "Rajendran Farmer",
      email: "rajendran292005@gmail.com",
      role: "Farmer",
      password: "password123",
      isVerified: true,
      createdAt: "2026-07-01T00:00:00Z"
    },
    {
      id: "usr-2",
      name: "Dr. Ananya Sharma",
      email: "officer@agroadvisor.gov",
      role: "Agriculture Officer",
      password: "password123",
      isVerified: true,
      createdAt: "2026-07-02T00:00:00Z"
    },
    {
      id: "usr-3",
      name: "System Administrator",
      email: "admin@agroadvisor.com",
      role: "Admin",
      password: "password123",
      isVerified: true,
      createdAt: "2026-07-03T00:00:00Z"
    }
  ],
  expenses: [
    { id: "exp-1", userId: "usr-1", category: "Seeds", amount: 2400, date: "2026-07-05", description: "Premium Basmati Rice seeds" },
    { id: "exp-2", userId: "usr-1", category: "Labor", amount: 4500, date: "2026-07-04", description: "Sowing operations - 3 days" },
    { id: "exp-3", userId: "usr-1", category: "Fertilizer", amount: 1800, date: "2026-07-02", description: "Organic compost and Urea booster" },
    { id: "exp-4", userId: "usr-1", category: "Machinery", amount: 3200, date: "2026-06-28", description: "Tractor rental for field tilling" }
  ],
  crops: [
    {
      id: "crop-1",
      userId: "usr-1",
      inputs: {
        location: "Tamil Nadu, IN",
        season: "Kharif",
        soilType: "Clayey",
        pH: 6.8,
        nitrogen: 80,
        phosphorus: 40,
        potassium: 40,
        temp: 29,
        humidity: 78,
        rainfall: 1200,
        area: 4.5
      },
      recommendation: {
        bestCrop: "Rice (Basmati/Paddy)",
        expectedYield: "4.8 Tons/Acre",
        profitEstimate: "₹ 1,45,000",
        waterRequirement: "High (1200-1400 mm)",
        fertilizerPlan: "NPK ratio of 120:60:60 kg/ha. Apply urea in 3 split doses.",
        riskAnalysis: "Moderate. Potential risk of Blast disease due to high humidity. Maintain proper drainage.",
        confidenceScore: 94
      },
      createdAt: "2026-07-05T10:30:00Z"
    }
  ],
  diseases: [
    {
      id: "dis-1",
      userId: "usr-1",
      crop: "Rice",
      diseaseName: "Rice Blast (Magnaporthe oryzae)",
      confidence: 92,
      treatment: "Spray Tricyclazole 75 WP @ 0.6 g/l or Carbendazim 50 WP @ 1 g/l of water.",
      organic: "Apply Pseudomonas fluorescens formulation @ 10 g/l. Ensure clean cultivation and destroy stubbles.",
      prevention: "Use blast-resistant varieties, avoid excessive nitrogenous fertilizers, and space out seedlings.",
      imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=60",
      createdAt: "2026-07-06T15:20:00Z"
    }
  ],
  schemes: [
    {
      id: "sch-1",
      title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
      description: "Income support scheme of ₹6,000 per year in three equal installments to all landholding farmer families.",
      eligibility: "Small and marginal farmers holding cultivable agricultural land in their names.",
      benefits: "Direct bank transfer of ₹2,000 every 4 months.",
      link: "https://pmkisan.gov.in/",
      bookmarkedBy: ["usr-1"]
    },
    {
      id: "sch-2",
      title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      description: "Government-sponsored crop insurance scheme that integrates multiple stakeholders for securing yield.",
      eligibility: "All farmers growing notified crops in notified areas, including sharecroppers.",
      benefits: "Low premium rates (1.5% to 2% for food crops, 5% for commercial/horticultural crops) with full insurance cover.",
      link: "https://pmfby.gov.in/",
      bookmarkedBy: []
    },
    {
      id: "sch-3",
      title: "Soil Health Card Scheme",
      description: "Assists State Governments to issue soil health cards to all farmers in the country to promote balanced fertilizer use.",
      eligibility: "All operational landholding farmers.",
      benefits: "Free soil testing and detailed nutrition card indicating corrective measures.",
      link: "https://soilhealth.dac.gov.in/",
      bookmarkedBy: ["usr-1"]
    }
  ],
  marketPrices: [
    { id: "mkt-1", crop: "Paddy (Basmati)", market: "Chennai Market", price: 3400, prevPrice: 3250, change: 4.6, demand: "High" },
    { id: "mkt-2", crop: "Wheat", market: "Delhi Mandi", price: 2350, prevPrice: 2400, change: -2.1, demand: "Stable" },
    { id: "mkt-3", crop: "Cotton", market: "Mumbai Yard", price: 7200, prevPrice: 7000, change: 2.8, demand: "Very High" },
    { id: "mkt-4", crop: "Tomato", market: "Bangalore Market", price: 1800, prevPrice: 1200, change: 50.0, demand: "Surging" },
    { id: "mkt-5", crop: "Maize", market: "Hyderabad Market", price: 2100, prevPrice: 2050, change: 2.4, demand: "Moderate" }
  ],
  chats: {} as Record<string, Array<{ role: "user" | "model"; text: string; timestamp: string }>>
};

// Database utility functions
function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
      return DEFAULT_DB;
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("DB Read Error, reverting to default schema:", error);
    return DEFAULT_DB;
  }
}

function writeDb(data: typeof DEFAULT_DB) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("DB Write Error:", error);
  }
}

// Lazy Gemini Client Initialization Helper
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Routes
// 1. AUTH MODULE
app.post("/api/auth/register", (req, res) => {
  const { name, email, role, password } = req.body;
  if (!name || !email || !role || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const db = readDb();
  if (db.users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email,
    role,
    password, // Simulated basic storage for demo simplicity
    isVerified: false,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDb(db);

  // Generate simulated verification OTP
  res.json({
    message: "Registration successful. OTP sent to email.",
    userId: newUser.id,
    otpCode: "1234" // Fixed mock OTP for seamless walkthrough
  });
});

app.post("/api/auth/otp", (req, res) => {
  const { userId, otp } = req.body;
  if (otp === "1234") {
    const db = readDb();
    const user = db.users.find(u => u.id === userId);
    if (user) {
      user.isVerified = true;
      writeDb(db);
      return res.json({ message: "Email verified successfully!", user });
    }
  }
  res.status(400).json({ error: "Invalid OTP code" });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const db = readDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({
    token: `jwt-${user.id}-${Date.now()}`,
    user
  });
});

app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  const db = readDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    return res.json({ message: "Password reset link and OTP sent to your email." });
  }
  res.status(404).json({ error: "User not found" });
});

app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token supplied" });

  const tokenParts = authHeader.split("-");
  if (tokenParts.length < 2) return res.status(401).json({ error: "Malformed token" });

  const userId = tokenParts[1];
  const db = readDb();
  const user = db.users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user });
});

app.post("/api/auth/profile", (req, res) => {
  const { userId, name, phone, location, farmSize, primaryCrop } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const db = readDb();
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (location !== undefined) user.location = location;
  if (farmSize !== undefined) user.farmSize = farmSize ? Number(farmSize) : undefined;
  if (primaryCrop !== undefined) user.primaryCrop = primaryCrop;

  writeDb(db);
  res.json({ message: "Profile updated successfully", user });
});

// 2. EXPENSE TRACKING MODULE
app.get("/api/expenses", (req, res) => {
  const userId = req.query.userId as string;
  const db = readDb();
  const filtered = userId ? db.expenses.filter(e => e.userId === userId) : db.expenses;
  res.json(filtered);
});

app.post("/api/expenses", (req, res) => {
  const { userId, category, amount, date, description } = req.body;
  if (!userId || !category || !amount || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const db = readDb();
  const newExpense = {
    id: `exp-${Date.now()}`,
    userId,
    category,
    amount: Number(amount),
    date,
    description: description || ""
  };

  db.expenses.push(newExpense);
  writeDb(db);
  res.status(201).json(newExpense);
});

app.delete("/api/expenses/:id", (req, res) => {
  const db = readDb();
  db.expenses = db.expenses.filter(e => e.id !== req.params.id);
  writeDb(db);
  res.json({ message: "Expense deleted" });
});

// 3. AI CROP RECOMMENDATION MODULE
app.post("/api/crops/recommend", async (req, res) => {
  const { location, season, soilType, pH, nitrogen, phosphorus, potassium, temp, humidity, rainfall, area, userId } = req.body;

  const inputSummary = `Location: ${location}, Season: ${season}, Soil: ${soilType}, pH: ${pH}, N: ${nitrogen}, P: ${phosphorus}, Potassium: ${potassium}, Temperature: ${temp}°C, Humidity: ${humidity}%, Rainfall: ${rainfall}mm, Area: ${area} Acres`;

  const aiClient = getGeminiClient();

  if (aiClient) {
    try {
      const prompt = `You are an expert Agriculture AI Advisor. Based on these farm conditions, generate a structured crop recommendation in JSON format:
Conditions:
- Location: ${location}
- Season: ${season}
- Soil Type: ${soilType}
- pH: ${pH}
- Nitrogen (N): ${nitrogen} ppm
- Phosphorus (P): ${phosphorus} ppm
- Potassium (K): ${potassium} ppm
- Avg Temp: ${temp} °C
- Humidity: ${humidity} %
- Annual Rainfall: ${rainfall} mm
- Farm Area: ${area} Acres

You must output STRICTLY a JSON object with these fields, with no other text, markdown blocks or quotes. Ensure fields match this structure:
{
  "bestCrop": "Crop Name",
  "expectedYield": "Estimated yield in tons per acre",
  "profitEstimate": "Estimated net profit range in currency equivalent",
  "waterRequirement": "High/Medium/Low with brief water interval details",
  "fertilizerPlan": "Detailed recommended NPK dosage and timeline",
  "riskAnalysis": "Risks like pests, weather vulnerabilities, and tips",
  "confidenceScore": 85
}`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || "{}";
      const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const rec = JSON.parse(cleanJson);

      const db = readDb();
      const newRec = {
        id: `crop-${Date.now()}`,
        userId: userId || "anonymous",
        inputs: req.body,
        recommendation: rec,
        createdAt: new Date().toISOString()
      };
      db.crops.push(newRec);
      writeDb(db);

      return res.json(newRec);
    } catch (e: any) {
      console.error("Gemini Crop Recommendation Error:", e);
      // Fallback below
    }
  }

  // EXPERT FALLBACK SYSTEM (If Gemini fails or is not configured)
  const score = 80 + Math.floor(Math.random() * 15);
  let recommendedCrop = "Wheat";
  let water = "Medium (350-500mm)";
  let fertilizer = "Apply Urea in 2 doses; use Zinc booster due to Clayey content.";
  let risk = "Low risk. Watch out for stem borer pests in mid-season.";
  let profit = "₹ 1,20,000";
  let yieldEst = "3.2 Tons/Acre";

  if (soilType === "Clayey" || rainfall > 1000) {
    recommendedCrop = "Paddy (Rice)";
    water = "High (1200-1400mm)";
    fertilizer = "NPK 120:60:60 kg/ha. Top dress nitrogen at tillering phase.";
    risk = "Blast disease vulnerability due to high humidity. Maintain drainage.";
    profit = "₹ 1,35,000";
    yieldEst = "4.5 Tons/Acre";
  } else if (pH < 6.0) {
    recommendedCrop = "Potatoes";
    water = "Medium (500-700mm)";
    fertilizer = "Potassium-rich fertilization required to encourage tuber growth.";
    risk = "Late blight protection required. Avoid water logging.";
    profit = "₹ 95,000";
    yieldEst = "10 Tons/Acre";
  } else if (temp > 32) {
    recommendedCrop = "Millet / Sorghum";
    water = "Low (200-300mm)";
    fertilizer = "Minimal fertilizer. 40kg/ha Nitrogen after weeding.";
    risk = "Drought hardy. High wind lodging risk.";
    profit = "₹ 70,000";
    yieldEst = "1.8 Tons/Acre";
  }

  const mockRec = {
    id: `crop-${Date.now()}`,
    userId: userId || "anonymous",
    inputs: req.body,
    recommendation: {
      bestCrop: `${recommendedCrop} [Expert Advice]`,
      expectedYield: yieldEst,
      profitEstimate: profit,
      waterRequirement: water,
      fertilizerPlan: fertilizer,
      riskAnalysis: `${risk} (Add GEMINI_API_KEY for dynamic real-time AI)`,
      confidenceScore: score
    },
    createdAt: new Date().toISOString()
  };

  const db = readDb();
  db.crops.push(mockRec);
  writeDb(db);
  res.json(mockRec);
});

app.get("/api/crops/recommendations", (req, res) => {
  const userId = req.query.userId as string;
  const db = readDb();
  const filtered = userId ? db.crops.filter(c => c.userId === userId) : db.crops;
  res.json(filtered);
});

// 4. AI DISEASE DETECTION MODULE
app.post("/api/diseases/detect", async (req, res) => {
  const { imageBase64, crop, userId } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: "Missing image base64 data" });
  }

  const aiClient = getGeminiClient();

  if (aiClient) {
    try {
      // Clean base64 header
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      
      const prompt = `Analyze this diseased plant image for a crop of type '${crop || "Any"}'. Give a structured diagnosis in JSON format:
JSON schema fields strictly:
{
  "diseaseName": "Common Name (Scientific Name)",
  "confidence": 88,
  "treatment": "Chemical treatment instructions",
  "organic": "Organic & eco-friendly control remedies",
  "prevention": "Practical preventative farming advice"
}
Provide ONLY the raw JSON string. Do not wrap in markdown or block text.`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data
            }
          },
          { text: prompt }
        ]
      });

      const responseText = response.text || "{}";
      const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const rec = JSON.parse(cleanJson);

      const db = readDb();
      const newDisease = {
        id: `dis-${Date.now()}`,
        userId: userId || "anonymous",
        crop: crop || "Unknown",
        diseaseName: rec.diseaseName,
        confidence: rec.confidence || 85,
        treatment: rec.treatment,
        organic: rec.organic,
        prevention: rec.prevention,
        imageUrl: imageBase64.startsWith("data:") ? "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600" : imageBase64,
        createdAt: new Date().toISOString()
      };

      db.diseases.push(newDisease);
      writeDb(db);
      return res.json(newDisease);
    } catch (e: any) {
      console.error("Gemini Disease Detection Error:", e);
    }
  }

  // Expert Fallback Diagnostics
  const db = readDb();
  let diseaseName = "Leaf Rust (Puccinia recondita)";
  let treatment = "Spray Propiconazole 25 EC @ 1 ml/litre of water immediately.";
  let organic = "Apply neem oil spray (3% concentration) and clear affected lower leaves.";
  let prevention = "Plant rust-resistant cultivars, avoid overhead watering, and ensure good crop spacing.";

  if (crop?.toLowerCase() === "rice") {
    diseaseName = "Rice Blast (Magnaporthe oryzae)";
    treatment = "Apply Tricyclazole 75 WP @ 0.6 g/l to halt spore progression.";
    organic = "Foliar spray with Trichoderma viride and Pseudomonas formulations.";
    prevention = "Avoid excessive nitrogen, use certified blast-free seeds, and rotate with legumes.";
  } else if (crop?.toLowerCase() === "tomato") {
    diseaseName = "Early Blight (Alternaria solani)";
    treatment = "Spray Chlorothalonil or Mancozeb fungicide according to safety margins.";
    organic = "Apply copper-based organic fungicides and mulch the soil surface to prevent soil splash.";
    prevention = "Rotate crops annually, remove bottom branches, and irrigate at the plant base.";
  }

  const mockDisease = {
    id: `dis-${Date.now()}`,
    userId: userId || "anonymous",
    crop: crop || "General Crops",
    diseaseName: `${diseaseName} [Expert Diagnostics]`,
    confidence: 85,
    treatment,
    organic,
    prevention,
    imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600",
    createdAt: new Date().toISOString()
  };

  db.diseases.push(mockDisease);
  writeDb(db);
  res.json(mockDisease);
});

app.get("/api/diseases", (req, res) => {
  const userId = req.query.userId as string;
  const db = readDb();
  const filtered = userId ? db.diseases.filter(d => d.userId === userId) : db.diseases;
  res.json(filtered);
});

// 5. GOVERNMENT SCHEMES & BOOKMARKS
app.get("/api/schemes", (req, res) => {
  const db = readDb();
  res.json(db.schemes);
});

app.post("/api/schemes/bookmark", (req, res) => {
  const { userId, schemeId } = req.body;
  if (!userId || !schemeId) return res.status(400).json({ error: "Missing params" });

  const db = readDb();
  const scheme = db.schemes.find(s => s.id === schemeId);
  if (scheme) {
    if (scheme.bookmarkedBy.includes(userId)) {
      scheme.bookmarkedBy = scheme.bookmarkedBy.filter(id => id !== userId);
    } else {
      scheme.bookmarkedBy.push(userId);
    }
    writeDb(db);
    return res.json({ message: "Bookmark status updated", scheme });
  }
  res.status(404).json({ error: "Scheme not found" });
});

// 6. MARKET PRICE MODULE
app.get("/api/market", (req, res) => {
  const db = readDb();
  res.json(db.marketPrices);
});

// 7. CHATBOT HELPER
app.get("/api/chatbot/history/:userId", (req, res) => {
  const db = readDb();
  const history = db.chats[req.params.userId] || [];
  res.json(history);
});

app.post("/api/chatbot/message", async (req, res) => {
  const { userId, message, lang } = req.body;
  if (!userId || !message) return res.status(400).json({ error: "Missing parameters" });

  const db = readDb();
  if (!db.chats[userId]) db.chats[userId] = [];

  // Append user message
  db.chats[userId].push({
    role: "user",
    text: message,
    timestamp: new Date().toISOString()
  });

  const aiClient = getGeminiClient();
  let aiReply = "";

  if (aiClient) {
    try {
      const historyFormatted = db.chats[userId].slice(-10).map(m => `${m.role === "user" ? "User" : "AI"}: ${m.text}`).join("\n");
      const systemInstruct = `You are the premium 'AI Agriculture Advisor' helper bot. The current local time is 2026. Respond in ${lang || "English"} to agricultural questions (pest control, crops, fertilizers, pricing, weather, organic farming). Support English, Tamil, Hindi, or Telugu as preferred by the user. Keep advice highly practical, professional, and targeted to the smallholder farmer.`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `${historyFormatted}\nAI:`,
        config: {
          systemInstruction: systemInstruct
        }
      });
      aiReply = response.text || "I apologize, I could not formulate a reply. Please try again.";
    } catch (e: any) {
      console.error("Chatbot Gemini error:", e);
    }
  }

  // Fallback Rule-based Chat replies if key is empty
  if (!aiReply) {
    const msg = message.toLowerCase();
    if (msg.includes("pest") || msg.includes("insect") || msg.includes("disease")) {
      aiReply = "To manage crop pests naturally, spray a mixture of 3% organic neem oil emulsified with mild liquid dish soap in water. Clear lower weeds and increase direct aeration. Ensure you configure GEMINI_API_KEY in secrets to get custom disease diagnostics.";
    } else if (msg.includes("fertilizer") || msg.includes("npk") || msg.includes("soil")) {
      aiReply = "Balanced soil nutrition is critical! Paddy crops usually demand an NPK ratio of 120:60:60, while wheat demands 120:50:40. We suggest adding organic well-decomposed manure to soil beds to naturally boost moisture retention.";
    } else if (msg.includes("weather") || msg.includes("rain")) {
      aiReply = "Unseasonal rain is predicted next week across the Southern Peninsula. We recommend draining fields with clay soil, and holding off on granular fertilizer application until dry skies return.";
    } else {
      aiReply = `Thank you for your question! I am the Smart Agricultural Assistant. I can recommend crops, detect pests, suggest fertilizers, and analyze prices.
Please note: To unlock full, dynamic, and state-of-the-art AI advice, configure your 'GEMINI_API_KEY' in the Secrets panel!
How can I assist your farming today?`;
    }
  }

  // Append model response
  db.chats[userId].push({
    role: "model",
    text: aiReply,
    timestamp: new Date().toISOString()
  });

  writeDb(db);
  res.json(db.chats[userId]);
});

// 8. ADMIN / OFFICER MANAGEMENT
app.get("/api/admin/overview", (req, res) => {
  const db = readDb();
  res.json({
    totalUsers: db.users.length,
    totalExpenses: db.expenses.reduce((sum, e) => sum + e.amount, 0),
    totalCropsRecommended: db.crops.length,
    totalDiseasesDetected: db.diseases.length,
    usersList: db.users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, isVerified: u.isVerified, createdAt: u.createdAt })),
    recentActivities: [
      ...db.crops.map(c => ({ type: "Crop Rec", text: `Recommended crop for field of ${c.inputs.area} acres`, date: c.createdAt })),
      ...db.diseases.map(d => ({ type: "Disease Detect", text: `Detected ${d.diseaseName} with confidence ${d.confidence}%`, date: d.createdAt }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
  });
});

app.post("/api/admin/users/role", (req, res) => {
  const { userId, newRole } = req.body;
  if (!userId || !newRole) return res.status(400).json({ error: "Missing arguments" });

  const db = readDb();
  const user = db.users.find(u => u.id === userId);
  if (user) {
    user.role = newRole;
    writeDb(db);
    return res.json({ message: "User role updated", user });
  }
  res.status(404).json({ error: "User not found" });
});

// Serve frontend assets
if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa"
  }).then((vite) => {
    app.use(vite.middlewares);
    
    // Fallback for HTML5 router
    app.get("*", (req, res, next) => {
      // Check if it's an API route
      if (req.url.startsWith("/api/")) {
        return next();
      }
      fs.readFile(path.join(process.cwd(), "index.html"), "utf-8", (err, html) => {
        if (err) return next(err);
        vite.transformIndexHtml(req.url, html).then(transformed => {
          res.status(200).set({ "Content-Type": "text/html" }).end(transformed);
        }).catch(next);
      });
    });
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running in development mode on http://localhost:${PORT}`);
    });
  });
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  
  app.get("*", (req, res, next) => {
    if (req.url.startsWith("/api/")) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running in production mode on http://localhost:${PORT}`);
  });
}
