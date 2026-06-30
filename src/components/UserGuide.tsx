import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Camera, 
  Eye, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  Layers, 
  Info,
  Clock,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function UserGuide() {
  const [activeTab, setActiveTab] = useState<'upload' | 'science' | 'routine' | 'faq'>('upload');
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({
    0: true, // open first by default
  });

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const steps = [
    {
      title: "1. Capture or Upload a Facial Photo",
      desc: "Our model inspects key pixel matrices on your forehead, cheeks, nose, and chin to gauge hydration and red-blood flow anomalies.",
      icon: <Camera className="h-5 w-5 text-brand-500 dark:text-indigo-400" />
    },
    {
      title: "2. Real-Time Neural Mapping",
      desc: "SkinGPT runs modern computer vision to isolate local skin surface indicators—quantifying sebum blockages, barrier thickness, and moisture indexes.",
      icon: <Sparkles className="h-5 w-5 text-brand-500 dark:text-indigo-400" />
    },
    {
      title: "3. Formulate Bio-Adaptive Routine",
      desc: "Receive customized morning and night active formulas containing non-conflicting ingredients tailored strictly to your climate and concerns.",
      icon: <Layers className="h-5 w-5 text-brand-500 dark:text-indigo-400" />
    },
    {
      title: "4. Log Ingredients & Monitor Path",
      desc: "Add your personal cosmetic shelf to the virtual cabinet. Track weekly skin density fluctuations and heal irritation in real-time.",
      icon: <Calendar className="h-5 w-5 text-brand-500 dark:text-indigo-400" />
    }
  ];

  const dos = [
    "Position yourself in front of a natural, bright light source (such as facing a window in daytime).",
    "Ensure your camera lens is completely clean of smudges or oil.",
    "Face the camera directly at eye-level to maintain neutral focal distance.",
    "Tie your hair back so your forehead, temples, cheeks, and chin are completely unblocked.",
    "Remove glasses and heavy, reflective facial jewelry."
  ];

  const donts = [
    "Avoid backlighting (standing with a window or bright lamp behind you). This causes high shadow contrast.",
    "Do not apply heavy foundation, powder, or high-concealment cosmetics prior to the scan.",
    "Do not use third-party beauty, smoothing, or color-enhancing filters.",
    "Avoid holding your phone at steep upward or downward angles."
  ];

  const faqs = [
    {
      question: "Is SkinGPT a replacement for a certified dermatologist?",
      answer: "No, SkinGPT is an advanced AI-powered educational skin scanner and cosmetic chemistry synthesizer designed to guide cosmetic optimizations. It does not provide medical diagnoses, prescribe prescription actives (like Tretinoin or Hydroquinone), or treat clinical skin diseases. Always consult a board-certified dermatologist for medical skin concerns."
    },
    {
      question: "How does the AI skin analysis model calculate its scores?",
      answer: "Our engine uses multi-spectral visual mapping algorithms. It breaks down facial photos into key channels: Sebum Index (surface reflection intensity for oil control), Erythema Index (localized red-chromophore density for sensitivity and redness), Epidermal Texture (micro-shadow depth for smoothness and wrinkles), and Moisture Retention. The system pairs these scores with your local age, climate, and entered profile settings to calculate your overall skin health rating out of 100."
    },
    {
      question: "What does ingredient conflict or layering rules mean?",
      answer: "Skincare ingredients are active chemical molecules that require specific pH ranges and carrier environments to perform safely. When certain actives are layered directly on top of each other, they can either neutralize one another (rendering them useless) or cause severe chemical irritation. For instance, layering high-strength L-Ascorbic Acid (Vitamin C) with Retinol or Salicylic Acid (BHA) can destroy your protective moisture barrier. SkinGPT dynamically schedules these actives across separate morning and evening cycles to maximize results safely."
    },
    {
      question: "How frequently should I run an AI Skin Scan?",
      answer: "We recommend scanning your skin once a week. The outer stratum corneum takes approximately 28 to 40 days to undergo a full cellular turnover. Scanning daily can lead to false readings influenced by temporary elements like salt intake, sleep quality, or ambient humidity, whereas weekly scans capture authentic progressive trends in barrier thickness and epidermal clarity."
    },
    {
      question: "Can I use SkinGPT while pregnant or nursing?",
      answer: "Yes, but with strict ingredient vigilance. Many common active ingredients—specifically Retinoids (Retinol, Retinyl Palmitate, retinal, and prescription Adapalene/Tretinoin), Salicylic Acid (in concentrations above 2%), and Hydroquinone—must be avoided entirely during pregnancy due to systemic absorption risks. SkinGPT lists pregnancy safety ratings ('Safe', 'Avoid', or 'Consult Doctor') for every ingredient in our database and flags dangerous actives."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10" id="user-onboarding-guide-module">
      
      {/* Intro Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 bg-brand-500/10 text-brand-700 dark:text-indigo-300 rounded-full text-xs font-semibold uppercase tracking-wider">
          Onboarding & Support Center
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-brand-900 dark:text-white font-display">
          A Better Way to Understand Your Skin
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
          Welcome to the SkinGPT Skin Intelligence Hub. Learn how to take accurate diagnostic photos, explore the underlying chemical mapping AI, and discover how to heal and protect your skin barrier with daily consistency.
        </p>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-brand-200 dark:border-slate-800 justify-center gap-1 sm:gap-2">
        {[
          { id: 'upload', label: 'Selfie Guidelines', icon: <Camera className="h-4 w-4" /> },
          { id: 'science', label: 'How the AI Works', icon: <Sparkles className="h-4 w-4" /> },
          { id: 'routine', label: 'Routine Integration', icon: <Layers className="h-4 w-4" /> },
          { id: 'faq', label: 'FAQ & Safety', icon: <HelpCircle className="h-4 w-4" /> }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-brand-500 text-brand-950 dark:border-indigo-500 dark:text-white font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Context Switcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Tab Content (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-brand-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm space-y-8">
          
          {/* TAB 1: SELFIE GUIDELINES */}
          {activeTab === 'upload' && (
            <div className="space-y-6" id="onboarding-selfie-guidelines">
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display flex items-center gap-2">
                  <Camera className="h-5 w-5 text-brand-500 dark:text-indigo-400" />
                  Facial Scan Photographic Guidelines
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                  The precision of your confidence scores and overall analysis is directly influenced by photo quality. Follow these strict clinical principles to prevent false diagnostics.
                </p>
              </div>

              {/* Do & Dont Side-by-Side Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* DO'S CARD */}
                <div className="p-5 bg-emerald-50/10 dark:bg-emerald-950/5 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl space-y-3.5">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                    <span className="h-6 w-6 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-xs">✓</span>
                    <h4 className="font-bold text-sm">Preferred Setup (DO)</h4>
                  </div>
                  <ul className="space-y-2.5 text-xs text-gray-650 dark:text-gray-350">
                    {dos.map((item, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* DONT'S CARD */}
                <div className="p-5 bg-rose-50/10 dark:bg-rose-950/5 border border-rose-100 dark:border-rose-900/30 rounded-2xl space-y-3.5">
                  <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400">
                    <span className="h-6 w-6 bg-rose-100 dark:bg-rose-950/60 rounded-full flex items-center justify-center text-rose-700 dark:text-rose-300 font-bold text-xs">✕</span>
                    <h4 className="font-bold text-sm">Avoid These (DON'T)</h4>
                  </div>
                  <ul className="space-y-2.5 text-xs text-gray-650 dark:text-gray-350">
                    {donts.map((item, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start">
                        <X className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Interactive guidelines reminder box */}
              <div className="p-4 bg-amber-50/10 dark:bg-amber-950/5 border border-amber-100 dark:border-amber-900/40 rounded-xl flex gap-3 text-xs leading-relaxed text-amber-800 dark:text-amber-400">
                <Info className="h-5 w-5 shrink-0 mt-0.5" />
                <p>
                  <strong>Why it matters:</strong> Low resolution or dark settings force the AI to misinterpret natural pixel noise or dark camera noise as blackheads, sebum blockages, or high pigmentation, leading to lower clarity scores.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: HOW THE AI WORKS */}
          {activeTab === 'science' && (
            <div className="space-y-6" id="onboarding-ai-science">
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brand-500 dark:text-indigo-400" />
                  Our Skin Analysis Methodology
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                  Unlike basic filter apps, SkinGPT utilizes advanced computer vision techniques to calculate quantitative metrics.
                </p>
              </div>

              {/* The 4 pillars of scan scoring */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-4 bg-gray-50 dark:bg-slate-800/40 border border-gray-150 dark:border-slate-800 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white">Moisture & Barrier Index</span>
                    <span className="px-1.5 py-0.5 bg-brand-500/10 text-brand-600 dark:text-indigo-400 font-mono text-[9px] font-bold rounded">BARRIER</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Evaluates skin luster and texture alignment in highlighted face zones. Lower scores flag a depleted outer lipid layer and visible flaking or tightness.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-800/40 border border-gray-150 dark:border-slate-800 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white">Erythema Detection (Redness)</span>
                    <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-[9px] font-bold rounded">REDNESS</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Calculates surface hemoglobin saturation. Ideal for tracking hot cheeks, localized flushes, or skin barrier irritation.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-800/40 border border-gray-150 dark:border-slate-800 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white">Sebum Blockage / Pore Diameter</span>
                    <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[9px] font-bold rounded">OIL & PORES</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Analyzes pore circumference and specular sheen in the T-zone (forehead, nose, chin) to distinguish healthy moisture shine from high sebum rates.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-800/40 border border-gray-150 dark:border-slate-800 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white">Texture & Micro-Shadow Analysis</span>
                    <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[9px] font-bold rounded">TEXTURE</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Traces linear and geometric shadows along the nasolabial folds, under-eyes, and forehead to track early dehydration lines vs structural fine lines.
                  </p>
                </div>

              </div>

              {/* Progress visual list */}
              <div className="space-y-3.5">
                <h4 className="font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Analysis Progression Checklist</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {steps.map((step, idx) => (
                    <div key={idx} className="p-3.5 bg-brand-50/10 dark:bg-indigo-950/15 border border-brand-100 dark:border-indigo-900/30 rounded-xl space-y-2">
                      <div className="h-8 w-8 bg-white dark:bg-slate-800 rounded-full border border-brand-200/50 dark:border-slate-700 flex items-center justify-center">
                        {step.icon}
                      </div>
                      <p className="font-bold text-xs text-brand-950 dark:text-indigo-300">{step.title}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ROUTINE INTEGRATION */}
          {activeTab === 'routine' && (
            <div className="space-y-6" id="onboarding-routine-guide">
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display flex items-center gap-2">
                  <Layers className="h-5 w-5 text-brand-500 dark:text-indigo-400" />
                  Following Your Bio-Adaptive Routine
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                  A perfect routine is only half the battle. Consistently applying items in the correct order is vital to secure cellular delivery of active components.
                </p>
              </div>

              {/* Application Rules Rule of Thumb */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-brand-100 dark:border-slate-800 rounded-2xl text-xs space-y-2">
                  <div className="flex gap-2 items-center text-brand-900 dark:text-indigo-300 font-bold">
                    <Clock className="h-4 w-4" />
                    <span>Rule 1: Thin to Thick</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-[11px]">
                    Always layer products from thinnest viscosity to thickest. Apply water-based serums first, followed by dense oils, emulsions, and heavy creams.
                  </p>
                </div>

                <div className="p-4 border border-brand-100 dark:border-slate-800 rounded-2xl text-xs space-y-2">
                  <div className="flex gap-2 items-center text-brand-900 dark:text-indigo-300 font-bold">
                    <Info className="h-4 w-4" />
                    <span>Rule 2: pH Progression</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-[11px]">
                    Low-pH active exfoliants (AHA/BHAs) must be applied immediately after cleansing. Wait 2-3 minutes before layering neutral-pH serums like Niacinamide.
                  </p>
                </div>

                <div className="p-4 border border-brand-100 dark:border-slate-800 rounded-2xl text-xs space-y-2">
                  <div className="flex gap-2 items-center text-brand-900 dark:text-indigo-300 font-bold">
                    <Lock className="h-4 w-4" />
                    <span>Rule 3: Occlusive Lock</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-[11px]">
                    Always end your evening routine with an occlusive moisturizer or barrier balm. This prevents Trans-Epidermal Water Loss (TEWL) during sleep.
                  </p>
                </div>
              </div>

              {/* Morning vs Evening Cycle comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="p-5 border border-brand-100 dark:border-slate-800 rounded-2xl space-y-3 bg-brand-50/5 dark:bg-slate-850/50">
                  <span className="text-[9px] font-bold font-mono tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-350 px-2 py-0.5 rounded uppercase">MORNING: PROTECT</span>
                  <p className="text-xs font-bold text-gray-950 dark:text-white">Shield, Hydrate & Filter UV</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed">
                    The daytime priority is antioxidant defense and solar shielding. Focus on gentle cleansers, hydration enhancers (hyaluronic acid), Vit C antioxidants, and SPF 30-50+.
                  </p>
                </div>

                <div className="p-5 border border-brand-100 dark:border-slate-800 rounded-2xl space-y-3 bg-brand-50/5 dark:bg-slate-850/50">
                  <span className="text-[9px] font-bold font-mono tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-350 px-2 py-0.5 rounded uppercase">EVENING: REPAIR</span>
                  <p className="text-xs font-bold text-gray-950 dark:text-white">Renew, Exfoliate & Restore</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed">
                    Night is when skin cellular division spikes. Focus on double cleansing, barrier-healing Ceramides, cell renewal (Retinoids), and heavy moisture sealants.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FAQ & SAFETY */}
          {activeTab === 'faq' && (
            <div className="space-y-6" id="onboarding-faq-accordions">
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-brand-500 dark:text-indigo-400" />
                  Frequently Asked Questions & Advisory Safety
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                  Read these detailed breakdowns compiled by our cosmetic formulation models.
                </p>
              </div>

              {/* Accordions */}
              <div className="space-y-3">
                {faqs.map((faq, i) => {
                  const isOpen = !!faqOpen[i];
                  return (
                    <div key={i} className="border border-brand-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => toggleFaq(i)}
                        className="w-full px-5 py-4 bg-brand-50/5 dark:bg-slate-850/20 hover:bg-brand-50/10 dark:hover:bg-slate-850/50 transition-colors flex justify-between items-center text-left cursor-pointer"
                      >
                        <span className="text-xs font-bold text-gray-900 dark:text-white pr-4">{faq.question}</span>
                        {isOpen ? <ChevronUp className="h-4 w-4 text-gray-450 shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-450 shrink-0" />}
                      </button>
                      
                      {isOpen && (
                        <div className="px-5 py-4 bg-white dark:bg-slate-900 border-t border-brand-100 dark:border-slate-800 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Trust, Privacy, & Secure Handling Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-brand-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
            
            <div className="space-y-1">
              <h3 className="text-md font-bold text-gray-900 dark:text-white font-display flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                Data Privacy & Trust Guard
              </h3>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">Your health and biometric privacy are our paramount values.</p>
            </div>

            <div className="p-4 bg-emerald-50/10 dark:bg-emerald-950/10 border border-emerald-100/60 dark:border-emerald-900/40 rounded-xl space-y-3 text-xs leading-relaxed text-gray-650 dark:text-gray-400">
              <p className="font-bold text-emerald-900 dark:text-emerald-400">Privacy Manifesto:</p>
              
              <div className="space-y-3 text-[11px]">
                <div className="flex gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                  <p><strong>100% Client-Side Scan Processing:</strong> Facial photographs analyzed directly inside your secure browser instance or through direct API handshakes with zero long-term retention of raw frames on public fileservers.</p>
                </div>
                
                <div className="flex gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                  <p><strong>No Identity Selling:</strong> We do not sell, trade, or distribute your diagnostic skin profiles to cosmetic marketing corporations or insurance agencies.</p>
                </div>

                <div className="flex gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                  <p><strong>HIPAA-Compliant Layout:</strong> Structured state and local storage models built following key elements of the Health Insurance Portability and Accountability Act guidelines.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 rounded-xl text-[10px] text-gray-450 dark:text-gray-500 leading-relaxed flex items-start gap-2">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                All data, including recommended routine lists and virtual cabinet products, are stored locally on your device's sandbox. Clearing browser history or local site files will wipe active configurations. Save your API key or take screenshots of customized regimes!
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
