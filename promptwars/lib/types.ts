export type DayType = "Busy Workday" | "Workout Day" | "Lazy Sunday" | "Family Gathering" | "Travel Day";
export type DietPreference = "None" | "Vegetarian" | "Vegan" | "High Protein" | "Low Budget";

export interface UserDayProfile {
  dayType: DayType;
  budget: number;
  availableTime: number; // in minutes
  energyLevel: "Low" | "Medium" | "High";
  peopleEating: number;
  dietPreference: DietPreference;
}

export interface Meal {
  id: string;
  name: string;
  prepTime: number;
  estimatedCost: number;
  nutritionTag: string;
  ingredients: string[];
}

export interface MealPlan {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
}

export interface GroceryItem {
  id: string;
  name: string;
  category: "Produce" | "Protein" | "Dairy" | "Pantry";
  quantity: string;
}

export interface Substitution {
  original: string;
  alternative: string;
  reason: string;
}

export interface BudgetStatus {
  totalCost: number;
  costPerMeal: number;
  budgetRemaining: number;
  budgetUtilization: number; // percentage
  efficiencyScore: number;
  status: "SAFE" | "WARNING" | "OVER BUDGET";
}
