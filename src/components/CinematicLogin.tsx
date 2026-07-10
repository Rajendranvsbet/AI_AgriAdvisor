import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Fingerprint, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sun, 
  Moon, 
  CloudRain, 
  Activity, 
  Droplet, 
  ShieldCheck, 
  ChevronRight, 
  RefreshCw, 
  Smartphone,
  Cpu,
  Tv,
  Globe,
  Compass,
  AlertCircle
} from "lucide-react";
import { User } from "../types";

interface CinematicLoginProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  name: string;
  setName: (val: string) => void;
  role: "Farmer" | "Agriculture Officer" | "Admin";
  setRole: (val: "Farmer" | "Agriculture Officer" | "Admin") => void;
  isRegister: boolean;
  setIsRegister: (val: boolean) => void;
  otpSent: boolean;
  setOtpSent: (val: boolean) => void;
  otpInput: string;
  setOtpInput: (val: string) => void;
  authError: string;
  setAuthError: (val: string) => void;
  authLoading: boolean;
  onLogin: (e: React.FormEvent) => Promise<void>;
  onRegister: (e: React.FormEvent) => Promise<void>;
  onVerifyOtp: (e: React.FormEvent) => Promise<void>;
  onQuickLogin: (role: "Farmer" | "Agriculture Officer" | "Admin") => Promise<void>;
  onBackToLanding: () => void;
}

