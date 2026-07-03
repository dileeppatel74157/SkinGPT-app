import React, { useState, useEffect } from 'react';
import { User, Mail, Key, Eye, EyeOff, Check, Save, Globe, CloudSun, Sliders, ShieldCheck } from 'lucide-react';
import { UserProfile, SkinScan } from '../types';

interface UserProfileSettingsProps {
  latestReport: SkinScan | null;
  onProfileChanged: (profile: UserProfile) => void;
  currentProfile: UserProfile;
}

export default function UserProfileSettings({ latestReport, onProfileChanged, currentProfile }: UserProfileSettingsProps) {
  const [name, setName] = useState(currentProfile.name);
  const [email, setEmail] = useState(currentProfile.email);
  const [age, setAge] = useState(currentProfile.age);
  const [location, setLocation] = useState(currentProfile.location);
  const [climate, setClimate] = useState<UserProfile['climate']>(currentProfile.climate);
  const [skinType, setSkinType] = useState<UserProfile['skinType']>(currentProfile.skinType);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(currentProfile.concerns);
  
  const [openuvApiKey, setOpenuvApiKey] = useState(currentProfile.openuvApiKey);

  const [showOpenuvKey, setShowOpenuvKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  // Synchronize with scan report if profile skin attributes are empty
  useEffect(() => {
    if (latestReport && latestReport.isValid) {
      if (!currentProfile.skinType || currentProfile.skinType === 'Normal') {
        setSkinType(latestReport.skinType);
      }
      if (currentProfile.concerns.length === 0) {
        setSelectedConcerns(latestReport.concerns || []);
      }
    }
  }, [latestReport]);

  const toggleConcern = (concern: string) => {
    if (selectedConcerns.includes(concern)) {
      setSelectedConcerns(selectedConcerns.filter(c => c !== concern));
    } else {
      setSelectedConcerns([...selectedConcerns, concern]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: UserProfile = {
      name,
      email,
      age: Number(age),
      location,
      climate,
      skinType,
      concerns: selectedConcerns,
      openuvApiKey: openuvApiKey.trim()
    };
    onProfileChanged(updatedProfile);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };



  const allConcernsList = [
    "Acne",
    "Pores",
    "Oiliness",
    "Dryness",
    "Redness",
    "Wrinkles",
    "Texture",
    "Pigmentation",
    "Dark Circles",
    "Eczema",
    "Dehydration"
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in" id="user-profile-settings-module">
      
      {/* Module Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-850 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            User Profile & Credentials
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed max-w-xl">
            Configure your personal profile details, clinical skin conditions, and provide your private API keys for advanced integrations.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {saveStatus === 'saved' && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <Check className="h-3.5 w-3.5" />
              Settings saved successfully!
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Personal and Skin Details (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: User Identity Details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <User className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
              Personal Profile Info
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Your Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Elena Rostova"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="elena@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Age (Years)</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  required
                  placeholder="28"
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location / City</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <Globe className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="San Francisco, CA"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Local Climate</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <CloudSun className="h-4 w-4" />
                  </span>
                  <select
                    value={climate}
                    onChange={e => setClimate(e.target.value as UserProfile['climate'])}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 text-sm appearance-none"
                  >
                    <option value="Temperate">Temperate</option>
                    <option value="Dry/Cold">Dry & Cold</option>
                    <option value="Warm/Humid">Warm & Humid</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Personal Skin Characteristics */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sliders className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
              Skin Characteristics & Profile
            </h3>

            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Skin Type</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'].map((type) => {
                  const isActive = skinType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSkinType(type as UserProfile['skinType'])}
                      className={`py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Active Dermatological Concerns</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allConcernsList.map((concern) => {
                  const isChecked = selectedConcerns.includes(concern);
                  return (
                    <button
                      key={concern}
                      type="button"
                      onClick={() => toggleConcern(concern)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                        isChecked
                          ? 'border-indigo-500 dark:border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/15 text-indigo-900 dark:text-indigo-200 font-medium'
                          : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-850 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                        isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}>
                        {isChecked && "✓"}
                      </span>
                      {concern}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action button in form (for Mobile & Desktop convenience) */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="h-4.5 w-4.5" />
              Save Profile & API Settings
            </button>
          </div>

        </div>

        {/* Right Column - API Key Configuration Details (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm space-y-6 sticky top-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Key className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
              Custom API Configurations
            </h3>

            <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
              We provide fully operational, pre-configured server-side integrations out-of-the-box. However, you can secure your own custom access credentials below.
            </p>



            {/* OpenUV API Key Block */}
            <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800 dark:text-gray-200 uppercase tracking-wider block">OpenUV API Key (UV Index)</span>
                {openuvApiKey.trim() ? (
                  <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded text-[9px] font-bold">CONFIGURED</span>
                ) : (
                  <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800/80 text-slate-500 dark:text-gray-400 rounded text-[9px] font-medium border border-slate-300 dark:border-slate-750">OPTIONAL</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed">
                Provide an API key from <a href="https://www.openuv.io/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline font-medium">openuv.io</a> to calculate hyper-local, real-time UV Index readings directly on your dashboard based on location parameters.
              </p>
              
              <div className="relative">
                <input
                  type={showOpenuvKey ? "text" : "password"}
                  placeholder="Enter OpenUV token..."
                  value={openuvApiKey}
                  onChange={e => setOpenuvApiKey(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowOpenuvKey(!showOpenuvKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showOpenuvKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Client Privacy Note */}
            <div className="p-4 bg-indigo-50/20 dark:bg-indigo-950/15 border border-indigo-100/50 dark:border-indigo-900/40 rounded-xl flex items-start gap-2 text-[11px] text-indigo-950 dark:text-indigo-300 leading-relaxed">
              <ShieldCheck className="h-4 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-indigo-900 dark:text-indigo-200">Security Guarantee</p>
                <p className="mt-0.5 text-indigo-700 dark:text-indigo-400">All custom API keys are loaded securely inside your private cloud profile (Firestore) and never shared or stored on unencrypted public channels.</p>
              </div>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
}
