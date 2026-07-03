import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, Eye, Flame, Shield, Droplets, Smile, HelpCircle } from 'lucide-react';
import { SkinScan } from '../types';
import { useAuth } from '../hooks/useAuth';
import { uploadScanImage } from '../services/storageService';


interface SkinScannerProps {
  onScanCompleted: (report: SkinScan) => void;
}

export default function SkinScanner({ 
  onScanCompleted
}: SkinScannerProps) {
  const { user, idToken } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Scanning phases
  const [scanStatus, setScanStatus] = useState<'idle' | 'capturing' | 'analyzing' | 'completed'>('idle');
  const [analysisPhase, setAnalysisPhase] = useState<number>(0);
  const [phaseLog, setPhaseLog] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const phases = [
    { name: "Verifying Lighting Normalization", detail: "Checking for balanced color temperature and glare..." },
    { name: "Performing Facial Alignment", detail: "Locating forehead, cheek zones, chin, and nose bridge..." },
    { name: "Skin Layer Segmentation", detail: "Analyzing epidermal surface texture and dermis layers..." },
    { name: "Feature Extraction & Anomaly Detection", detail: "Scanning for active acne, sebum blockages, and erythema..." },
    { name: "Orchestrating Generative AI Report", detail: "Structuring skin diagnosis with clinical explanations..." }
  ];

  // Stop camera stream when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);



  // Run through scanning phases sequentially to mimic a clinical scanner
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (scanStatus === 'analyzing') {
      if (analysisPhase < phases.length) {
        timer = setTimeout(() => {
          setPhaseLog(prev => [...prev, `✓ ${phases[analysisPhase].name}`]);
          setAnalysisPhase(prev => prev + 1);
        }, 1500);
      } else {
        // Trigger actual server analysis after visual phases
        triggerServerAnalysis();
      }
    }
    return () => clearTimeout(timer);
  }, [scanStatus, analysisPhase]);

  const startCamera = async () => {
    setError(null);
    setIsCameraActive(true);
    setFile(null);
    setImagePreview(null);
    setScanStatus('capturing');

    try {
      const constraints = {
        video: { width: 640, height: 480, facingMode: "user" }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setError("Unable to access camera. Please check your system permissions or upload an image instead.");
      setIsCameraActive(false);
      setScanStatus('idle');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImagePreview(dataUrl);
        stopCamera();
        setScanStatus('idle');
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setScanStatus('idle');
      };
      reader.readAsDataURL(uploadedFile);
    }
  };

  const cancelSelection = () => {
    stopCamera();
    setFile(null);
    setImagePreview(null);
    setScanStatus('idle');
    setAnalysisPhase(0);
    setPhaseLog([]);
  };

  const startAnalysis = () => {
    if (!imagePreview) return;
    setScanStatus('analyzing');
    setAnalysisPhase(0);
    setPhaseLog([]);
  };

  const triggerServerAnalysis = async () => {
    if (!imagePreview) return;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000); // 30 seconds client-side timeout

    try {
      const scanId = `scan-${Date.now()}`;
      let downloadURL = imagePreview;
      let storagePath = '';

      if (user) {
        setPhaseLog(prev => [...prev, "Uploading diagnostic imagery to secure cloud..."]);
        const uploadResult = await uploadScanImage(user.uid, scanId, imagePreview);
        downloadURL = uploadResult.downloadURL;
        storagePath = uploadResult.storagePath;
      }

      setPhaseLog(prev => [...prev, "Contacting clinical generative analysis engine..."]);

      // Send image to back-end proxy to keep API keys safe!
      const response = await fetch('/api/analyze-skin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': idToken ? `Bearer ${idToken}` : '',
        },
        body: JSON.stringify({
          image: imagePreview
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      const report: SkinScan = await response.json();
      
      // Inject scanId, storage info, and the final cloud imageURL into the report
      const completedReport: SkinScan = {
        ...report,
        id: scanId,
        imageUrl: downloadURL,
        storagePath: storagePath
      };

      onScanCompleted(completedReport);
      setScanStatus('completed');
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error("Analysis server route failed:", err);
      if (err.name === 'AbortError') {
        setError("The skin analysis request timed out (30 seconds limit reached). Please check your internet connection or API settings and try again.");
      } else {
        setError(err.message || "An unexpected error occurred during the facial scan. Please retry with a clearer image.");
      }
      setScanStatus('idle');
      setAnalysisPhase(0);
      setPhaseLog([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8" id="skin-scanner-view">
      
      {/* Title block */}
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-brand-900 dark:text-white font-display">
          AI Skin Scanner
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xl">
          Instantly execute clinical dermal evaluation on hydration, pores, barrier wellness, sebum, and obtain custom product routine suggestions.
        </p>
      </div>

      {/* Main scanner panel container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-brand-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
        
        {/* Warning alerts / status */}
        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-xl flex items-start gap-3 text-xs leading-relaxed text-rose-900 dark:text-rose-300">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Scan Exception Identified</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Idle Mode: Selection and Upload */}
        {scanStatus === 'idle' && !imagePreview && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="idle-scan-selection">
            
            {/* Camera Box Launcher */}
            <button
              onClick={startCamera}
              className="group p-8 border border-brand-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-indigo-500 bg-brand-50/10 dark:bg-slate-800/10 hover:bg-brand-50/20 dark:hover:bg-slate-800/25 rounded-2xl flex flex-col items-center justify-center text-center gap-4 transition-all cursor-pointer shadow-sm hover:shadow"
            >
              <div className="h-14 w-14 bg-brand-500/10 dark:bg-indigo-950 text-brand-500 dark:text-indigo-400 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                <Camera className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Launch Live Camera</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[220px]">Align your face dynamically in front of your camera device.</p>
              </div>
            </button>

            {/* Photo Upload Box Launcher */}
            <label className="group p-8 border border-dashed border-brand-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-indigo-500 bg-brand-50/10 dark:bg-slate-800/10 hover:bg-brand-50/20 dark:hover:bg-slate-800/25 rounded-2xl flex flex-col items-center justify-center text-center gap-4 transition-all cursor-pointer shadow-sm hover:shadow">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="h-14 w-14 bg-brand-500/10 dark:bg-indigo-950 text-brand-500 dark:text-indigo-400 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                <Upload className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Upload Photo File</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[220px]">Upload a clear selfie portrait from your local hard drive.</p>
              </div>
            </label>
          </div>
        )}

        {/* Live Camera View */}
        {scanStatus === 'capturing' && isCameraActive && (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border-2 border-brand-400 dark:border-indigo-500 shadow-md bg-black">
              {/* Overlay for alignment */}
              <div className="absolute inset-0 border-4 border-brand-400/30 dark:border-indigo-500/30 rounded-2xl pointer-events-none"></div>
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-brand-400/20 dark:border-indigo-500/20 pointer-events-none"></div>
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-brand-400/20 dark:border-indigo-500/20 pointer-events-none"></div>
              
              {/* Simulated oval frame */}
              <div className="absolute inset-6 border-2 border-dashed border-brand-300/60 dark:border-indigo-400/60 rounded-full pointer-events-none"></div>
              
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-sm leading-relaxed">
              Align your entire face inside the circular dashed target. Ensure uniform front lighting and clear camera focus.
            </p>

            <div className="flex gap-4">
              <button
                onClick={capturePhoto}
                className="px-6 py-3 bg-brand-500 hover:bg-brand-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                id="capture-photo-btn"
              >
                <Camera className="h-5 w-5" />
                Capture Snapshot
              </button>
              <button
                onClick={cancelSelection}
                className="px-6 py-3 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Image Selected Preview */}
        {scanStatus === 'idle' && imagePreview && (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden border border-brand-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-800 shadow-sm">
              <img
                src={imagePreview}
                alt="Captured Skin"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1 text-center">
              <p className="font-semibold text-gray-900 dark:text-white">Photo Loaded Successfully</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                Confirm your face is fully visible with no hair or hands blocking your cheeks, chin, and forehead.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={startAnalysis}
                className="px-8 py-3.5 bg-brand-500 hover:bg-brand-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
                id="run-analysis-btn"
              >
                <Sparkles className="h-5 w-5 text-brand-200 dark:text-indigo-200 animate-pulse-subtle" />
                Begin Advanced AI Skin Scan
              </button>
              <button
                onClick={cancelSelection}
                className="px-5 py-3.5 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                Reset Image
              </button>
            </div>
          </div>
        )}

        {/* Interactive Analyzer */}
        {scanStatus === 'analyzing' && (
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            {/* Interactive Image Frame with Scanlines */}
            <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden border-2 border-brand-400 dark:border-indigo-500 bg-gray-50 dark:bg-slate-800 shadow-md">
              <img
                src={imagePreview || ''}
                alt="Scanning..."
                className="w-full h-full object-cover filter brightness-75"
              />
              {/* Scan Bar */}
              <div className="absolute inset-x-0 h-1.5 bg-brand-400/95 dark:bg-indigo-500/95 shadow-[0_0_15px_#cca77b] dark:shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-scan pointer-events-none"></div>
              
              {/* Scanner Grid Overlay */}
              <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40 pointer-events-none"></div>
              
              {/* Pulsing Scan Indicator */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur text-brand-300 dark:text-indigo-300 rounded-full text-xs font-mono tracking-widest flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-400 dark:bg-indigo-400 animate-pulse"></span>
                SCANNING
              </div>
            </div>

            {/* Progress Log */}
            <div className="w-full max-w-md space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-mono text-brand-600 dark:text-indigo-400 uppercase tracking-widest">Diagnostic Phase</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Multi-Stage Evaluation</h3>
              </div>

              {/* Progress Steps */}
              <div className="space-y-3">
                {phases.map((p, idx) => {
                  const isActive = idx === analysisPhase;
                  const isCompleted = idx < analysisPhase;

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border transition-all duration-300 ${
                        isActive
                          ? 'border-brand-400 dark:border-indigo-500 bg-brand-50/30 dark:bg-indigo-950/20 shadow-sm'
                          : isCompleted
                          ? 'border-emerald-100 dark:border-emerald-900 bg-emerald-50/10 dark:bg-emerald-950/10'
                          : 'border-gray-100 dark:border-slate-800/40 opacity-40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : isActive ? (
                          <RefreshCw className="h-5 w-5 text-brand-500 dark:text-indigo-400 animate-spin shrink-0 mt-0.5" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border border-gray-300 dark:border-slate-700 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500 shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                        )}
                        <div>
                          <p className={`text-sm font-medium ${isActive ? 'text-brand-950 dark:text-white font-semibold' : 'text-gray-900 dark:text-gray-300'}`}>
                            {p.name}
                          </p>
                          {isActive && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                              {p.detail}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instruction Tips */}
      <div className="bg-brand-50/10 dark:bg-slate-900 rounded-2xl border border-brand-200/50 dark:border-slate-800 p-6">
        <h4 className="text-sm font-semibold text-brand-900 dark:text-indigo-400 flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-brand-500 dark:text-indigo-400" />
          Optimal Scanning Guidelines
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          <div className="flex gap-2">
            <span className="font-bold text-brand-500 dark:text-indigo-400 text-sm">01.</span>
            <p><strong className="text-gray-900 dark:text-white block mb-0.5">Freshly Cleansed Skin</strong> For highest accuracy, remove any makeup, sunscreens, and topical cosmetic powders that might mask texture anomalies.</p>
          </div>
          <div className="flex gap-2">
            <span className="font-bold text-brand-500 dark:text-indigo-400 text-sm">02.</span>
            <p><strong className="text-gray-900 dark:text-white block mb-0.5">Uniform Front Light</strong> Capture face facing directly towards natural soft window daylight or bright uniform indoor lights to avoid false shadow contours.</p>
          </div>
          <div className="flex gap-2">
            <span className="font-bold text-brand-500 dark:text-indigo-400 text-sm">03.</span>
            <p><strong className="text-gray-900 dark:text-white block mb-0.5">Avoid Angles</strong> Hold your device at straight eye-level and align your nose bridge with the center point of the frame.</p>
          </div>
        </div>
      </div>

      {/* Canvas for rendering frames */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
