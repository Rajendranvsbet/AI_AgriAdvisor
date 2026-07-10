import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  FileSpreadsheet, 
  Calendar, 
  Tag, 
  FileText,
  PieChart,
  TrendingDown
} from "lucide-react";
import { Expense, User } from "../types";

interface ExpenseTrackerViewProps {
  user: User;
  expenses: Expense[];
  onAddExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

export default function ExpenseTrackerView({ user, expenses, onAddExpense, onDeleteExpense }: ExpenseTrackerViewProps) {
  const [category, setCategory] = useState<Expense["category"]>("Seeds");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    setLoading(true);
    setSuccessMsg("");

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || "anonymous",
          category,
          amount,
          date,
          description
        })
      });

      if (response.ok) {
        const data = await response.json();
        onAddExpense(data);
        setAmount("");
        setDescription("");
        setSuccessMsg("Expense logged successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (response.ok) {
        onDeleteExpense(id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Aggregates
  const totalCost = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Custom visual list
  const categorySummary = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  // Export to Excel / CSV Simulator
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,ID,Category,Amount,Date,Description\n";
    expenses.forEach((e) => {
      csvContent += `${e.id},${e.category},${e.amount},${e.date},"${e.description.replace(/"/g, '""')}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `agri_expenses_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 font-sans pb-12">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-emerald-600" />
            Seasonal Cost Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Log raw inputs, manage operational budgets, view spending segments, and export high-fidelity financial audit spreadsheets.
          </p>
        </div>
        
        <button
          onClick={exportToCSV}
          disabled={expenses.length === 0}
          className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm disabled:opacity-40"
        >
          <FileSpreadsheet className="w-4 h-4" /> Export Ledger CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Logger Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Log Expenditure</h3>
            <p className="text-xs text-slate-400 mt-0.5">Record immediate farm transactions</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Seeds">Seeds</option>
                <option value="Labor">Labor</option>
                <option value="Machinery">Machinery Rental</option>
                <option value="Fuel">Fuel (Tractor/Pump)</option>
                <option value="Fertilizer">Fertilizers / Nutrients</option>
                <option value="Transport">Logistics / Hauling</option>
                <option value="Other">Other Expenses</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cost (₹ INR)</label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 font-bold text-slate-400 text-sm">₹</span>
                <input 
                  type="number"
                  min="1"
                  required
                  placeholder="e.g. 2400"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Transaction Date</label>
              <input 
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description / Vendor</label>
              <textarea 
                placeholder="e.g. Purchased 5 bags Basmati Paddy Seeds from local cooperative store"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none min-h-[80px]"
              />
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-100 text-center">
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-emerald-100 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {loading ? "Logging Entry..." : "Log Transaction"}
            </button>
          </form>
        </div>

        {/* Right Side: Ledger Table & Cost Breakdowns */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Total Budget Card */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl flex justify-between items-center shadow-lg">
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Accumulated Seasonal Expenses</div>
              <div className="text-3xl font-black text-white mt-1">₹{totalCost.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400 mt-1 font-medium">Estimated Seasonal Limit: ₹60,000</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <PieChart className="w-6 h-6" />
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Ledger Ledger</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
                    <th className="pb-3 font-bold">Category</th>
                    <th className="pb-3 font-bold">Date</th>
                    <th className="pb-3 font-bold text-right">Cost</th>
                    <th className="pb-3 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-xs text-slate-400 font-medium">
                        No transactions logged for this season yet.
                      </td>
                    </tr>
                  ) : (
                    expenses.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5 text-slate-400" />
                            <div>
                              <span className="font-bold text-slate-800 text-xs block">{e.category}</span>
                              <span className="text-[10px] text-slate-400 max-w-[180px] truncate block">{e.description || "No memo"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-slate-500 font-medium text-xs whitespace-nowrap">
                          {new Date(e.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-right font-black text-slate-800 text-xs whitespace-nowrap">
                          ₹{e.amount.toLocaleString()}
                        </td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => handleDelete(e.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all inline-flex"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
