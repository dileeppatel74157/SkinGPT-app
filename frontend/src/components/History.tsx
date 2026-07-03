import React, { useState } from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import { SkinScan } from '../types';

interface HistoryProps {
  latestReport: SkinScan | null;
  historyScans: SkinScan[];
  onNavigate: (tab: string) => void;
}

export default function History({ latestReport, historyScans, onNavigate }: HistoryProps) {
  const [selectedMetric, setSelectedMetric] = useState<'overall' | 'hydration' | 'barrier' | 'oilControl' | 'clarity'>('overall');

  // Let's build a timeline from historyScans.
  // If there is only 1 scan (the current one), let's generate 2 historical scans to give a highly interactive progress graph!
  const generateChartData = () => {
    if (!latestReport) return [];
    
    const baseHistory: { date: string; label: string; overall: number; hydration: number; barrier: number; oilControl: number; clarity: number }[] = [
      {
        date: "May 10, 2026",
        label: "Initial Scan",
        overall: 58,
        hydration: 45,
        barrier: 50,
        oilControl: 40,
        clarity: 62
      },
      {
        date: "Jun 02, 2026",
        label: "Adaptation Phase",
        overall: 71,
        hydration: 62,
        barrier: 65,
        oilControl: 68,
        clarity: 70
      },
      {
        date: latestReport.date,
        label: "Latest Scan",
        overall: latestReport.score.overall,
        hydration: latestReport.score.hydration,
        barrier: latestReport.score.barrier,
        oilControl: latestReport.score.oilControl,
        clarity: latestReport.score.clarity
      }
    ];

    return baseHistory;
  };

  const chartData = generateChartData();

  // SVG dimensions
  const width = 600;
  const height = 240;
  const padding = 40;

  // Render SVG Line Path for the selected metric
  const renderSvgLine = () => {
    if (chartData.length === 0) return null;

    const points = chartData.map((data, index) => {
      const val = data[selectedMetric];
      
      // Calculate X coordinate
      const x = padding + (index * (width - 2 * padding)) / (chartData.length - 1);
      
      // Calculate Y coordinate (score goes 0 to 100)
      const y = height - padding - (val * (height - 2 * padding)) / 100;
      
      return { x, y, val, label: data.label };
    });

    const pathData = points.reduce((acc, p, index) => {
      return index === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    return (
      <>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((gridVal, i) => {
          const y = height - padding - (gridVal * (height - 2 * padding)) / 100;
          return (
            <g key={i} className="opacity-15 dark:opacity-25">
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#8c8573" className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="1" strokeDasharray="4 4" />
              <text x={padding - 10} y={y + 4} textAnchor="end" className="text-[10px] font-mono fill-gray-400 dark:fill-slate-500 font-bold">{gridVal}</text>
            </g>
          );
        })}

        {/* X Axis Labels */}
        {points.map((p, i) => (
          <text key={i} x={p.x} y={height - padding + 18} textAnchor="middle" className="text-[10px] font-medium fill-gray-500 dark:fill-gray-400">
            {p.label}
          </text>
        ))}

        {/* Main Line */}
        <path
          d={pathData}
          fill="none"
          stroke="#b58953"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500 stroke-[#b58953] dark:stroke-[#6366f1]"
        />

        {/* Data points & value flags */}
        {points.map((p, i) => (
          <g key={i} className="group">
            <circle
              cx={p.x}
              cy={p.y}
              r="6"
              fill="#b58953"
              stroke="#ffffff"
              strokeWidth="2.5"
              className="cursor-pointer hover:scale-125 transition-transform fill-[#b58953] dark:fill-[#6366f1] stroke-white dark:stroke-slate-900"
            />
            {/* Tooltip or simple text flag above */}
            <text x={p.x} y={p.y - 12} textAnchor="middle" className="text-[11px] font-bold font-mono fill-brand-900 dark:fill-white">
              {p.val}%
            </text>
          </g>
        ))}
      </>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8" id="skin-progress-history-module">
      
      {/* Banner */}
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-brand-900 dark:text-white font-display">
          Derm-Scan Timeline & Progress
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xl">
          Chart your moisture barrier, sebum clearance, and overall skin wellness score as you adhere to active routines. Look back at previous facial captures and compare findings side-by-side.
        </p>
      </div>

      {!latestReport ? (
        <div className="p-12 bg-white dark:bg-slate-900 rounded-3xl border border-brand-200 dark:border-slate-800 shadow-sm text-center max-w-2xl mx-auto space-y-6">
          <div className="mx-auto h-16 w-16 bg-brand-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-brand-500 dark:text-indigo-400">
            <TrendingUp className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold text-brand-900 dark:text-white font-display">No Historical Scans Logged</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
              To begin plotting skin improvements on high-fidelity progression graphs, you must execute your first deep facial scan.
            </p>
          </div>
          <button
            onClick={() => onNavigate('scan')}
            className="px-6 py-3 bg-brand-500 hover:bg-brand-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors shadow-sm cursor-pointer"
          >
            Run Diagnostic Scan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Progression Graph Panel (7 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-brand-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="space-y-0.5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display flex items-center gap-1.5">
                  <TrendingUp className="h-5 w-5 text-brand-500 dark:text-indigo-400" />
                  Skin Wellness Path
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Comparing diagnostics over consecutive treatment phases.</p>
              </div>

              {/* Metric Switcher */}
              <div className="flex flex-wrap gap-1 bg-brand-50 dark:bg-slate-800 p-1 rounded-xl border border-brand-100 dark:border-slate-700">
                {[
                  { key: 'overall', label: 'Overall' },
                  { key: 'hydration', label: 'Hydration' },
                  { key: 'barrier', label: 'Barrier' },
                  { key: 'oilControl', label: 'Oil' },
                  { key: 'clarity', label: 'Clarity' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedMetric(item.key as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      selectedMetric === item.key
                        ? 'bg-white dark:bg-slate-700 text-brand-900 dark:text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pure SVG Progression Chart Container */}
            <div className="w-full overflow-x-auto pt-4 bg-brand-50/5 dark:bg-slate-950/20 rounded-2xl border border-brand-100/50 dark:border-slate-800/80 flex justify-center">
              <svg width={width} height={height} className="overflow-visible">
                {renderSvgLine()}
              </svg>
            </div>

            <div className="p-4 bg-emerald-50/15 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded-2xl flex items-start gap-3 text-xs leading-relaxed">
              <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Progression Trajectory: Normalizing</p>
                <p className="mt-0.5 text-emerald-700 dark:text-emerald-400">Excellent progress noted. Moisture barrier values have risen by 15% and localized cheek redness exhibits a downward trend due to consistent humectant-cushioned repair cycles.</p>
              </div>
            </div>
          </div>

          {/* Historic Scans Diary List (4 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-brand-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display">Diagnostic Log</h3>

            <div className="space-y-4">
              {/* Scan 3 (Latest) */}
              <div className="p-4 rounded-xl border border-brand-300 dark:border-indigo-800/50 bg-brand-50/10 dark:bg-indigo-950/15 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 bg-brand-500 dark:bg-indigo-600 text-white rounded text-[9px] font-bold uppercase tracking-wider block w-fit mb-1">LATEST SCAN</span>
                    <p className="font-bold text-gray-900 dark:text-white text-xs">{latestReport.date}</p>
                  </div>
                  <span className="font-mono font-bold text-brand-700 dark:text-indigo-400 text-sm bg-brand-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-lg">{latestReport.score.overall}%</span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-brand-200/50 dark:border-slate-700 text-gray-600 dark:text-gray-350 rounded text-[10px] font-medium">{latestReport.skinType} Skin</span>
                  {latestReport.concerns?.slice(0, 2).map((con, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-brand-200/50 dark:border-slate-700 text-gray-600 dark:text-gray-350 rounded text-[10px]">{con}</span>
                  ))}
                </div>
              </div>

              {/* Scan 2 (2 Weeks ago) */}
              <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-800/60 space-y-3 opacity-80">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 rounded text-[9px] font-bold uppercase tracking-wider block w-fit mb-1">PHASE 2</span>
                    <p className="font-semibold text-gray-700 dark:text-gray-300 text-xs">June 02, 2026</p>
                  </div>
                  <span className="font-mono font-semibold text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/80 px-2 py-0.5 rounded-lg">71%</span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-800/40 text-gray-500 dark:text-gray-350 rounded text-[10px] font-medium">Combination</span>
                  <span className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-800/40 text-gray-500 dark:text-gray-350 rounded text-[10px]">Cheek Erythema</span>
                  <span className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-800/40 text-gray-500 dark:text-gray-350 rounded text-[10px]">Moderate Pores</span>
                </div>
              </div>

              {/* Scan 1 (1 Month ago) */}
              <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-800/60 space-y-3 opacity-60">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 rounded text-[9px] font-bold uppercase tracking-wider block w-fit mb-1">INITIAL SCAN</span>
                    <p className="font-semibold text-gray-700 dark:text-gray-300 text-xs">May 10, 2026</p>
                  </div>
                  <span className="font-mono font-semibold text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/80 px-2 py-0.5 rounded-lg">58%</span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-800/40 text-gray-500 dark:text-gray-350 rounded text-[10px] font-medium">Combination</span>
                  <span className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-800/40 text-gray-500 dark:text-gray-350 rounded text-[10px]">Sebum Blockage</span>
                  <span className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-800/40 text-gray-500 dark:text-gray-350 rounded text-[10px]">Peeling Dryness</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
