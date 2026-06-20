import { GroceryItem, Substitution, UserDayProfile } from "./types";

export const generateSubstitutions = (groceries: GroceryItem[], profile: UserDayProfile): Substitution[] => {
  if (!groceries || groceries.length === 0) return [];
  const subs: Substitution[] = [];

  groceries.forEach(item => {
    const name = item.name.toLowerCase();
    
    if (profile.dietPreference === "Vegan" || profile.dietPreference === "Vegetarian") {
      if (name.includes("chicken") || name.includes("beef") || name.includes("turkey") || name.includes("salmon") || name.includes("meat")) {
        subs.push({
          original: item.name,
          alternative: "Tofu or Tempeh",
          reason: `Matches ${profile.dietPreference} diet`
        });
      }
      if (name.includes("milk") && profile.dietPreference === "Vegan") {
         subs.push({
          original: item.name,
          alternative: "Oat Milk",
          reason: "Vegan dairy alternative"
        });
      }
      if (name.includes("eggs") && profile.dietPreference === "Vegan") {
         subs.push({
          original: item.name,
          alternative: "Flaxseed Egg",
          reason: "Vegan binding alternative"
        });
      }
    }

    if (profile.dietPreference === "Low Budget") {
      if (name.includes("salmon") || name.includes("beef")) {
        subs.push({
          original: item.name,
          alternative: "Canned Tuna or Beans",
          reason: "Cost efficiency"
        });
      }
      if (name.includes("berries")) {
        subs.push({
          original: item.name,
          alternative: "Frozen Berries",
          reason: "More economical"
        });
      }
    }
    
    if (profile.dietPreference === "High Protein") {
        if (name.includes("wrap") || name.includes("bread")) {
            subs.push({
                original: item.name,
                alternative: "Protein Wrap",
                reason: "Macronutrient optimization"
            })
        }
        if (name.includes("milk")) {
            subs.push({
                original: item.name,
                alternative: "Ultra-filtered Protein Milk",
                reason: "Macronutrient optimization"
            })
        }
    }
  });

  // Default fallback if no specific substitutions needed
  if (subs.length === 0) {
    subs.push({
        original: "Any Missing Produce",
        alternative: "Frozen Veggies",
        reason: "General adaptability"
    });
  }

  return subs;
};
