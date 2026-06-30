import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Layers, BookOpen, MessageSquare, TrendingUp, Bell, Heart, Menu, X, Check, HelpCircle, User, Sun, Moon, Folder } from 'lucide-react';
import { SkinScan, CabinetItem, ChatMessage, UserProfile } from './types';
import Dashboard from './components/Dashboard';
import SkinScanner from './components/SkinScanner';
import Cabinet from './components/Cabinet';
import IngredientDb from './components/IngredientDb';
import AiConsultant from './components/AiConsultant';
import History from './components/History';
import UserProfileSettings from './components/UserProfileSettings';
import UserGuide from './components/UserGuide';
import Testimonials from './components/Testimonials';
import GoogleDrive from './components/GoogleDrive';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [importedImage, setImportedImage] = useState<string | null>(null);
  const [latestReport, setLatestReport] = useState<SkinScan | null>(null);
  const [cabinetItems, setCabinetItems] = useState<CabinetItem[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [historyScans, setHistoryScans] = useState<SkinScan[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([
    "☀ Morning routine reminder: Lock in moisture and apply SPF 60.",
    "✓ New Skin Analysis Report generated successfully."
  ]);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('skingpt_dark_mode');
      if (stored) return JSON.parse(stored);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('skingpt_dark_mode', JSON.stringify(darkMode));
    } catch (e) {
      console.error(e);
    }
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('skingpt_user_profile') || localStorage.getItem('aura_user_profile');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing profile from localStorage:", e);
    }
    return {
      name: 'Dileep Patel',
      email: 'dileeppatel74157@gmail.com',
      age: 26,
      location: 'San Francisco, CA',
      climate: 'Temperate',
      skinType: 'Normal',
      concerns: [],
      geminiApiKey: '',
      openuvApiKey: ''
    };
  });

  const handleProfileChanged = (updated: UserProfile) => {
    setUserProfile(updated);
    localStorage.setItem('skingpt_user_profile', JSON.stringify(updated));
  };

  // Load from localStorage on startup
  useEffect(() => {
    try {
      const storedReport = localStorage.getItem('skingpt_latest_report') || localStorage.getItem('aura_latest_report');
      if (storedReport) {
        const parsed = JSON.parse(storedReport);
        setLatestReport(parsed);
        setHistoryScans([parsed]);
      }

      const storedCabinet = localStorage.getItem('skingpt_cabinet_items') || localStorage.getItem('aura_cabinet_items');
      if (storedCabinet) {
        setCabinetItems(JSON.parse(storedCabinet));
      }
    } catch (e) {
      console.error("Error reading localStorage:", e);
    }

    // Initialize Chat with friendly greeting
    setChatMessages([
      {
        id: 'initial',
        role: 'model',
        text: "Hello! I am SkinGPT, your private AI Skincare Coach and Cosmetic Chemist. If you have completed a facial analysis scan, I am already updated on your primary skin type, scores, and active concerns. Ask me any question about ingredient pairings, formulation pH ranges, or how to lay out your custom morning and evening routine!",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  // Save latest report to localStorage
  const handleScanCompleted = (report: SkinScan) => {
    setLatestReport(report);
    setHistoryScans(prev => [report, ...prev]);
    localStorage.setItem('skingpt_latest_report', JSON.stringify(report));
    
    // Add custom notification
    setNotifications(prev => [
      `✓ New Skin Scan Complete: Score is ${report.score.overall}/100 (${report.skinType})`,
      ...prev
    ]);
    
    // Navigate to dashboard automatically to reveal results
    setCurrentTab('dashboard');
  };

  // Save cabinet to localStorage
  const handleCabinetChanged = (updatedItems: CabinetItem[]) => {
    setCabinetItems(updatedItems);
    localStorage.setItem('skingpt_cabinet_items', JSON.stringify(updatedItems));
  };

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-brand-50/20 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-200" id="applet-core-shell">
      {/* Top Premium Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-brand-200/80 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo brand */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-brand-500 rounded-full flex items-center justify-center text-white shadow-sm">
              <Sparkles className="h-5 w-5 text-brand-100 animate-pulse-subtle" />
            </div>
            <div>
              <span className="text-xl font-bold font-display tracking-tight text-brand-950 dark:text-white block">SKINGPT</span>
              <span className="text-[9px] font-mono font-semibold tracking-wider text-brand-600 dark:text-indigo-400 block -mt-1 uppercase">Skin Analysis Lab</span>
            </div>
          </div>

          {/* Desktop Tab Links */}
          <nav className="hidden lg:flex lg:flex-wrap items-center gap-1.5 text-xs font-semibold">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <Layers className="h-4 w-4" /> },
              { id: 'scan', label: 'AI Skin Scan', icon: <Sparkles className="h-4 w-4" /> },
              { id: 'cabinet', label: 'Virtual Cabinet', icon: <Layers className="h-4 w-4" /> },
              { id: 'ingredients', label: 'Ingredient Wiki', icon: <BookOpen className="h-4 w-4" /> },
              { id: 'consultant', label: 'AI Coach SkinGPT', icon: <MessageSquare className="h-4 w-4" /> },
              { id: 'history', label: 'Timeline & History', icon: <TrendingUp className="h-4 w-4" /> },
              { id: 'drive', label: 'Google Drive', icon: <Folder className="h-4 w-4" /> },
              { id: 'guide', label: 'User Guide', icon: <HelpCircle className="h-4 w-4" /> },
              { id: 'testimonials', label: 'Testimonials', icon: <Heart className="h-4 w-4" /> },
              { id: 'profile', label: 'Profile & Keys', icon: <User className="h-4 w-4" /> }
            ].map(tab => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavigate(tab.id)}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-brand-950 text-white shadow-sm dark:bg-indigo-600'
                      : 'text-gray-500 dark:text-gray-400 hover:text-brand-950 dark:hover:text-white hover:bg-brand-50/30 dark:hover:bg-slate-800'
                  }`}
                  id={`nav-tab-${tab.id}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls (Notifications, Dark Mode, User info) */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 text-gray-500 hover:text-brand-950 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              title={darkMode ? "Switch to Light Mode" : "Switch to Night Mode"}
              id="dark-mode-toggle-btn"
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-500" />}
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationPopup(!showNotificationPopup)}
                className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-brand-950 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800 rounded-full transition-colors relative cursor-pointer"
                id="notification-bell-btn"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-brand-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                )}
              </button>

              {/* Simulated Notifications Panel */}
              {showNotificationPopup && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-brand-200 dark:border-slate-800 shadow-xl p-4 space-y-3 z-50">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">Skincare Notifications</span>
                    <button
                      onClick={() => setNotifications([])}
                      className="text-[10px] text-brand-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">No active skin schedules or alerts.</p>
                    ) : (
                      notifications.map((notif, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-brand-50/10 dark:bg-slate-800/20 border border-brand-100/50 dark:border-slate-800/50 text-[10px] text-gray-600 dark:text-gray-300 leading-relaxed flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <p>{notif}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <button
              onClick={() => handleNavigate('profile')}
              className="flex items-center gap-2 pl-3 border-l border-brand-200/60 dark:border-slate-800 text-left hover:opacity-85 cursor-pointer focus:outline-none"
              id="header-user-profile-trigger"
            >
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-950/40 border border-indigo-300 dark:border-indigo-800 flex items-center justify-center text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase">
                {userProfile.name ? userProfile.name.charAt(0) : 'U'}
              </div>
              <div className="hidden sm:block">
                <span className="text-xs font-bold text-brand-950 dark:text-gray-200 block leading-tight truncate max-w-[110px]">
                  {userProfile.name || 'Guest User'}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 block leading-none">
                  {userProfile.geminiApiKey ? 'Custom API Key' : 'Built-in API'}
                </span>
              </div>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-gray-500 dark:text-gray-400 hover:text-brand-950 dark:hover:text-white rounded-full cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm pt-20">
          <div className="bg-white dark:bg-slate-900 rounded-b-3xl p-6 border-b border-brand-200 dark:border-slate-800 shadow-xl space-y-4">
            <p className="text-xs font-mono font-bold text-brand-500 dark:text-indigo-400 uppercase tracking-widest">Main Modules</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: <Layers className="h-4 w-4" /> },
                { id: 'scan', label: 'AI Skin Scan', icon: <Sparkles className="h-4 w-4" /> },
                { id: 'cabinet', label: 'Virtual Cabinet', icon: <Layers className="h-4 w-4" /> },
                { id: 'ingredients', label: 'Ingredient Wiki', icon: <BookOpen className="h-4 w-4" /> },
                { id: 'consultant', label: 'AI Coach SkinGPT', icon: <MessageSquare className="h-4 w-4" /> },
                { id: 'history', label: 'Timeline & History', icon: <TrendingUp className="h-4 w-4" /> },
                { id: 'drive', label: 'Google Drive', icon: <Folder className="h-4 w-4" /> },
                { id: 'guide', label: 'User Guide', icon: <HelpCircle className="h-4 w-4" /> },
                { id: 'testimonials', label: 'Testimonials', icon: <Heart className="h-4 w-4" /> },
                { id: 'profile', label: 'Profile & Keys', icon: <User className="h-4 w-4" /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleNavigate(tab.id)}
                  className={`p-4 rounded-xl text-xs font-bold flex flex-col gap-2 items-start border transition-colors cursor-pointer ${
                    currentTab === tab.id
                      ? 'bg-brand-950 text-white border-brand-950 dark:bg-indigo-600 dark:border-indigo-600'
                      : 'bg-brand-50/10 dark:bg-slate-800/20 border-brand-100 dark:border-slate-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Workspace with smooth transition spacing */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        
        {currentTab === 'dashboard' && (
          <Dashboard
            latestReport={latestReport}
            onNavigate={handleNavigate}
            userProfile={userProfile}
          />
        )}

        {currentTab === 'scan' && (
          <SkinScanner
            onScanCompleted={handleScanCompleted}
            geminiApiKey={userProfile.geminiApiKey}
            importedImage={importedImage}
            onClearImportedImage={() => setImportedImage(null)}
          />
        )}

        {currentTab === 'drive' && (
          <GoogleDrive
            latestReport={latestReport}
            userProfile={userProfile}
            onImportImageForScan={(base64Url) => setImportedImage(base64Url)}
            onNavigateToTab={handleNavigate}
          />
        )}

        {currentTab === 'cabinet' && (
          <Cabinet
            cabinetItems={cabinetItems}
            onCabinetChanged={handleCabinetChanged}
          />
        )}

        {currentTab === 'ingredients' && (
          <IngredientDb />
        )}

        {currentTab === 'consultant' && (
          <AiConsultant
            latestReport={latestReport}
            chatMessages={chatMessages}
            onChatMessagesChanged={setChatMessages}
            geminiApiKey={userProfile.geminiApiKey}
          />
        )}

        {currentTab === 'history' && (
          <History
            latestReport={latestReport}
            historyScans={historyScans}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'guide' && (
          <UserGuide />
        )}

        {currentTab === 'testimonials' && (
          <Testimonials />
        )}

        {currentTab === 'profile' && (
          <UserProfileSettings
            latestReport={latestReport}
            onProfileChanged={handleProfileChanged}
            currentProfile={userProfile}
          />
        )}

      </main>

      {/* Humble Footer with Clinical Advisory Disclaimer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-brand-200/80 dark:border-slate-800 px-6 py-6 text-center text-xs text-gray-400 dark:text-slate-500 space-y-2 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono">© 2026 SkinGPT Skin Lab. All rights preserved.</p>
          <p className="max-w-xl text-left leading-relaxed">
            <strong className="text-gray-500 dark:text-slate-400 block">Advisory Disclaimer:</strong> SkinGPT skin models represent cosmetic assessments, layering compatibility optimizations, and product suggestions. Results do not constitute clinical diagnoses or medical statements.
          </p>
        </div>
      </footer>
    </div>
  );
}
