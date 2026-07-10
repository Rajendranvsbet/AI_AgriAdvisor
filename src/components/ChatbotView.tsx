import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { 
  BrainCircuit, 
  Send, 
  Mic, 
  HelpCircle, 
  Sprout, 
  CheckCircle,
  RefreshCw,
  Globe,
  Smile,
  Volume2
} from "lucide-react";
import { ChatMessage, User } from "../types";

interface ChatbotViewProps {
  user: User;
}

export default function ChatbotView({ user }: ChatbotViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("English");
  const [loading, setLoading] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggested starting prompts
  const SUGGESTIONS = [
    "What is the optimal fertilizer plan for Basmati Paddy?",
    "How do I prevent Rice Blast disease organically?",
    "Tell me about PM-KISAN landholding eligibility.",
    "Recommend crops for low rainfall (loamy soil)."
  ];

  useEffect(() => {
    // Load initial chat history on mount
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/chatbot/history/${user?.id || "anonymous"}`);
        if (response.ok) {
          const history = await response.json();
          if (history.length > 0) {
            setMessages(history);
          } else {
            // Initial welcoming message
            setMessages([
              {
                role: "model",
                text: `Hello ${user?.name || "Farmer"}! I am your personal AI Agriculture Advisor. I can assist you with dynamic crop suggestions, leaf disease identification, weather disruptions, and market commodity prices.
Feel free to ask a question below or choose one of our quick suggested topics!`,
                timestamp: new Date().toISOString()
              }
            ]);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, [user]);

  useEffect(() => {
    // Auto scroll chat to bottom
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: "user",
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || "anonymous",
          message: textToSend,
          lang
        })
      });

      if (response.ok) {
        const chatHistory = await response.json();
        setMessages(chatHistory);
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: "model",
            text: "My communication relays are temporarily congested. Please re-trigger your query in a few moments.",
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: "model",
          text: "I experienced a network disruption. Please check your system link.",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Simulate Voice input dictation for visual satisfaction
  const triggerVoiceSimulation = () => {
    if (micActive) {
      setMicActive(false);
      return;
    }
    setMicActive(true);
    setTimeout(() => {
      setInput("What organic nitrogen booster works best for high humidity clay soil?");
      setMicActive(false);
    }, 2800);
  };

  return (
    <div className="space-y-6 font-sans pb-12 flex flex-col h-[calc(100vh-160px)]">
      
      {/* Title / Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-7 h-7 text-teal-600" />
            AI Agri Chatbot Advisor
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Discuss crop health, chemical ratios, weather changes, and market trends directly with Generative AI.
          </p>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-slate-100 shadow-sm shrink-0">
          <Globe className="w-4 h-4 text-slate-400" />
          <select 
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="text-xs font-extrabold text-slate-700 bg-transparent border-0 outline-none cursor-pointer"
          >
            <option value="English">English Mode</option>
            <option value="Tamil">Tamil / தமிழ்</option>
            <option value="Hindi">Hindi / हिंदी</option>
            <option value="Telugu">Telugu / తెలుగు</option>
          </select>
        </div>
      </div>

      {/* Main chat terminal layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 items-stretch">
        
        {/* Left Side: Chat screen */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
          
          {/* Chat bubbles container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
            {messages.map((m, idx) => {
              const isUser = m.role === "user";
              return (
                <div 
                  key={idx} 
                  className={`flex items-start gap-3.5 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  <div className={`p-2.5 rounded-2xl shrink-0 ${isUser ? "bg-slate-100 text-slate-800" : "bg-teal-50 text-teal-700"}`}>
                    <Sprout className="w-4 h-4" />
                  </div>
                  
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed font-medium shadow-sm border ${
                    isUser 
                      ? "bg-slate-900 text-white border-slate-900 rounded-tr-none" 
                      : "bg-slate-50 text-slate-800 border-slate-100 rounded-tl-none"
                  }`}>
                    {/* Preserve line breaks */}
                    <div className="whitespace-pre-line">{m.text}</div>
                  </div>
                </div>
              );
            })}

            {/* Chatbot loading state */}
            {loading && (
              <div className="flex items-start gap-3.5 max-w-[85%] mr-auto">
                <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-700 shrink-0">
                  <Sprout className="w-4 h-4 animate-bounce" />
                </div>
                <div className="p-4 rounded-2xl rounded-tl-none bg-slate-50 border border-slate-100 text-xs text-slate-400 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
                  Gemini formulating advice...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Voice active indicator banner */}
          {micActive && (
            <div className="bg-teal-50 border-y border-teal-100/50 p-2.5 text-center flex items-center justify-center gap-3 animate-pulse">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
              <span className="text-[10px] font-extrabold text-teal-800 uppercase tracking-widest flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-teal-600 animate-bounce" /> Dictation Sensor Listening...
              </span>
            </div>
          )}

          {/* Form input console */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
            
            <button
              type="button"
              onClick={triggerVoiceSimulation}
              className={`p-3 rounded-xl border transition-all shrink-0 ${
                micActive 
                  ? "bg-red-50 border-red-200 text-red-600 animate-pulse" 
                  : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
              title="Dictate message"
            >
              <Mic className="w-5 h-5" />
            </button>

            <input 
              type="text"
              placeholder={micActive ? "Processing voice input..." : "Describe soil issues, pest concerns, or water queries..."}
              value={input}
              disabled={loading || micActive}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none"
            />

            <button
              type="button"
              disabled={loading || !input.trim() || micActive}
              onClick={() => handleSendMessage(input)}
              className="p-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-xl transition-all shadow-md shadow-teal-100 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Right Side: Quick topics */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Suggested Topics</h3>
            <p className="text-xs text-slate-400 mt-0.5">Quick starting queries</p>
          </div>

          <div className="flex-1 space-y-2.5">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(s)}
                disabled={loading}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-teal-50/50 border border-slate-100 hover:border-teal-100 text-left text-[11px] font-bold text-slate-600 hover:text-teal-800 transition-all leading-relaxed flex gap-2.5 items-start"
              >
                <HelpCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                {s}
              </button>
            ))}
          </div>

          <div className="p-4 bg-teal-50/30 border border-teal-100/50 rounded-2xl">
            <h4 className="text-[11px] font-extrabold text-teal-900 uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-teal-600" /> Active Translations
            </h4>
            <p className="text-[10px] text-teal-800 leading-relaxed font-medium mt-1">
              Selecting Tamil, Hindi, or Telugu modes translates both instructions and Gemini AI results to eliminate literacy barriers.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
