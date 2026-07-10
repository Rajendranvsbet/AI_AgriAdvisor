import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Activity, 
  Users, 
  Sprout, 
  Camera, 
  DollarSign, 
  RefreshCw, 
  CheckCircle,
  AlertTriangle,
  FileText,
  ShieldAlert
} from "lucide-react";
import { User } from "../types";

interface AdminPanelProps {
  currentUser: User;
}

export default function AdminPanel({ currentUser }: AdminPanelProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/overview");
      if (response.ok) {
        const payload = await response.json();
        setData(payload);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const changeUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch("/api/admin/users/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRole })
      });

      if (response.ok) {
        setSuccessMsg("User classification updated in database!");
        setTimeout(() => setSuccessMsg(""), 3000);
        fetchOverview();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sysLogs = [
    { time: "03:46:58", event: "Express HTTP listening on port 3000", type: "system" },
    { time: "03:47:04", event: "JSON database state committed to data.json", type: "db" },
    { time: "03:48:22", event: "Lazy Gemini API client check completed", type: "ai" },
    { time: "03:49:50", event: "GET /api/auth/me - 200 OK", type: "http" },
    { time: "03:50:41", event: "POST /api/crops/recommend - 201 Created", type: "http" },
    { time: "03:51:14", event: "POST /api/diseases/detect - 201 Created", type: "http" }
  ];

  return (
    <div className="space-y-8 font-sans pb-12">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-purple-600" />
            Platform Control Panel
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            System overview analytics, user accounts permissions promotion, and diagnostic transaction logs.
          </p>
        </div>

        <button
          onClick={fetchOverview}
          disabled={loading}
          className="p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {data && (
        <div className="space-y-8">
          
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Users</div>
                <div className="text-xl font-black text-slate-800 mt-0.5">{data.totalUsers}</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Crop Recs</div>
                <div className="text-xl font-black text-slate-800 mt-0.5">{data.totalCropsRecommended}</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Disease Reports</div>
                <div className="text-xl font-black text-slate-800 mt-0.5">{data.totalDiseasesDetected}</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expenses Logged</div>
                <div className="text-xl font-black text-slate-800 mt-0.5">₹{data.totalExpenses.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-2xl text-xs font-bold text-center">
              {successMsg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* User details table */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">User Account Classifications</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
                      <th className="pb-3">User Profile</th>
                      <th className="pb-3">Classification Role</th>
                      <th className="pb-3 text-center">Security Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.usersList.map((userItem: any) => (
                      <tr key={userItem.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5">
                          <div>
                            <span className="font-bold text-slate-800 text-xs block">{userItem.name}</span>
                            <span className="text-[10px] text-slate-400 block">{userItem.email}</span>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                            userItem.role === "Admin" ? "bg-purple-100 text-purple-800" :
                            userItem.role === "Agriculture Officer" ? "bg-blue-100 text-blue-800" :
                            "bg-emerald-100 text-emerald-800"
                          }`}>
                            {userItem.role}
                          </span>
                        </td>
                        <td className="py-3.5 text-center">
                          {userItem.id !== currentUser.id ? (
                            <select
                              value={userItem.role}
                              onChange={(e) => changeUserRole(userItem.id, e.target.value)}
                              className="px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-semibold bg-slate-50 outline-none cursor-pointer"
                            >
                              <option value="Farmer">Farmer</option>
                              <option value="Agriculture Officer">Agri Officer</option>
                              <option value="Admin">Admin</option>
                            </select>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Active Session</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Platform log console */}
            <div className="lg:col-span-4 bg-slate-950 text-slate-300 p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Diagnostic Console</span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>

              <div className="font-mono text-[10px] space-y-2.5 max-h-[220px] overflow-y-auto">
                {sysLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-slate-500 font-medium shrink-0">[{log.time}]</span>
                    <span className={
                      log.type === "ai" ? "text-amber-400" :
                      log.type === "db" ? "text-emerald-400" :
                      log.type === "system" ? "text-blue-400" : "text-slate-300"
                    }>
                      {log.event}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
