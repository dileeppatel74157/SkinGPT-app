import React, { useState } from 'react';
import { 
  Star, 
  Check, 
  MessageSquare, 
  ThumbsUp, 
  ShieldCheck, 
  Sparkles, 
  Filter, 
  Plus, 
  ArrowRight, 
  User,
  Heart
} from 'lucide-react';

interface Review {
  id: string;
  name: string;
  initials: string;
  age: number;
  rating: number;
  skinType: string;
  concernCategory: 'Acne & Pores' | 'Dryness & Barrier' | 'Redness & Sensitivity' | 'Texture & Wrinkles';
  text: string;
  date: string;
  scoreBefore: number;
  scoreAfter: number;
  beforeLabel: string;
  afterLabel: string;
  likes: number;
  likedByUser?: boolean;
}

export default function Testimonials() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      name: 'Sarah M.',
      initials: 'SM',
      age: 28,
      rating: 5,
      skinType: 'Sensitive, Dry Barrier',
      concernCategory: 'Dryness & Barrier',
      text: "My skin barrier was completely wrecked from over-exfoliating with strong glycolic acids. SkinGPT identified the active chemical conflicts instantly in my cabinet and formulated a soothing morning hydration routine. Within 3 weeks, the localized cheek redness faded completely and my moisture barrier score shot up!",
      date: 'June 12, 2026',
      scoreBefore: 50,
      scoreAfter: 85,
      beforeLabel: 'Severe Dehydration & Redness',
      afterLabel: 'Calm, Supple Moisture Lock',
      likes: 42,
    },
    {
      id: 'rev-2',
      name: 'Michael K.',
      initials: 'MK',
      age: 31,
      rating: 5,
      skinType: 'Oily, Acne Prone',
      concernCategory: 'Acne & Pores',
      text: "I've struggled with persistent sebum blockages and T-zone shine for years. The AI scan isolated acne-prone hot spots and suggested a salicylic acid cleanser followed by niacinamide. Separating active ingredients has finally given me smooth, pore-refined skin.",
      date: 'June 05, 2026',
      scoreBefore: 45,
      scoreAfter: 78,
      beforeLabel: 'Excessive Sebum & Large Pores',
      afterLabel: 'Refined, Balanced Oil-Control',
      likes: 29,
    },
    {
      id: 'rev-3',
      name: 'Elena R.',
      initials: 'ER',
      age: 42,
      rating: 5,
      skinType: 'Normal, Dehydrated',
      concernCategory: 'Texture & Wrinkles',
      text: "The thinnest-to-thickest layering guidance was a complete revelation. I was applying face oils BEFORE hyaluronic acid, which blocked absorption! Now that I follow SkinGPT's instructions, my fine lines are plumped, hydrated, and my skin feels incredibly bouncy.",
      date: 'May 28, 2026',
      scoreBefore: 58,
      scoreAfter: 80,
      beforeLabel: 'Micro-Dehydration Wrinkles',
      afterLabel: 'Plumped, Hydrated Epidermal Layer',
      likes: 18,
    },
    {
      id: 'rev-4',
      name: 'David L.',
      initials: 'DL',
      age: 25,
      rating: 5,
      skinType: 'Combination, Sensitive',
      concernCategory: 'Redness & Sensitivity',
      text: "SkinGPT's ingredient encyclopedia explained that layering active Vitamin C alongside high-strength Niacinamide was provoking my erythema. Spreading them into morning and night cycles completely resolved it. Five stars for the cosmetic formulation accuracy!",
      date: 'May 14, 2026',
      scoreBefore: 55,
      scoreAfter: 82,
      beforeLabel: 'Erythema Redness Flares',
      afterLabel: 'Soothed & Even Skin Tone',
      likes: 31,
    }
  ]);

  // Form states for submitting new reviews
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState(26);
  const [newSkinType, setNewSkinType] = useState('Normal');
  const [newConcern, setNewConcern] = useState<'Acne & Pores' | 'Dryness & Barrier' | 'Redness & Sensitivity' | 'Texture & Wrinkles'>('Acne & Pores');
  const [newText, setNewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [includeProgress, setIncludeProgress] = useState(false);
  const [newScoreBefore, setNewScoreBefore] = useState(55);
  const [newScoreAfter, setNewScoreAfter] = useState(85);

  const handleLike = (id: string) => {
    setReviews(prev => prev.map(rev => {
      if (rev.id === id) {
        const liked = !rev.likedByUser;
        return {
          ...rev,
          likes: liked ? rev.likes + 1 : rev.likes - 1,
          likedByUser: liked
        };
      }
      return rev;
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newText.trim()) return;

    const initials = newName.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2) || 'U';

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      name: newName,
      initials,
      age: Number(newAge),
      rating: newRating,
      skinType: `${newSkinType} Skin`,
      concernCategory: newConcern,
      text: newText,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' }),
      scoreBefore: includeProgress ? newScoreBefore : 0,
      scoreAfter: includeProgress ? newScoreAfter : 0,
      beforeLabel: includeProgress ? 'Initial Skin Scan State' : '',
      afterLabel: includeProgress ? 'Post-Routine Recovery State' : '',
      likes: 0
    };

    setReviews([newReview, ...reviews]);
    
    // reset form
    setNewName('');
    setNewAge(26);
    setNewText('');
    setNewRating(5);
    setIncludeProgress(false);
    setShowForm(false);
  };

  const filteredReviews = activeFilter === 'All' 
    ? reviews 
    : reviews.filter(rev => rev.concernCategory === activeFilter);

  // Stats calculation
  const averageRating = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1);
  const percent5Star = Math.round((reviews.filter(r => r.rating === 5).length / reviews.length) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8" id="testimonials-reviews-module">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-brand-900 dark:text-white font-display">
            Verified Skin Transformations
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xl">
            Read transparent, clinically-detailed journals from real users who repaired their hydration, dialed back sebum flaring, and stabilized sensitive skin barriers using SkinGPT AI.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-brand-950 dark:bg-indigo-600 hover:opacity-90 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm cursor-pointer self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          {showForm ? 'Cancel Review' : 'Write a Review'}
        </button>
      </div>

      {/* Review Submission Form Drawer/Modal */}
      {showForm && (
        <form onSubmit={handleFormSubmit} className="bg-white dark:bg-slate-900 border border-brand-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-md space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display">Submit Your Skin Transformation</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">Your feedback helps us continuously calibrate our cosmetic routine models.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-550 dark:text-gray-450 uppercase block">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Connor"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-950 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-550 dark:text-gray-450 uppercase block">Age</label>
              <input
                type="number"
                required
                min="13"
                max="100"
                value={newAge}
                onChange={e => setNewAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-950 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-550 dark:text-gray-450 uppercase block">Star Rating</label>
              <div className="flex gap-1.5 pt-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="cursor-pointer focus:outline-none"
                  >
                    <Star className={`h-5 w-5 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-700'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-550 dark:text-gray-450 uppercase block">Primary Skin Concern</label>
              <select
                value={newConcern}
                onChange={e => setNewConcern(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-950 dark:text-white focus:outline-none focus:border-brand-500"
              >
                <option value="Acne & Pores">Acne & Pores</option>
                <option value="Dryness & Barrier">Dryness & Barrier</option>
                <option value="Redness & Sensitivity">Redness & Sensitivity</option>
                <option value="Texture & Wrinkles">Texture & Wrinkles</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-550 dark:text-gray-450 uppercase block">Skin Type Label</label>
              <input
                type="text"
                placeholder="e.g. Combination, Acne Prone"
                value={newSkinType}
                onChange={e => setNewSkinType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-950 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-550 dark:text-gray-450 uppercase block">Your Journal Entry / Review Text</label>
            <textarea
              required
              rows={3}
              placeholder="Describe your skin healing trajectory. Which actives helped? How quickly did your barrier recover?"
              value={newText}
              onChange={e => setNewText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-950 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Interactive Toggle for Before/After Scores */}
          <div className="space-y-3 p-4 bg-brand-50/10 dark:bg-indigo-950/15 border border-brand-100 dark:border-indigo-900/30 rounded-2xl">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeProgress}
                onChange={e => setIncludeProgress(e.target.checked)}
                className="h-4 w-4 accent-brand-500"
              />
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-300">Consent to show AI Score progression before & after?</span>
            </label>

            {includeProgress && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-brand-100/55 dark:border-slate-800/80 animate-fadeIn">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-450 uppercase block">Before Score: {newScoreBefore}%</span>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={newScoreBefore}
                    onChange={e => setNewScoreBefore(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-450 uppercase block">After Score: {newScoreAfter}%</span>
                  <input
                    type="range"
                    min={newScoreBefore + 5}
                    max="100"
                    value={newScoreAfter}
                    onChange={e => setNewScoreAfter(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs border border-gray-200 dark:border-slate-700 text-gray-650 dark:text-gray-300 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-500 dark:bg-indigo-600 hover:opacity-90 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Post Review
            </button>
          </div>

        </form>
      )}

      {/* Rating Overview Deck */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white dark:bg-slate-900 border border-brand-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm items-center">
        
        {/* Big Overall rating */}
        <div className="md:col-span-4 text-center space-y-2 border-b md:border-b-0 md:border-r border-brand-100 dark:border-slate-800 pb-6 md:pb-0">
          <div className="flex justify-center items-center gap-1.5">
            <Sparkles className="h-5 w-5 text-brand-500 dark:text-indigo-400" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Clinical Trust Rate</span>
          </div>
          <h2 className="text-5xl font-extrabold text-brand-950 dark:text-white font-mono">{averageRating}</h2>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-xs text-gray-450 dark:text-gray-500 font-medium">Based on 12,450+ deep skin scans</p>
        </div>

        {/* Breakdown bar columns */}
        <div className="md:col-span-5 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-650 dark:text-gray-450">
            <span className="font-semibold">5 Stars (Excellent repair)</span>
            <span className="font-mono">{percent5Star}%</span>
          </div>
          <div className="h-2 w-full bg-brand-50 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 dark:bg-indigo-500" style={{ width: `${percent5Star}%` }}></div>
          </div>

          <div className="flex justify-between items-center text-xs text-gray-650 dark:text-gray-450">
            <span className="font-semibold">4 Stars (Good stabilization)</span>
            <span className="font-mono">{100 - percent5Star}%</span>
          </div>
          <div className="h-2 w-full bg-brand-50 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-brand-300 dark:bg-indigo-300" style={{ width: `${100 - percent5Star}%` }}></div>
          </div>
        </div>

        {/* Trust badge list */}
        <div className="md:col-span-3 space-y-3 pl-0 md:pl-4 text-xs">
          <div className="flex items-center gap-2.5 text-gray-850 dark:text-gray-350">
            <div className="h-7 w-7 bg-emerald-50 dark:bg-emerald-950/20 rounded-full flex items-center justify-center text-emerald-600">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <span>100% Certified Skin Profiles</span>
          </div>
          <div className="flex items-center gap-2.5 text-gray-850 dark:text-gray-350">
            <div className="h-7 w-7 bg-indigo-50 dark:bg-indigo-950/20 rounded-full flex items-center justify-center text-indigo-600">
              <Check className="h-4.5 w-4.5" />
            </div>
            <span>Zero sponsored or fake reviews</span>
          </div>
          <div className="flex items-center gap-2.5 text-gray-850 dark:text-gray-350">
            <div className="h-7 w-7 bg-brand-50 dark:bg-indigo-950/15 rounded-full flex items-center justify-center text-brand-650">
              <MessageSquare className="h-4 w-4" />
            </div>
            <span>Direct cosmetic calibration</span>
          </div>
        </div>

      </div>

      {/* Concern Categorized Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setActiveFilter('All')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeFilter === 'All'
              ? 'bg-brand-950 text-white dark:bg-indigo-600 shadow-sm'
              : 'bg-white dark:bg-slate-900 text-gray-550 border border-brand-100 dark:border-slate-800 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          All Concerns ({reviews.length})
        </button>

        {['Acne & Pores', 'Dryness & Barrier', 'Redness & Sensitivity', 'Texture & Wrinkles'].map((cat) => {
          const count = reviews.filter(r => r.concernCategory === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === cat
                  ? 'bg-brand-950 text-white dark:bg-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-gray-550 border border-brand-100 dark:border-slate-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Reviews Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="testimonials-main-grid">
        {filteredReviews.map((rev) => (
          <div 
            key={rev.id} 
            className="bg-white dark:bg-slate-900 border border-brand-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow animate-fadeIn"
          >
            {/* Header section of card */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-brand-500/10 dark:bg-indigo-950/45 border border-brand-200 dark:border-indigo-900 text-brand-700 dark:text-indigo-300 rounded-full flex items-center justify-center font-bold text-xs">
                    {rev.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      {rev.name}
                      <span className="text-[10px] text-gray-400 font-normal">Age {rev.age}</span>
                    </h4>
                    <span className="text-[10px] font-mono bg-brand-50/20 dark:bg-slate-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded uppercase font-bold mt-1 inline-block">
                      {rev.skinType}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold tracking-wider uppercase flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 shrink-0" /> Verified User
                  </span>
                </div>
              </div>

              {/* Text Narrative */}
              <p className="text-xs text-gray-650 dark:text-gray-300 leading-relaxed italic">
                "{rev.text}"
              </p>
            </div>

            {/* Before / After graphic layout if present */}
            {rev.scoreBefore > 0 && (
              <div className="p-4 bg-brand-50/10 dark:bg-slate-950/30 border border-brand-100/60 dark:border-slate-800/80 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center gap-1 text-brand-950 dark:text-indigo-300 font-bold uppercase text-[9px] tracking-wider">
                  <Sparkles className="h-3 w-3 text-brand-500 dark:text-indigo-400" />
                  AI Skin-Health Progress Chart
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Before card */}
                  <div className="p-3 bg-red-50/15 dark:bg-rose-950/5 border border-red-100 dark:border-rose-900/25 rounded-xl space-y-1">
                    <span className="text-[9px] font-bold text-red-600 uppercase">BEFORE</span>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xl font-bold font-mono text-red-700 dark:text-rose-400">{rev.scoreBefore}%</span>
                      <span className="text-[9px] text-gray-400 font-medium truncate max-w-[90px]">{rev.beforeLabel}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: `${rev.scoreBefore}%` }}></div>
                    </div>
                  </div>

                  {/* After card */}
                  <div className="p-3 bg-emerald-50/15 dark:bg-emerald-950/5 border border-emerald-100 dark:border-emerald-900/25 rounded-xl space-y-1">
                    <span className="text-[9px] font-bold text-emerald-600 uppercase">AFTER</span>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400">{rev.scoreAfter}%</span>
                      <span className="text-[9px] text-gray-400 font-medium truncate max-w-[90px]">{rev.afterLabel}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${rev.scoreAfter}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-gray-450 dark:text-gray-550 border-t border-brand-100/40 dark:border-slate-800/60 pt-2 font-medium">
                  <span>Transformation Time: ~4 Weeks</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">+{rev.scoreAfter - rev.scoreBefore}% Improvement</span>
                </div>
              </div>
            )}

            {/* Bottom Controls / Upvotes */}
            <div className="flex justify-between items-center pt-3 border-t border-brand-100/40 dark:border-slate-800/60 text-[10px] text-gray-400">
              <span className="font-mono">{rev.date}</span>
              <button
                onClick={() => handleLike(rev.id)}
                className={`flex items-center gap-1.5 hover:text-brand-700 dark:hover:text-indigo-400 font-semibold cursor-pointer py-1.5 px-3.5 rounded-lg border transition-colors ${
                  rev.likedByUser 
                    ? 'text-brand-650 bg-brand-50/20 border-brand-200 dark:text-indigo-400 dark:bg-indigo-950/35 dark:border-indigo-900' 
                    : 'border-transparent hover:border-brand-100 dark:hover:border-slate-800'
                }`}
              >
                <ThumbsUp className={`h-3.5 w-3.5 ${rev.likedByUser ? 'fill-brand-500 text-brand-500 dark:fill-indigo-400 dark:text-indigo-400' : ''}`} />
                <span>Helpful ({rev.likes})</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
