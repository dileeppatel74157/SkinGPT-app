import React, { useState } from 'react';
import { Sparkles, Calendar, CheckCircle, Clock, Smile, ShieldAlert, BookOpen, Plus, Heart, ChevronRight, HelpCircle, Flame, Droplets, FileText } from 'lucide-react';
import { SkinScan, UserProfile } from '../types';
import { exportReportToPDF } from '../utils/pdfGenerator';

interface DashboardProps {
  latestReport: SkinScan | null;
  onNavigate: (tab: string) => void;
  userProfile?: UserProfile;
}

export default function Dashboard({ latestReport, onNavigate, userProfile }: DashboardProps) {
  const [completedMorningSteps, setCompletedMorningSteps] = useState<{ [key: number]: boolean }>({});
  const [completedEveningSteps, setCompletedEveningSteps] = useState<{ [key: number]: boolean }>({});

  const toggleMorningStep = (stepNum: number) => {
    setCompletedMorningSteps(prev => ({ ...prev, [stepNum]: !prev[stepNum] }));
  };

  const toggleEveningStep = (stepNum: number) => {
    setCompletedEveningSteps(prev => ({ ...prev, [stepNum]: !prev[stepNum] }));
  };

  if (!latestReport) {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-8 py-10" id="empty-dashboard-container">
        {/* Empty state */}
        <div className="p-12 bg-white dark:bg-slate-900 rounded-3xl border border-brand-200 dark:border-slate-800 shadow-sm space-y-6 max-w-2xl mx-auto">
          <div className="mx-auto h-20 w-20 rounded-full bg-brand-50 dark:bg-slate-800 flex items-center justify-center text-brand-500 animate-pulse-subtle">
            <Sparkles className="h-10 w-10 text-brand-500 dark:text-indigo-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-brand-900 dark:text-white font-display">Begin Your Skincare Journey</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
              Scan your face with our smart clinical-grade vision AI to analyze hydration, barrier wellness, pores, and receive a customized routine and active compatibilities.
            </p>
          </div>
          <button
            onClick={() => onNavigate('scan')}
            className="px-8 py-3.5 bg-brand-500 hover:bg-brand-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md cursor-pointer"
            id="start-first-scan-btn"
          >
            Start First AI Skin Scan
          </button>
        </div>

        {/* Informative quickcards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          <div className="p-6 bg-white dark:bg-slate-900 border border-brand-100 dark:border-slate-800 rounded-2xl space-y-3">
            <div className="p-3 bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-indigo-400 rounded-xl w-fit">
              <Calendar className="h-6 w-6" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Track Skin Changes</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Log periodic skin scans and see high-contrast timelines charting hydration, barrier healing, and sebum improvements.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-brand-100 dark:border-slate-800 rounded-2xl space-y-3">
            <div className="p-3 bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-indigo-400 rounded-xl w-fit">
              <Plus className="h-6 w-6" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Virtual Skincare Cabinet</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Add your current products, scan their active ingredients, and instantly check for duplicate actives or hazardous conflicts.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-brand-100 dark:border-slate-800 rounded-2xl space-y-3">
            <div className="p-3 bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-indigo-400 rounded-xl w-fit">
              <BookOpen className="h-6 w-6" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Cosmetics Encyclopedia</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Browse pregnancy-safety indicators, pH ranges, usage frequencies, and layering rules for 15+ advanced cosmetics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate routine completion percentage
  const mSteps = latestReport.routine?.morning || [];
  const eSteps = latestReport.routine?.evening || [];
  
  const totalMCompleted = mSteps.filter(s => completedMorningSteps[s.step]).length;
  const totalECompleted = eSteps.filter(s => completedEveningSteps[s.step]).length;
  
  const mPercent = mSteps.length ? Math.round((totalMCompleted / mSteps.length) * 100) : 0;
  const ePercent = eSteps.length ? Math.round((totalECompleted / eSteps.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8" id="dashboard-main-view">
      {/* Top Welcome & PDF Download */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-brand-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Scan Diagnostics</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">View real-time computer-vision telemetry and your customized routine.</p>
        </div>
        <button
          onClick={() => exportReportToPDF(latestReport, userProfile)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer border border-indigo-500/10 active:scale-95"
          id="dashboard-export-pdf-btn"
          title="Download printable medical-grade PDF report"
        >
          <FileText className="h-4 w-4" />
          Export Clinical PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Welcome & Primary Skin Profile */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 dark:from-slate-900 dark:to-slate-950 text-white rounded-3xl p-8 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[260px] border border-slate-800">
          {/* Subtle background glow */}
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-brand-400/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-brand-800/60 dark:bg-indigo-950/40 rounded-full text-brand-300 dark:text-indigo-300 text-xs w-fit border border-brand-700/30 dark:border-indigo-900/40 font-mono">
              <Sparkles className="h-3 w-3 animate-pulse-subtle" />
              LATEST DERM ANALYSIS: {latestReport.date}
            </div>
            <h2 className="text-3xl font-medium tracking-tight font-display text-white">
              Your Skin is diagnosed as <span className="text-indigo-400 font-semibold">{latestReport.skinType}</span>
            </h2>
            <p className="text-brand-100/80 text-sm leading-relaxed max-w-xl">
              Focus on {latestReport.concerns?.[0] || 'moisture barrier support'} and {latestReport.concerns?.[1] || 'gentle cleansing'}. You have {latestReport.concerns?.length || 0} active skin concerns under monitor.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 mt-6">
            {latestReport.concerns?.map((concern, idx) => (
              <span key={idx} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-medium border border-white/5 text-slate-200">
                {concern}
              </span>
            ))}
          </div>
        </div>

        {/* Big Overall Score Gauge */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-brand-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center text-center shadow-sm">
          <p className="text-xs font-mono text-brand-600 dark:text-indigo-400 uppercase tracking-widest mb-4">Overall Wellness Score</p>
          <div className="relative h-36 w-36 flex items-center justify-center">
            {/* SVG Circle Gauge */}
            <svg className="absolute transform -rotate-90 w-full h-full">
              <circle
                cx="72"
                cy="72"
                r="64"
                className="stroke-brand-100 dark:stroke-slate-800 fill-none"
                strokeWidth="10"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                className="stroke-indigo-500 fill-none transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 64}
                strokeDashoffset={2 * Math.PI * 64 * (1 - latestReport.score.overall / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center space-y-0.5">
              <span className="text-4xl font-extrabold text-brand-950 dark:text-white font-mono">{latestReport.score.overall}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 block">/ 100</span>
            </div>
          </div>
          <p className="text-xs font-medium text-brand-600 dark:text-indigo-400 mt-5 flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            Healthy skin threshold achieved
          </p>
        </div>
      </div>

      {/* Visual Component Gauges */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Hydration', score: latestReport.score.hydration, color: 'bg-cyan-500' },
          { label: 'Oil Control', score: latestReport.score.oilControl, color: 'bg-amber-500' },
          { label: 'Barrier Health', score: latestReport.score.barrier, color: 'bg-emerald-500' },
          { label: 'Clarity', score: latestReport.score.clarity, color: 'bg-indigo-500' },
          { label: 'Texture Smoothness', score: latestReport.score.texture, color: 'bg-purple-500' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl border border-brand-200/80 dark:border-slate-800 p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 dark:text-gray-400 font-medium truncate">{item.label}</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">{item.score}%</span>
            </div>
            {/* Meter Bar */}
            <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.score}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Qualitative Diagnostic Notes */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-brand-200 dark:border-slate-800 p-8 shadow-sm">
        <h3 className="text-2xl font-semibold text-brand-950 dark:text-white mb-6 font-display flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
          Skin Analysis Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Redness & Erythema", text: latestReport.analysis.redness, icon: <Smile className="h-5 w-5 text-rose-500" /> },
            { title: "Pore Volume & Sebum", text: latestReport.analysis.pores, icon: <Plus className="h-5 w-5 text-amber-500" /> },
            { title: "Collagen & Elasticity", text: latestReport.analysis.wrinkles, icon: <Clock className="h-5 w-5 text-indigo-500" /> },
            { title: "Oiliness / T-Zone Activity", text: latestReport.analysis.oiliness, icon: <Flame className="h-5 w-5 text-orange-500" /> },
            { title: "Dryness / Flakiness", text: latestReport.analysis.dryness, icon: <Droplets className="h-5 w-5 text-cyan-500" /> },
            { title: "Active Impurities & Acne", text: latestReport.analysis.acne, icon: <Plus className="h-5 w-5 text-red-500" /> },
          ].map((note, index) => (
            <div key={index} className="p-5 rounded-2xl border border-brand-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-brand-50 dark:bg-slate-800/60 rounded-lg">
                  {note.icon}
                </div>
                <h4 className="font-semibold text-brand-900 dark:text-white text-sm">{note.title}</h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{note.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Skincare Checklist Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Morning Tracker */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-brand-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-400"></span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display">Morning Active Routine</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Protect, hydrate, and prepare for daily stressors.</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
              {mPercent}% Complete
            </span>
          </div>

          <div className="space-y-3">
            {mSteps.map((step, idx) => (
              <label
                key={idx}
                className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                  completedMorningSteps[step.step]
                    ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/10 dark:bg-emerald-950/20 opacity-75'
                    : 'border-brand-100 dark:border-slate-800 bg-brand-50/5 dark:bg-slate-800/20 hover:bg-brand-50/10 dark:hover:bg-slate-800/40'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!completedMorningSteps[step.step]}
                  onChange={() => toggleMorningStep(step.step)}
                  className="h-5 w-5 rounded border-gray-300 dark:border-slate-700 text-brand-600 dark:text-indigo-400 focus:ring-brand-500 shrink-0 mt-0.5"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-gray-400 dark:text-gray-500">STEP {step.step}</span>
                    <span className="px-2 py-0.5 bg-brand-100 dark:bg-indigo-950/40 text-brand-700 dark:text-indigo-300 rounded-md text-[10px] font-semibold uppercase tracking-wider">{step.category}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{step.name}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{step.instructions}</p>
                  <div className="flex gap-1.5 flex-wrap pt-1">
                    {step.activeIngredients.map((act, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 rounded text-[10px]">
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Evening Tracker */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-brand-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-indigo-600 animate-pulse-subtle"></span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display">Evening Repair Routine</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Deep cleanse, treat anomalies, and nourish the barrier.</p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
              {ePercent}% Complete
            </span>
          </div>

          <div className="space-y-3">
            {eSteps.map((step, idx) => (
              <label
                key={idx}
                className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                  completedEveningSteps[step.step]
                    ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/10 dark:bg-emerald-950/20 opacity-75'
                    : 'border-brand-100 dark:border-slate-800 bg-brand-50/5 dark:bg-slate-800/20 hover:bg-brand-50/10 dark:hover:bg-slate-800/40'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!completedEveningSteps[step.step]}
                  onChange={() => toggleEveningStep(step.step)}
                  className="h-5 w-5 rounded border-gray-300 dark:border-slate-700 text-brand-600 dark:text-indigo-400 focus:ring-brand-500 shrink-0 mt-0.5"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-gray-400 dark:text-gray-500">STEP {step.step}</span>
                    <span className="px-2 py-0.5 bg-brand-100 dark:bg-indigo-950/40 text-brand-700 dark:text-indigo-300 rounded-md text-[10px] font-semibold uppercase tracking-wider">{step.category}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{step.name}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{step.instructions}</p>
                  <div className="flex gap-1.5 flex-wrap pt-1">
                    {step.activeIngredients.map((act, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 rounded text-[10px]">
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Target Product Recommendations */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-brand-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold text-brand-950 dark:text-white font-display">Target Product Recommendations</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Formulated precisely to complement your active skin type.</p>
          </div>
          <button
            onClick={() => onNavigate('cabinet')}
            className="px-4 py-2 text-xs font-medium text-brand-700 hover:text-brand-900 dark:text-indigo-400 dark:hover:text-indigo-300 bg-brand-50 dark:bg-slate-800/80 hover:bg-brand-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 w-fit cursor-pointer"
          >
            Check Cabinet Compatibility
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestReport.recommendations?.map((prod, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-brand-100 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:shadow-sm transition-shadow bg-brand-50/5 dark:bg-slate-800/20">
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="text-[10px] font-mono font-semibold text-brand-600 dark:text-indigo-400 uppercase tracking-widest">{prod.brand}</p>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base">{prod.name}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    prod.tier === 'Budget' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40' :
                    prod.tier === 'Mid-range' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40' :
                    'bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-300 border border-purple-100 dark:border-purple-900/40'
                  }`}>
                    {prod.tier}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{prod.reason}</p>
                
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {prod.activeIngredients.map((act, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-brand-200/50 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-[10px] font-medium">
                      {act}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-brand-100/60 dark:border-slate-800/60 flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-400 dark:text-gray-500 block text-[10px]">EFFICACY MATCH</span>
                  <span className="font-mono font-bold text-brand-700 dark:text-indigo-400">{prod.confidenceScore}% Confidence</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 dark:text-gray-500 block text-[10px]">EST. TIMELINE</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{prod.expectedTimeline}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
