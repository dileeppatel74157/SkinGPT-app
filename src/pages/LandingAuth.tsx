import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  Globe, 
  CloudSun, 
  Sliders, 
  ShieldCheck, 
  Star, 
  MessageSquare, 
  RefreshCw, 
  Camera, 
  BookOpen, 
  Layers 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { UserProfile } from '../types';
import { auth } from '../utils/firebase';
import { sendEmailVerification } from 'firebase/auth';


interface LandingAuthProps {
  initialView?: 'landing' | 'login' | 'signup' | 'forgot' | 'verify';
}

export default function LandingAuth({ initialView = 'landing' }: LandingAuthProps) {
  const [view, setView] = useState<'landing' | 'login' | 'signup' | 'forgot' | 'verify'>(initialView);
  const { login, signup, loginWithGoogle, resetPassword, logout, user, refreshUser } = useAuth();
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupAge, setSignupAge] = useState(25);
  const [signupLocation, setSignupLocation] = useState('San Francisco, CA');
  const [signupClimate, setSignupClimate] = useState<'Temperate' | 'Dry/Cold' | 'Warm/Humid'>('Temperate');
  const [signupSkinType, setSignupSkinType] = useState<'Oily' | 'Dry' | 'Combination' | 'Sensitive' | 'Normal'>('Normal');
  const [signupConcerns, setSignupConcerns] = useState<string[]>([]);
  
  // Reset password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  
  // General status state
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  // If initialView changes, update local view
  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await login(loginEmail, loginPassword);
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err?.message || 'Failed to authenticate. Please check your credentials.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail || !signupPassword || !signupName) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      // Step 1: Create user in Firebase Auth
      const newUser = await signup(signupEmail, signupPassword);
      
      // Step 2: Store temporary signup profile in localStorage so the profile migration step 
      // can read it and save it to Firestore when the user completes/verifies.
      const signupProfile: UserProfile = {
        name: signupName,
        email: signupEmail,
        age: Number(signupAge),
        location: signupLocation,
        climate: signupClimate,
        skinType: signupSkinType,
        concerns: signupConcerns,
        geminiApiKey: '',
        openuvApiKey: ''
      };
      localStorage.setItem('skingpt_signup_temp_profile', JSON.stringify(signupProfile));
      
      setStatus('success');
      setView('verify');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err?.message || 'Failed to register. Email may already be in use.');
    }
  };

  const handleGoogleLogin = async () => {
    setStatus('loading');
    setErrorMsg('');
    try {
      await loginWithGoogle();
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err?.message || 'Google authentication failed.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await resetPassword(resetEmail);
      setStatus('success');
      setResetSent(true);
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err?.message || 'Failed to send password reset email.');
    }
  };

  const handleCheckVerification = async () => {
    setStatus('loading');
    try {
      await refreshUser();
      // Auth state listener in AuthContext will handle state redirection
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err?.message || 'Verification check failed. Please check your inbox.');
    } finally {
      setStatus('idle');
    }
  };

  const toggleConcern = (concern: string) => {
    if (signupConcerns.includes(concern)) {
      setSignupConcerns(signupConcerns.filter(c => c !== concern));
    } else {
      setSignupConcerns([...signupConcerns, concern]);
    }
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
    "Dark Circles"
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans relative overflow-hidden" id="landing-auth-gateway">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none"></div>

      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-sm">
              <Sparkles className="h-5 w-5 text-indigo-100 animate-pulse-subtle" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight font-display text-white block">SKINGPT</span>
              <span className="text-[9px] font-mono font-semibold tracking-wider text-indigo-400 block -mt-1 uppercase">Skin Analysis Lab</span>
            </div>
          </div>
          
          {view === 'landing' && (
            <button 
              onClick={() => setView('login')}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Sign In
            </button>
          )}
          {view !== 'landing' && view !== 'verify' && (
            <button 
              onClick={() => setView('landing')}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-all cursor-pointer"
            >
              Back to Overview
            </button>
          )}
          {view === 'verify' && (
            <button 
              onClick={async () => {
                await logout();
                setView('login');
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-all cursor-pointer"
            >
              Sign Out
            </button>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex items-center justify-center py-12 px-6">
        
        {/* LANDING OVERVIEW PAGE */}
        {view === 'landing' && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/50 border border-indigo-500/30 text-xs text-indigo-400 font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                Next-Gen Dermatological Computer Vision AI
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-bold font-display leading-tight tracking-tight text-white">
                Clinical Skincare, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
                  Decoded by Generative AI.
                </span>
              </h1>
              
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
                Upload a facial close-up and let SkinGPT scan for hydration levels, barrier wellness, pores, redness, and wrinkle telemetry. Instantly inventory your cabinet to screen for hazardous active conflict combinations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => setView('signup')}
                  className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  Create Free Account
                  <ArrowRight className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => setView('login')}
                  className="px-8 py-3.5 border border-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Sign In
                </button>
              </div>

              {/* Specs Quick Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-900">
                <div className="space-y-2">
                  <div className="h-9 w-9 rounded-xl bg-indigo-950/60 border border-indigo-900 flex items-center justify-center text-indigo-400">
                    <Camera className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-slate-200 text-sm">Computer Vision Scan</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Deep analysis of acne, dehydration, redness, and skin barrier metrics.</p>
                </div>
                <div className="space-y-2">
                  <div className="h-9 w-9 rounded-xl bg-indigo-950/60 border border-indigo-900 flex items-center justify-center text-indigo-400">
                    <Layers className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-slate-200 text-sm">Active Compatibility</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Screens cosmetic cabinets for harmful chemical layerings and duplicates.</p>
                </div>
                <div className="space-y-2">
                  <div className="h-9 w-9 rounded-xl bg-indigo-950/60 border border-indigo-900 flex items-center justify-center text-indigo-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-slate-200 text-sm">AI Skincare Coach</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Ask SkinGPT about layering pH levels, active pairing rules, and ingredients.</p>
                </div>
              </div>
            </div>

            {/* Right Form / Visual Column (Glassmorphic Mockup) */}
            <div className="lg:col-span-5 relative">
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">SKINGPT TELEMETRY</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-900/40 text-xs">
                    <span className="text-slate-400">Overall Score:</span>
                    <span className="font-bold text-indigo-400 font-mono text-sm">82 / 100</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-900/40 text-xs">
                    <span className="text-slate-400">Primary Skin Type:</span>
                    <span className="font-bold text-indigo-400">Combination (Sensitive)</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-900/40 text-xs">
                    <span className="text-slate-400">Moisture Barrier:</span>
                    <span className="font-bold text-indigo-400 font-mono">Good (76%)</span>
                  </div>
                  
                  {/* Testimonial snippet */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-900 relative">
                    <p className="text-xs text-slate-400 italic leading-relaxed">
                      "SkinGPT detected chemical conflicts in my routine and rebuilt a custom morning hydration cycle. My barrier redness disappeared in days!"
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="h-6 w-6 rounded-full bg-indigo-600/40 border border-indigo-500 text-[10px] font-bold flex items-center justify-center uppercase">
                        SM
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">Sarah M. (Age 28)</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setView('signup')}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-semibold tracking-wider transition-all shadow-md cursor-pointer"
                >
                  GET STARTED FOR FREE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LOGIN SCREEN */}
        {view === 'login' && (
          <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6">
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl font-bold font-display text-white">Welcome Back</h2>
              <p className="text-xs text-slate-400">Log in to view your personalized routines and scans.</p>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-rose-950/20 border border-rose-900/50 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                  <button 
                    type="button"
                    onClick={() => setView('forgot')}
                    className="text-[10px] text-indigo-400 font-semibold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {status === 'loading' ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  "SIGN IN"
                )}
              </button>
            </form>

            <div className="relative flex items-center justify-center my-2">
              <div className="absolute w-full border-t border-slate-800"></div>
              <span className="relative px-3 bg-slate-900/60 text-[10px] font-bold text-slate-500 uppercase tracking-wider">or sign in with</span>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={status === 'loading'}
              className="w-full py-3 border border-slate-800 hover:bg-slate-950 disabled:opacity-50 text-white rounded-xl text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {/* Google logo SVG */}
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.232 1.95 15.485.8 12.24.8 6.035.8 1 5.835 1 12.04s5.035 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.985 0-.74-.08-1.305-.178-1.865h-10.615z" />
              </svg>
              Google Account
            </button>

            <div className="text-center">
              <span className="text-xs text-slate-400">Don't have an account? </span>
              <button 
                onClick={() => setView('signup')}
                className="text-xs text-indigo-400 font-bold hover:underline"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}

        {/* SIGNUP SCREEN */}
        {view === 'signup' && (
          <div className="w-full max-w-2xl bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6">
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl font-bold font-display text-white">Create SaaS Account</h2>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider text-indigo-400">Begin your clinical skin-tracking dashboard</p>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-rose-950/20 border border-rose-900/50 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Account Credentials */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 border-b border-slate-800 pb-1.5 uppercase tracking-wider">Account Credentials</h3>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                      <UserIcon className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Elena Rostova"
                      value={signupName}
                      onChange={e => setSignupName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-indigo-500 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="elena@example.com"
                      value={signupEmail}
                      onChange={e => setSignupEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-indigo-500 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      type="password"
                      required
                      placeholder="Min 6 characters"
                      value={signupPassword}
                      onChange={e => setSignupPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-indigo-500 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Age (Years)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={signupAge}
                      onChange={e => setSignupAge(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-indigo-500 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</label>
                    <input
                      type="text"
                      required
                      placeholder="Chicago, IL"
                      value={signupLocation}
                      onChange={e => setSignupLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-indigo-500 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Local Climate</label>
                  <select
                    value={signupClimate}
                    onChange={e => setSignupClimate(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-indigo-500 text-xs appearance-none"
                  >
                    <option value="Temperate">Temperate</option>
                    <option value="Dry/Cold">Dry & Cold</option>
                    <option value="Warm/Humid">Warm & Humid</option>
                  </select>
                </div>
              </div>

              {/* Skin Attributes */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 border-b border-slate-800 pb-1.5 uppercase tracking-wider">Skin Profile Details</h3>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Skin Type</span>
                  <div className="grid grid-cols-3 gap-2">
                    {['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSignupSkinType(type as any)}
                        className={`py-2 rounded-lg border text-[10px] font-semibold transition-all cursor-pointer ${
                          signupSkinType === type
                            ? 'border-indigo-500 bg-indigo-950/40 text-indigo-300 font-bold'
                            : 'border-slate-850 hover:bg-slate-900 text-slate-400'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Primary Skin Concerns</span>
                  <div className="grid grid-cols-3 gap-2">
                    {allConcernsList.map(concern => {
                      const isSelected = signupConcerns.includes(concern);
                      return (
                        <button
                          key={concern}
                          type="button"
                          onClick={() => toggleConcern(concern)}
                          className={`py-2 px-1 rounded-lg border text-[9px] text-center transition-all cursor-pointer truncate ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-950/30 text-indigo-300 font-medium'
                              : 'border-slate-850 bg-slate-950 text-slate-500 hover:border-slate-800'
                          }`}
                          title={concern}
                        >
                          {concern}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {status === 'loading' ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      "CREATE SAAS ACCOUNT"
                    )}
                  </button>
                </div>
              </div>

            </form>

            <div className="relative flex items-center justify-center my-2">
              <div className="absolute w-full border-t border-slate-800"></div>
              <span className="relative px-3 bg-slate-900/60 text-[10px] font-bold text-slate-500 uppercase tracking-wider">or join with</span>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={status === 'loading'}
              className="w-full py-3 border border-slate-800 hover:bg-slate-950 disabled:opacity-50 text-white rounded-xl text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.232 1.95 15.485.8 12.24.8 6.035.8 1 5.835 1 12.04s5.035 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.985 0-.74-.08-1.305-.178-1.865h-10.615z" />
              </svg>
              Google Account
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">Already registered? </span>
              <button 
                onClick={() => setView('login')}
                className="text-xs text-indigo-400 font-bold hover:underline"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* FORGOT PASSWORD SCREEN */}
        {view === 'forgot' && (
          <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6">
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl font-bold font-display text-white">Reset Password</h2>
              <p className="text-xs text-slate-400">Provide your account email to dispatch recovery link.</p>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-rose-950/20 border border-rose-900/50 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            {resetSent ? (
              <div className="p-4 bg-emerald-950/20 border border-emerald-900/50 rounded-2xl space-y-4 text-center">
                <div className="mx-auto h-10 w-10 bg-emerald-950 border border-emerald-900 text-emerald-400 rounded-full flex items-center justify-center">
                  <Check className="h-5 w-5" />
                </div>
                <p className="text-xs text-emerald-300">A password recovery email was successfully dispatched to **{resetEmail}**.</p>
                <button
                  onClick={() => {
                    setResetSent(false);
                    setResetEmail('');
                    setView('login');
                  }}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {status === 'loading' ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    "DISPATCH RECOVERY EMAIL"
                  )}
                </button>
              </form>
            )}

            <div className="text-center pt-2">
              <button 
                onClick={() => setView('login')}
                className="text-xs text-slate-400 hover:text-white font-semibold transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        )}

        {/* VERIFY EMAIL SCREEN */}
        {view === 'verify' && (
          <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6 text-center">
            <div className="space-y-3">
              <div className="mx-auto h-12 w-12 bg-indigo-950 border border-indigo-850 text-indigo-400 rounded-full flex items-center justify-center animate-pulse-subtle">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold font-display text-white">Email Verification Required</h2>
              <p className="text-xs text-slate-450 leading-relaxed">
                A verification link was dispatched to: <br />
                <strong className="text-indigo-300 font-semibold">{user?.email}</strong>
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-rose-950/20 border border-rose-900/50 rounded-xl flex items-start gap-2.5 text-xs text-rose-300 text-left">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                onClick={handleCheckVerification}
                disabled={status === 'loading'}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {status === 'loading' ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  "I HAVE VERIFIED MY EMAIL"
                )}
              </button>

              <button
                onClick={async () => {
                  setResendStatus('sending');
                  try {
                    if (auth.currentUser) {
                      await sendEmailVerification(auth.currentUser);
                      setResendStatus('sent');
                      setTimeout(() => setResendStatus('idle'), 5000);
                    }
                  } catch (err: any) {
                    console.error(err);
                    setErrorMsg(err?.message || 'Failed to dispatch verification email.');
                    setResendStatus('idle');
                  }
                }}
                disabled={resendStatus === 'sending' || resendStatus === 'sent'}
                className="w-full py-2.5 border border-slate-800 hover:bg-slate-900 disabled:opacity-50 text-slate-300 hover:text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                {resendStatus === 'sending' && "Dispatching Link..."}
                {resendStatus === 'sent' && "✓ Verification Link Sent!"}
                {resendStatus === 'idle' && "Resend Verification Email"}
              </button>
            </div>

            <div className="text-center pt-4 border-t border-slate-850 flex justify-between text-xs text-slate-500">
              <span>Verified already? Check spam folder.</span>
              <button 
                onClick={async () => {
                  await logout();
                  setView('login');
                }}
                className="text-indigo-400 font-bold hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        <p>© 2026 SkinGPT SaaS Skin Lab. All rights preserved.</p>
      </footer>
    </div>
  );
}
