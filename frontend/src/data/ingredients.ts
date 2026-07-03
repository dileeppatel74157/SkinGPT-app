import { Ingredient } from '../types';

export const INGREDIENTS_DATABASE: Ingredient[] = [
  {
    inciName: "Retinol",
    commonName: "Retinol (Vitamin A)",
    benefits: [
      "Accelerates cell turnover",
      "Stimulates collagen production",
      "Reduces fine lines and wrinkles",
      "Improves skin texture",
      "Fades hyperpigmentation"
    ],
    sideEffects: [
      "Dryness",
      "Peeling and flaking",
      "Redness",
      "Increased sun sensitivity"
    ],
    pregnancySafety: "Avoid",
    skinTypes: ["Normal", "Dry", "Oily", "Combination"],
    concerns: ["Wrinkles", "Texture", "Pigmentation", "Acne"],
    layeringRules: {
      combineWith: ["Hyaluronic Acid", "Niacinamide", "Ceramides", "Panthenol"],
      avoidWith: ["Salicylic Acid", "Glycolic Acid", "Benzoyl Peroxide", "Vitamin C (L-Ascorbic Acid)"],
      explanation: "Avoid layering Retinol with strong acids (AHAs/BHAs) or Benzoyl Peroxide in the exact same routine step as it can cause extreme irritation and compromise the skin barrier. Pair it instead with hydrators like Niacinamide and Ceramides to soothe dryness."
    },
    usageFrequency: "2-4 times a week at night",
    dayNight: "Night",
    phRange: "5.0 - 6.0"
  },
  {
    inciName: "Salicylic Acid",
    commonName: "Salicylic Acid (BHA)",
    benefits: [
      "Exfoliates inside pores",
      "Dissolves sebum and oil",
      "Reduces blackheads and whiteheads",
      "Calms active acne inflammation"
    ],
    sideEffects: [
      "Mild purging",
      "Dryness",
      "Slight stinging or tingling"
    ],
    pregnancySafety: "Consult Doctor",
    skinTypes: ["Oily", "Combination"],
    concerns: ["Acne", "Pores", "Oiliness"],
    layeringRules: {
      combineWith: ["Niacinamide", "Hyaluronic Acid", "Centella Asiatica (Cica)"],
      avoidWith: ["Retinol", "Glycolic Acid", "Vitamin C"],
      explanation: "Salicylic Acid is oil-soluble and penetrates deep into pores. Avoid mixing it with other strong exfoliators or Retinol to prevent barrier stripping. Hydrate immediately after use."
    },
    usageFrequency: "2-3 times a week",
    dayNight: "Both",
    phRange: "3.0 - 4.0"
  },
  {
    inciName: "Niacinamide",
    commonName: "Niacinamide (Vitamin B3)",
    benefits: [
      "Strengthens the skin barrier",
      "Regulates sebum production",
      "Reduces redness and inflammation",
      "Fades dark spots and hyperpigmentation",
      "Minimizes pore appearance"
    ],
    sideEffects: [
      "Extremely rare flushing or irritation at very high percentages (>10%)"
    ],
    pregnancySafety: "Safe",
    skinTypes: ["Oily", "Dry", "Combination", "Sensitive", "Normal"],
    concerns: ["Oiliness", "Pores", "Redness", "Pigmentation", "Acne"],
    layeringRules: {
      combineWith: ["Retinol", "Salicylic Acid", "Hyaluronic Acid", "Vitamin C", "Ceramides"],
      avoidWith: [],
      explanation: "Niacinamide is highly stable and versatile. It acts as an anti-inflammatory cushion, making it highly beneficial when paired with active ingredients like Retinol and BHAs to reduce potential irritation."
    },
    usageFrequency: "Daily morning and night",
    dayNight: "Both",
    phRange: "5.5 - 6.5"
  },
  {
    inciName: "L-Ascorbic Acid",
    commonName: "Vitamin C (L-Ascorbic Acid)",
    benefits: [
      "Powerful antioxidant protection",
      "Fights free-radical environmental damage",
      "Brightens overall skin tone",
      "Boosts collagen synthesis",
      "Fades sun damage and dark spots"
    ],
    sideEffects: [
      "Slight stinging",
      "Oxidizes easily if exposed to light and air"
    ],
    pregnancySafety: "Safe",
    skinTypes: ["Normal", "Dry", "Oily", "Combination"],
    concerns: ["Pigmentation", "Wrinkles", "Texture"],
    layeringRules: {
      combineWith: ["Ferulic Acid", "Vitamin E", "Hyaluronic Acid"],
      avoidWith: ["Retinol", "Salicylic Acid", "Benzoyl Peroxide"],
      explanation: "Pure Vitamin C is highly acidic and unstable. Ferulic acid and Vitamin E stabilize it. Avoid combining it directly with Retinol (which works at a higher pH) or Benzoyl Peroxide (which oxidizes Vitamin C, rendering it useless)."
    },
    usageFrequency: "Daily in the morning",
    dayNight: "Day",
    phRange: "2.5 - 3.5"
  },
  {
    inciName: "Hyaluronic Acid",
    commonName: "Hyaluronic Acid",
    benefits: [
      "Draws moisture deep into the skin",
      "Plumps fine lines instantly",
      "Soothes dehydrated skin",
      "Accelerates barrier healing"
    ],
    sideEffects: [
      "Can draw moisture out of the skin if applied in an extremely dry environment without a sealing moisturizer"
    ],
    pregnancySafety: "Safe",
    skinTypes: ["Dry", "Oily", "Combination", "Sensitive", "Normal"],
    concerns: ["Dryness", "Wrinkles", "Redness"],
    layeringRules: {
      combineWith: ["All Skincare Actives"],
      avoidWith: [],
      explanation: "Hyaluronic Acid is a gentle humectant compatible with all ingredients. Apply to damp skin, then lock in with a moisturizer."
    },
    usageFrequency: "Daily morning and night",
    dayNight: "Both",
    phRange: "5.0 - 7.0"
  },
  {
    inciName: "Glycolic Acid",
    commonName: "Glycolic Acid (AHA)",
    benefits: [
      "Exfoliates the surface skin layer",
      "Dissolves dead skin cell bonds",
      "Reveals bright, glowing skin",
      "Aids in fading superficial pigmentation",
      "Smoothes rough, uneven surface texture"
    ],
    sideEffects: [
      "Tingling or burning",
      "Photosensitivity (increases sunburn risk)",
      "Redness if overused"
    ],
    pregnancySafety: "Safe",
    skinTypes: ["Normal", "Dry", "Combination"],
    concerns: ["Texture", "Pigmentation", "Wrinkles"],
    layeringRules: {
      combineWith: ["Hyaluronic Acid", "Ceramides", "Niacinamide"],
      avoidWith: ["Retinol", "Salicylic Acid", "Benzoyl Peroxide"],
      explanation: "An AHA that provides immediate surface resurfacing. Do not layer with other potent exfoliants or Retinol. Always wear SPF the morning after using Glycolic Acid."
    },
    usageFrequency: "1-3 times a week at night",
    dayNight: "Night",
    phRange: "3.5 - 4.2"
  },
  {
    inciName: "Ceramides",
    commonName: "Ceramides",
    benefits: [
      "Rebuilds and protects the lipid barrier",
      "Prevents transepidermal water loss (TEWL)",
      "Soothes eczema and dry patches",
      "Enhances long-term hydration"
    ],
    sideEffects: [
      "None"
    ],
    pregnancySafety: "Safe",
    skinTypes: ["Dry", "Sensitive", "Normal", "Combination", "Oily"],
    concerns: ["Dryness", "Redness", "Texture"],
    layeringRules: {
      combineWith: ["Retinol", "AHAs", "BHAs", "Vitamin C", "Hyaluronic Acid"],
      avoidWith: [],
      explanation: "Ceramides are natural skin lipids. They are extremely safe and work as the ultimate calming companion to heavy active treatments like Retinol or chemical exfoliants."
    },
    usageFrequency: "Daily morning and night",
    dayNight: "Both",
    phRange: "5.5 - 6.5"
  },
  {
    inciName: "Centella Asiatica",
    commonName: "Centella Asiatica (Cica / Tiger Grass)",
    benefits: [
      "Powerfully reduces skin redness",
      "Speeds up acne wound recovery",
      "Soothes hot, inflamed, or sensitive skin",
      "Antioxidant-rich protection"
    ],
    sideEffects: [
      "Extremely rare localized allergic reaction"
    ],
    pregnancySafety: "Safe",
    skinTypes: ["Sensitive", "Oily", "Combination", "Dry", "Normal"],
    concerns: ["Redness", "Acne", "Dryness"],
    layeringRules: {
      combineWith: ["Salicylic Acid", "Retinol", "Hyaluronic Acid", "Niacinamide"],
      avoidWith: [],
      explanation: "Cica is a magical botanical extract that relieves irritation. It is the perfect calming countermeasure for active breakouts, post-chemical peel skin, or Retinol adjustment periods."
    },
    usageFrequency: "Daily morning and night",
    dayNight: "Both",
    phRange: "5.0 - 7.0"
  },
  {
    inciName: "Azelaic Acid",
    commonName: "Azelaic Acid",
    benefits: [
      "Fades persistent post-inflammatory erythema (acne marks)",
      "Soothes rosacea and diffuses facial redness",
      "Mildly exfoliates and reduces comedones",
      "Antibacterial properties against acne-causing bacteria"
    ],
    sideEffects: [
      "Temporary itching or stinging upon application"
    ],
    pregnancySafety: "Safe",
    skinTypes: ["Sensitive", "Oily", "Combination", "Dry", "Normal"],
    concerns: ["Redness", "Pigmentation", "Acne"],
    layeringRules: {
      combineWith: ["Salicylic Acid", "Niacinamide", "Hyaluronic Acid", "Ceramides"],
      avoidWith: ["Retinol (in sensitive skin - layer carefully)"],
      explanation: "Azelaic Acid is incredibly well-tolerated and is one of the few acne-and-redness treatments considered completely safe for pregnancy. It is excellent for reducing both brown spots and red vascular marks."
    },
    usageFrequency: "Once or twice daily",
    dayNight: "Both",
    phRange: "4.0 - 4.9"
  },
  {
    inciName: "Benzoyl Peroxide",
    commonName: "Benzoyl Peroxide",
    benefits: [
      "Kills P. acnes bacteria inside the pore",
      "Reduces inflammatory pustules and pimples",
      "Clears blocked follicular pathways"
    ],
    sideEffects: [
      "Dryness and scaling",
      "Can bleach colored fabrics/towels on contact",
      "Redness and skin irritation"
    ],
    pregnancySafety: "Avoid",
    skinTypes: ["Oily", "Combination"],
    concerns: ["Acne"],
    layeringRules: {
      combineWith: ["Salicylic Acid (in rotation)", "Hyaluronic Acid", "Ceramides"],
      avoidWith: ["Retinol", "Vitamin C"],
      explanation: "Benzoyl peroxide is a potent oxidative agent. Avoid layering it simultaneously with Vitamin C (it oxidizes it) or Retinol (it degrades it). Use on alternate nights or separate steps."
    },
    usageFrequency: "Once daily, or as a spot treatment",
    dayNight: "Both",
    phRange: "4.5 - 6.0"
  }
];
