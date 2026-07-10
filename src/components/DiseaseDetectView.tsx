import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Camera, 
  Upload, 
  AlertTriangle, 
  ShieldCheck, 
  Sprout, 
  RefreshCw, 
  Sparkles,
  Heart,
  Droplet,
  Info
} from "lucide-react";
import { DiseaseRecord, User } from "../types";

interface DiseaseDetectViewProps {
  user: User;
  onAddDisease: (record: DiseaseRecord) => void;
}

export default function DiseaseDetectView({ user, onAddDisease }: DiseaseDetectViewProps) {
  const [crop, setCrop] = useState("Rice");
  const [imageBase64, setImageBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Sample leaf disease preset specimens for easy testing/playgrounds
  const PRESETS = [
    {
      name: "Rice Blast Leaf Specimen",
      crop: "Rice",
      url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=60"
    },
    {
      name: "Tomato Blight Specimen",
      crop: "Tomato",
      url: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&auto=format&fit=crop&q=60"
    },
    {
      name: "Leaf Spot Specimen",
      crop: "General Crops",
      url: "https://images.unsplash.com/photo-1581093196867-9f6c5e57a216?w=600&auto=format&fit=crop&q=60"
    }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreset = (preset: typeof PRESETS[0]) => {
    setImageBase64(preset.url);
    setCrop(preset.crop);
    setResult(null);
    setErrorMsg("");
  };

  const handleDiagnose = async () => {
    if (!imageBase64) {
      setErrorMsg("Please select a leaf specimen or upload a leaf photo first.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const response = await fetch("/api/diseases/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          crop,
          userId: user?.id || "anonymous"
        })
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
        onAddDisease(data);
      } else {
        setErrorMsg(data.error || "Failed to diagnose plant pathology");
      }
    } catch (e) {
      setErrorMsg("Connection error. Generating expert diagnostic advice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-12">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Camera className="w-7 h-7 text-amber-600" />
          AI Leaf Disease Diagnostics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Instantly diagnose leaf blight, rust, pests, or nutritional deficiencies using computer vision and multimodal Gemini LLM analysis.
        </p>
      </div>

      {/* Grid wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left pane: Upload leaf sample */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm lg:col-span-6 space-y-6">
          
          {/* Crop selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Affected Crop Type</label>
            <select 
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="Rice">Paddy Rice</option>
              <option value="Wheat">Wheat</option>
              <option value="Tomato">Tomato</option>
              <option value="Cotton">Cotton</option>
              <option value="Corn">Corn / Maize</option>
              <option value="General Crops">Other / Unknown Crops</option>
            </select>
          </div>

          {/* Interactive drop zone */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Leaf Specimen Photo</label>
            
            <div className="relative border-2 border-dashed border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-slate-50/50 rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center min-h-[220px]">
              {imageBase64 ? (
                <div className="space-y-4">
                  <img 
                    src={imageBase64} 
                    alt="Leaf Specimen" 
                    className="max-h-[160px] object-cover rounded-xl shadow-sm border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <button 
                    onClick={() => setImageBase64("")}
                    className="text-xs font-bold text-red-600 hover:text-red-700 block mx-auto underline"
                  >
                    Remove specimen
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-amber-50 rounded-full text-amber-600 w-fit mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-700">Drag leaf photograph here</h3>
                    <p className="text-[11px] text-slate-400 mt-1">PNG, JPG formats up to 10MB supported</p>
                  </div>
                  <label className="inline-block px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 rounded-xl cursor-pointer shadow-sm transition-colors">
                    Browse Files
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Preset options */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">No Leaf Nearby? Select a Preset Specimen:</h4>
            <div className="flex flex-col gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectPreset(p)}
                  className="flex items-center gap-3 p-2 bg-slate-50 hover:bg-amber-50/50 border border-slate-100 rounded-xl text-left transition-colors"
                >
                  <img 
                    src={p.url} 
                    alt={p.name} 
                    className="w-10 h-10 object-cover rounded-lg shrink-0 border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">{p.name}</div>
                    <div className="text-[10px] text-slate-400">Classified: {p.crop}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Trigger button */}
          <button
            type="button"
            onClick={handleDiagnose}
            disabled={loading || !imageBase64}
            className="w-full py-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl transition-all shadow-md shadow-amber-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Diagnosing leaf spores &amp; evaluating pathology...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Diagnose Specimen Leaf
              </>
            )}
          </button>

        </div>

        {/* Right pane: Diagnosis report */}
        <div className="lg:col-span-6">
          {errorMsg && (
            <div className="bg-red-50 text-red-700 text-xs font-semibold p-4 rounded-2xl border border-red-100 mb-4">
              {errorMsg}
            </div>
          )}

          {!result && !loading && (
            <div className="bg-slate-50 border border-dashed border-slate-200 p-12 text-center rounded-3xl h-full min-h-[300px] flex flex-col justify-center items-center">
              <Camera className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="font-bold text-sm text-slate-700">Awaiting Specimen Diagnosis</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Select one of our preset crop leaf specimens or upload your own leaf photo, then trigger diagnosis to receive chemical &amp; bio-control plans.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-full min-h-[300px] flex flex-col justify-center items-center space-y-6">
              <div className="w-16 h-16 border-4 border-amber-100 border-t-amber-600 rounded-full animate-spin" />
              <div className="text-center">
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-widest">Running Plant Pathology AI</h3>
                <p className="text-xs text-slate-400 mt-1">Scanning cell pigmentation, analyzing spore vectors...</p>
              </div>
            </div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl space-y-6"
            >
              {/* Header result */}
              <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-50">
                <div>
                  <div className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">AI DIAGNOSED CONDITION</div>
                  <h3 className="text-xl font-black text-slate-900 mt-1 leading-tight">{result.diseaseName}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 font-bold">
                    <Sprout className="w-4 h-4 text-slate-500" /> Host Crop: {result.crop}
                  </div>
                </div>

                <div className="bg-amber-50 px-3 py-2 rounded-xl border border-amber-100/50 flex items-center gap-1.5 text-right">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase">CONFIDENCE</div>
                    <div className="font-black text-sm text-slate-800">{result.confidence}% match</div>
                  </div>
                </div>
              </div>

              {/* Treatment Sections */}
              <div className="space-y-4">
                
                {/* Organic / Bio Solution */}
                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-1.5">
                  <h4 className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-emerald-600" /> Organic &amp; Biological Remedies (Eco-Safe)
                  </h4>
                  <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                    {result.organic}
                  </p>
                </div>

                {/* Chemical Control */}
                <div className="p-4 bg-amber-50/30 border border-amber-100 rounded-2xl space-y-1.5">
                  <h4 className="text-xs font-extrabold text-amber-800 flex items-center gap-1.5">
                    <Droplet className="w-4 h-4 text-amber-600" /> Chemical Fungicides / Pesticides Plan
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {result.treatment}
                  </p>
                </div>

                {/* Prevention tips */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1.5">
                  <h4 className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-slate-600" /> Preventative Cultural Practices
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {result.prevention}
                  </p>
                </div>

              </div>

              {/* Local infection stats */}
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Local Incident Index</span>
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                  ⚠️ 3 cases reported within 15km
                </span>
              </div>

            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
