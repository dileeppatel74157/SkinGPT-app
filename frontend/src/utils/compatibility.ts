import { CabinetItem } from '../types';

export interface CompatibilityReport {
  conflicts: {
    severity: 'high' | 'warning';
    title: string;
    description: string;
    affectedProducts: string[];
  }[];
  duplicates: {
    active: string;
    description: string;
    affectedProducts: string[];
  }[];
  layeringAdvice: {
    morning: {
      order: string[];
      tips: string[];
    };
    evening: {
      order: string[];
      tips: string[];
    };
  };
  routineOk: boolean;
}

export function checkRoutineCompatibility(items: CabinetItem[]): CompatibilityReport {
  const conflicts: CompatibilityReport['conflicts'] = [];
  const duplicates: CompatibilityReport['duplicates'] = [];
  
  // Track active ingredients across products
  const morningActives: { [active: string]: string[] } = {};
  const eveningActives: { [active: string]: string[] } = {};
  
  // Categorize active ingredients
  items.forEach(item => {
    const actives = item.activeIngredients.map(a => a.toLowerCase().trim());
    
    if (item.useInMorning) {
      actives.forEach(act => {
        if (!morningActives[act]) morningActives[act] = [];
        morningActives[act].push(`${item.brand} ${item.name}`);
      });
    }
    
    if (item.useInEvening) {
      actives.forEach(act => {
        if (!eveningActives[act]) eveningActives[act] = [];
        eveningActives[act].push(`${item.brand} ${item.name}`);
      });
    }
  });

  // Helper to standardise active names for matching
  const hasActive = (activesList: typeof morningActives, name: string) => {
    return Object.keys(activesList).some(k => k.includes(name.toLowerCase()));
  };

  const getProductsWithActive = (activesList: typeof morningActives, name: string): string[] => {
    const matchedKey = Object.keys(activesList).find(k => k.includes(name.toLowerCase()));
    return matchedKey ? activesList[matchedKey] : [];
  };

  // Check 1: Duplicate Actives
  const checkDuplicatesForTimeOfDay = (activesList: typeof morningActives, timeLabel: string) => {
    Object.entries(activesList).forEach(([active, products]) => {
      if (products.length > 1) {
        // We have duplicate active ingredients in the same routine
        const activeName = active.charAt(0).toUpperCase() + active.slice(1);
        const alreadyAdded = duplicates.some(d => d.active.toLowerCase() === active.toLowerCase());
        
        if (!alreadyAdded) {
          duplicates.push({
            active: activeName,
            description: `You are using multiple products containing ${activeName} in your ${timeLabel} routine. This might over-treat the skin and cause redness or barrier peeling.`,
            affectedProducts: products
          });
        }
      }
    });
  };

  checkDuplicatesForTimeOfDay(morningActives, 'morning');
  checkDuplicatesForTimeOfDay(eveningActives, 'evening');

  // Check 2: Strong Conflicts in the same routine
  // Rules:
  // - Retinol + AHA (Glycolic Acid, lactic, etc) / BHA (Salicylic Acid) in the same routine
  // - Retinol + Benzoyl Peroxide
  // - Vitamin C + AHA/BHA (unless formulated together, but in separate products it causes excessive peeling)
  // - Retinol + Vitamin C (Vitamin C works best at pH 2.5-3.5, Retinol at pH 5.5+. Mixing them reduces efficacy and causes high irritation)

  const checkConflictsForTimeOfDay = (activesList: typeof morningActives, timeLabel: string) => {
    const hasRetinol = hasActive(activesList, 'retinol');
    const hasBha = hasActive(activesList, 'salicylic acid') || hasActive(activesList, 'bha');
    const hasAha = hasActive(activesList, 'glycolic acid') || hasActive(activesList, 'aha');
    const hasBp = hasActive(activesList, 'benzoyl peroxide');
    const hasVitC = hasActive(activesList, 'ascorbic acid') || hasActive(activesList, 'vitamin c');

    if (hasRetinol && (hasBha || hasAha)) {
      const retinolProds = getProductsWithActive(activesList, 'retinol');
      const acidProds = [...getProductsWithActive(activesList, 'salicylic acid'), ...getProductsWithActive(activesList, 'glycolic acid')];
      conflicts.push({
        severity: 'high',
        title: `Retinol + Chemical Exfoliants (${timeLabel.toUpperCase()})`,
        description: `Using Retinol together with AHAs or BHAs in your ${timeLabel} routine is highly irritating. They both accelerate cell turnover in different ways and will likely compromise your moisture barrier.`,
        affectedProducts: [...retinolProds, ...acidProds]
      });
    }

    if (hasRetinol && hasBp) {
      const retinolProds = getProductsWithActive(activesList, 'retinol');
      const bpProds = getProductsWithActive(activesList, 'benzoyl peroxide');
      conflicts.push({
        severity: 'high',
        title: `Retinol + Benzoyl Peroxide (${timeLabel.toUpperCase()})`,
        description: `Benzoyl Peroxide can oxidize and deactivate Retinol molecules when layered directly. This makes both products less effective and increases dryness.`,
        affectedProducts: [...retinolProds, ...bpProds]
      });
    }

    if (hasRetinol && hasVitC) {
      const retinolProds = getProductsWithActive(activesList, 'retinol');
      const vitCProds = getProductsWithActive(activesList, 'vitamin c') || getProductsWithActive(activesList, 'ascorbic acid');
      conflicts.push({
        severity: 'warning',
        title: `Retinol + Vitamin C (${timeLabel.toUpperCase()})`,
        description: `Vitamin C (L-Ascorbic Acid) requires a low pH to penetrate, while Retinol requires a higher pH. Layering them together makes them less effective. Move Vitamin C to the Morning and Retinol to the Night.`,
        affectedProducts: [...retinolProds, ...vitCProds]
      });
    }

    if (hasVitC && (hasAha || hasBha)) {
      const vitCProds = getProductsWithActive(activesList, 'vitamin c') || getProductsWithActive(activesList, 'ascorbic acid');
      const acidProds = [...getProductsWithActive(activesList, 'salicylic acid'), ...getProductsWithActive(activesList, 'glycolic acid')];
      conflicts.push({
        severity: 'warning',
        title: `Vitamin C + Chemical Acids (${timeLabel.toUpperCase()})`,
        description: `Both Vitamin C and exfoliating acids (AHAs/BHAs) are acidic. Combining them in the same ${timeLabel} routine can overwhelm sensitive skin and cause redness or stinging.`,
        affectedProducts: [...vitCProds, ...acidProds]
      });
    }
  };

  checkConflictsForTimeOfDay(morningActives, 'morning');
  checkConflictsForTimeOfDay(eveningActives, 'evening');

  // Check 3: Morning Sunscreen verification if retinol is used in the cabinet
  const hasRetinolInCabinet = items.some(item => item.activeIngredients.some(act => act.toLowerCase().includes('retinol')));
  const hasAhaInCabinet = items.some(item => item.activeIngredients.some(act => act.toLowerCase().includes('glycolic') || act.toLowerCase().includes('aha')));
  const hasSunscreenInMorning = items.some(item => item.useInMorning && item.category.toLowerCase() === 'sunscreen');

  if ((hasRetinolInCabinet || hasAhaInCabinet) && !hasSunscreenInMorning) {
    conflicts.push({
      severity: 'high',
      title: 'Sunscreen Missing in Morning Routine',
      description: 'You are using retinoids or exfoliating acids which significantly increase skin photosensitivity (sunburn risk). A morning sunscreen is critical to protect your skin barrier and prevent hyperpigmentation.',
      affectedProducts: items
        .filter(i => i.activeIngredients.some(act => act.toLowerCase().includes('retinol') || act.toLowerCase().includes('glycolic')))
        .map(i => `${i.brand} ${i.name}`)
    });
  }

  // Layering order rules:
  // Thinnest to thickest: Cleanser -> Toner -> Serum -> Treatment -> Moisturizer -> Sunscreen
  const categoryWeights: { [category: string]: number } = {
    'cleanser': 1,
    'toner': 2,
    'essence': 3,
    'serum': 4,
    'treatment': 5,
    'moisturizer': 6,
    'oil': 7,
    'sunscreen': 8
  };

  const getStepOrder = (timeFilter: 'morning' | 'evening') => {
    const routineItems = items.filter(item => timeFilter === 'morning' ? item.useInMorning : item.useInEvening);
    const sorted = [...routineItems].sort((a, b) => {
      const wA = categoryWeights[a.category.toLowerCase()] || 4;
      const wB = categoryWeights[b.category.toLowerCase()] || 4;
      return wA - wB;
    });
    return sorted.map(item => `${item.brand} ${item.name} (${item.category})`);
  };

  // Generate morning and evening tips
  const morningTips: string[] = ["Always apply your sunscreen as the absolute final step of your morning routine."];
  const eveningTips: string[] = ["Apply thicker moisturizing creams at the end to seal in watery serums."];

  if (hasRetinolInCabinet) {
    eveningTips.push("Apply Retinol on completely dry skin to minimize its irritation potential.");
  }
  if (items.some(i => i.useInMorning && i.activeIngredients.some(act => act.toLowerCase().includes('vitamin c')))) {
    morningTips.push("Vitamin C boosts your sunscreen's efficacy against UV free radicals. Excellent morning pairing!");
  }
  if (items.some(i => i.activeIngredients.some(act => act.toLowerCase().includes('hyaluronic')))) {
    morningTips.push("Apply Hyaluronic Acid to slightly damp skin so it can draw moisture deep into the epidermal layers.");
  }

  return {
    conflicts,
    duplicates,
    layeringAdvice: {
      morning: {
        order: getStepOrder('morning'),
        tips: morningTips
      },
      evening: {
        order: getStepOrder('evening'),
        tips: eveningTips
      }
    },
    routineOk: conflicts.length === 0
  };
}
