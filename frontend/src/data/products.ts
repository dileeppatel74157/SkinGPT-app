import { Product } from '../types';

export const PRODUCTS_DATABASE: Product[] = [
  {
    id: "prod-1",
    brand: "CeraVe",
    name: "Hydrating Facial Cleanser",
    category: "Cleanser",
    ingredients: [
      "Aqua/Water/Eau", "Glycerin", "Cetearyl Alcohol", "Peg-40 Stearate", "Stearyl Alcohol", "Potassium Phosphate", 
      "Ceramide Np", "Ceramide Ap", "Ceramide Eop", "Carbomer", "Glyceryl Stearate", "Behentrimonium Methosulfate", 
      "Sodium Lauroyl Lactylate", "Sodium Hyaluronate", "Cholesterol", "Phenoxyethanol", "Disodium Edta", 
      "Dipotassium Phosphate", "Tocopherol", "Phytosphingosine", "Xanthan Gum", "Ethylhexylglycerin"
    ],
    activeIngredients: ["Ceramides", "Hyaluronic Acid"],
    price: "$14.99",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=300&auto=format&fit=crop",
    recommendedFor: ["Dry", "Sensitive", "Normal"],
    concerns: ["Dryness", "Redness"]
  },
  {
    id: "prod-2",
    brand: "CeraVe",
    name: "Foaming Facial Cleanser",
    category: "Cleanser",
    ingredients: [
      "Aqua/Water/Eau", "Cocamidopropyl Hydroxysultaine", "Glycerin", "Sodium Lauroyl Sarcosinate", "Peg-150 Pentaerythrityl Tetrastearate", 
      "Niacinamide", "Peg-6 Caprylic/Capric Glycerides", "Sodium Methyl Cocoyl Taurate", "Propylene Glycol", "Ceramide Np", 
      "Ceramide Ap", "Ceramide Eop", "Carbomer", "Methylparaben", "Sodium Chloride", "Sodium Lauroyl Lactylate", "Cholesterol", 
      "Disodium Edta", "Propylparaben", "Citric Acid", "Tetrasodium Edta", "Hydrolyzed Hyaluronic Acid", "Phytosphingosine", "Xanthan Gum"
    ],
    activeIngredients: ["Ceramides", "Niacinamide", "Hyaluronic Acid"],
    price: "$15.49",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=300&auto=format&fit=crop",
    recommendedFor: ["Oily", "Combination", "Normal"],
    concerns: ["Oiliness", "Pores"]
  },
  {
    id: "prod-3",
    brand: "The Ordinary",
    name: "Niacinamide 10% + Zinc 1%",
    category: "Serum",
    ingredients: [
      "Aqua (Water)", "Niacinamide", "Pentylene Glycol", "Zinc Pca", "Dimethyl Isosorbide", "Tamarindus Indica Seed Gum", 
      "Xanthan Gum", "Isoceteth-20", "Ethoxydiglycol", "Phenoxyethanol", "Chlorphenesin"
    ],
    activeIngredients: ["Niacinamide", "Zinc PCA"],
    price: "$6.50",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300&auto=format&fit=crop",
    recommendedFor: ["Oily", "Combination", "Normal"],
    concerns: ["Oiliness", "Pores", "Acne", "Pigmentation"]
  },
  {
    id: "prod-4",
    brand: "The Ordinary",
    name: "Hyaluronic Acid 2% + B5",
    category: "Serum",
    ingredients: [
      "Aqua (Water)", "Sodium Hyaluronate", "Pentylene Glycol", "Propanediol", "Sodium Hyaluronate Crosspolymer", 
      "Panthenol", "Ahnfeltia Concinna Extract", "Glycerin", "Trisodium Ethylenediamine Disuccinate", "Citric Acid", 
      "Isoceteth-20", "Ethoxydiglycol", "Ethylhexylglycerin", "Hexylene Glycol", "1,2-Hexanediol", "Caprylyl Glycol"
    ],
    activeIngredients: ["Hyaluronic Acid", "Panthenol"],
    price: "$8.90",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=300&auto=format&fit=crop",
    recommendedFor: ["Dry", "Sensitive", "Oily", "Combination", "Normal"],
    concerns: ["Dryness"]
  },
  {
    id: "prod-5",
    brand: "Paula's Choice",
    name: "Skin Perfecting 2% BHA Liquid Exfoliant",
    category: "Treatment",
    ingredients: [
      "Water (Aqua)", "Methylpropanediol", "Butylene Glycol", "Salicylic Acid", "Polysorbate 20", "Camellia Oleifera (Green Tea) Leaf Extract", 
      "Sodium Hydroxide", "Tetrasodium Edta"
    ],
    activeIngredients: ["Salicylic Acid"],
    price: "$34.00",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1556229174-5e42a09e45af?q=80&w=300&auto=format&fit=crop",
    recommendedFor: ["Oily", "Combination", "Normal"],
    concerns: ["Acne", "Pores", "Oiliness", "Texture"]
  },
  {
    id: "prod-6",
    brand: "La Roche-Posay",
    name: "Effaclar Duo Dual Action Acne Treatment",
    category: "Treatment",
    ingredients: [
      "Water", "Isostearyl Neopentanoate", "Glycerin", "Benzoyl Peroxide", "Silica", "Acrylates/C10-30 Alkyl Acrylate Crosspolymer", 
      "Sodium Hydroxide", "Capryloyl Salicylic Acid", "Zinc Pca", "Pentaerythrityl Tetra-di-t-butyl Hydroxyhydrocinnamate"
    ],
    activeIngredients: ["Benzoyl Peroxide", "Salicylic Acid"],
    price: "$22.99",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=300&auto=format&fit=crop",
    recommendedFor: ["Oily", "Combination"],
    concerns: ["Acne"]
  },
  {
    id: "prod-7",
    brand: "COSRX",
    name: "Advanced Snail 96 Mucin Power Essence",
    category: "Serum",
    ingredients: [
      "Snail Secretion Filtrate", "Betaine", "Butylene Glycol", "1,2-Hexanediol", "Sodium Polyacrylate", "Sodium Hyaluronate", 
      "Panthenol", "Allantoin", "Adenosine", "Ethyl Hexanediol", "Phenoxyethanol"
    ],
    activeIngredients: ["Snail Mucin", "Hyaluronic Acid"],
    price: "$21.00",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=300&auto=format&fit=crop",
    recommendedFor: ["Dry", "Sensitive", "Oily", "Combination", "Normal"],
    concerns: ["Dryness", "Redness", "Texture"]
  },
  {
    id: "prod-8",
    brand: "La Roche-Posay",
    name: "Toleriane Double Repair Face Moisturizer",
    category: "Moisturizer",
    ingredients: [
      "Aqua/Water/Eau", "Glycerin", "Dimethicone", "Hydrogenated Polyisobutene", "Niacinamide", "Ammonium Polyacryloyldimethyl Taurate", 
      "Myristyl Myristate", "Stearic Acid", "Ceramide Np", "Potassium Cetyl Phosphate", "Isobutane", "Glyceryl Stearate Se", 
      "Sodium Hydroxide", "Myristic Acid", "Palmitic Acid", "Capryloyl Glycine", "Caprylyl Glycol", "Xanthan Gum", "Acrylonitrile/Methyl Methacrylate/Vinylidene Chloride Copolymer", "Tocopherol"
    ],
    activeIngredients: ["Ceramides", "Niacinamide", "Prebiotic Thermal Water"],
    price: "$20.99",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1620917670397-dc71186a20e2?q=80&w=300&auto=format&fit=crop",
    recommendedFor: ["Dry", "Sensitive", "Normal", "Combination"],
    concerns: ["Dryness", "Redness"]
  },
  {
    id: "prod-9",
    brand: "The Ordinary",
    name: "Granactive Retinoid 2% in Squalane",
    category: "Serum",
    ingredients: [
      "Squalane", "C12-15 Alkyl Benzoate", "Bisabolol", "Dimethyl Isosorbide", "Hydroxypinacolone Retinoate", 
      "Solanum Lycopersicum (Tomato) Fruit Extract", "Simmondsia Chinensis (Jojoba) Seed Oil"
    ],
    activeIngredients: ["Retinol", "Squalane"],
    price: "$11.00",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=300&auto=format&fit=crop",
    recommendedFor: ["Dry", "Normal", "Combination", "Oily"],
    concerns: ["Wrinkles", "Texture", "Pigmentation"]
  },
  {
    id: "prod-10",
    brand: "La Roche-Posay",
    name: "Anthelios Melt-in Milk Sunscreen SPF 60",
    category: "Sunscreen",
    ingredients: [
      "Avobenzone 3%", "Homosalate 10%", "Octisalate 5%", "Octocrylene 7%", "Water", "Styrene/Acrylates Copolymer", 
      "Dimethicone", "Polymethylsilsesquioxane", "Glycerin", "Alcohol Denat.", "Poly C10-30 Alkyl Acrylate", "Silica", 
      "Caprylyl Methicone", "Acrylates/Dimethicone Copolymer", "Peg-100 Stearate", "Glyceryl Stearate", "Phenoxyethanol"
    ],
    activeIngredients: ["Chemical UV Filters", "Antioxidants"],
    price: "$25.99",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=300&auto=format&fit=crop",
    recommendedFor: ["Dry", "Normal", "Combination", "Sensitive", "Oily"],
    concerns: ["Sun Protection", "Wrinkles"]
  }
];
