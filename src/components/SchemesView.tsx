import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Award, 
  Search, 
  Bookmark, 
  ExternalLink, 
  HelpCircle, 
  CheckCircle,
  FileText,
  BadgeAlert,
  Info
} from "lucide-react";
import { Scheme, User } from "../types";

interface SchemesViewProps {
  user: User;
  schemes: Scheme[];
  onToggleBookmark: (schemeId: string) => void;
}

export default function SchemesView({ user, schemes, onToggleBookmark }: SchemesViewProps) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Bookmarked">("All");
  
  // Eligibility states
  const [landOwned, setLandOwned] = useState("");
  const [isLandholder, setIsLandholder] = useState(true);
  const [eligibilityResult, setEligibilityResult] = useState<string | null>(null);

  const filteredSchemes = schemes.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || 
                          s.description.toLowerCase().includes(search.toLowerCase());
    
    if (filterType === "Bookmarked") {
      return matchesSearch && s.bookmarkedBy.includes(user?.id);
    }
    return matchesSearch;
  });

  const runEligibilityCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const acres = Number(landOwned);
    if (!acres || acres <= 0) {
      setEligibilityResult("Please specify a valid cultivable land size.");
      return;
    }

    if (!isLandholder) {
      setEligibilityResult("Note: Prime schemes like PM-KISAN require operational landholding registered under your family name. However, sharing contracts (Fasal Bima) support non-landholders.");
    } else if (acres > 5) {
      setEligibilityResult("Qualified! You are eligible for large landholder schemes and tractor farm equipment subsidies. Note: PM-KISAN is optimized for small/medium families, but check local criteria limits.");
    } else {
      setEligibilityResult("Excellent! You qualify for all Small & Marginal Landholder benefits, PM-KISAN direct cash payments, and heavily subsidized seeds/fertilizer kits.");
    }
  };

  const handleBookmark = async (schemeId: string) => {
    try {
      const response = await fetch("/api/schemes/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id || "anonymous", schemeId })
      });
      if (response.ok) {
        onToggleBookmark(schemeId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-12">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Award className="w-7 h-7 text-emerald-600" />
          Government Schemes &amp; Subsidies
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore direct income assistance plans, agricultural risk crop insurance programs, national organic fertilizers cards, and track bookmarks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Schemes directory */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text"
                placeholder="Search schemes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setFilterType("All")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterType === "All" ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                All Programs
              </button>
              <button
                onClick={() => setFilterType("Bookmarked")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  filterType === "Bookmarked" ? "bg-emerald-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" /> Bookmarked ({schemes.filter(s => s.bookmarkedBy.includes(user?.id)).length})
              </button>
            </div>
          </div>

          {/* Schemes grid list */}
          <div className="space-y-4">
            {filteredSchemes.length === 0 ? (
              <div className="bg-white py-12 text-center rounded-3xl border border-slate-100 text-slate-400 text-xs font-semibold">
                No schemes found matching the criteria.
              </div>
            ) : (
              filteredSchemes.map((scheme) => {
                const isBookmarked = scheme.bookmarkedBy.includes(user?.id);
                return (
                  <motion.div
                    key={scheme.id}
                    layoutId={`scheme-${scheme.id}`}
                    className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 hover:text-emerald-600 transition-colors cursor-pointer">{scheme.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{scheme.description}</p>
                      </div>

                      <button
                        onClick={() => handleBookmark(scheme.id)}
                        className={`p-2.5 rounded-xl border transition-all ${
                          isBookmarked 
                            ? "bg-emerald-50 border-emerald-200 text-emerald-600" 
                            : "bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600"
                        }`}
                        title="Bookmark"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {/* Criteria check cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 text-xs">
                      <div>
                        <span className="font-extrabold text-slate-400 uppercase text-[9px] tracking-wider block">Program Eligibility</span>
                        <p className="text-slate-600 font-medium leading-relaxed mt-1">{scheme.eligibility}</p>
                      </div>

                      <div>
                        <span className="font-extrabold text-slate-400 uppercase text-[9px] tracking-wider block">Benefits details</span>
                        <p className="text-emerald-800 font-bold leading-relaxed mt-1">{scheme.benefits}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Info className="w-4 h-4 text-slate-400" /> Direct Bank Transfer (DBT) enabled
                      </span>
                      
                      <a
                        href={scheme.link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1 hover:bg-emerald-700 transition-colors"
                      >
                        Official Application Portal <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Quick self-eligibility checker */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Quick Eligibility Audit</h3>
            <p className="text-xs text-slate-400 mt-0.5">Evaluate qualification parameters</p>
          </div>

          <form onSubmit={runEligibilityCheck} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cultivable Land Size (Acres)</label>
              <input 
                type="number"
                min="0.1"
                step="0.1"
                required
                placeholder="e.g. 3.5"
                value={landOwned}
                onChange={(e) => setLandOwned(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Owner Status</label>
              
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="status"
                    checked={isLandholder === true}
                    onChange={() => setIsLandholder(true)}
                    className="accent-emerald-600"
                  />
                  <span className="text-xs text-slate-700 font-bold">Land Registered Owner</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="status"
                    checked={isLandholder === false}
                    onChange={() => setIsLandholder(false)}
                    className="accent-emerald-600"
                  />
                  <span className="text-xs text-slate-700 font-bold">Sharecropper / Tenant</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm"
            >
              Verify Eligibility Criteria
            </button>
          </form>

          {eligibilityResult && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-emerald-50 text-emerald-950 rounded-2xl border border-emerald-100/50 text-xs leading-relaxed space-y-1.5"
            >
              <div className="font-extrabold text-[10px] text-emerald-800 uppercase flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Evaluation Results
              </div>
              <p className="font-medium text-emerald-900">{eligibilityResult}</p>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
