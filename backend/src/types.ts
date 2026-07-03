export interface Product {
  id: string;
  brand: string;
  name: string;
  category: string;
  ingredients: string[];
  activeIngredients: string[];
  price: string;
  rating: number;
  image: string;
  recommendedFor: string[];
  concerns: string[];
}
