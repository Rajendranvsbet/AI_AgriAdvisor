import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Sprout, 
  BrainCircuit, 
  CloudSun, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  ShieldAlert, 
  ShieldCheck,
  Star,
  Activity,
  Droplet,
  Users,
  Award
} from "lucide-react";

interface LandingPageProps {
  onStart: (role?: string) => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [demoSoil, setDemoSoil] = useState("Clayey");
  const [demopH, setDemoPH] = useState(6.5);
  const [demoResult, setDemoResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const runMiniDemo = () => {
    setIsCalculating(true);
    setTimeout(() => {
      let crop = "Paddy / Basmati Rice";
      let confidence = 95;
      let moisture = "High water retention required";
      
      if (demoSoil === "Sandy") {
        crop = "Groundnuts / Millets";
        confidence = 88;
        moisture = "Drip irrigation suggested";
      } else if (demopH < 5.5) {
        crop = "Potato / Tea Plantations";
        confidence = 90;
        moisture = "Medium moisture, high acidity adaptation";
      } else if (demoSoil === "Black") {
        crop = "Cotton / Soybeans";
        confidence = 94;
        moisture = "Moderate moisture, rich organic retention";
      }
      
      setDemoResult({ crop, confidence, moisture });
      setIsCalculating(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Premium Elegant Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-md shadow-emerald-200">
              <Sprout className="w-6 h-6" />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight text-slate-900">
              AI Agri<span className="text-emerald-600">Advisor</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Features</a>
            <a href="#demo" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Live Demo</a>
            <a href="#stats" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Impact</a>
            <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Success Stories</a>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onStart("Farmer")}
              className="px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all"
            >
              Sign In
            </button>
            <button 
              onClick={() => onStart("Farmer")}
              className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-200 hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              Launch Platform <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Elegant Hero Section */}
      <section className="relative px-6 pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        {/* Subtle Decorative Background Blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-emerald-100/40 blur-3xl -z-10" />
        <div className="absolute bottom-[10%] right-[-15%] w-[45%] h-[55%] rounded-full bg-amber-100/30 blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Text */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-800 text-xs font-semibold uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4 text-emerald-600" />
              Empowering Smart Agriculture with Generative AI
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-sans tracking-tight text-slate-900 leading-tight">
              Sow Intelligently. <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Harvest Plentifully.
              </span>
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
              AI Agriculture Advisor leverages Google Gemini API, satellite insights, weather telemetry, and soil NPK matrices to give you accurate crop recommendations, real-time disease detection, and crop insurance scheme analysis.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <button
                onClick={() => onStart("Farmer")}
                className="px-8 py-4 text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2"
              >
                Access Farmer Dashboard <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => onStart("Agriculture Officer")}
                className="px-8 py-4 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl hover:translate-y-[-1px] transition-all shadow-sm flex items-center justify-center gap-2"
              >
                Officer Verification Portal
              </button>
            </div>

            {/* Quick Benefits Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="font-bold text-2xl text-slate-900">40%</div>
                <div className="text-xs text-slate-500 font-medium">Avg. Yield Gain</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-bold text-2xl text-slate-900">30%</div>
                <div className="text-xs text-slate-500 font-medium">Water Saved</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-bold text-2xl text-slate-900">₹18K+</div>
                <div className="text-xs text-slate-500 font-medium">Avg. Saving/Acre</div>
              </div>
            </div>
          </div>

          {/* Hero Decorative Floating Interface Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-md bg-white p-6 rounded-3xl shadow-2xl border border-slate-100"
            >
              <div className="absolute top-[-20px] right-[-20px] bg-amber-500 text-white p-3 rounded-2xl shadow-lg animate-bounce duration-1000">
                <CloudSun className="w-6 h-6" />
              </div>
              
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Live Soil Health Analytics</h3>
                  <p className="text-xs text-emerald-600 font-medium">Active Zone: Southern Deccan</p>
                </div>
              </div>

              {/* Mock Sensor Grid */}
              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Moisture Content</span>
                    <span className="text-emerald-600">68% (Optimal)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "68%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Nitrogen (N) Dosage</span>
                    <span className="text-amber-600">42 ppm (Deficient)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "42%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Phosphorus (P) Dosage</span>
                    <span className="text-emerald-600">76 ppm (Optimal)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "76%" }} />
                  </div>
                </div>
              </div>

