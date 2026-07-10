import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  User as UserIcon, 
  Phone, 
  MapPin, 
  Ruler, 
  Sprout, 
  Mail, 
  Shield, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Save, 
  Loader2 
} from "lucide-react";
import { User } from "../types";

interface ProfileViewProps {
  user: User;
  onUpdateProfile: (updatedUser: User) => void;
}

export default function ProfileView({ user, onUpdateProfile }: ProfileViewProps) {
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [location, setLocation] = useState(user.location || "");
  const [farmSize, setFarmSize] = useState(user.farmSize ? String(user.farmSize) : "");
  const [primaryCrop, setPrimaryCrop] = useState(user.primaryCrop || "");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("agri_token") || ""
        },
        body: JSON.stringify({
          userId: user.id,
          name,
          phone,
          location,
          farmSize: farmSize ? Number(farmSize) : undefined,
          primaryCrop
        })
      });

      const data = await response.json();
      if (response.ok) {
        onUpdateProfile(data.user);
        setMessage({ type: "success", text: "Your profile has been updated successfully." });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update profile." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "A network error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-12 max-w-4xl mx-auto">
      {/* Banner Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl text-white">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="p-5 bg-emerald-600/30 border border-emerald-500/20 rounded-3xl text-emerald-400 shrink-0 shadow-lg">
            <UserIcon className="w-12 h-12" />
          </div>
          <div className="text-center md:text-left space-y-1.5 flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight truncate">
              {user.name}
            </h1>
            <p className="text-sm text-slate-300 font-medium flex items-center justify-center md:justify-start gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              Role: <span className="text-emerald-300 font-semibold">{user.role}</span>
            </p>
            <p className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              Registered: {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            {user.isVerified ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-xl shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Verified Grower
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold rounded-xl shadow-sm">
                <XCircle className="w-4 h-4 text-amber-400" />
                Unverified Profile
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Card: Account Statistics & Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Account Credentials</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3 items-start border-b border-slate-50 pb-4">
                <div className="p-2 bg-slate-50 rounded-xl text-slate-500 shrink-0 border border-slate-100">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Login Email</div>
                  <div className="text-xs font-bold text-slate-700 truncate mt-0.5">{user.email}</div>
                  <span className="inline-block text-[9px] font-semibold text-slate-400 mt-1 bg-slate-100 px-2 py-0.5 rounded-full">
                    Primary Sign-In Key
                  </span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2 bg-slate-50 rounded-xl text-slate-500 shrink-0 border border-slate-100">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Account Status</div>
                  <div className="text-xs font-bold text-slate-700 mt-0.5">
                    {user.isVerified ? "Fully Active" : "Pending Activation"}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Verified profiles unlock premium microclimate forecasting features.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/40 p-6 rounded-3xl border border-emerald-100/50 space-y-3">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
              Smart Farmer Profile
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Completing your farming profile helps the AI Agriculture Advisor system customize crop yields, profit estimations, and microclimate risk analyses for your specific region and farm dimensions.
            </p>
          </div>
        </div>

        {/* Right Card: Profile Edit Form */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="border-b border-slate-50 pb-4">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Update Profile Information</h3>
              <p className="text-xs text-slate-400 mt-0.5">Customize your personal bio and agricultural operational properties.</p>
            </div>

            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl text-xs font-semibold border ${
                  message.type === "success" 
                    ? "bg-emerald-50 text-emerald-800 border-emerald-100" 
                    : "bg-red-50 text-red-800 border-red-100"
                }`}
              >
                {message.text}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  Full Name
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Rajendran Farmer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Contact Number
                </label>
                <input 
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Farm Location / Region
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Tamil Nadu, IN"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Farm Size */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-slate-400" />
                  Total Farm Size (Acres)
                </label>
                <input 
                  type="number"
                  step="0.1"
                  placeholder="e.g. 4.5"
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Primary Crop */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-slate-400" />
                  Primary Crops Cultivated
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Basmati Paddy, Sugarcane, Cotton"
                  value={primaryCrop}
                  onChange={(e) => setPrimaryCrop(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="border-t border-slate-50 pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Profile Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
