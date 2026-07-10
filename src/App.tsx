import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sprout, 
  BrainCircuit, 
  CloudSun, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Users, 
  LogOut, 
  Camera, 
  Menu, 
  X,
  BellRing,
  Smartphone,
  Sparkles,
  ShieldAlert,
  Fingerprint,
  CheckCircle,
  User as UserIcon,
  Trash2,
  Check,
  Bell
} from "lucide-react";

import { User, Expense, CropRecRecord, DiseaseRecord, Scheme, AppNotification } from "./types";
import LandingPage from "./components/LandingPage";
import DashboardView from "./components/DashboardView";
import CropRecommendView from "./components/CropRecommendView";
import DiseaseDetectView from "./components/DiseaseDetectView";
import WeatherView from "./components/WeatherView";
import ExpenseTrackerView from "./components/ExpenseTrackerView";
import SchemesView from "./components/SchemesView";
import ChatbotView from "./components/ChatbotView";
import AdminPanel from "./components/AdminPanel";
import ProfileView from "./components/ProfileView";
import CinematicLogin from "./components/CinematicLogin";

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCyber, setIsCyber] = useState(() => {
    const saved = localStorage.getItem("agri_theme");
    return saved === null ? true : saved === "cyber"; // default to true
  });

  useEffect(() => {
    localStorage.setItem("agri_theme", isCyber ? "cyber" : "light");
  }, [isCyber]);

  // Core Data Arrays
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [cropRecs, setCropRecs] = useState<CropRecRecord[]>([]);
  const [diseases, setDiseases] = useState<DiseaseRecord[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);

  // Notifications State and Handlers
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: "notif-1",
      title: "Weather Disruption Warning",
      message: "Unseasonal high temperatures predicted this Wednesday. Plan extra evening drip irrigation.",
      type: "weather",
      isRead: false,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: "notif-2",
      title: "Govt Scheme Alert",
      message: "PM-KISAN has announced a new verification window for the upcoming subsidy installment.",
      type: "scheme",
      isRead: false,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      id: "notif-3",
      title: "Yard Rate Surge",
      message: "Tomato market rates in Chennai Market have surged by 50% today due to local supply constraints.",
      type: "market",
      isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const triggerNotification = (title: string, message: string, type: AppNotification["type"]) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const formatRelativeTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return new Date(isoString).toLocaleDateString();
  };

  // Auth form states
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"Farmer" | "Agriculture Officer" | "Admin">("Farmer");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [tempUserId, setTempUserId] = useState("");

  // Load user details if token exists
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("agri_token");
      if (token) {
        try {
          const response = await fetch("/api/auth/me", {
            headers: { Authorization: token }
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setShowLanding(false);
          } else {
            localStorage.removeItem("agri_token");
          }
        } catch (e) {
          console.error("Auth check failed:", e);
        }
      }
    };
    checkUser();
  }, []);

  // Sync data arrays once authenticated
  useEffect(() => {
    if (!user) return;

    const syncData = async () => {
      try {
        // 1. Fetch Expenses
        const expRes = await fetch(`/api/expenses?userId=${user.id}`);
        if (expRes.ok) {
          const expData = await expRes.json();
          setExpenses(expData);
        }

        // 2. Fetch Crops Recommended
        const cropRes = await fetch(`/api/crops/recommendations?userId=${user.id}`);
        if (cropRes.ok) {
          const cropData = await cropRes.json();
          setCropRecs(cropData);
        }

        // 3. Fetch Disease Diagnostics
        const disRes = await fetch(`/api/diseases?userId=${user.id}`);
        if (disRes.ok) {
          const disData = await disRes.json();
          setDiseases(disData);
        }

        // 4. Fetch Government Schemes
        const schRes = await fetch("/api/schemes");
        if (schRes.ok) {
          const schData = await schRes.json();
          setSchemes(schData);
        }
      } catch (err) {
        console.error("Data syncing error:", err);
      }
    };

    syncData();
  }, [user]);

  // Auth Operations
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("agri_token", data.token);
        setUser(data.user);
        setShowLanding(false);
      } else {
        setAuthError(data.error || "Login credentials invalid.");
      }
    } catch (err) {
      setAuthError("Auth routing failed. Check backend.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, password })
      });

      const data = await response.json();
      if (response.ok) {
        setTempUserId(data.userId);
        setOtpCode(data.otpCode);
        setOtpSent(true);
      } else {
        setAuthError(data.error || "Registration failed.");
      }
    } catch (err) {
      setAuthError("Registration failure.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const response = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: tempUserId, otp: otpInput })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("agri_token", `jwt-${data.user.id}-${Date.now()}`);
        setUser(data.user);
        setOtpSent(false);
        setShowLanding(false);
      } else {
        setAuthError(data.error || "Incorrect OTP code.");
      }
    } catch (err) {
      setAuthError("OTP routing failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleQuickLogin = async (quickRole: "Farmer" | "Agriculture Officer" | "Admin") => {
    let targetEmail = "rajendran292005@gmail.com";
    if (quickRole === "Agriculture Officer") targetEmail = "officer@agroadvisor.gov";
    if (quickRole === "Admin") targetEmail = "admin@agroadvisor.com";

    setAuthLoading(true);
    setAuthError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, password: "password123" })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("agri_token", data.token);
        setUser(data.user);
        setShowLanding(false);
      }
    } catch (err) {
      setAuthError("Quick login failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("agri_token");
    setUser(null);
    setShowLanding(true);
    setActiveTab("dashboard");
  };

  // State handlers to bubble updates from children panels
  const addExpense = (newExp: Expense) => {
    setExpenses(prev => [...prev, newExp]);
    triggerNotification("New Cost Tracked", `Logged ₹${newExp.amount} for ${newExp.category} category.`, "market");
  };
  const deleteExpense = (id: string) => setExpenses(prev => prev.filter(e => e.id !== id));
  const addCropRec = (newRec: CropRecRecord) => {
    setCropRecs(prev => [...prev, newRec]);
    triggerNotification("AI Recommendation Complete", `Recommended crop: ${newRec.recommendation.bestCrop} with ${newRec.recommendation.confidenceScore}% confidence.`, "system");
  };
  const addDisease = (newDis: DiseaseRecord) => {
    setDiseases(prev => [...prev, newDis]);
    triggerNotification("Plant Pathology Diagnosis", `Detected ${newDis.diseaseName} on Host Crop: ${newDis.crop}.`, "disease");
  };
  const toggleBookmark = (schemeId: string) => {
    setSchemes(prev => prev.map(s => {
      if (s.id === schemeId) {
        const isBookmarked = s.bookmarkedBy.includes(user!.id);
        const updated = isBookmarked 
          ? s.bookmarkedBy.filter(id => id !== user!.id) 
          : [...s.bookmarkedBy, user!.id];
        return { ...s, bookmarkedBy: updated };
      }
      return s;
    }));
  };

  // Sidebar elements configuration
  const sidebarTabs = [
    { id: "dashboard", label: "Dashboard", icon: Sprout, roles: ["Farmer", "Agriculture Officer", "Admin"] },
    { id: "crop-rec", label: "Crop Advisor", icon: BrainCircuit, roles: ["Farmer", "Agriculture Officer", "Admin"] },
    { id: "disease", label: "AI Diagnosis", icon: Camera, roles: ["Farmer", "Agriculture Officer", "Admin"] },
    { id: "weather", label: "Soil &amp; Weather", icon: CloudSun, roles: ["Farmer", "Agriculture Officer", "Admin"] },
    { id: "expenses", label: "Cost Tracker", icon: DollarSign, roles: ["Farmer", "Admin"] },
    { id: "schemes", label: "Govt Schemes", icon: Award, roles: ["Farmer", "Agriculture Officer", "Admin"] },
    { id: "chatbot", label: "AI Assistant", icon: Sparkles, roles: ["Farmer", "Agriculture Officer", "Admin"] },
    { id: "profile", label: "My Profile", icon: UserIcon, roles: ["Farmer", "Agriculture Officer", "Admin"] },
    { id: "admin", label: "Control Center", icon: Users, roles: ["Admin"] }
  ];

  const visibleTabs = sidebarTabs.filter(tab => tab.roles.includes(user?.role || "Farmer"));

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${
      isCyber ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      <AnimatePresence mode="wait">
        
        {/* Landing Page */}
        {showLanding && !user && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingPage onStart={(preferredRole) => {
              setShowLanding(false);
              if (preferredRole) {
                setRole(preferredRole as any);
              }
            }} />
          </motion.div>
        )}

        {/* Authenticating Screen */}
        {!showLanding && !user && (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CinematicLogin
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              name={name}
              setName={setName}
              role={role}
              setRole={setRole}
              isRegister={isRegister}
              setIsRegister={setIsRegister}
              otpSent={otpSent}
              setOtpSent={setOtpSent}
              otpInput={otpInput}
              setOtpInput={setOtpInput}
              authError={authError}
              setAuthError={setAuthError}
              authLoading={authLoading}
              onLogin={handleLogin}
              onRegister={handleRegister}
              onVerifyOtp={handleVerifyOtp}
              onQuickLogin={handleQuickLogin}
              onBackToLanding={() => setShowLanding(true)}
            />
          </motion.div>
        )}

        {/* Authenticated Application Shell */}
        {user && (
          <motion.div
            key="shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex h-screen overflow-hidden transition-colors duration-500 ${
              isCyber ? "bg-slate-950" : "bg-slate-50"
            }`}
          >
            {/* Desktop Sidebar navigation */}
            <aside className={`hidden lg:flex flex-col w-64 shrink-0 border-r transition-colors duration-300 ${
              isCyber 
                ? "bg-slate-950 text-slate-400 border-slate-900" 
                : "bg-emerald-950 text-emerald-100/80 border-emerald-900"
            }`}>
              
              {/* Sidebar Header */}
              <div className={`p-6 border-b flex items-center gap-2 text-white font-display ${
                isCyber ? "border-slate-900" : "border-emerald-900"
              }`}>
                <div className="p-1.5 bg-emerald-500 rounded-xl text-slate-900 shadow-md">
                  <Sprout className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-base tracking-tight font-display">Agri<span className="text-emerald-400 font-bold">Advisor</span></span>
              </div>

              {/* Sidebar Tabs List */}
              <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                {visibleTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-extrabold transition-all font-display ${
                        isActive 
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30" 
                          : isCyber 
                            ? "hover:bg-slate-900/60 hover:text-slate-200" 
                            : "hover:bg-emerald-900/40 hover:text-emerald-100"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>

              {/* Sidebar User Footer */}
              <div className={`p-4 border-t flex items-center justify-between gap-2.5 ${
                isCyber ? "border-slate-900" : "border-emerald-900"
              }`}>
                <button
                  onClick={() => setActiveTab("profile")}
                  className="min-w-0 flex-1 text-left hover:opacity-85 transition-opacity cursor-pointer group"
                  title="View &amp; Edit Profile"
                >
                  <div className="font-bold text-xs text-slate-200 truncate group-hover:text-emerald-400 transition-colors">{user.name}</div>
                  <div className={`text-[10px] font-semibold truncate ${
                    isCyber ? "text-slate-500" : "text-emerald-300/60"
                  }`}>{user.email}</div>
                </button>
                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-xl transition-colors shrink-0 ${
                    isCyber 
                      ? "bg-slate-900 hover:bg-red-950 hover:text-red-400 text-slate-400" 
                      : "bg-emerald-900/60 hover:bg-red-950 hover:text-red-350 text-emerald-300"
                  }`}
                  title="Logout Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </aside>

            {/* Right Main Panel Panel Container */}
            <div className="flex-1 flex flex-col min-w-0">
              
              {/* Top bar header */}
              <header className={`sticky top-0 z-40 backdrop-blur-md border-b p-4 flex justify-between items-center lg:px-8 transition-colors duration-500 ${
                isCyber 
                  ? "bg-slate-950/80 border-slate-900 text-slate-100" 
                  : "bg-white/80 border-slate-150 text-slate-800"
              }`}>
                
                {/* Mobile Menu trigger */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileMenuOpen(true)}
                    className={`p-2 rounded-xl lg:hidden ${
                      isCyber ? "bg-slate-900 text-slate-300 hover:bg-slate-800" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-1.5 lg:hidden">
                    <Sprout className="w-4 h-4 text-emerald-600" />
                    <span className={`font-extrabold text-sm tracking-tight ${isCyber ? "text-slate-105" : "text-slate-805"}`}>AI Agri</span>
                  </div>
                </div>

                {/* Left side actions */}
                <div className="flex items-center gap-4 ml-auto">
                  
                  {/* Sync Indicator */}
                  <div className={`hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border transition-colors ${
                    isCyber 
                      ? "bg-slate-900 text-slate-400 border-slate-800" 
                      : "bg-slate-50 text-slate-500 border-slate-100"
                  }`}>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Live SQLite-JSON Engine
                  </div>

                  {/* Dynamic Alert Icon */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className={`relative p-2 rounded-xl cursor-pointer transition-colors focus:outline-none border ${
                        isCyber 
                          ? "bg-slate-900 hover:bg-slate-800/80 border-slate-800 text-slate-300" 
                          : "bg-slate-50 hover:bg-slate-100/80 border-slate-100 text-slate-600"
                      }`}
                    >
                      <BellRing className={`w-4 h-4 ${isCyber ? "text-slate-300" : "text-slate-600"} ${notifications.filter(n => !n.isRead).length > 0 ? "animate-bounce text-amber-500" : ""}`} />
                      {notifications.filter(n => !n.isRead).length > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full shadow-sm flex items-center justify-center min-w-[16px] h-[16px]">
                          {notifications.filter(n => !n.isRead).length}
                        </span>
                      )}
                    </button>

                    {/* Notification Dropdown Tray */}
                    {showNotifications && (
                      <>
                        {/* Overlay to dismiss dropdown when clicking outside */}
                        <div 
                          className="fixed inset-0 z-40 cursor-default" 
                          onClick={() => setShowNotifications(false)} 
                        />
                        <div className={`absolute right-0 mt-2.5 w-80 sm:w-96 rounded-3xl border shadow-2xl z-50 overflow-hidden font-sans transition-colors ${
                          isCyber ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
                        }`}>
                          {/* Header */}
                          <div className={`p-4 border-b flex items-center justify-between transition-colors ${
                            isCyber ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"
                          }`}>
                            <div className="flex items-center gap-2">
                              <Bell className="w-4 h-4 text-slate-400" />
                              <span className={`font-extrabold text-xs uppercase tracking-wider ${
                                isCyber ? "text-slate-300" : "text-slate-800"
                              }`}>Advisory Notifications</span>
                              {notifications.filter(n => !n.isRead).length > 0 && (
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full">
                                  {notifications.filter(n => !n.isRead).length} New
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {notifications.filter(n => !n.isRead).length > 0 && (
                                <button
                                  onClick={() => {
                                    markAllNotificationsAsRead();
                                  }}
                                  className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                                  title="Mark all as read"
                                >
                                  Mark all read
                                </button>
                              )}
                              {notifications.length > 0 && (
                                <button
                                  onClick={() => {
                                    clearAllNotifications();
                                  }}
                                  className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:underline cursor-pointer"
                                  title="Clear all"
                                >
                                  Clear all
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Notifications Scroll Area */}
                          <div className={`max-h-[350px] overflow-y-auto divide-y ${
                            isCyber ? "divide-slate-800" : "divide-slate-50"
                          }`}>
                            {notifications.length === 0 ? (
                              <div className="p-8 text-center text-slate-400">
                                <CheckCircle className="w-10 h-10 text-emerald-100 mx-auto mb-2" />
                                <h4 className={`font-bold text-xs ${isCyber ? "text-slate-300" : "text-slate-700"}`}>All Caught Up!</h4>
                                <p className="text-[10px] text-slate-400 mt-1">No active system or farm advisories detected.</p>
                              </div>
                            ) : (
                              notifications.map((n) => {
                                return (
                                  <div 
                                    key={n.id} 
                                    onClick={() => markNotificationAsRead(n.id)}
                                    className={`p-3.5 flex gap-3 items-start transition-colors cursor-pointer relative ${
                                      isCyber 
                                        ? "hover:bg-slate-800/50 " + (!n.isRead ? "bg-emerald-500/5" : "") 
                                        : "hover:bg-slate-50 " + (!n.isRead ? "bg-blue-50/20" : "")
                                    }`}
                                  >
                                    {/* Icon selection */}
                                    <div className={`p-2 rounded-xl shrink-0 ${
                                      isCyber
                                        ? "bg-slate-950 border border-slate-800 text-emerald-400"
                                        : n.type === "weather" ? "bg-amber-50 text-amber-500" :
                                          n.type === "scheme" ? "bg-purple-50 text-purple-500" :
                                          n.type === "market" ? "bg-emerald-50 text-emerald-500" :
                                          n.type === "disease" ? "bg-rose-50 text-rose-500" :
                                          "bg-blue-50 text-blue-500"
                                    }`}>
                                      {n.type === "weather" && <CloudSun className="w-4 h-4" />}
                                      {n.type === "scheme" && <Award className="w-4 h-4" />}
                                      {n.type === "market" && <TrendingUp className="w-4 h-4" />}
                                      {n.type === "disease" && <Camera className="w-4 h-4" />}
                                      {n.type === "system" && <Sprout className="w-4 h-4" />}
                                    </div>

                                    {/* Text Detail */}
                                    <div className="min-w-0 flex-1">
                                      <div className="flex justify-between items-start gap-1">
                                        <h4 className={`text-xs font-bold leading-snug truncate ${!n.isRead 
                                             ? (isCyber ? "text-emerald-400 font-extrabold" : "text-slate-900 font-extrabold") 
                                             : (isCyber ? "text-slate-300" : "text-slate-700")}`}>
                                          {n.title}
                                        </h4>
                                        <span className="text-[9px] font-semibold text-slate-400 whitespace-nowrap">
                                          {formatRelativeTime(n.createdAt)}
                                        </span>
                                      </div>
                                      <p className={`text-[11px] leading-normal mt-0.5 font-medium ${isCyber ? "text-slate-400" : "text-slate-500"}`}>
                                        {n.message}
                                      </p>
                                    </div>

                                    {/* Right Controls */}
                                    <div className="flex flex-col items-center gap-1.5 shrink-0 self-center">
                                      {!n.isRead && (
                                        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shrink-0" title="Unread advisory" />
                                      )}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteNotification(n.id);
                                        }}
                                        className={`p-1 rounded-lg transition-colors cursor-pointer ${isCyber ? "hover:bg-slate-800 text-slate-500 hover:text-red-400" : "hover:bg-slate-100 text-slate-400 hover:text-red-500"}`}
                                        title="Delete advisory"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </header>

              {/* Main Tab Routing content frame with scroll constraints */}
              <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl w-full mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === "dashboard" && (
                      <DashboardView 
                        user={user} 
                        expenses={expenses} 
                        cropRecs={cropRecs} 
                        diseases={diseases} 
                        onNavigate={(tab) => setActiveTab(tab)}
                        isCyber={isCyber}
                        setIsCyber={setIsCyber}
                      />
                    )}

                    {activeTab === "crop-rec" && (
                      <CropRecommendView 
                        user={user} 
                        onAddRecommendation={addCropRec} 
                      />
                    )}

                    {activeTab === "disease" && (
                      <DiseaseDetectView 
                        user={user} 
                        onAddDisease={addDisease} 
                      />
                    )}

                    {activeTab === "weather" && (
                      <WeatherView />
                    )}

                    {activeTab === "expenses" && (
                      <ExpenseTrackerView 
                        user={user} 
                        expenses={expenses} 
                        onAddExpense={addExpense} 
                        onDeleteExpense={deleteExpense} 
                      />
                    )}

                    {activeTab === "schemes" && (
                      <SchemesView 
                        user={user} 
                        schemes={schemes} 
                        onToggleBookmark={toggleBookmark} 
                      />
                    )}

                    {activeTab === "chatbot" && (
                      <ChatbotView user={user} />
                    )}

                    {activeTab === "profile" && (
                      <ProfileView 
                        user={user} 
                        onUpdateProfile={(updatedUser) => setUser(updatedUser)}
                      />
                    )}

                    {activeTab === "admin" && (
                      <AdminPanel currentUser={user} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </main>

            </div>

            {/* Mobile Drawer Slide Navigation Overlay */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                  
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                  />

                  {/* Drawer Content */}
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 25 }}
                    className={`relative flex flex-col w-72 max-w-sm h-full p-6 shadow-2xl transition-colors duration-350 ${
                      isCyber 
                        ? "bg-slate-950 text-slate-400 border-r border-slate-900" 
                        : "bg-emerald-950 text-emerald-100/80 border-r border-emerald-900"
                    }`}
                  >
                    <div className={`flex justify-between items-center pb-6 border-b text-white mb-6 ${
                      isCyber ? "border-slate-900" : "border-emerald-900"
                    }`}>
                      <div className="flex items-center gap-2">
                        <Sprout className="w-5 h-5 text-emerald-400" />
                        <span className="font-extrabold text-base font-display">AgriAdvisor</span>
                      </div>
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className={`p-1.5 rounded-xl transition-colors ${
                          isCyber ? "bg-slate-900 text-slate-450 hover:text-white" : "bg-emerald-900/55 text-emerald-300 hover:text-white"
                        }`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <nav className="flex-1 space-y-1.5 overflow-y-auto">
                      {visibleTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveTab(tab.id);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                              isActive 
                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20" 
                                : isCyber 
                                  ? "hover:bg-slate-900/60 hover:text-slate-200" 
                                  : "hover:bg-emerald-900/40 hover:text-emerald-100"
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            {tab.label}
                          </button>
                        );
                      })}
                    </nav>

                    <div className={`pt-6 border-t flex items-center justify-between gap-3 mt-auto text-white ${
                      isCyber ? "border-slate-900" : "border-emerald-900"
                    }`}>
                      <button
                        onClick={() => {
                          setActiveTab("profile");
                          setMobileMenuOpen(false);
                        }}
                        className="min-w-0 flex-1 text-left hover:opacity-85 transition-opacity cursor-pointer group"
                        title="View &amp; Edit Profile"
                      >
                        <div className="font-bold text-xs truncate group-hover:text-emerald-400 transition-colors">{user.name}</div>
                        <div className={`text-[10px] font-bold truncate ${
                          isCyber ? "text-slate-500" : "text-emerald-300/60"
                        }`}>{user.email}</div>
                      </button>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className={`p-2 rounded-xl transition-colors shrink-0 ${
                          isCyber 
                            ? "bg-slate-900 hover:bg-red-950 hover:text-red-400 text-slate-400" 
                            : "bg-emerald-900/60 hover:bg-red-950 hover:text-red-350 text-emerald-300"
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>

                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
