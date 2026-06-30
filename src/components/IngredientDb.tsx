import React, { useState } from 'react';
import { Search, Sparkles, AlertCircle, ArrowRightLeft, CheckCircle } from 'lucide-react';
import { INGREDIENTS_DATABASE } from '../data/ingredients';
import { Ingredient } from '../types';

export default function IngredientDb() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkinType, setSelectedSkinType] = useState('All');
  const [selectedConcern, setSelectedConcern] = useState('All');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(INGREDIENTS_DATABASE[0]);

  // Filters logic
  const filteredIngredients = INGREDIENTS_DATABASE.filter(ing => {
    const matchesSearch = 
      ing.commonName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ing.inciName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSkinType = 
      selectedSkinType === 'All' || 
      ing.skinTypes.includes(selectedSkinType);

    const matchesConcern = 
      selectedConcern === 'All' || 
      ing.concerns.includes(selectedConcern);

    return matchesSearch && matchesSkinType && matchesConcern;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8" id="ingredient-encyclopedia-module">
      {/* Header Banner */}
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-brand-900 dark:text-white font-display">
          Ingredient Intelligence Database
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl">
          Search, cross-examine, and educate yourself on active skincare compounds. Understand how cosmetic acids, retinoids, and calming botanicals react with your skin cells.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-brand-200 dark:border-slate-800 p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search input */}
        <div className="relative w-full md:w-1/3">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search e.g. Retinol, Niacinamide..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 text-sm"
          />
        </div>

        {/* Filter selectors */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Skin type filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Skin Type:</span>
            <select
              value={selectedSkinType}
              onChange={e => setSelectedSkinType(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-brand-200 dark:border-slate-700 focus:outline-none focus:border-brand-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-xs"
            >
              <option value="All">All Skin Types</option>
              {['Dry', 'Oily', 'Combination', 'Sensitive', 'Normal'].map((type, i) => (
                <option key={i} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Concern filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Concern:</span>
            <select
              value={selectedConcern}
              onChange={e => setSelectedConcern(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-brand-200 dark:border-slate-700 focus:outline-none focus:border-brand-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-xs"
            >
              <option value="All">All Concerns</option>
              {['Acne', 'Pores', 'Oiliness', 'Dryness', 'Redness', 'Wrinkles', 'Texture', 'Pigmentation'].map((concern, i) => (
                <option key={i} value={concern}>{concern}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Dual Panel Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Directory List (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-brand-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-4 max-h-[600px] overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Ingredient Directory ({filteredIngredients.length})</p>
          
          <div className="space-y-2">
            {filteredIngredients.map((ing, idx) => {
              const isSelected = selectedIngredient?.inciName === ing.inciName;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedIngredient(ing)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center cursor-pointer ${
                    isSelected
                      ? 'border-brand-500 dark:border-indigo-500 bg-brand-50/30 dark:bg-indigo-950/20'
                      : 'border-brand-100 dark:border-slate-800 hover:bg-brand-50/15 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className={`text-sm font-bold ${isSelected ? 'text-brand-950 dark:text-white font-extrabold' : 'text-gray-900 dark:text-gray-300'}`}>{ing.commonName}</h4>
                    <p className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-wider">{ing.inciName}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    ing.pregnancySafety === 'Safe' ? 'bg-emerald-50 dark:bg-emerald-950/25 text-emerald-700 dark:text-emerald-300' :
                    ing.pregnancySafety === 'Avoid' ? 'bg-rose-50 dark:bg-rose-950/25 text-rose-700 dark:text-rose-300' :
                    'bg-amber-50 dark:bg-amber-950/25 text-amber-700 dark:text-amber-300'
                  }`}>
                    {ing.pregnancySafety}
                  </span>
                </button>
              );
            })}

            {filteredIngredients.length === 0 && (
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-10">No ingredients match your active filters.</p>
            )}
          </div>
        </div>

        {/* Right Side: Detailed Scientific Profile (7 cols) */}
        <div className="lg:col-span-7">
          {selectedIngredient ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-brand-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
              {/* Header block */}
              <div className="border-b border-brand-100 dark:border-slate-800 pb-6 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-mono font-semibold text-brand-500 dark:text-indigo-400 uppercase tracking-widest">{selectedIngredient.inciName}</p>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-display">{selectedIngredient.commonName}</h2>
                  </div>
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500">Pregnancy safety:</span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                      selectedIngredient.pregnancySafety === 'Safe' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/50' :
                      selectedIngredient.pregnancySafety === 'Avoid' ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900/50' :
                      'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-900/50'
                    }`}>
                      {selectedIngredient.pregnancySafety}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs pt-2">
                  {selectedIngredient.phRange && (
                    <div className="px-3 py-1 bg-gray-50 dark:bg-slate-800 rounded-lg text-gray-600 dark:text-gray-350 font-mono">
                      <span className="font-semibold text-gray-500 dark:text-gray-400">pH level:</span> {selectedIngredient.phRange}
                    </div>
                  )}
                  <div className="px-3 py-1 bg-gray-50 dark:bg-slate-800 rounded-lg text-gray-600 dark:text-gray-350 font-mono">
                    <span className="font-semibold text-gray-500 dark:text-gray-400">Usage schedule:</span> {selectedIngredient.dayNight}
                  </div>
                  <div className="px-3 py-1 bg-gray-50 dark:bg-slate-800 rounded-lg text-gray-600 dark:text-gray-350 font-mono">
                    <span className="font-semibold text-gray-500 dark:text-gray-400">Frequency:</span> {selectedIngredient.usageFrequency}
                  </div>
                </div>
              </div>

              {/* Benefits list */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-450 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-brand-500 dark:text-indigo-400" />
                  Primary Benefits
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedIngredient.benefits.map((benefit, i) => (
                    <div key={i} className="p-3 bg-brand-50/20 dark:bg-indigo-950/10 border border-brand-100/60 dark:border-indigo-900/40 rounded-xl flex items-start gap-2.5 text-xs">
                      <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-350 leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Side effects list */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-450 uppercase tracking-wider flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Potential Side Effects & Adaptation
                </h4>
                <div className="p-4 bg-amber-50/10 dark:bg-amber-950/5 border border-amber-100 dark:border-amber-900/40 rounded-xl space-y-2 text-xs text-gray-700 dark:text-gray-350 leading-relaxed">
                  <p className="font-semibold text-amber-900 dark:text-amber-400 mb-1">Common skin adaptations:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    {selectedIngredient.sideEffects.map((side, i) => (
                      <li key={i}>{side}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Layering & Conflicts rule */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-450 uppercase tracking-wider flex items-center gap-1">
                  <ArrowRightLeft className="h-4 w-4 text-brand-500 dark:text-indigo-400" />
                  Chemical Compatibility & Layering Rules
                </h4>
                <div className="p-5 bg-brand-50/10 dark:bg-indigo-950/10 border border-brand-100 dark:border-indigo-900/30 rounded-2xl space-y-4 text-xs">
                  <p className="text-gray-600 dark:text-gray-450 leading-relaxed italic">
                    "{selectedIngredient.layeringRules.explanation}"
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-brand-100 dark:border-slate-800">
                    <div className="space-y-1.5">
                      <span className="font-semibold text-emerald-800 dark:text-emerald-400 uppercase text-[10px] block tracking-wider">Synergizes with:</span>
                      <p className="font-mono text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                        {selectedIngredient.layeringRules.combineWith.length > 0 
                          ? selectedIngredient.layeringRules.combineWith.join(', ') 
                          : 'Highly compatible, fits most gentle formulas.'}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="font-semibold text-rose-800 dark:text-rose-400 uppercase text-[10px] block tracking-wider">DO NOT layer with:</span>
                      <p className="font-mono text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                        {selectedIngredient.layeringRules.avoidWith.length > 0 
                          ? selectedIngredient.layeringRules.avoidWith.join(', ') 
                          : 'No critical conflicts identified.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Skins & Concerns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="font-semibold text-gray-500 dark:text-gray-400 block mb-2">COMPATIBLE SKIN TYPES</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedIngredient.skinTypes.map((type, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-md font-medium text-[10px]">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-gray-500 dark:text-gray-400 block mb-2">PRIMARY TARGET CONCERNS</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedIngredient.concerns.map((con, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-md font-medium text-[10px]">
                        {con}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full bg-white dark:bg-slate-900 rounded-3xl border border-brand-200 dark:border-slate-800 p-8 shadow-sm flex items-center justify-center text-center text-gray-400 dark:text-gray-500 text-sm">
              Select an active skincare ingredient from the directory to examine its scientific characteristics.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
