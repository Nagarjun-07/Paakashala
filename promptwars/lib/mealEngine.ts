import { DayType, DietPreference, Meal, MealPlan, UserDayProfile, GroceryItem } from "./types";
import { generateId } from "./helpers";

const generateMeal = (
  baseName: string,
  prepTime: number,
  cost: number,
  nutritionTag: string,
  ingredients: string[]
): Meal => ({
  id: generateId(),
  name: baseName,
  prepTime,
  estimatedCost: cost,
  nutritionTag,
  ingredients,
});

export const generateMealMatrix = (profile: UserDayProfile): MealPlan => {
  const { dayType, availableTime, budget, peopleEating, dietPreference } = profile;
  
  // Safe logic to scale meals
  const timeFactor = Math.max(10, availableTime / 3);
  const safeBudget = Math.max(10, budget); // avoid NaN or 0 scaling
  const costFactor = safeBudget / 3;
  
  if (dayType === "Workout Day") {
    return {
      breakfast: generateMeal("Protein Oats", 10, costFactor * 0.2, "High Protein", ["Oats", "Protein Powder", "Milk"]),
      lunch: generateMeal("Chicken & Quinoa Bowl", 20, costFactor * 0.4, "Lean Muscle", ["Chicken Breast", "Quinoa", "Broccoli"]),
      dinner: generateMeal("Salmon & Sweet Potato", 30, costFactor * 0.4, "Omega-3", ["Salmon", "Sweet Potato", "Asparagus"]),
    };
  }

  if (dayType === "Lazy Sunday") {
    return {
      breakfast: generateMeal("Pancakes & Berries", 25, costFactor * 0.3, "Comfort", ["Flour", "Eggs", "Berries", "Syrup"]),
      lunch: generateMeal("Leftover Revamp", 15, costFactor * 0.1, "Resourceful", ["Leftovers", "Cheese", "Bread"]),
      dinner: generateMeal("Slow Cooker Roast", 120, costFactor * 0.6, "Hearty", ["Beef Roast", "Potatoes", "Carrots"]),
    };
  }
  
  if (dayType === "Family Gathering") {
    return {
      breakfast: generateMeal("Large Scramble", 20, costFactor * 0.3, "Crowd Pleaser", ["Eggs", "Bell Peppers", "Cheese"]),
      lunch: generateMeal("Sandwich Platter", 15, costFactor * 0.3, "Easy Prep", ["Deli Meats", "Bread", "Lettuce"]),
      dinner: generateMeal("Pasta Bake", 60, costFactor * 0.4, "Comfort", ["Pasta", "Tomato Sauce", "Ground Beef"]),
    };
  }
  
  if (dayType === "Travel Day") {
    return {
      breakfast: generateMeal("Breakfast Bar", 5, costFactor * 0.3, "On the Go", ["Granola Bar", "Banana"]),
      lunch: generateMeal("Packed Wrap", 10, costFactor * 0.3, "Portable", ["Wrap", "Hummus", "Veggies"]),
      dinner: generateMeal("Quick Burger", 15, costFactor * 0.4, "Fast", ["Burger Patty", "Bun", "Tomato"]),
    };
  }

  // Default Busy Workday fallback
  return {
    breakfast: generateMeal("Green Smoothie", 5, costFactor * 0.2, "Quick Energy", ["Banana", "Spinach", "Almond Milk"]),
    lunch: generateMeal("Turkey Wrap", 10, costFactor * 0.3, "Balanced", ["Turkey", "Wrap", "Lettuce", "Tomato"]),
    dinner: generateMeal("15-Min Stir Fry", 15, costFactor * 0.5, "Veggie Packed", ["Tofu", "Mixed Veggies", "Soy Sauce"]),
  };
};

export const generateGroceryList = (mealPlan: MealPlan, profile: UserDayProfile): GroceryItem[] => {
  if (!mealPlan) return [];
  const items: GroceryItem[] = [];
  const add = (name: string, category: GroceryItem["category"], qty: string) => {
    items.push({ id: generateId(), name, category, quantity: qty });
  };
  
  const allIngredients = [
    ...mealPlan.breakfast.ingredients,
    ...mealPlan.lunch.ingredients,
    ...mealPlan.dinner.ingredients
  ];
  
  allIngredients.forEach((ing) => {
    const name = ing.toLowerCase();
    if (name.includes("chicken") || name.includes("salmon") || name.includes("beef") || name.includes("turkey") || name.includes("patty")) {
      add(ing, "Protein", `${profile.peopleEating} servings`);
    } else if (name.includes("milk") || name.includes("cheese") || name.includes("eggs")) {
      add(ing, "Dairy", "1 unit");
    } else if (name.includes("broccoli") || name.includes("potato") || name.includes("spinach") || name.includes("banana") || name.includes("veggies") || name.includes("berries") || name.includes("tomato") || name.includes("asparagus")) {
      add(ing, "Produce", "1 bunch/bag");
    } else {
      add(ing, "Pantry", "1 unit");
    }
  });

  return items;
};
