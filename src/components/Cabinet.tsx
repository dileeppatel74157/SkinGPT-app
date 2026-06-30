import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, AlertTriangle, ShieldCheck, Sparkles, RefreshCw, Layers, Calendar } from 'lucide-react';
import { CabinetItem } from '../types';
import { checkRoutineCompatibility, CompatibilityReport } from '../utils/compatibility';

// Pre-packaged popular items for easy cabinet testing
const SAMPLE_PRODUCTS: CabinetItem[] = [
  {
    id: "sample-1",
    brand: "CeraVe",
    name: "Hydrating Facial Cleanser",
    category: "Cleanser",
    ingredients: "Aqua, Glycerin, Ceramides, Hyaluronic Acid",
    activeIngredients: ["Ceramides", "Hyaluronic Acid"],
    useInMorning: true,
    useInEvening: true,
    addedAt: new Date().toLocaleDateString()
  },
  {
    id: "sample-2",
    brand: "The Ordinary",
    name: "Niacinamide 10% + Zinc 1%",
    category: "Serum",
    ingredients: "Aqua, Niacinamide, Pentylene Glycol, Zinc PCA",
    activeIngredients: ["Niacinamide", "Zinc PCA"],
    useInMorning: true,
    useInEvening: false,
    addedAt: new Date().toLocaleDateString()
  },
  {
    id: "sample-3",
    brand: "The Ordinary",
    name: "Granactive Retinoid 2% in Squalane",
    category: "Serum",
    ingredients: "Squalane, Hydroxypinacolone Retinoate, Bisabolol",
    activeIngredients: ["Retinol", "Squalane"],
    useInMorning: false,
    useInEvening: true,
    addedAt: new Date().toLocaleDateString()
  }
];

interface CabinetProps {
  cabinetItems: CabinetItem[];
  onCabinetChanged: (items: CabinetItem[]) => void;
}

