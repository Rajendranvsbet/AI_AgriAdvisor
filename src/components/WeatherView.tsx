import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  CloudSun, 
  CloudRain, 
  CloudLightning, 
  Sun, 
  Compass, 
  Droplet, 
  Wind, 
  Calendar,
  Layers,
  Thermometer,
  ShieldAlert,
  Sprout,
  HelpCircle,
  FileCheck
} from "lucide-react";

export default function WeatherView() {
  const [soilType, setSoilType] = useState("Clayey");
  const [moistureInput, setMoistureInput] = useState(65);
  const [nitrogenInput, setNitrogenInput] = useState(80);

  // Simulated weather data
  const weeklyForecast = [
    { day: "Tue", temp: 30, rainProb: 15, condition: "Partly Cloudy", icon: "cloud-sun" },
    { day: "Wed", temp: 31, rainProb: 10, condition: "Sunny", icon: "sun" },
    { day: "Thu", temp: 33, rainProb: 80, condition: "Thunderstorms", icon: "storm" },
    { day: "Fri", temp: 28, rainProb: 40, condition: "Light Showers", icon: "rain" },
    { day: "Sat", temp: 29, rainProb: 5, condition: "Sunny", icon: "sun" },
    { day: "Sun", temp: 30, rainProb: 10, condition: "Sunny", icon: "sun" },
    { day: "Mon", temp: 31, rainProb: 12, condition: "Partly Cloudy", icon: "cloud-sun" }
  ];

  // Simple Fertilizer calculator logic
  const calculateFertilizer = () => {
    const deficitN = Math.max(120 - nitrogenInput, 0);
    const ureaBagsNeeded = Math.ceil((deficitN * 2.17 * 4.5) / 50); // 50kg bag, 4.5 acres
    return {
      deficitN,
      ureaBagsNeeded: ureaBagsNeeded || 0,
      potashBags: Math.floor(Math.random() * 2) + 2,
      compostBags: Math.floor(Math.random() * 4) + 6
    };
  };

  const fertPlan = calculateFertilizer();

  // Dynamic irrigation schedule based on soil type & moisture
  const getIrrigationRecommendation = () => {
    if (moistureInput < 40) {
      return {
        status: "Critical Water Deficit",
        color: "text-red-600 bg-red-50 border-red-100",
        message: "Severe dehydration detected. Apply immediate deep root irrigation. Required volume: ~450 Liters/Acre.",
        schedule: "Today, 6:00 PM (Sunset cooling window)"
      };
    } else if (moistureInput < 60) {
      return {
        status: "Moderate Moisture Level",
        color: "text-amber-600 bg-amber-50 border-amber-100",
        message: "Moisture levels are dipping below optimal. Schedule secondary drip irrigation. Required volume: ~250 Liters/Acre.",
        schedule: "Tomorrow, 5:30 AM (Morning absorption window)"
      };
    } else {
      return {
        status: "Optimal Hydration Index",
        color: "text-emerald-600 bg-emerald-50 border-emerald-100",
        message: "Excellent moisture content. Hold off irrigation. Next moisture review recommended in 48 hours.",
        schedule: "No watering needed today. Monitor weather rain forecasts."
      };
    }
  };

  const irrigation = getIrrigationRecommendation();

  // Custom SVG chart path generators for 7-day temperature trends
  const svgWidth = 500;
  const svgHeight = 120;
  const padding = 30;
  
  const points = weeklyForecast.map((item, index) => {
    const x = padding + (index * (svgWidth - 2 * padding)) / (weeklyForecast.length - 1);
    // Maps 25-35 temp range to height (100 to 20)
    const y = svgHeight - padding - ((item.temp - 25) * (svgHeight - 2 * padding)) / 10;
    return { x, y, temp: item.temp, day: item.day };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - padding} L ${points[0].x} ${svgHeight - padding} Z`;

  return (
    <div className="space-y-8 font-sans pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <CloudSun className="w-7 h-7 text-blue-600" />
          Climate &amp; Soil Intelligence
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Coordinate seasonal atmospheric transitions, dynamic moisture indexes, customized fertilizer bag formulations, and micro-drip timetables.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Section: Weather forecasts */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Current index widgets */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Atmospheric Live Radar</h3>
                <p className="text-xs text-slate-400">Regional station telemetries</p>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                ● Live Synchronized
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-2xl">
                <Thermometer className="w-5 h-5 text-amber-500 mx-auto" />
                <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase">UV Index</div>
                <div className="font-extrabold text-slate-800 text-sm mt-0.5">3.4 Low</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-2xl">
                <Wind className="w-5 h-5 text-blue-500 mx-auto" />
                <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Humidity</div>
                <div className="font-extrabold text-slate-800 text-sm mt-0.5">72% RH</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-2xl">
                <Compass className="w-5 h-5 text-teal-500 mx-auto" />
                <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Soil pH</div>
                <div className="font-extrabold text-slate-800 text-sm mt-0.5">6.8 Neutral</div>
              </div>
            </div>

            {/* 7-Day Temp Trend Chart */}
            <div className="pt-4 border-t border-slate-50 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span>7-Day Temperature Trend (°C)</span>
                <span className="text-[10px] text-slate-400">Expected High: 33°C</span>
              </div>
              
              <div className="w-full overflow-x-auto">
                <div className="min-w-[450px]">
                  <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
                    {/* Grids */}
                    <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#f1f5f9" strokeWidth="1" />
                    <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1" />
                    
                    {/* Area fill */}
                    <path d={areaD} fill="url(#blue-gradient)" opacity="0.1" />
                    
                    {/* Trend Line */}
                    <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
                    
                    {/* Dots and Labels */}
                    {points.map((p, idx) => (
                      <g key={idx}>
                        <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                        <text x={p.x} y={p.y - 8} textAnchor="middle" className="text-[9px] font-black fill-slate-800">{p.temp}°</text>
                        <text x={p.x} y={svgHeight - 10} textAnchor="middle" className="text-[9px] font-bold fill-slate-400">{p.day}</text>
                      </g>
                    ))}

                    <defs>
                      <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day forecasts scroll list */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Hourly &amp; Weekly Outlook</h3>
            
            <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
              {weeklyForecast.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl text-center flex flex-col justify-between border border-slate-50 hover:border-blue-200 transition-colors">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{item.day}</span>
                  <div className="my-2 text-blue-600 flex justify-center">
                    {item.icon === "sun" && <Sun className="w-5 h-5 text-amber-500" />}
                    {item.icon === "cloud-sun" && <CloudSun className="w-5 h-5 text-slate-500" />}
                    {item.icon === "rain" && <CloudRain className="w-5 h-5 text-blue-500" />}
                    {item.icon === "storm" && <CloudLightning className="w-5 h-5 text-purple-600 animate-bounce" />}
                  </div>
                  <span className="font-black text-slate-800 text-xs">{item.temp}°C</span>
                  <span className="text-[9px] text-blue-500 font-bold mt-1">☔ {item.rainProb}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Section: Soil Health Analysis & Drip Scheduler */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Dynamic Moisture Soil Tester */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Water Scheduler &amp; Drip Controller</h3>
                <p className="text-xs text-slate-400">Based on active sensor telemetry</p>
              </div>
              <Droplet className="w-6 h-6 text-blue-500" />
            </div>

            {/* Slider to trigger different moisture indices */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Active Soil Moisture Index</span>
                <span className="text-blue-600">{moistureInput}% moisture</span>
              </div>
              <input 
                type="range"
                min="20"
                max="90"
                value={moistureInput}
                onChange={(e) => setMoistureInput(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                <span>Bone Dry (20%)</span>
                <span>Waterlogged (90%)</span>
              </div>
            </div>

            {/* Simulated Irrigation Card */}
            <div className={`p-4.5 rounded-2xl border ${irrigation.color} space-y-2.5`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider">{irrigation.status}</span>
                <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full shadow-sm">Suggested Task</span>
              </div>
              <p className="text-xs leading-relaxed font-medium">
                {irrigation.message}
              </p>
              <div className="pt-2 border-t border-slate-200/40 text-xs font-bold flex justify-between">
                <span>Next Hydration Event:</span>
                <span className="underline">{irrigation.schedule}</span>
              </div>
            </div>
          </div>

          {/* Fertilizer Bag Dosage Calculator */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">NPK Bag Dosage Calculator</h3>
                <p className="text-xs text-slate-400">Calculate quantities based on farm deficit</p>
              </div>
              <Layers className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Soil Nitrogen (N) Levels</span>
                <span className="text-emerald-600">{nitrogenInput} ppm</span>
              </div>
              <input 
                type="range"
                min="40"
                max="120"
                value={nitrogenInput}
                onChange={(e) => setNitrogenInput(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Calculator Outputs */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recommended Bags to Buy (for 4.5 Acres):</div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="p-2.5 bg-white rounded-xl text-center border border-slate-100 shadow-sm">
                  <div className="text-xs font-black text-slate-800">{fertPlan.ureaBagsNeeded}</div>
                  <div className="text-[9px] text-slate-400 font-bold mt-1">Urea (46% N)</div>
                </div>

                <div className="p-2.5 bg-white rounded-xl text-center border border-slate-100 shadow-sm">
                  <div className="text-xs font-black text-slate-800">{fertPlan.potashBags}</div>
                  <div className="text-[9px] text-slate-400 font-bold mt-1">MOP Potash</div>
                </div>

                <div className="p-2.5 bg-white rounded-xl text-center border border-slate-100 shadow-sm">
                  <div className="text-xs font-black text-slate-800">{fertPlan.compostBags}</div>
                  <div className="text-[9px] text-slate-400 font-bold mt-1">Organic Humus</div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 mt-1 flex items-start gap-1.5 pt-2 border-t border-slate-100">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>Dosages are scaled for basic cereal crops. Double-check with the Crop Advisor panel for custom recommendations.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