export default function CinematicLogin({
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  role,
  setRole,
  isRegister,
  setIsRegister,
  otpSent,
  setOtpSent,
  otpInput,
  setOtpInput,
  authError,
  setAuthError,
  authLoading,
  onLogin,
  onRegister,
  onVerifyOtp,
  onQuickLogin,
  onBackToLanding
}: CinematicLoginProps) {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Custom weather toggle
  const [weatherMode, setWeatherMode] = useState<"sunny" | "rainy" | "aurora">("sunny");
  
  // Show password state
  const [showPassword, setShowPassword] = useState(false);
  
  // Typewriter text state
  const [welcomeText, setWelcomeText] = useState("");
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Mouse position state for 3D parallax layers
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Canvas for advanced particle overlay
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Success flow simulation
  const [successProgress, setSuccessProgress] = useState<"idle" | "scanning" | "fingerprint" | "face" | "verified" | "zooming">("idle");
  const [rememberMe, setRememberMe] = useState(true);

  // Typewriter phrases
  const welcomePhrases = [
    "Welcome to AI Agriculture Advisor",
    "Empowering Farmers with Artificial Intelligence",
    "Analyzing Crop Intelligence...",
    "Connecting to Weather Services...",
    "Preparing Smart Farming Dashboard..."
  ];

  // Typing effect hook
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentPhrase = welcomePhrases[typewriterIndex];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setWelcomeText(currentPhrase.substring(0, welcomeText.length - 1));
      }, 30);
    } else {
      timer = setTimeout(() => {
        setWelcomeText(currentPhrase.substring(0, welcomeText.length + 1));
      }, 70);
    }

    if (!isDeleting && welcomeText === currentPhrase) {
      timer = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && welcomeText === "") {
      setIsDeleting(false);
      setTypewriterIndex((prev) => (prev + 1) % welcomePhrases.length);
    }

    return () => clearTimeout(timer);
  }, [welcomeText, isDeleting, typewriterIndex]);

  // Mouse move handler for parallax and light-following coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Normalized coordinates from -0.5 to 0.5
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // HTML5 Canvas background particle system (GPU-accelerated pollen, fireflies, rain)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle class definition
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * -0.5 - 0.2;
        this.opacity = Math.random() * 0.6 + 0.2;
        
        // Color depends on mode and weather
        if (weatherMode === "rainy") {
          this.color = "rgba(186, 230, 253, 0.4)";
          this.speedY = Math.random() * 4 + 5;
          this.speedX = Math.random() * 0.5 - 0.2;
          this.size = Math.random() * 1.5 + 0.5;
        } else if (isDarkMode) {
          // Glow Fireflies
          this.color = "rgba(16, 185, 129, 0.6)"; // green fireflies
          this.speedY = Math.random() * 0.6 - 0.3;
          this.speedX = Math.random() * 0.6 - 0.3;
        } else {
          // Warm Pollen
          this.color = "rgba(250, 204, 21, 0.5)"; // golden pollen
          this.speedY = Math.random() * 0.3 - 0.15;
          this.speedX = Math.random() * 0.5 - 0.1;
        }
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction ripple
        const dx = this.x - (mousePos.x + 0.5) * width;
        const dy = this.y - (mousePos.y + 0.5) * height;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.x += (dx / dist) * force * 2;
          this.y += (dy / dist) * force * 2;
        }

        // Screen boundary wraps
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        
        if (weatherMode === "rainy") {
          if (this.y > height) {
            this.y = 0;
            this.x = Math.random() * width;
          }
        } else {
          if (this.y < 0) this.y = height;
          if (this.y > height) this.y = 0;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        if (weatherMode === "rainy") {
          // Rain streaks
          ctx.strokeStyle = this.color;
          ctx.lineWidth = this.size;
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x + this.speedX * 2, this.y + this.speedY * 1.5);
          ctx.stroke();
        } else {
          // Glowing circles
          ctx.fillStyle = this.color;
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const particleCount = weatherMode === "rainy" ? 120 : 60;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode, weatherMode, mousePos]);

  // Hook into form login success action to trigger scanner animations first!
  const triggerLoginSuccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError("Email and Password are required");
      return;
    }

    setAuthError("");
    setSuccessProgress("scanning");

    // Sequence the animations: scanning -> fingerprint -> face -> verified -> dashboard
    setTimeout(() => {
      setSuccessProgress("fingerprint");
      setTimeout(() => {
        setSuccessProgress("face");
        setTimeout(() => {
          setSuccessProgress("verified");
          setTimeout(async () => {
            setSuccessProgress("zooming");
            // Call actual auth handler
            await onLogin(e);
          }, 1000);
        }, 1200);
      }, 1200);
    }, 1000);
  };

  const triggerQuickSuccess = async (preferredRole: "Farmer" | "Agriculture Officer" | "Admin") => {
    setAuthError("");
    setSuccessProgress("scanning");

    setTimeout(() => {
      setSuccessProgress("fingerprint");
      setTimeout(() => {
        setSuccessProgress("face");
        setTimeout(() => {
          setSuccessProgress("verified");
          setTimeout(async () => {
            setSuccessProgress("zooming");
            await onQuickLogin(preferredRole);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 800);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative min-h-screen font-sans overflow-hidden select-none transition-colors duration-1000 flex flex-col justify-between p-4 md:p-8 ${
        isDarkMode 
          ? "bg-slate-950 text-slate-100" 
          : "bg-sky-50 text-slate-900"
      }`}
    >
      {/* Background Canvas Particles */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      />

      {/* Cinematic Environmental Lights (Aurora & Sunlight follow mouse) */}
      <div 
        className="absolute pointer-events-none transition-transform duration-300 -z-0"
        style={{
          left: `calc(50% + ${mousePos.x * 200}px)`,
          top: `calc(50% + ${mousePos.y * 200}px)`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div 
          className={`w-[600px] h-[600px] rounded-full blur-[140px] opacity-30 transition-all duration-1000 ${
            isDarkMode 
              ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" 
              : "bg-gradient-to-r from-amber-300 via-emerald-200 to-sky-200"
          }`}
        />
      </div>

      {/* Stars at night overlay (Dark Mode) */}
      {isDarkMode && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-950 via-slate-950 to-slate-900 -z-10 opacity-70" />
      )}

      {/* Header controls (Clean Navigation Menu) */}
      <header className="relative z-20 flex justify-between items-center w-full max-w-7xl mx-auto py-2">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onBackToLanding}>
          <div className="p-2.5 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight">
              AI Agri<span className="text-emerald-500">Advisor</span>
            </span>
            <div className="text-[9px] font-bold tracking-widest text-emerald-400 uppercase">
              Smart Platform
            </div>
          </div>
        </div>

        {/* Ambient Controls Toggle Bar */}
        <div className="flex items-center gap-2.5 bg-white/5 dark:bg-black/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-sm">
          {/* Sunny weather selector */}
          <button
            onClick={() => setWeatherMode("sunny")}
            className={`p-1.5 rounded-xl transition-all ${
              weatherMode === "sunny" 
                ? "bg-emerald-500 text-white" 
                : "text-slate-400 hover:text-emerald-400"
            }`}
            title="Sunny Skies"
          >
            <Sun className="w-4 h-4" />
          </button>
          
          {/* Rainy weather selector */}
          <button
            onClick={() => setWeatherMode("rainy")}
            className={`p-1.5 rounded-xl transition-all ${
              weatherMode === "rainy" 
                ? "bg-sky-500 text-white" 
                : "text-slate-400 hover:text-sky-400"
            }`}
            title="Monsoon Mode"
          >
            <CloudRain className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-white/20 mx-1" />

          {/* Theme switcher */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-400 transition-colors"
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main 3D / Isometric Content Grid */}
      <main className="relative z-20 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-4">
        
        {/* Left Hand: Interactive Living 3D Smart Farm & Holograms */}
        <div 
          className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center relative space-y-6 lg:h-[550px]"
          style={{
            transform: `perspective(1000px) rotateY(${mousePos.x * 12}deg) rotateX(${-mousePos.y * 12}deg)`,
            transition: "transform 0.2s ease-out"
          }}
        >
          {/* Floating Earth Hologram */}
          <div className="absolute top-0 left-10 pointer-events-none opacity-20 dark:opacity-30 animate-[spin_40s_linear_infinite]">
            <Globe className="w-48 h-48 text-emerald-500/40" />
          </div>

          {/* Isometric Smart Farm Vector Illustration Area */}
          <div className="relative w-full aspect-video bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-white/5 rounded-3xl p-6 shadow-2xl overflow-hidden backdrop-blur-sm">
            
            {/* Grid Horizon / Field Parallax Backdrop */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] opacity-60" />

            {/* Rising Sun or Stars & Clouds based on controls */}
            <div className="absolute top-6 right-8 text-center flex flex-col items-center">
              <motion.div
                animate={{ 
                  y: [0, -4, 0],
                  rotate: weatherMode === "sunny" ? 360 : 0
                }}
                transition={{ 
                  y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                  rotate: { repeat: Infinity, duration: 25, ease: "linear" }
                }}
              >
                {weatherMode === "sunny" ? (
                  <Sun className="w-12 h-12 text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
                ) : (
                  <Moon className="w-10 h-10 text-sky-200 drop-shadow-[0_0_15px_rgba(186,230,253,0.3)]" />
                )}
              </motion.div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400/80 mt-1.5">
                {weatherMode === "sunny" ? "Sun Rays" : "Moon glow"}
              </div>
            </div>

            {/* Living Farm elements layered and responsive */}
            <div className="absolute inset-x-4 bottom-4 h-3/4 flex flex-col justify-end">
              
              {/* Parallax Field Stalks & Green Lands */}
              <div className="relative w-full h-1/2 bg-gradient-to-t from-emerald-950/20 to-transparent rounded-2xl flex items-end justify-between px-4 overflow-hidden">
                
                {/* Simulated Wheat / Rice Swaying Stalks */}
                <div className="flex items-end gap-1 w-full">
                  {[...Array(22)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ rotate: [-4, 6, -4] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3 + (i % 3), 
                        ease: "easeInOut",
                        delay: i * 0.1
                      }}
                      className="origin-bottom w-1 rounded-t-full shrink-0"
                      style={{
                        height: `${30 + (i % 4) * 15}px`,
                        backgroundColor: i % 2 === 0 ? "rgba(34, 197, 94, 0.7)" : "rgba(16, 185, 129, 0.5)"
                      }}
                    />
                  ))}
                </div>

                {/* Autonomous Electric Smart Tractor driving */}
                <motion.div
                  animate={{
                    x: ["-10%", "110%"]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 15,
                    ease: "linear"
                  }}
                  className="absolute bottom-1 w-16 h-10 bg-slate-800/90 border border-slate-700 p-1.5 rounded-xl shadow-lg flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center">
                    <span className="w-2.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-[6px] font-mono font-bold text-slate-300">GPS OK</span>
                  </div>
                  <div className="text-[7px] font-extrabold text-emerald-400 uppercase tracking-widest truncate">
                    🤖 Tractor
                  </div>
                </motion.div>
              </div>

              {/* Holographic AI Drone Scanning Layer */}
              <div className="absolute top-0 inset-x-0 flex justify-center">
                <motion.div
                  animate={{
                    y: [-12, 12, -12],
                    x: [-30, 30, -30]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 6,
                    ease: "easeInOut"
                  }}
                  className="relative flex flex-col items-center"
                >
                  {/* Drone graphic */}
                  <div className="bg-slate-900 border border-emerald-500/30 px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-1.5 text-white">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                    <span className="text-[8px] font-bold uppercase tracking-wider">AI Drone-04</span>
                  </div>
                  
                  {/* Glowing Laser Scan Pyramidal beam */}
                  <div className="w-40 h-24 bg-gradient-to-t from-emerald-500/10 to-transparent [mask-image:linear-gradient(to_bottom,transparent,black)] border-r border-l border-emerald-400/20 rounded-b-full mt-1 flex justify-center items-end">
                    <span className="w-24 h-[1px] bg-emerald-400/60 shadow-[0_0_8px_emerald-400] mb-0.5 animate-pulse" />
                  </div>
                </motion.div>
              </div>

              {/* Rain Rainbow Effect Overlay */}
              {weatherMode === "rainy" && (
                <div className="absolute inset-0 bg-sky-950/20 backdrop-blur-[0.5px] pointer-events-none flex items-center justify-center">
                  <div className="w-full h-1/2 border-t-4 border-r-4 border-dashed border-sky-400/20 rounded-full animate-pulse flex items-center justify-center text-[10px] font-black text-sky-400/75 uppercase tracking-widest">
                    🌧️ Rain Scan Active
                  </div>
                </div>
              )}
            </div>

            {/* Flying Birds/Butterflies inside the viewport */}
            <motion.div
              animate={{
                x: ["-20px", "500px"],
                y: ["20px", "10px", "40px", "20px"]
              }}
              transition={{
                repeat: Infinity,
                duration: 22,
                ease: "linear"
              }}
              className="absolute top-1/4 text-xs select-none"
            >
              🦋
            </motion.div>

            <motion.div
              animate={{
                x: ["500px", "-20px"],
                y: ["60px", "80px", "50px", "60px"]
              }}
              transition={{
                repeat: Infinity,
                duration: 25,
                ease: "linear"
              }}
              className="absolute top-1/3 text-sm select-none"
            >
              🕊️
            </motion.div>
          </div>

          {/* AI Holographic Floating Telemetry Panels */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 relative z-10">
            {[
              { label: "Crop Health", val: "96%", desc: "Highly Optimal", icon: Activity, color: "border-emerald-500/20 text-emerald-400" },
              { label: "Soil Moisture", val: "82%", desc: "Adequate Zone", icon: Droplet, color: "border-sky-500/20 text-sky-400" },
              { label: "Yield Target", val: "+18%", desc: "AI Projected", icon: ShieldCheck, color: "border-amber-500/20 text-amber-400" },
              { label: "Market Index", val: "Positive", desc: "Basmati Rising", icon: Compass, color: "border-purple-500/20 text-purple-400" }
            ].map((stat, sIdx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={sIdx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * sIdx }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`bg-white/5 dark:bg-black/20 backdrop-blur-md p-3.5 rounded-2xl border ${stat.color} shadow-lg relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 w-10 h-10 bg-white/5 rounded-full blur-xl" />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                    <Icon className="w-3.5 h-3.5 opacity-80" />
                  </div>
                  <div className="text-base font-extrabold mt-1.5">{stat.val}</div>
                  <div className="text-[9px] font-bold text-slate-500 mt-0.5">{stat.desc}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Slogans & Info Card Footer */}
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              Grower Verification Framework
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Verify credentials to tap into satellite microclimate triggers, high-resolution leaf disease analyzers, and predictive local market arbitrage tables.
            </p>
          </div>
        </div>

        {/* Right Hand: Floating Glassmorphism Login Card */}
        <div className="lg:col-span-6 xl:col-span-5 relative">
          
          <AnimatePresence mode="wait">
            {successProgress !== "idle" && successProgress !== "zooming" ? (
              /* Success Progress Overlay Screens */
              <motion.div
                key="loading-screens"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full bg-slate-900/90 backdrop-blur-2xl p-8 rounded-[32px] border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col items-center justify-center text-center space-y-8 min-h-[500px]"
              >
                {/* Pulse Ring scanner */}
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                  
                  {successProgress === "scanning" && (
                    <div className="p-8 bg-emerald-950/50 border border-emerald-500/30 rounded-full text-emerald-400 relative overflow-hidden">
                      <RefreshCw className="w-16 h-16 animate-spin" />
                      <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400/80 animate-bounce" />
                    </div>
                  )}

                  {successProgress === "fingerprint" && (
                    <div className="p-8 bg-emerald-950/50 border border-emerald-400 text-emerald-400 rounded-full animate-pulse">
                      <Fingerprint className="w-16 h-16" />
                    </div>
                  )}

                  {successProgress === "face" && (
                    <div className="p-8 bg-emerald-950/50 border border-sky-400 text-sky-400 rounded-full relative">
                      <Tv className="w-16 h-16 animate-pulse" />
                      <div className="absolute inset-2 border-2 border-dashed border-sky-400/40 rounded-full animate-spin" />
                    </div>
                  )}

                  {successProgress === "verified" && (
                    <div className="p-8 bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/30">
                      <ShieldCheck className="w-16 h-16" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black tracking-tight text-white uppercase">
                    {successProgress === "scanning" && "Initiating Secure Protocol"}
                    {successProgress === "fingerprint" && "Analyzing Biometric Node"}
                    {successProgress === "face" && "Scanning Face Geometry"}
                    {successProgress === "verified" && "Grower Handshake Complete"}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    {successProgress === "scanning" && "Requesting server decryption nodes..."}
                    {successProgress === "fingerprint" && "Authenticating physical fingerprint hardware pass..."}
                    {successProgress === "face" && "Verifying agricultural user profile with neural AI classification..."}
                    {successProgress === "verified" && "Synchronizing live microclimate variables. Welcome back!"}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ 
                      width: 
                        successProgress === "scanning" ? "25%" : 
                        successProgress === "fingerprint" ? "50%" : 
                        successProgress === "face" ? "75%" : "100%" 
                    }}
                    transition={{ duration: 1 }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
              </motion.div>
            ) : (
              /* Standard Sign-In / Register Form */
              <motion.div
                key="auth-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="w-full bg-white/10 dark:bg-black/25 backdrop-blur-2xl p-6 md:p-8 rounded-[32px] border border-white/20 dark:border-white/5 shadow-2xl relative overflow-hidden"
                style={{
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Sweep reflection accent */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-30 animate-[shimmer_6s_infinite]" />

                {/* Card Title & Typewriter Welcome */}
                <div className="space-y-3 pb-5 border-b border-white/10">
                  <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    Authentication Hub
                  </div>
                  
                  {/* Typewriter Banner */}
                  <div className="h-6 flex items-center">
                    <p className="text-xs text-slate-400 font-medium">
                      {welcomeText}
                      <span className="inline-block w-1.5 h-3 bg-emerald-500 ml-1 animate-ping" />
                    </p>
                  </div>
                </div>

                {/* Quick Roles Shortcut Bar inside Form */}
                <div className="py-4 space-y-2">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block text-center">
                    Select Quick Tour Profiles
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { roleName: "Farmer", label: "🧑‍🌾 Farmer", color: "hover:border-emerald-500 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10" },
                      { roleName: "Agriculture Officer", label: "🎓 Officer", color: "hover:border-sky-500 text-sky-400 bg-sky-500/5 hover:bg-sky-500/10" },
                      { roleName: "Admin", label: "🛡️ Admin", color: "hover:border-purple-500 text-purple-400 bg-purple-500/5 hover:bg-purple-500/10" }
                    ].map((btn) => (
                      <button
                        key={btn.roleName}
                        type="button"
                        onClick={() => triggerQuickSuccess(btn.roleName as any)}
                        className={`py-2 px-1 text-[10px] font-extrabold text-center rounded-xl border border-white/10 transition-all ${btn.color}`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Banner */}
                {authError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/15 border border-red-500/30 text-red-200 text-xs font-semibold rounded-2xl flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{authError}</span>
                  </motion.div>
                )}

                {/* Forms Switcher */}
                {otpSent ? (
                  /* OTP Verification Form */
                  <form onSubmit={onVerifyOtp} className="space-y-4 pt-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Verification Pin
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter OTP (e.g., 1234)"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="w-full px-4 py-3 border border-white/10 rounded-2xl bg-white/5 text-sm font-semibold text-center tracking-widest focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all"
                    >
                      Verify Grower Code
                    </button>
                  </form>
                ) : isRegister ? (
                  /* Registration Form */
                  <form onSubmit={onRegister} className="space-y-4 pt-2">
                    
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Grower / Officer Name
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="Muthuvel Rajan"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-white/10 rounded-xl bg-white/5 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          placeholder="farmer@agroadvisor.gov"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-white/10 rounded-xl bg-white/5 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Role Choice */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Access Credentials Category
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as any)}
                        className="w-full px-4 py-2.5 border border-white/10 rounded-xl bg-white/5 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                      >
                        <option value="Farmer" className="text-slate-900">Farmer / Grower</option>
                        <option value="Agriculture Officer" className="text-slate-900">Agriculture Officer</option>
                        <option value="Admin" className="text-slate-900">Administrator</option>
                      </select>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Secure Account Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 border border-white/10 rounded-xl bg-white/5 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg hover:shadow-emerald-600/10 transition-all flex items-center justify-center gap-1.5"
                    >
                      Request Secure Account <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="text-center text-[10px] font-semibold text-slate-400 pt-1">
                      Already registered?{" "}
                      <button 
                        type="button" 
                        onClick={() => setIsRegister(false)} 
                        className="text-emerald-400 hover:underline font-bold"
                      >
                        Access Account
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Login Form */
                  <form onSubmit={triggerLoginSuccess} className="space-y-4 pt-2">
                    
                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Registered Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          placeholder="farmer@agroadvisor.gov"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-white/10 rounded-2xl bg-white/5 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Account Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-3 border border-white/10 rounded-2xl bg-white/5 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Extra options: Remember Me & Forgot Password */}
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold px-1">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="accent-emerald-500 rounded border-white/10 bg-white/5" 
                        />
                        Remember Me
                      </label>
                      <button 
                        type="button" 
                        onClick={() => setAuthError("Contact your agricultural officer for profile retrieval.")}
                        className="hover:text-emerald-400 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-lg hover:shadow-emerald-600/10 transition-all flex items-center justify-center gap-1.5"
                    >
                      Verify &amp; Enter Dashboard <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Guest access option */}
                    <button
                      type="button"
                      onClick={() => triggerQuickSuccess("Farmer")}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs rounded-2xl transition-colors"
                    >
                      Continue as Guest
                    </button>

                    {/* Social Login Panel */}
                    <div className="pt-4 border-t border-white/10 space-y-2.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block text-center">
                        Or Connect Credentials Via
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {["Google", "Microsoft", "Apple"].map((provider) => (
                          <button
                            key={provider}
                            type="button"
                            onClick={() => setAuthError(`Single Sign-On with ${provider} is in sandbox mode.`)}
                            className="py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-[10px] text-slate-300 hover:text-white transition-all text-center"
                          >
                            {provider}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="text-center text-[10px] font-semibold text-slate-400 pt-2">
                      New to platform?{" "}
                      <button 
                        type="button" 
                        onClick={() => setIsRegister(true)} 
                        className="text-emerald-400 hover:underline font-bold"
                      >
                        Register Grower
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* Modern responsive sticky bottom footer */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center py-3 border-t border-white/10 text-slate-500 text-[10px] font-bold tracking-wider uppercase mt-4 gap-4">
        <div>
          &copy; 2026 AI Agriculture Platform. All rights reserved.
        </div>
        <div className="flex gap-4">
          <a href="#privacy" className="hover:text-emerald-400">Telemetry Privacy</a>
          <a href="#terms" className="hover:text-emerald-400">Service Nodes</a>
          <a href="#support" className="hover:text-emerald-400">Satellite Support</a>
        </div>
      </footer>
    </div>
  );
}
