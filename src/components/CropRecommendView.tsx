import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  BrainCircuit, 
  Sprout, 
  Activity, 
  Droplet, 
  TrendingUp, 
  ShieldAlert, 
  HelpCircle,
  FileSpreadsheet,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { CropInput, CropRecRecord, User } from "../types";

interface CropRecommendViewProps {
  user: User;
  onAddRecommendation: (rec: CropRecRecord) => void;
}

export default function CropRecommendView({ user, onAddRecommendation }: CropRecommendViewProps) {
  const [formData, setFormData] = useState<CropInput>({
    location: "Tamil Nadu, IN",
    season: "Kharif",
    soilType: "Clayey",
    pH: 6.5,
    nitrogen: 80,
    phosphorus: 40,
    potassium: 40,
    temp: 29,
    humidity: 75,
    rainfall: 1100,
    area: 3.5
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const loadProfile = (profileType: "rice" | "wheat" | "cotton") => {
    if (profileType === "rice") {
      setFormData({
        location: "Tamil Nadu, IN",
        season: "Kharif",
        soilType: "Clayey",
        pH: 6.6,
        nitrogen: 85,
        phosphorus: 42,
        potassium: 38,
        temp: 30,
        humidity: 80,
        rainfall: 1250,
        area: 4.5
      });
    } else if (profileType === "wheat") {
      setFormData({
        location: "Punjab, IN",
        season: "Rabi",
        soilType: "Loamy",
        pH: 7.2,
        nitrogen: 110,
        phosphorus: 55,
        potassium: 45,
        temp: 18,
        humidity: 50,
        rainfall: 450,
        area: 6.0
      });
    } else if (profileType === "cotton") {
      setFormData({
        location: "Gujarat, IN",
        season: "Kharif",
        soilType: "Black",
        pH: 7.8,
        nitrogen: 70,
        phosphorus: 35,
        potassium: 65,
        temp: 32,
        humidity: 60,
        rainfall: 750,
        area: 5.0
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const response = await fetch("/api/crops/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId: user?.id || "anonymous" })
      });
      
      const data = await response.json();
      if (response.ok) {
        setResult(data);
        onAddRecommendation(data);
      } else {
        setErrorMsg(data.error || "Failed to process recommendation");
      }
    } catch (e) {
      setErrorMsg("Connection failure. Serving local expert analytics.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-12">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <BrainCircuit className="w-7 h-7 text-emerald-600" />
          AI Crop Suitability Advisor
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Compute optimal crop recommendations based on complex NPK soil values, pH levels, temperature thresholds, and seasonal availability.
        </p>
      </div>

      {/* Preset Profiles */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Baseline Presets:</span>
        <button 
          onClick={() => loadProfile("rice")}
          className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-800 transition-colors"
        >
          🌾 Thanjavur Rice Profile
        </button>
        <button 
          onClick={() => loadProfile("wheat")}
          className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100/70 border border-amber-100 rounded-xl text-xs font-bold text-amber-800 transition-colors"
        >
          🌾 Punjab Wheat Profile
        </button>
        <button 
          onClick={() => loadProfile("cotton")}
          className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100/70 border border-purple-100 rounded-xl text-xs font-bold text-purple-800 transition-colors"
        >
          🌱 Gujarat Cotton Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location / State</label>
              <input 
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Tamil Nadu, IN"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Season</label>
              <select 
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value as any })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Kharif">Kharif (Monsoon Sowing)</option>
                <option value="Rabi">Rabi (Winter Sowing)</option>
                <option value="Zaid">Zaid (Summer Sowing)</option>
                <option value="Whole Year">Whole Year Sowing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Soil Classification</label>
              <select 
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value as any })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Alluvial">Alluvial (Very Fertile)</option>
                <option value="Black">Black (Rich Organic Cotton soil)</option>
                <option value="Red">Red (High iron)</option>
                <option value="Laterite">Laterite (Acidic, low nutrients)</option>
                <option value="Sandy">Sandy (Rapid draining)</option>
                <option value="Clayey">Clayey (Tight water retention)</option>
                <option value="Loamy">Loamy (Balanced mix)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Farm Area (Acres)</label>
              <input 
                type="number"
                min="0.1"
                step="0.1"
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="space-y-4 border-t border-slate-50 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Macro-Nutrients &amp; pH Level</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>Nitrogen (N) Dosage</span>
                  <span className="text-emerald-600">{formData.nitrogen} ppm</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="140"
                  value={formData.nitrogen}
                  onChange={(e) => setFormData({ ...formData, nitrogen: Number(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>Phosphorus (P) Dosage</span>
                  <span className="text-emerald-600">{formData.phosphorus} ppm</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="140"
                  value={formData.phosphorus}
                  onChange={(e) => setFormData({ ...formData, phosphorus: Number(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>Potassium (K) Dosage</span>
                  <span className="text-emerald-600">{formData.potassium} ppm</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="140"
                  value={formData.potassium}
                  onChange={(e) => setFormData({ ...formData, potassium: Number(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>Soil pH acidity</span>
                  <span className="text-amber-600">{formData.pH}</span>
                </div>
                <input 
                  type="range"
                  min="4.0"
                  max="9.0"
                  step="0.1"
                  value={formData.pH}
                  onChange={(e) => setFormData({ ...formData, pH: Number(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Microclimate Telemetries */}
          <div className="space-y-4 border-t border-slate-50 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Climate Telemetries</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                  <span>Temperature</span>
                  <span>{formData.temp}°C</span>
                </div>
                <input 
                  type="range"
                  min="10"
                  max="45"
                  value={formData.temp}
                  onChange={(e) => setFormData({ ...formData, temp: Number(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                  <span>Humidity</span>
                  <span>{formData.humidity}%</span>
                </div>
                <input 
                  type="range"
                  min="20"
                  max="100"
                  value={formData.humidity}
                  onChange={(e) => setFormData({ ...formData, humidity: Number(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                  <span>Rainfall Index</span>
                  <span>{formData.rainfall} mm</span>
                </div>
                <input 
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={formData.rainfall}
                  onChange={(e) => setFormData({ ...formData, rainfall: Number(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl transition-all shadow-md shadow-emerald-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Sensing Mineral Matrices &amp; Evaluating Gemini AI...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze Crop suitability &amp; Forecast Yield
              </>
            )}
          </button>
        </form>

        {/* Results output section */}
        <div className="lg:col-span-5">
          {errorMsg && (
            <div className="bg-red-50 text-red-700 text-xs font-semibold p-4 rounded-2xl border border-red-100 mb-4">
              {errorMsg}
            </div>
          )}

          {!result && !loading && (
            <div className="bg-slate-50 border border-dashed border-slate-200 p-12 text-center rounded-3xl h-full flex flex-col justify-center items-center">
              <BrainCircuit className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="font-bold text-sm text-slate-700">Awaiting Farm Inputs</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Configure your NPK matrices and climate sliders on the left, then trigger analysis to render AI reports.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-full flex flex-col justify-center items-center space-y-6">
              <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
              <div className="text-center">
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-widest">Running ML Evaluator</h3>
                <p className="text-xs text-slate-400 mt-1">Modeling nitrogen profiles &amp; precipitation metrics...</p>
              </div>
            </div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl space-y-6"
            >
              {/* Header result */}
              <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-50">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">AI Crop Recommendation</div>
                  <h3 className="text-2xl font-black text-slate-900 mt-1 leading-tight">{result.recommendation.bestCrop}</h3>
                </div>
                
                {/* Custom SVG confidence radial wheel */}
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="28" cy="28" r="24" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
                    <circle 
                      cx="28" 
                      cy="28" 
                      r="24" 
                      stroke="#10b981" 
                      strokeWidth="4" 
                      fill="transparent" 
                      strokeDasharray={`${2 * Math.PI * 24}`}
                      strokeDashoffset={`${2 * Math.PI * 24 * (1 - result.recommendation.confidenceScore / 100)}`}
                    />
                  </svg>
                  <span className="absolute text-xs font-black text-slate-800">{result.recommendation.confidenceScore}%</span>
                </div>
              </div>

              {/* Grid metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-2xl">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" /> Expected Yield
                  </div>
                  <div className="font-black text-slate-800 mt-1 text-sm">{result.recommendation.expectedYield}</div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Profit Estimate
                  </div>
                  <div className="font-black text-emerald-600 mt-1 text-sm">{result.recommendation.profitEstimate}</div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl col-span-2">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-blue-500" /> Water Requirement
                  </div>
                  <div className="font-bold text-slate-700 mt-1 text-xs leading-relaxed">{result.recommendation.waterRequirement}</div>
                </div>
              </div>

              {/* Detailed Fertilizer block */}
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-slate-400">NPK Fertilizer Schedule</div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100/30">
                  {result.recommendation.fertilizerPlan}
                </p>
              </div>

              {/* Detailed Risk block */}
              <div className="space-y-1.5 border-t border-slate-50 pt-4">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Risk Mitigation Analysis
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {result.recommendation.riskAnalysis}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