              {/* Intelligent AI Banner inside Hero Card */}
              <div className="mt-5 p-3.5 bg-emerald-50/70 border border-emerald-100/50 rounded-2xl">
                <div className="flex gap-2.5">
                  <BrainCircuit className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    &ldquo;Current N-Deficiency diagnosed. Recommended adding bio-compost or organic nitrogen spikes to increase expected yield by 15% before flowering starts.&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section id="features" className="py-20 bg-white border-y border-slate-100 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-sm font-bold text-emerald-600 tracking-wider uppercase">Advanced Farming Modules</h2>
            <p className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              One Unified Smart Platform for High Yields
            </p>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              Our comprehensive suite uses specialized ML models alongside state-of-the-art Generative AI for end-to-end guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-slate-50 hover:bg-slate-100/70 transition-all rounded-3xl border border-slate-100 group">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Crop Recommendation Engine</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Enter NPK values, pH levels, location metrics, and water sources to get highly tailored crops and yield estimations.
              </p>
              <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1 cursor-pointer" onClick={() => onStart("Farmer")}>
                Try Crop Recommendation <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-slate-50 hover:bg-slate-100/70 transition-all rounded-3xl border border-slate-100 group">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">AI Leaf Disease Detection</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Simply upload images of leaves or snap pictures with your phone camera. Gemini instantly detects pests and suggests cures.
              </p>
              <div className="text-xs text-amber-700 font-semibold flex items-center gap-1 cursor-pointer" onClick={() => onStart("Farmer")}>
                Try Crop Diagnosis <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-slate-50 hover:bg-slate-100/70 transition-all rounded-3xl border border-slate-100 group">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <CloudSun className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Weather &amp; Irrigation Planner</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Integrates dynamic regional hourly and 7-day weather matrices with soil moisture levels to generate precision water schedules.
              </p>
              <div className="text-xs text-blue-700 font-semibold flex items-center gap-1 cursor-pointer" onClick={() => onStart("Farmer")}>
                Check Rain Forecast <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-slate-50 hover:bg-slate-100/70 transition-all rounded-3xl border border-slate-100 group">
              <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Market Pricing &amp; Analytics</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Track historical commodity price fluctuations, current yard demand indexes, and future price forecast models.
              </p>
              <div className="text-xs text-purple-700 font-semibold flex items-center gap-1 cursor-pointer" onClick={() => onStart("Farmer")}>
                Explore Yard Prices <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-slate-50 hover:bg-slate-100/70 transition-all rounded-3xl border border-slate-100 group">
              <div className="p-3 bg-red-100 text-red-700 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Govt Schemes &amp; Subsidies</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Never miss critical agricultural programs. Search, check direct criteria eligibility, and bookmark schemes.
              </p>
              <div className="text-xs text-red-700 font-semibold flex items-center gap-1 cursor-pointer" onClick={() => onStart("Farmer")}>
                View Active Subsidies <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-slate-50 hover:bg-slate-100/70 transition-all rounded-3xl border border-slate-100 group">
              <div className="p-3 bg-teal-100 text-teal-700 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Multilingual Voice AI Bot</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Chat naturally in English, Tamil, Hindi, or Telugu. Voice inputs and context history are supported instantly.
              </p>
              <div className="text-xs text-teal-700 font-semibold flex items-center gap-1 cursor-pointer" onClick={() => onStart("Farmer")}>
                Open Conversation AI <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live AI Demo Section */}
      <section id="demo" className="py-20 bg-slate-50 px-6">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="px-3 py-1 bg-amber-50 border border-amber-100 rounded-full text-xs font-bold text-amber-800 uppercase">
              Interactive Playground
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-3">
              Test Our Crop Recommendation Logic
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Select soil types and pH factors below to see expert recommendations dynamically computed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Soil Type</label>
              <select 
                value={demoSoil}
                onChange={(e) => setDemoSoil(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-medium text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Clayey">Clayey (Retains high moisture)</option>
                <option value="Sandy">Sandy (High drainage, low N)</option>
                <option value="Black">Black (Rich, clayey organic)</option>
                <option value="Loamy">Loamy (Balanced mixture)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Soil pH level ({demopH})</label>
              <input 
                type="range"
                min="4.5"
                max="8.5"
                step="0.1"
                value={demopH}
                onChange={(e) => setDemoPH(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 mt-2 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                <span>Highly Acidic (4.5)</span>
                <span>Neutral (7.0)</span>
                <span>Alkaline (8.5)</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <button
              onClick={runMiniDemo}
              disabled={isCalculating}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-emerald-200 disabled:opacity-50"
            >
              {isCalculating ? "Calculating Recommendation..." : "Evaluate Soil Suitability"}
            </button>
          </div>

          {demoResult && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800">RECOMMENDED CROP</div>
                <div className="font-extrabold text-lg text-emerald-950 mt-0.5">{demoResult.crop}</div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-blue-500" /> {demoResult.moisture}
                </div>
              </div>
              <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-100/50 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Confidence</div>
                  <div className="font-extrabold text-sm text-slate-800">{demoResult.confidence}% match</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Impact Statistics */}
      <section id="stats" className="py-16 bg-slate-900 text-white px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-emerald-400 font-bold tracking-wider uppercase text-xs mb-10">AgriAdvisor National Reach</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-emerald-400">120K+</div>
              <div className="text-xs text-slate-400 font-medium mt-2">Active Smallholder Farmers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-emerald-400">18 Cr+</div>
              <div className="text-xs text-slate-400 font-medium mt-2">INR In Savings Generated</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-emerald-400">4.7★</div>
              <div className="text-xs text-slate-400 font-medium mt-2">Farmer Satisfaction Rating</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-emerald-400">14 States</div>
              <div className="text-xs text-slate-400 font-medium mt-2">Active Agricultural Zones</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Testimonials</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">Sustaining Farmer Livelihoods</h2>
            <p className="text-slate-500 text-sm mt-1">Discover stories from fields that have integrated AI AgriAdvisor.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <p className="text-slate-600 text-sm italic leading-relaxed mb-6">
                &ldquo;By utilizing the Soil Analysis inputs on the platform, I realized my fields were overdosed with Potassium and deficient in Nitrogen. Rectifying this saved ₹12,000 in fertilizer costs and boosted our paddy grains.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700">MR</div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Muthvel Rajan</h4>
                  <p className="text-xs text-slate-500">Paddy Farmer, Thanjavur, TN</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <p className="text-slate-600 text-sm italic leading-relaxed mb-6">
                &ldquo;Leaf disease diagnosis was a huge issue. We used to wait days for a field officer. Now we take a crop photo, upload it to the platform, and get chemical or organic solutions in 10 seconds.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center font-bold text-amber-700">KS</div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Kulvinder Singh</h4>
                  <p className="text-xs text-slate-500">Wheat Cultivator, Bhatinda, PB</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <p className="text-slate-600 text-sm italic leading-relaxed mb-6">
                &ldquo;The dynamic market price tracking is very accurate. It helps me choose which yards offer premium payouts before hauling transport, preventing price exploitation by middlemen.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center font-bold text-teal-700">RP</div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Ramesh Patel</h4>
                  <p className="text-xs text-slate-500">Cotton Farmer, Rajkot, GJ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white">
            <Sprout className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-lg">AI Agriculture Advisor</span>
          </div>
          <p className="text-xs font-sans text-center md:text-right">
            &copy; 2026 AI Agriculture Advisor Platform. Powered by Google Gemini. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
