import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CloudSun,
  Thermometer,
  Droplet,
  Wind,
  Compass,
  Sprout,
  AlertTriangle,
  Activity,
  ArrowRight,
  DollarSign,
  Clipboard,
  TrendingUp,
  BrainCircuit,
  Bell,
  Sun,
  Moon,
  Search,
  Mic,
  Languages,
  RefreshCw,
  Cpu,
  Battery,
  Zap,
  ShieldAlert,
  AlertCircle,
  Play,
  X,
  Map,
  Satellite,
  Layers,
  Info,
  Calendar,
  Plus,
  Trash2,
  Check,
  Clock,
  Radio,
  MessageSquare,
  Volume2,
  HelpCircle,
  Award,
  Camera,
  Sparkles
} from "lucide-react";
import { User, Expense, CropRecRecord, DiseaseRecord } from "../types";

interface DashboardViewProps {
  user: User;
  expenses: Expense[];
  cropRecs: CropRecRecord[];
  diseases: DiseaseRecord[];
  onNavigate: (tab: string) => void;
  isCyber: boolean;
  setIsCyber: (val: boolean) => void;
}

export default function DashboardView({
  user,
  expenses,
  cropRecs,
  diseases,
  onNavigate,
  isCyber,
  setIsCyber
}: DashboardViewProps) {
  // Theme & Language Settings
  const [lang, setLang] = useState<"EN" | "TA" | "HI" | "ES">("EN");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [voiceActive, setVoiceActive] = useState(false);
  const [mapSatellite, setMapSatellite] = useState(false);
  const [selectedField, setSelectedField] = useState("Field Alpha");
  const [isScanning, setIsScanning] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiModalText, setAiModalText] = useState("");
  const [smartIrrigation, setSmartIrrigation] = useState(true);

  // Notes persistence
  const [farmerNotes, setFarmerNotes] = useState(() => {
    return localStorage.getItem("agri_notes") || "Schedule soil testing for the southern fields. Nitrogen levels might need replenishment.";
  });

  useEffect(() => {
    localStorage.setItem("agri_notes", farmerNotes);
  }, [farmerNotes]);

  // Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Multi-Language Localization
  const t = {
    EN: {
      welcome: "Welcome Back, Chief Grower",
      subWelcome: "System online. Drone telemetry synchronizing. Microclimates are stable.",
      stats: "Live Grid Telemetry",
      recommend: "Today's AI Advisory",
      recommendVal: "A 12% boost in overnight moisture is projected. Delay drone fungicide spray until Thursday 08:00 AM.",
      soilScore: "Soil Health Index",
      irrigation: "Autonomous Drip Line",
      active: "Active",
      inactive: "Paused",
      scanBtn: "Execute Crop Scan",
      aiVoice: "Consult AI Assistant",
      sosBtn: "SOS Emergency",
      mapTitle: "Digital Twin Wireframe Map",
      fieldInfo: "Active Field Analytics",
      tasks: "Upcoming Directives",
      notes: "Tactical Notes Pad",
      recentLogs: "Telemetry Event Feed",
      clearNotes: "Reset Notes"
    },
    TA: {
      welcome: "மீண்டும் வருக, தலைமை விவசாயி",
      subWelcome: "அமைப்பு செயல்பாட்டில் உள்ளது. ட்ரோன் தரவு ஒத்திசைக்கப்படுகிறது.",
      stats: "நேரடி சென்சார் அளவீடுகள்",
      recommend: "இன்றைய செயற்கை நுண்ணறிவு ஆலோசனை",
      recommendVal: "இரவில் ஈரப்பதம் 12% அதிகரிக்கும் என எதிர்பார்க்கப்படுகிறது. வியாழக்கிழமை வரை மருந்து தெளிப்பதை ஒத்திவைக்கவும்.",
      soilScore: "மண் ஆரோக்கிய குறியீடு",
      irrigation: "தானியங்கி சொட்டு நீர் பாசனம்",
      active: "செயலில்",
      inactive: "நிறுத்தப்பட்டது",
      scanBtn: "பயிர்களை ஸ்கேன் செய்",
      aiVoice: "உதவியாளரைத் தொடர்பு கொள்",
      sosBtn: "அவசரகால உதவி",
      mapTitle: "டிஜிட்டல் பண்ணை வரைபடம்",
      fieldInfo: "செயலில் உள்ள புல பகுப்பாய்வு",
      tasks: "வரவிருக்கும் பணிகள்",
      notes: "விவசாயக் குறிப்பேடு",
      recentLogs: "சமீபத்திய தரவு பதிவுகள்",
      clearNotes: "குறிப்புகளை மீட்டமை"
    },
    HI: {
      welcome: "स्वागत है, मुख्य कृषक",
      subWelcome: "प्रणाली ऑनलाइन है। ड्रोन टेलीमेट्री सिंक हो रही है। सूक्ष्म जलवायु स्थिर है।",
      stats: "लाइव ग्रिड टेलीमेट्री",
      recommend: "आज की एआई सलाह",
      recommendVal: "रात में नमी में 12% की वृद्धि का अनुमान है। गुरुवार सुबह 8 बजे तक ड्रोन स्प्रे स्थगित करें।",
      soilScore: "मृदा स्वास्थ्य सूचकांक",
      irrigation: "स्वायत्त ड्रिप सिंचाई",
      active: "सक्रिय",
      inactive: "विराम",
      scanBtn: "क्रॉप स्कैन चलाएं",
      aiVoice: "एआई सहायक से बात करें",
      sosBtn: "आपातकालीन एसओएस",
      mapTitle: "डिजिटल ट्विन फार्म मैप",
      fieldInfo: "सक्रिय क्षेत्र विश्लेषण",
      tasks: "आगामी निर्देश",
      notes: "सामरिक नोट्स पैड",
      recentLogs: "टेलीमेट्री इवेंट फीड",
      clearNotes: "नोट्स रीसेट करें"
    },
    ES: {
      welcome: "Bienvenido, Agricultor Principal",
      subWelcome: "Sistema en línea. Telemetría de drones sincronizada. Microclimas estables.",
      stats: "Telemetría de Red en Vivo",
      recommend: "Asesoramiento de IA Hoy",
      recommendVal: "Se prevé un aumento de humedad del 12%. Retrase la fumigación con drones hasta el jueves a las 08:00 AM.",
      soilScore: "Salud del Suelo",
      irrigation: "Riego Goteo Autónomo",
      active: "Activo",
      inactive: "Pausado",
      scanBtn: "Escanear Cultivos",
      aiVoice: "Consultar Asistente IA",
      sosBtn: "Emergencia SOS",
      mapTitle: "Mapa Digital del Campo",
      fieldInfo: "Análisis de Campo Activo",
      tasks: "Directivas Pendientes",
      notes: "Bloc de Notas Tácticas",
      recentLogs: "Registro de Telemetría",
      clearNotes: "Reiniciar Notas"
    }
  }[lang];

  // Simulated live counter that fluctuates
  const [moistureVal, setMoistureVal] = useState(68);
  useEffect(() => {
    const interval = setInterval(() => {
      setMoistureVal(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next >= 64 && next <= 72 ? next : prev;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 15 Futuristic telemetry points configuration
  const telemetry = [
    { id: "temp", title: "Air Temp", val: "29.4 °C", status: "Optimal", color: "from-emerald-500 to-teal-400", glow: "shadow-emerald-500/20", icon: Thermometer, trend: [24, 25, 27, 29, 29, 28, 29.4] },
    { id: "humidity", title: "Humidity", val: "54.2 %", status: "Stable", color: "from-blue-500 to-indigo-400", glow: "shadow-blue-500/20", icon: CloudSun, trend: [51, 52, 54, 55, 53, 54, 54.2] },
    { id: "soil", title: "Soil Moisture", val: `${moistureVal} %`, status: "Perfect", color: "from-cyan-500 to-blue-400", glow: "shadow-cyan-500/20", icon: Droplet, trend: [66, 67, 65, 68, 67, 68, moistureVal] },
    { id: "wind", title: "Wind Speed", val: "14.2 km/h", status: "Moderate", color: "from-sky-500 to-emerald-400", glow: "shadow-sky-500/20", icon: Wind, trend: [11, 13, 15, 14, 12, 14, 14.2] },
    { id: "rain", title: "Rain Chance", val: "15 %", status: "Low Risk", color: "from-violet-500 to-fuchsia-400", glow: "shadow-violet-500/20", icon: Compass, trend: [10, 15, 15, 10, 20, 15, 15] },
    { id: "sun", title: "UV Radiance", val: "7.8 kW/m²", status: "High Gen", color: "from-amber-500 to-yellow-400", glow: "shadow-amber-500/20", icon: Sun, trend: [6.1, 7.0, 7.5, 7.8, 7.6, 7.8, 7.8] },
    { id: "aqi", title: "Air Quality", val: "32 AQI", status: "Pristine", color: "from-emerald-600 to-green-400", glow: "shadow-emerald-600/20", icon: Activity, trend: [40, 38, 35, 32, 31, 33, 32] },
    { id: "cropHealth", title: "Crop Canopy", val: "97.4 %", status: "Healthy", color: "from-lime-500 to-emerald-400", glow: "shadow-lime-500/20", icon: Sprout, trend: [95, 96, 96.5, 97, 97.2, 97.4, 97.4] },
    { id: "waterTank", title: "Reservoir", val: "88.2 %", status: "Full Cap", color: "from-blue-600 to-teal-400", glow: "shadow-blue-600/20", icon: Award, trend: [92, 91, 90, 89, 88.5, 88.2, 88.2] },
    { id: "battery", title: "Power Bank", val: "94.0 %", status: "Charging", color: "from-amber-400 to-orange-500", glow: "shadow-amber-400/20", icon: Battery, trend: [80, 82, 85, 90, 92, 94, 94] },
    { id: "solar", title: "Solar Yield", val: "12.8 kWh", status: "Optimal", color: "from-yellow-400 to-red-500", glow: "shadow-yellow-400/20", icon: Zap, trend: [8, 10, 11, 12, 12.5, 12.8, 12.8] },
    { id: "drone", title: "Drone Scout", val: "Patrolling", status: "Online", color: "from-purple-500 to-pink-500", glow: "shadow-purple-500/20", icon: Cpu, trend: [1, 1, 1, 1, 1, 1, 1] },
    { id: "aiConf", title: "AI Precision", val: "98.9 %", status: "Validated", color: "from-teal-400 to-cyan-500", glow: "shadow-teal-400/20", icon: BrainCircuit, trend: [98.1, 98.4, 98.6, 98.9, 98.9, 98.9, 98.9] },
    { id: "market", title: "Tomato Index", val: "₹48.50 /kg", status: "+12.4% Up", color: "from-emerald-500 to-green-600", glow: "shadow-emerald-500/20", icon: TrendingUp, trend: [42, 44, 45, 48, 47, 48.5, 48.5] },
    { id: "pest", title: "Pest Risk", val: "2.1 %", status: "Negligible", color: "from-rose-500 to-red-400", glow: "shadow-rose-500/20", icon: ShieldAlert, trend: [5, 4, 3, 2.5, 2.2, 2.1, 2.1] }
  ];

  // Simulated interactive actions
  const triggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setAiModalText("Drone Multispectral Scan Complete. Field Alpha Canopy Nitrogen is 102ppm (Target: 100ppm). No fungal spots or chlorosis detected. Soil hydration score is perfect at 94%!");
      setShowAiModal(true);
    }, 2200);
  };

  const consultAiAssistant = () => {
    setAiModalText("Greetings, Farmer! My neural network shows stable weather ahead. High temperature warning Wednesday will trigger automated nocturnal irrigation on Field Beta to conserve water. Ground sensors look outstanding!");
    setShowAiModal(true);
  };

  const triggerSos = () => {
    setAiModalText("⚠️ EMERGENCY TRANSMISSION INITIALIZED: SOS Beacon broadcast to local extension officer (Officer Muthu). Water supply valve backup activated. System diagnostics locked at stable protocols.");
    setShowAiModal(true);
  };

  const handleCardClick = (id: string) => {
    if (["temp", "humidity", "soil", "wind", "rain", "sun", "aqi", "waterTank", "battery", "solar"].includes(id)) {
      onNavigate("weather");
    } else if (["cropHealth", "pest"].includes(id)) {
      onNavigate("disease");
    } else if (["drone"].includes(id)) {
      triggerScan();
    } else if (["aiConf"].includes(id)) {
      onNavigate("chatbot");
    } else if (["market"].includes(id)) {
      onNavigate("expenses");
    }
  };

  // Recent combined operations feed
  const combinedFeed = [
    ...cropRecs.map(cr => ({
      id: cr.id,
      title: "AI Crop Advising",
      detail: `Advised ${cr.recommendation.bestCrop} (${cr.recommendation.confidenceScore}% match)`,
      time: "Recent Rec",
      type: "crop"
    })),
    ...diseases.map(d => ({
      id: d.id,
      title: "Crop Scan Defend",
      detail: `${d.diseaseName} on ${d.crop} (${d.confidence}% conf)`,
      time: "Recent Scan",
      type: "disease"
    })),
    ...expenses.map(e => ({
      id: e.id,
      title: `Logged ${e.category} Cost`,
      detail: `${e.description || e.category} - ₹${e.amount}`,
      time: "Recent Cost",
      type: "expense"
    }))
  ].slice(0, 4);

  // Fallback items if feed is empty
  const defaultFeed = [
    { id: "f-1", title: "Weather Alert Sync", detail: "Scouting drone detected morning wind velocities of 14km/h", time: "1 hour ago", type: "system" },
    { id: "f-2", title: "Autonomous Siphon Status", detail: "Reservoir topped up to 88% capacity from solar pumping terminal", time: "3 hours ago", type: "water" },
    { id: "f-3", title: "Canopy Index Update", detail: "Average NDRE index increased to 0.74 indicating excellent leaf nitrogen", time: "Yesterday", type: "crop" }
  ];

  const actualFeed = combinedFeed.length > 0 ? combinedFeed : defaultFeed;

  return (
    <div className={`space-y-6 font-sans pb-16 transition-colors duration-500 ${isCyber ? "text-slate-100" : "text-slate-800"}`}>
      
      {/* 3D Animated Farmland Landscape Canvas Layer */}
      <div className={`relative w-full h-48 md:h-64 rounded-3xl overflow-hidden border shadow-inner transition-all duration-500 ${
        isCyber 
          ? "bg-gradient-to-b from-indigo-950 via-slate-900 to-emerald-950/80 border-emerald-500/20" 
          : "bg-gradient-to-b from-sky-200 via-blue-100 to-emerald-100 border-slate-200"
      }`}>
        {/* Glowing Ambient Grid / Cyber Sunlight Reflections */}
        <div className={`absolute inset-0 bg-grid-pattern opacity-10 ${isCyber ? "bg-emerald-500" : "bg-slate-700"}`} />
        
        {/* Rotating Sun / Glowing Moon Orb */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
          className={`absolute top-4 left-1/4 w-12 h-12 rounded-full filter blur-[4px] shadow-lg flex items-center justify-center ${
            isCyber ? "bg-amber-100/95 shadow-amber-300/50" : "bg-amber-400 shadow-amber-500/50"
          }`}
        >
          {isCyber ? <Moon className="w-5 h-5 text-indigo-900" /> : <Sun className="w-6 h-6 text-white" />}
        </motion.div>

        {/* Parallax Mountains background */}
        <div className="absolute bottom-0 w-full flex items-end justify-between px-4 opacity-40">
          <svg className="w-1/3 h-20 text-slate-700/40 fill-current" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="0,100 50,20 100,100" />
          </svg>
          <svg className="w-1/2 h-28 text-emerald-800/20 fill-current" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="0,100 40,10 80,100" />
          </svg>
          <svg className="w-1/4 h-16 text-slate-700/30 fill-current" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="0,100 50,30 100,100" />
          </svg>
        </div>

        {/* Animated Flying Birds */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ x: "-10%", y: "40%" }}
            animate={{ x: "110%", y: "20%" }}
            transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
            className="flex gap-4 text-xs"
          >
            <span className="animate-bounce">🕊️</span>
            <span className="animate-bounce delay-1000">🕊️</span>
            <span className="animate-bounce delay-500">🕊️</span>
          </motion.div>
        </div>

        {/* Floating Clouds */}
        <div className="absolute inset-x-0 top-6 pointer-events-none opacity-60">
          <motion.div
            initial={{ x: "-30%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="w-24 h-8 bg-white/70 rounded-full filter blur-[3px]"
          />
          <motion.div
            initial={{ x: "110%" }}
            animate={{ x: "-50%" }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="w-32 h-10 bg-white/40 rounded-full filter blur-[4px] mt-2"
          />
        </div>

        {/* Interactive Simulated 3D Farmland Blocks (Digital Twin Representation) */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-emerald-900/45 backdrop-blur-xs border-t border-emerald-500/20 flex items-center justify-around px-2 md:px-8">
          {["Field Alpha", "Field Beta", "Field Gamma", "Field Delta"].map((fld) => {
            const isActive = selectedField === fld;
            return (
              <button
                key={fld}
                onClick={() => setSelectedField(fld)}
                className={`relative px-3.5 py-1.5 rounded-xl border font-bold text-[10px] md:text-xs transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-emerald-500 text-slate-900 border-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.5)] scale-105"
                    : isCyber
                      ? "bg-slate-900/80 text-slate-300 border-slate-700 hover:border-emerald-500/40"
                      : "bg-white/90 text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-1">
                  <Sprout className={`w-3.5 h-3.5 ${isActive ? "animate-pulse" : ""}`} />
                  {fld}
                </div>
                {/* Laser scan lines overlay for active field */}
                {isActive && (
                  <div className="absolute inset-x-0 -top-8 h-8 pointer-events-none overflow-hidden">
                    <div className="w-full h-[1.5px] bg-emerald-400 animate-pulse" />
                    <div className="w-full h-full bg-emerald-400/10 animate-pulse filter blur-xs" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Drone Scanning Beam Animation Overlay */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/25 to-transparent h-full w-full animate-pulse flex items-center justify-center">
            <div className="w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-bounce" />
            <span className="absolute text-cyan-400 font-mono text-[10px] uppercase font-bold tracking-widest bg-slate-950/80 px-2.5 py-1 rounded-full border border-cyan-400 animate-pulse">
              Multispectral Scanning Matrix Active
            </span>
          </div>
        )}

        {/* Title branding on Farmland overlay */}
        <div className="absolute top-4 left-4 p-3 bg-slate-950/70 backdrop-blur-md rounded-2xl border border-slate-800 flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500 text-slate-950 rounded-xl">
            <BrainCircuit className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <span className="font-black text-xs md:text-sm text-white tracking-widest">AGRIADVISOR <span className="text-emerald-400">AI</span></span>
            <span className="block text-[8px] text-slate-400 tracking-wider">SECURE DIGITAL TWIN PLATFORM</span>
          </div>
        </div>

        {/* Day/Night Theme toggler floating block */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setIsCyber(!isCyber)}
            className="p-2.5 bg-slate-950/70 hover:bg-slate-900/90 text-white rounded-xl border border-slate-800 transition-all cursor-pointer shadow-lg hover:border-emerald-500"
            title="Toggle Light / Cyber Neon Theme"
          >
            {isCyber ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Dynamic Advanced Top bar with Search, Language switcher, and AI status */}
      <div className={`p-4 rounded-3xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 transition-all ${
        isCyber ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100 shadow-xs"
      }`}>
        {/* Global Search and Speech Mock */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Query telemetry, machinery, or crops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-10 py-2 rounded-xl text-xs font-semibold outline-none transition-all ${
              isCyber
                ? "bg-slate-950 text-slate-100 border border-slate-800 focus:border-emerald-500"
                : "bg-slate-50 text-slate-800 border border-slate-200 focus:border-emerald-600"
            }`}
          />
          <button
            onClick={() => {
              setVoiceActive(true);
              setTimeout(() => {
                setVoiceActive(false);
                setSearchQuery("Soil Nitrogen levels Field Alpha");
              }, 1800);
            }}
            className="absolute right-2.5 top-2 p-1.5 hover:bg-slate-800 hover:text-emerald-400 text-slate-400 rounded-lg transition-colors cursor-pointer"
            title="Simulate AI Voice Search"
          >
            <Mic className={`w-3.5 h-3.5 ${voiceActive ? "text-emerald-400 animate-ping" : ""}`} />
          </button>
        </div>

        {/* Real Dynamic Language Selector */}
        <div className="flex flex-wrap items-center gap-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-450">
            <Languages className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Lang:</span>
            <div className={`flex rounded-lg p-0.5 border ${
              isCyber ? "bg-slate-950/80 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              {(["EN", "TA", "HI", "ES"] as const).map((ln) => (
                <button
                  key={ln}
                  onClick={() => setLang(ln)}
                  className={`px-2 py-1 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                    lang === ln 
                      ? (isCyber ? "bg-emerald-500 text-slate-950" : "bg-emerald-600 text-white") 
                      : (isCyber ? "text-slate-450 hover:text-white" : "text-slate-500 hover:text-slate-800")
                  }`}
                >
                  {ln}
                </button>
              ))}
            </div>
          </div>

          {/* Time & GPS Coordinate */}
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span className={`font-mono text-[10px] md:text-xs font-extrabold tracking-wider px-3 py-1 rounded-lg border ${
              isCyber 
                ? "bg-slate-950/80 text-emerald-400 border-emerald-950" 
                : "bg-white text-emerald-700 border-emerald-200 shadow-xs"
            }`}>
              {currentTime.toLocaleTimeString()}
            </span>
          </div>

          <div className={`hidden lg:flex items-center gap-2 text-xs font-bold ${
            isCyber ? "text-slate-450" : "text-slate-500"
          }`}>
            <Compass className="w-3.5 h-3.5 text-slate-500 animate-spin-slow" />
            <span>11.1278° N, 78.6569° E</span>
          </div>
        </div>
      </div>

      {/* Advanced HUD Welcome Panel with Live AI Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Welcome & AI Advisory Card */}
        <div className={`p-6 rounded-3xl border relative overflow-hidden lg:col-span-8 flex flex-col justify-between gap-6 transition-all ${
          isCyber 
            ? "bg-slate-950/80 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.08)]" 
            : "bg-white border-slate-100 shadow-xl"
        }`}>
          {/* Neon side indicator */}
          <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-emerald-500 to-teal-400" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pl-2">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                CONNECTED TELEMETRY ACTIVE
              </span>
              <h2 className={`text-xl md:text-2xl font-black tracking-tight ${isCyber ? "text-slate-100" : "text-slate-800"}`}>
                {t.welcome}, <span className="text-emerald-400">{user?.name || "Grower"}</span>!
              </h2>
              <p className="text-xs text-slate-400 mt-1">{t.subWelcome}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Irrigation Valve</span>
              <button
                onClick={() => setSmartIrrigation(!smartIrrigation)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                  smartIrrigation 
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                    : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${smartIrrigation ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
                  {smartIrrigation ? t.active : t.inactive}
                </div>
              </button>
            </div>
          </div>

          {/* AI Advisory block */}
          <div className={`p-4 border rounded-2xl flex items-start gap-3.5 relative overflow-hidden transition-colors ${
            isCyber 
              ? "bg-slate-900/80 border-slate-800" 
              : "bg-emerald-50/70 border-emerald-100/70"
          }`}>
            <div className={`absolute top-0 right-0 p-1 rounded-bl-xl font-bold text-[8px] uppercase tracking-wider ${
              isCyber ? "bg-emerald-500 text-slate-950" : "bg-emerald-600 text-white"
            }`}>
              Nvidia AI Edge
            </div>
            <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
              isCyber ? "bg-emerald-500 text-slate-950" : "bg-emerald-600 text-white"
            }`}>
              <BrainCircuit className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h4 className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                isCyber ? "text-emerald-400" : "text-emerald-700"
              }`}>
                <Sparkles className="w-3.5 h-3.5" />
                {t.recommend}
              </h4>
              <p className={`text-xs leading-relaxed mt-1 font-medium ${
                isCyber ? "text-slate-300" : "text-slate-700"
              }`}>
                {t.recommendVal}
              </p>
            </div>
          </div>

          {/* Landscape selector detail stats for Field */}
          <div className={`grid grid-cols-3 gap-3.5 pl-2 pt-2 border-t ${
            isCyber ? "border-slate-800/60" : "border-slate-100"
          }`}>
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Target Canopy</span>
              <span className="text-base font-black text-emerald-400">97.4% Density</span>
            </div>
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Sensor Pulse</span>
              <span className={`text-base font-black flex items-center gap-1 ${
                isCyber ? "text-slate-100" : "text-slate-800"
              }`}>
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                94 / 100
              </span>
            </div>
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Telemetry Class</span>
              <span className="text-base font-black text-teal-400 uppercase tracking-widest text-[11px] md:text-sm">
                {user?.role || "FARMER"}
              </span>
            </div>
          </div>
        </div>

        {/* Soil Health circular dashboard meter */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between items-center text-center transition-all lg:col-span-4 ${
          isCyber ? "bg-slate-950/80 border-emerald-500/20" : "bg-white border-slate-100 shadow-xl"
        }`}>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.soilScore}</span>
            <h4 className="text-[10px] text-emerald-400 font-bold mt-0.5">{selectedField}</h4>
          </div>

          {/* Animated SVG Circle Meter */}
          <div className="relative w-32 h-32 my-2 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={isCyber ? "#022c22" : "#f1f5f9"}
                strokeWidth="8"
                fill="transparent"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#emeraldGlow)"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * 94) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="emeraldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-slate-100 dark:text-white">94</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">EXCELLENT</span>
            </div>
          </div>

          <div className="w-full space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>Nitrogen (N)</span>
              <span className="text-emerald-400">Optimal (102 ppm)</span>
            </div>
            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400" style={{ width: "85%" }} />
            </div>
          </div>
        </div>

      </div>

      {/* Floating Statistics Telemetry Grid (15 Premium Floating Cards) */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            {t.stats} ({selectedField})
          </h3>
          <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase bg-emerald-500/10 px-2.5 py-1 rounded-full">
            REAL-TIME FEED SECURED
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {telemetry.map((c) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.id}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => handleCardClick(c.id)}
                className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between h-36 cursor-pointer group ${
                  isCyber
                    ? "bg-slate-950/80 border-slate-800 hover:border-emerald-500/40"
                    : "bg-white border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-500/30"
                }`}
              >
                {/* Micro Ambient background glow */}
                <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full filter blur-xl opacity-20 bg-gradient-to-tr ${c.color}`} />

                {/* Card Header Icon & Glow Indicator */}
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-xl border transition-colors ${
                    isCyber 
                      ? "bg-slate-900 border-slate-800 text-slate-300 group-hover:text-emerald-400" 
                      : "bg-slate-50 border-slate-200 text-slate-600 group-hover:bg-emerald-50 group-hover:border-emerald-200 group-hover:text-emerald-600"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    c.status === "Optimal" || c.status === "Perfect" || c.status === "Healthy" || c.status === "Validated" || c.status === "Online"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}>
                    {c.status}
                  </span>
                </div>

                {/* Number & Name */}
                <div className="mt-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.title}</span>
                  <span className={`text-lg md:text-xl font-black transition-colors ${
                    isCyber ? "text-slate-100 group-hover:text-white" : "text-slate-800 group-hover:text-emerald-600"
                  }`}>{c.val}</span>
                </div>

                {/* Tiny sparkline visualization */}
                <div className="h-6 flex items-end gap-[2px] mt-1 overflow-hidden">
                  {c.trend.map((val, idx) => {
                    const maxVal = Math.max(...c.trend);
                    const minVal = Math.min(...c.trend);
                    const range = maxVal - minVal || 1;
                    const heightPercent = ((val - minVal) / range) * 100;
                    return (
                      <div
                        key={idx}
                        className={`flex-1 rounded-xs transition-all duration-500 ${
                          idx === c.trend.length - 1 
                            ? "bg-emerald-400" 
                            : (isCyber ? "bg-slate-800" : "bg-slate-100")
                        }`}
                        style={{ height: `${Math.max(heightPercent, 15)}%` }}
                      />
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Futuristic 3D-styled Interactive Map Section & Digital Twin Farm Representation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Holographic Wireframe Farm Map */}
        <div className={`p-5 rounded-3xl border lg:col-span-8 flex flex-col justify-between gap-4 transition-all ${
          isCyber ? "bg-slate-950/80 border-slate-800" : "bg-white border-slate-100 shadow-md"
        }`}>
          <div className={`flex justify-between items-center border-b pb-3 ${
            isCyber ? "border-slate-800" : "border-slate-200"
          }`}>
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4 text-emerald-500" />
              <span className={`font-extrabold text-xs uppercase tracking-wider ${
                isCyber ? "text-slate-100" : "text-slate-800"
              }`}>{t.mapTitle}</span>
            </div>
            
            <div className={`flex items-center gap-2 p-0.5 rounded-lg border transition-colors ${
              isCyber ? "bg-slate-900/80 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              <button
                onClick={() => setMapSatellite(false)}
                className={`px-3 py-1 rounded-md text-[10px] font-extrabold transition-all cursor-pointer ${
                  !mapSatellite 
                    ? (isCyber ? "bg-emerald-500 text-slate-950" : "bg-emerald-600 text-white") 
                    : (isCyber ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-emerald-700")
                }`}
              >
                <Layers className="w-3.5 h-3.5 inline mr-1" /> Tactical
              </button>
              <button
                onClick={() => setMapSatellite(true)}
                className={`px-3 py-1 rounded-md text-[10px] font-extrabold transition-all cursor-pointer ${
                  mapSatellite 
                    ? (isCyber ? "bg-emerald-500 text-slate-950" : "bg-emerald-600 text-white") 
                    : (isCyber ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-emerald-700")
                }`}
              >
                <Satellite className="w-3.5 h-3.5 inline mr-1" /> Satellite
              </button>
            </div>
          </div>

          {/* Map canvas simulation with interactive nodes */}
          <div className={`relative h-64 md:h-80 rounded-2xl overflow-hidden border ${
            isCyber ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"
          }`}>
            {/* Background Grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-15" />

            {/* Satellite image simulation or Tactical grid design */}
            {mapSatellite ? (
              <div className="absolute inset-0 bg-cover bg-center opacity-60 filter saturate-150 contrast-125" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80')" }}>
                {/* Infrared overlay */}
                <div className="absolute inset-0 bg-emerald-900/20 mix-blend-color" />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="w-72 h-72 rounded-full border-4 border-dashed border-emerald-500/50 animate-spin-slow" />
              </div>
            )}

            {/* Cyber Grid Lines & Range Circles */}
            <div className="absolute inset-0 pointer-events-none border border-emerald-500/10 rounded-xl" />

            {/* Field boundaries overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300" preserveAspectRatio="none">
              {/* Field Alpha Boundary */}
              <polygon points="40,50 180,30 200,120 60,140" fill="rgba(16,185,129,0.06)" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" />
              {/* Field Beta Boundary */}
              <polygon points="190,30 350,20 370,110 210,120" fill="rgba(6,182,212,0.06)" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4 2" />
              {/* Field Gamma Boundary */}
              <polygon points="60,150 200,130 220,260 80,280" fill="rgba(245,158,11,0.06)" stroke="#f59e0b" strokeWidth="1.5" />
              {/* Field Delta Boundary */}
              <polygon points="210,130 370,120 390,250 230,260" fill="rgba(139,92,246,0.06)" stroke="#8b5cf6" strokeWidth="1.5" />
            </svg>

            {/* Interactive Drone Icon Pulsing hover */}
            <div 
              className="absolute top-1/4 left-1/3 animate-bounce cursor-pointer group"
              onClick={triggerScan}
              title="Click to execute drone multispectral crop scan"
            >
              <div className="p-2 bg-purple-500 text-white rounded-full shadow-[0_0_15px_#a855f7] transition-all group-hover:scale-110" title="Drone Scout Delta-9">
                <Cpu className="w-4 h-4 animate-spin-slow" />
              </div>
              <span className="block text-[8px] bg-slate-900 text-purple-300 px-1 py-0.5 rounded-md border border-purple-500/30 mt-1 text-center whitespace-nowrap">
                DRONE SCOUT [94% BATT]
              </span>
            </div>

            {/* Simulated Tractor Machinery marker */}
            <div 
              className="absolute bottom-1/4 right-1/4 cursor-pointer group"
              onClick={() => {
                setAiModalText("🚜 AUTONOMOUS SEEDING TRACTOR STATUS: Online & stable. Sowing depth: 2.5cm, Seed rate: 35kg/ha. Battery: 88% remaining. Sowing route mapped safely across Zone Gamma.");
                setShowAiModal(true);
              }}
              title="Click for sower tractor telemetry stats"
            >
              <div className="p-2 bg-amber-500 text-slate-950 rounded-full shadow-[0_0_15px_#f59e0b] transition-all group-hover:scale-110" title="Autonomous Sower Tractor">
                <Compass className="w-4 h-4" />
              </div>
              <span className="block text-[8px] bg-slate-900 text-amber-300 px-1 py-0.5 rounded-md border border-amber-500/30 mt-1 text-center whitespace-nowrap">
                SOWER TERMINAL [ACTIVE]
              </span>
            </div>

            {/* Live Soil Hydration Sensor Pulse Nodes */}
            <div 
              className="absolute top-1/2 left-2/3 cursor-pointer group"
              onClick={() => {
                setAiModalText("📡 GROUND MOISTURE SENSOR SYNC: Sensor ID: MS-902A. Nitrogen concentration: 102ppm, Moisture level: 68%, Soil Temp: 24.2°C. Next transmitter packet scheduled in 14 minutes.");
                setShowAiModal(true);
              }}
              title="Click for sensor MS-902A diagnostic packet"
            >
              <span className="absolute -top-1 -left-1 w-6 h-6 bg-emerald-400 rounded-full animate-ping opacity-35" />
              <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[8px] font-bold text-white transition-all group-hover:scale-110">
                S
              </div>
            </div>

            <div 
              className="absolute top-1/3 left-10 cursor-pointer group"
              onClick={() => {
                setAiModalText("📡 GROUND MOISTURE SENSOR SYNC: Sensor ID: MS-902B. Nitrogen concentration: 98ppm, Moisture level: 65%, Soil Temp: 24.5°C. Next transmitter packet scheduled in 8 minutes.");
                setShowAiModal(true);
              }}
              title="Click for sensor MS-902B diagnostic packet"
            >
              <span className="absolute -top-1 -left-1 w-6 h-6 bg-cyan-400 rounded-full animate-ping opacity-35" />
              <div className="w-4 h-4 bg-cyan-500 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[8px] font-bold text-white transition-all group-hover:scale-110">
                S
              </div>
            </div>

            {/* Tactical overlay indicators list */}
            <div className="absolute bottom-4 left-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[10px] space-y-1.5 backdrop-blur-md max-w-[200px]">
              <span className="block font-black text-slate-300 uppercase tracking-wider text-[8px] border-b border-slate-800 pb-1">MAP TELEMETRY</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Ground Moisture Nodes (Active)
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-cyan-500" /> Siphon Solenoid Valve (ON)
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" /> Drone Air Corridor Clear
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Details Sidebar and HUD Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Field Details */}
          <div className={`p-5 rounded-3xl border space-y-4 transition-all ${
            isCyber ? "bg-slate-950/80 border-slate-800" : "bg-white border-slate-100 shadow-md"
          }`}>
            <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-400" />
              {t.fieldInfo}
            </h3>

            <div className="space-y-3">
              <div className={`p-3 rounded-2xl border flex justify-between items-center transition-colors ${
                isCyber 
                  ? "bg-slate-900/80 border-slate-800/80" 
                  : "bg-slate-50 border-slate-200"
              }`}>
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase">Selected Zone</span>
                  <span className={`text-sm font-black ${isCyber ? "text-slate-100" : "text-slate-700"}`}>{selectedField}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${
                  isCyber 
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
                    : "text-emerald-700 bg-emerald-100/50 border-emerald-200"
                }`}>
                  Zone 1A
                </span>
              </div>

              <div className={`p-3 rounded-2xl border space-y-2 transition-colors ${
                isCyber 
                  ? "bg-slate-900/80 border-slate-800/80" 
                  : "bg-slate-50 border-slate-200"
              }`}>
                <span className={`block text-[9px] font-bold uppercase ${isCyber ? "text-slate-400" : "text-slate-500"}`}>Nitrogen Phosphorus Potassium (N-P-K)</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className={`p-2 rounded-xl border transition-colors ${
                    isCyber ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200/60"
                  }`}>
                    <span className="block text-[9px] font-bold text-slate-450">Nitrogen</span>
                    <span className="text-xs font-black text-emerald-500">102 ppm</span>
                  </div>
                  <div className={`p-2 rounded-xl border transition-colors ${
                    isCyber ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200/60"
                  }`}>
                    <span className="block text-[9px] font-bold text-slate-450">Phosphor</span>
                    <span className="text-xs font-black text-cyan-600">42 ppm</span>
                  </div>
                  <div className={`p-2 rounded-xl border transition-colors ${
                    isCyber ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200/60"
                  }`}>
                    <span className="block text-[9px] font-bold text-slate-450">Potassium</span>
                    <span className="text-xs font-black text-amber-600">148 ppm</span>
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-2xl border space-y-1.5 transition-colors ${
                isCyber 
                  ? "bg-slate-900/80 border-slate-800/80" 
                  : "bg-slate-50 border-slate-200"
              }`}>
                <span className={`block text-[9px] font-bold uppercase ${isCyber ? "text-slate-400" : "text-slate-500"}`}>Canopy Temperature Heatmap</span>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className={isCyber ? "text-slate-300" : "text-slate-600"}>Mean Temperature</span>
                  <span className={isCyber ? "text-slate-100" : "text-slate-800"}>28.9 °C</span>
                </div>
                <div className="h-2 bg-gradient-to-r from-blue-500 via-emerald-400 to-red-500 rounded-full" />
              </div>
            </div>
          </div>

          {/* Holographic Fast Actions HUD dock */}
          <div className={`p-5 rounded-3xl border space-y-4 transition-all ${
            isCyber ? "bg-slate-950/80 border-slate-800" : "bg-white border-slate-100 shadow-md"
          }`}>
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
              AUTONOMOUS FIELD PROTOCOLS
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={triggerScan}
                disabled={isScanning}
                className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group ${
                  isCyber 
                    ? "bg-slate-900 hover:bg-emerald-950 hover:text-emerald-400 text-slate-100 border-slate-800" 
                    : "bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-750 border-slate-200"
                }`}
              >
                <Cpu className={`w-5 h-5 group-hover:animate-bounce ${isCyber ? "text-emerald-500" : "text-emerald-600"}`} />
                <span className="text-[10px] font-black uppercase tracking-wider">{t.scanBtn}</span>
              </button>
              
              <button
                onClick={consultAiAssistant}
                className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group ${
                  isCyber 
                    ? "bg-slate-900 hover:bg-cyan-950 hover:text-cyan-400 text-slate-100 border-slate-800" 
                    : "bg-slate-50 hover:bg-cyan-50 hover:text-cyan-700 text-slate-750 border-slate-200"
                }`}
              >
                <BrainCircuit className={`w-5 h-5 group-hover:scale-110 transition-transform ${isCyber ? "text-cyan-400" : "text-cyan-600"}`} />
                <span className="text-[10px] font-black uppercase tracking-wider">{t.aiVoice}</span>
              </button>
              
              <button
                onClick={() => onNavigate("chatbot")}
                className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group ${
                  isCyber 
                    ? "bg-slate-900 hover:bg-teal-950 hover:text-teal-400 text-slate-100 border-slate-800" 
                    : "bg-slate-50 hover:bg-teal-50 hover:text-teal-700 text-slate-750 border-slate-200"
                }`}
              >
                <MessageSquare className={`w-5 h-5 ${isCyber ? "text-teal-400" : "text-teal-600"}`} />
                <span className="text-[10px] font-black uppercase tracking-wider">AI Consultation</span>
              </button>

              <button
                onClick={triggerSos}
                className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer ${
                  isCyber 
                    ? "bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border-rose-900/50" 
                    : "bg-rose-50 hover:bg-rose-100/80 text-rose-700 border-rose-200"
                }`}
              >
                <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider">{t.sosBtn}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Handcrafted High-Fidelity 3D Cyber Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Crop Growth Trend Area Chart */}
        <div className={`p-5 rounded-3xl border lg:col-span-8 flex flex-col justify-between gap-4 transition-all ${
          isCyber ? "bg-slate-950/80 border-slate-800" : "bg-white border-slate-100 shadow-md"
        }`}>
          <div>
            <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest">
              Biomass & Canopy Growth Trend
            </h3>
            <p className="text-[10px] text-slate-400">Comparative 14-day vegetative index index mapping</p>
          </div>

          {/* Beautiful SVG Area Chart */}
          <div className="h-48 relative flex items-end">
            <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="5 5" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="5 5" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="5 5" />
              
              {/* Chart Line Path */}
              <path
                d="M 0 130 C 50 110, 100 120, 150 90 C 200 70, 250 85, 300 50 C 350 40, 400 30, 450 25 L 500 20 L 500 150 L 0 150 Z"
                fill="url(#chartGlow)"
              />
              <path
                d="M 0 130 C 50 110, 100 120, 150 90 C 200 70, 250 85, 300 50 C 350 40, 400 30, 450 25 L 500 20"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
              />
              {/* Highlight Nodes */}
              <circle cx="150" cy="90" r="4" fill="#06b6d4" />
              <circle cx="300" cy="50" r="4" fill="#10b981" />
              <circle cx="450" cy="25" r="4" fill="#f59e0b" />
            </svg>
            
            {/* Legend overlays */}
            <div className="absolute top-2 right-2 flex gap-3 text-[9px] font-black uppercase">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Canopy Index
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" /> Target Projection
              </span>
            </div>
          </div>
        </div>

        {/* Seasonal Cost Pie/Donut Chart */}
        <div className={`p-5 rounded-3xl border lg:col-span-4 flex flex-col justify-between gap-4 transition-all ${
          isCyber ? "bg-slate-950/80 border-slate-800" : "bg-white border-slate-100 shadow-md"
        }`}>
          <div>
            <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest">
              Sowing Phase Cost Share
            </h3>
            <p className="text-[10px] text-slate-400">Distribution across active resource categories</p>
          </div>

          <div className="flex items-center justify-center py-2 relative">
            <svg className="w-32 h-32" viewBox="0 0 36 36">
              {/* Segment 1: Seeds 35% */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.2" strokeDasharray="35 65" strokeDashoffset="25" />
              {/* Segment 2: Machinery 25% */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#06b6d4" strokeWidth="4.2" strokeDasharray="25 75" strokeDashoffset="90" />
              {/* Segment 3: Labor 20% */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4.2" strokeDasharray="20 80" strokeDashoffset="115" />
              {/* Segment 4: Fertilizer 20% */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8b5cf6" strokeWidth="4.2" strokeDasharray="20 80" strokeDashoffset="135" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-[10px] font-black ${isCyber ? "text-slate-400" : "text-slate-500"}`}>Total</span>
              <span className={`text-sm font-black ${isCyber ? "text-white" : "text-slate-800"}`}>100%</span>
            </div>
          </div>

          {/* Compact Legend mapping */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
            <div className={`flex items-center gap-1.5 ${isCyber ? "text-slate-300" : "text-slate-600"}`}>
              <span className="w-2 h-2 bg-emerald-500 rounded-full" /> Seeds (35%)
            </div>
            <div className={`flex items-center gap-1.5 ${isCyber ? "text-slate-300" : "text-slate-600"}`}>
              <span className="w-2 h-2 bg-cyan-500 rounded-full" /> Machinery (25%)
            </div>
            <div className={`flex items-center gap-1.5 ${isCyber ? "text-slate-300" : "text-slate-600"}`}>
              <span className="w-2 h-2 bg-amber-500 rounded-full" /> Labor (20%)
            </div>
            <div className={`flex items-center gap-1.5 ${isCyber ? "text-slate-300" : "text-slate-600"}`}>
              <span className="w-2 h-2 bg-purple-500 rounded-full" /> Fertilizer (20%)
            </div>
          </div>
        </div>

      </div>

      {/* Advanced Bottom section for Tasks, Timeline Log & persistent Farmer Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Directives and Notes */}
        <div className="lg:col-span-8 space-y-6">
          {/* Upcoming Directive Task Toggles */}
          <div className={`p-5 rounded-3xl border space-y-4 transition-all ${
            isCyber ? "bg-slate-950/80 border-slate-800" : "bg-white border-slate-100 shadow-md"
          }`}>
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Clipboard className="w-4 h-4 text-emerald-400" />
                {t.tasks}
              </h3>
              <span className="text-[10px] font-bold text-slate-500">Auto-generated by AI</span>
            </div>

            <div className="space-y-2">
              {[
                { id: "t1", task: "Initiate microclimate drip irrigation line on Field Beta", due: "Due today, 07:00 PM", status: "pending" },
                { id: "t2", task: "Schedule multispectral drone canopy scan for weed mapping", due: "Due Thursday, 08:00 AM", status: "pending" },
                { id: "t3", task: "Apply organic nitrogen spray on southern soil block Gamma", due: "Due Friday, 11:00 AM", status: "pending" }
              ].map((tsk) => (
                <div key={tsk.id} className={`p-3 rounded-2xl border flex justify-between items-center gap-4 transition-colors ${
                  isCyber 
                    ? "bg-slate-900/80 border-slate-800/80" 
                    : "bg-slate-50 border-slate-200"
                }`}>
                  <div className="flex items-start gap-2.5">
                    <input type="checkbox" className="mt-1 accent-emerald-500" />
                    <div>
                      <h4 className={`text-xs font-bold ${isCyber ? "text-slate-200" : "text-slate-700"}`}>{tsk.task}</h4>
                      <span className="text-[10px] text-slate-400">{tsk.due}</span>
                    </div>
                  </div>
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-lg border whitespace-nowrap ${
                    isCyber 
                      ? "text-amber-400 bg-amber-500/10 border-amber-500/20" 
                      : "text-amber-700 bg-amber-50 border-amber-200"
                  }`}>
                    Telemetry Pending
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Durable Persistent Farmer Notes Pad */}
          <div className={`p-5 rounded-3xl border space-y-4 transition-all ${
            isCyber ? "bg-slate-950/80 border-slate-800" : "bg-white border-slate-100 shadow-md"
          }`}>
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Clipboard className="w-4 h-4 text-emerald-400" />
                {t.notes}
              </h3>
              <button
                onClick={() => setFarmerNotes("")}
                className="text-[9px] font-bold text-red-400 hover:text-red-500 cursor-pointer uppercase tracking-wider"
              >
                {t.clearNotes}
              </button>
            </div>
            
            <textarea
              rows={3}
              value={farmerNotes}
              onChange={(e) => setFarmerNotes(e.target.value)}
              className={`w-full p-3 rounded-2xl text-xs font-semibold outline-none transition-all ${
                isCyber
                  ? "bg-slate-950 text-slate-200 border border-slate-800 focus:border-emerald-500"
                  : "bg-slate-50 text-slate-800 border border-slate-200 focus:border-emerald-600"
              }`}
              placeholder="Jot down active irrigation codes, fertilizer weights or extension office recommendations here..."
            />
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              💾 Progress automatically synced to secure browser cache.
            </p>
          </div>
        </div>

        {/* Right column: Recent logs event feed */}
        <div className="lg:col-span-4">
          <div className={`p-5 rounded-3xl border h-full flex flex-col justify-between gap-4 transition-all ${
            isCyber ? "bg-slate-950/80 border-slate-800" : "bg-white border-slate-100 shadow-md"
          }`}>
            <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              {t.recentLogs}
            </h3>

            <div className="space-y-4 flex-1 mt-2">
              {actualFeed.map((feedItem, idx) => (
                <div key={feedItem.id || idx} className={`flex gap-3 items-start pb-3 last:border-0 last:pb-0 border-b transition-colors ${
                  isCyber ? "border-slate-800" : "border-slate-100"
                }`}>
                  <div className={`p-2 rounded-xl border shrink-0 transition-colors ${
                    isCyber ? "bg-slate-900 text-emerald-400 border-slate-850" : "bg-slate-50 text-emerald-600 border-slate-150"
                  }`}>
                    {feedItem.type === "crop" ? <Sprout className="w-3.5 h-3.5" /> :
                     feedItem.type === "disease" ? <Camera className="w-3.5 h-3.5" /> :
                     feedItem.type === "expense" ? <DollarSign className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className={`font-bold text-xs truncate ${isCyber ? "text-slate-200" : "text-slate-700"}`}>{feedItem.title}</h4>
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap ml-1">
                        {feedItem.time}
                      </span>
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 font-medium ${isCyber ? "text-slate-400" : "text-slate-500"}`}>{feedItem.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-900/40 rounded-2xl border border-slate-800/60 text-center text-[10px] text-slate-400 font-bold">
              Secure Gateway Link: AES-256 Enabled
            </div>
          </div>
        </div>

      </div>

      {/* Futuristic Holographic Modal Popup for AI Alerts and Scans */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAiModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-950 border border-emerald-500/30 p-6 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.3)] max-w-md w-full relative z-10 text-slate-100"
            >
              <button
                onClick={() => setShowAiModal(false)}
                className="absolute top-4 right-4 p-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 bg-emerald-500 text-slate-950 rounded-xl">
                  <BrainCircuit className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-wider text-white">AgriAdvisor AI Systems</h4>
                  <span className="block text-[8px] text-emerald-400 font-bold">MIL-SPEC SECURE TERMINAL</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs leading-relaxed text-slate-200">
                {aiModalText}
              </div>

              <button
                onClick={() => setShowAiModal(false)}
                className="mt-5 w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer uppercase tracking-widest transition-colors"
              >
                Acknowledge Protocol
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