export default function Cabinet({ cabinetItems, onCabinetChanged }: CabinetProps) {
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Serum');
  const [ingredients, setIngredients] = useState('');
  const [activeIngredients, setActiveIngredients] = useState('');
  const [useInMorning, setUseInMorning] = useState(true);
  const [useInEvening, setUseInEvening] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [compatibilityReport, setCompatibilityReport] = useState<CompatibilityReport | null>(null);

  // Recalculate compatibility report when cabinet items change
  useEffect(() => {
    const report = checkRoutineCompatibility(cabinetItems);
    setCompatibilityReport(report);
  }, [cabinetItems]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !name) return;

    // Split active ingredients by comma
    const activesArray = activeIngredients
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const newItem: CabinetItem = {
      id: `cabinet-${Date.now()}`,
      brand,
      name,
      category,
      ingredients,
      activeIngredients: activesArray,
      useInMorning,
      useInEvening,
      addedAt: new Date().toLocaleDateString()
    };

    onCabinetChanged([...cabinetItems, newItem]);
    resetForm();
  };

  const resetForm = () => {
    setBrand('');
    setName('');
    setCategory('Serum');
    setIngredients('');
    setActiveIngredients('');
    setUseInMorning(true);
    setUseInEvening(false);
    setShowAddForm(false);
  };

  const handleDeleteItem = (id: string) => {
    const updated = cabinetItems.filter(item => item.id !== id);
    onCabinetChanged(updated);
  };

  const toggleUsage = (id: string, time: 'morning' | 'evening') => {
    const updated = cabinetItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          useInMorning: time === 'morning' ? !item.useInMorning : item.useInMorning,
          useInEvening: time === 'evening' ? !item.useInEvening : item.useInEvening
        };
      }
      return item;
    });
    onCabinetChanged(updated);
  };

  const loadSampleRoutine = () => {
    onCabinetChanged(SAMPLE_PRODUCTS);
  };

  const clearCabinet = () => {
    onCabinetChanged([]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8" id="skincare-cabinet-module">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-brand-900 dark:text-white font-display">
            Virtual Cabinet & Routine Compatibility
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xl">
            Inventory your daily skincare products, toggle usage times, and let our algorithmic rule-engine detect hazardous layering conflicts, duplicate active serums, and check optimal orders.
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex-1 md:flex-none px-5 py-2.5 bg-brand-500 hover:bg-brand-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            id="open-add-product-form-btn"
          >
            <Plus className="h-4 w-4" />
            Add Custom Product
          </button>
          
          {cabinetItems.length === 0 && (
            <button
              onClick={loadSampleRoutine}
              className="flex-1 md:flex-none px-5 py-2.5 border border-brand-300 dark:border-slate-700 hover:bg-brand-50/50 dark:hover:bg-slate-800 text-brand-700 dark:text-brand-300 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-brand-500 dark:text-indigo-400" />
              Load Sample Skincare
            </button>
          )}

          {cabinetItems.length > 0 && (
            <button
              onClick={clearCabinet}
              className="px-4 py-2.5 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-700 dark:text-rose-400 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Add Custom Product Form Modal/Card */}
      {showAddForm && (
        <form onSubmit={handleAddProduct} className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-brand-400 dark:border-indigo-600 p-8 shadow-md space-y-6 max-w-2xl mx-auto animate-fade-in">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display">Add Skincare Product</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Brand Name *</label>
              <input
                type="text"
                required
                placeholder="E.g., CeraVe, The Ordinary"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 dark:focus:border-indigo-500 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Product Name *</label>
              <input
                type="text"
                required
                placeholder="E.g., Hydrating Cleanser"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 dark:focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Product Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 dark:focus:border-indigo-500 text-sm"
              >
                {['Cleanser', 'Toner', 'Essence', 'Serum', 'Treatment', 'Moisturizer', 'Oil', 'Sunscreen'].map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Active Ingredients (Comma-separated)</label>
              <input
                type="text"
                placeholder="E.g., Retinol, Niacinamide, Salicylic Acid"
                value={activeIngredients}
                onChange={e => setActiveIngredients(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 dark:focus:border-indigo-500 text-sm"
              />
              <span className="text-[10px] text-gray-400 dark:text-gray-500 block">Crucial for automated routine conflict matching.</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Full Ingredient List (Optional)</label>
            <textarea
              placeholder="Paste complete INCI ingredient list..."
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 dark:focus:border-indigo-500 text-sm resize-none"
            />
          </div>

          {/* Time of Day Toggles */}
          <div className="flex flex-col sm:flex-row gap-6 p-4 bg-brand-50/10 dark:bg-slate-800/40 rounded-xl border border-brand-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider self-center sm:mr-4">Incorporate In:</span>
            
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={useInMorning}
                onChange={() => setUseInMorning(!useInMorning)}
                className="h-5 w-5 rounded border-gray-300 dark:border-slate-700 text-brand-600 dark:text-indigo-400 focus:ring-brand-500"
              />
              Morning Routine
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={useInEvening}
                onChange={() => setUseInEvening(!useInEvening)}
                className="h-5 w-5 rounded border-gray-300 dark:border-slate-700 text-brand-600 dark:text-indigo-400 focus:ring-brand-500"
              />
              Evening Routine
            </label>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-brand-500 hover:bg-brand-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors shadow-sm cursor-pointer"
            >
              Add to Cabinet
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Cabinet inventory and Compatibility Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Cabinet List (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-brand-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display">My Skincare Products ({cabinetItems.length})</h3>

            {cabinetItems.length === 0 ? (
              <div className="text-center py-12 px-6 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-2xl space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
                  Your cabinet is empty. Click <strong>Add Custom Product</strong> or load the pre-packaged safe skincare routine to begin testing compatibility.
                </p>
                <button
                  onClick={loadSampleRoutine}
                  className="px-5 py-2.5 border border-brand-300 dark:border-slate-700 hover:bg-brand-50/40 dark:hover:bg-slate-800 text-brand-700 dark:text-brand-300 rounded-xl text-xs font-medium transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-brand-500 dark:text-indigo-400 animate-pulse-subtle" />
                  Load Sample Skincare
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-slate-800">
                {cabinetItems.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-brand-50 dark:bg-slate-800 text-brand-700 dark:text-indigo-300 rounded-md text-[10px] font-semibold uppercase tracking-wider">{item.category}</span>
                        <p className="text-xs font-mono font-semibold text-gray-400 dark:text-gray-500 uppercase">{item.brand}</p>
                      </div>
                      
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.name}</h4>
                      
                      {item.activeIngredients.length > 0 && (
                        <div className="flex gap-1 flex-wrap pt-0.5">
                          {item.activeIngredients.map((act, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 border border-brand-200/50 dark:border-slate-700 text-gray-600 dark:text-gray-300 rounded text-[10px]">
                              {act}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Morning/Night Quick Toggles */}
                      <div className="flex gap-3 pt-1 text-xs">
                        <button
                          onClick={() => toggleUsage(item.id, 'morning')}
                          className={`px-3 py-1 rounded-lg border text-[10px] font-medium transition-colors cursor-pointer ${
                            item.useInMorning
                              ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300'
                              : 'border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          ☀ Morning {item.useInMorning ? 'On' : 'Off'}
                        </button>
                        <button
                          onClick={() => toggleUsage(item.id, 'evening')}
                          className={`px-3 py-1 rounded-lg border text-[10px] font-medium transition-colors cursor-pointer ${
                            item.useInEvening
                              ? 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300'
                              : 'border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          ☾ Evening {item.useInEvening ? 'On' : 'Off'}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Compatibility Analysis (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-brand-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6 sticky top-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display flex items-center gap-2">
              <Layers className="h-5 w-5 text-brand-500 dark:text-indigo-400" />
              Real-time Optimization
            </h3>

            {cabinetItems.length === 0 ? (
              <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-xs leading-relaxed">
                Provide skincare products in your virtual cabinet to populate live compatibility warnings and layering orders.
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Visual Status Indicator */}
                {compatibilityReport?.routineOk ? (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-2xl flex items-start gap-3 text-xs leading-relaxed">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Routine Status: Safe</p>
                      <p className="mt-0.5 text-emerald-700 dark:text-emerald-400">No active chemical conflicts or hazardous overlaps identified in your current schedules.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900 text-rose-800 dark:text-rose-300 rounded-2xl flex items-start gap-3 text-xs leading-relaxed animate-pulse-subtle">
                    <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Routine Status: Action Recommended</p>
                      <p className="mt-0.5 text-rose-700 dark:text-rose-400">We identified {compatibilityReport?.conflicts.length} active conflict(s) that might cause high barrier irritation or compromise product efficacy.</p>
                    </div>
                  </div>
                )}

                {/* Conflict Log */}
                {compatibilityReport && compatibilityReport.conflicts.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Identified Conflicts</p>
                    <div className="space-y-3">
                      {compatibilityReport.conflicts.map((conf, i) => (
                        <div key={i} className={`p-4 rounded-xl border text-xs space-y-2 ${
                          conf.severity === 'high' 
                            ? 'bg-rose-50/5 dark:bg-rose-950/5 border-rose-200 dark:border-rose-900/50 text-rose-950 dark:text-rose-300' 
                            : 'bg-amber-50/5 dark:bg-amber-950/5 border-amber-200 dark:border-amber-900/50 text-amber-950 dark:text-amber-300'
                        }`}>
                          <p className="font-bold flex items-center gap-1.5">
                            <AlertTriangle className={`h-4 w-4 ${conf.severity === 'high' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`} />
                            {conf.title}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{conf.description}</p>
                          <div className="pt-1.5 border-t border-dashed border-brand-200/50 dark:border-slate-800">
                            <span className="font-semibold block mb-1 text-[10px] dark:text-slate-400">AFFECTED PRODUCTS:</span>
                            <p className="font-mono text-[10px] text-gray-500 dark:text-gray-400">{conf.affectedProducts.join(', ')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Duplicate Actives Log */}
                {compatibilityReport && compatibilityReport.duplicates.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duplicate Actives</p>
                    <div className="space-y-3">
                      {compatibilityReport.duplicates.map((dup, i) => (
                        <div key={i} className="p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/10 dark:bg-blue-950/10 text-xs space-y-1.5">
                          <p className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                            <RefreshCw className="h-3.5 w-3.5 text-blue-500" />
                            Overlapping {dup.active}
                          </p>
                          <p className="text-blue-700 dark:text-blue-400 leading-relaxed">{dup.description}</p>
                          <div className="pt-1 border-t border-dashed border-blue-100/50 dark:border-slate-800">
                            <span className="font-semibold block text-[10px] dark:text-slate-400">AFFECTED PRODUCTS:</span>
                            <p className="font-mono text-[10px] text-gray-500 dark:text-gray-400">{dup.affectedProducts.join(', ')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Layering Guides */}
                {compatibilityReport && (
                  <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Algorithmic Layering Order</p>
                    
                    <div className="space-y-4 divide-y divide-gray-100 dark:divide-slate-800 text-xs">
                      {/* Morning Routine Order */}
                      <div className="space-y-2">
                        <p className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">☀ Morning Layering Order</p>
                        {compatibilityReport.layeringAdvice.morning.order.length === 0 ? (
                          <p className="text-gray-400 dark:text-gray-500 italic text-[11px]">No products designated for Morning use.</p>
                        ) : (
                          <div className="space-y-1 font-mono text-[11px] text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                            {compatibilityReport.layeringAdvice.morning.order.map((step, idx) => (
                              <div key={idx} className="flex gap-2 py-0.5">
                                <span className="text-brand-500 dark:text-indigo-400 font-bold">{idx + 1}.</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Evening Routine Order */}
                      <div className="space-y-2 pt-4">
                        <p className="font-semibold text-indigo-700 dark:text-indigo-400 flex items-center gap-1">☾ Evening Layering Order</p>
                        {compatibilityReport.layeringAdvice.evening.order.length === 0 ? (
                          <p className="text-gray-400 dark:text-gray-500 italic text-[11px]">No products designated for Evening use.</p>
                        ) : (
                          <div className="space-y-1 font-mono text-[11px] text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                            {compatibilityReport.layeringAdvice.evening.order.map((step, idx) => (
                              <div key={idx} className="flex gap-2 py-0.5">
                                <span className="text-brand-500 dark:text-indigo-400 font-bold">{idx + 1}.</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
